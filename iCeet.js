/*
 * The javascript css3 selectors 
 * 
 * Do not know since when people almost do not want manufacture wheels!
 *
 * author iceet <iceet@uoeye.com>
 */
 
(function(Global,DOC,undefined){
var iCeet 	= function(selector,context){
		return iCeet.query(selector,context || DOC);
	},
	uuid 	= +new Date,
	expando = 'iceet'+uuid,
	aider 	= function(fn,div){fn(div=DOC.createElement('div'));div=null},
	mix 	= function(target,source){for(var p in source){target[p]=source[p]}},
	bone 	= function(a,v,ia){var ret={};a = a.match ? a.split(','):a;
			ia=(v instanceof Array);for(var i=0,len=a.length;i<len;i++){ret[a[i]]=ia?v[i]:v}},
	
	rxpath  = /(^[@\/]|node\(\)|^[^\/]+\/{1,2}\w+|\.\.|\[@)/i,
	rquick  = /^([#.]?)(\w+)$/,
	//the selector splitter
	rsplit  = /\s*([+,~>\s])[^\w=+~>\.#]?\s*/,
	rexcis  = /(?:([#.]?)(\w+\\:\w+|\w+)|(?:\[([\w-_]+)([^\w'"]+)['"]?([^'"\]]+)['"]?\])|(?::([\w-]+)(?:\(([^\)]+)\))?))/g,
	rchild  = /(nth|first|last|only)-(child|of-type|last-child|last-of-type)/i，
	
	PUSH 	= Array.prototype.push,
	UNDEF	= undefined,
	//buggy list 
	BUGGY 	= {};
	//check the buggy
	aider(function(div,id,e){
		
		if((BUGGY.detect = []) && document.querySelectorAll && 
		  	(div.innerHTML = '<select><option selected></option></select><input type="hidden"/>')){
		
			//:enabled ie8 don't match the hidden element
			(!div.querySelectorAll(':enabled').length) && BUGGY.detect.push(':enabled',':disabled');
			
			//:checked ie8 dom,t match the select element
			(!div.querySelectorAll(':checked').length) && BUGGY.detect.push(':checked');
			
			if( !div.querySelectorAll('[selected]').length ) {
				BUGGY.detect.push('\\[\\s*(?:readonly|defer|async|value|selected|checked|disabled|ismap|multiple|autofocus|autoplay|controls|declare|defaultChecked|contentEditable|loop|multiple|noshade|open|noresize)');
			}
		}

		div.innerHTML = '<a name="'+(id='buggy'+expando)+'" href="#" class="test"/><a class="test e"></a>';
		
		//check the 'getElementById'  bug on ie(name or id confusion)
		DOC.getElementById(id) && (BUGGY.idname = true);
		//check the 'getAttribute' bug on ie6/7
		//class -> className ...
		//href modified ?
		if ( e = div.lastChild ) {
			if ( e.getAttribute('href') !== '#' || !e.getAttribute('class') ) {
				BUGGY.attr = true;
			}
		}
		//in opera 9.6 cant match the second class
		if ( !DOC.getElementsByClassName || !div.getElementsByClassName('e').length || 
		   	(div.firstChild.className ='e') && div.getElementsByClassName('e').length ==1 ){
			BUGGY.class = true;
		}
		
		//add the position or non-standard  pseudo and the 
		BUGGY.detect.push(':nth|:first|:even|:odd|:eq|:last|:gt|:lt|:visible|:hidden');
		
		BUGGY.detect = BUGGY.detect.length ? new RegExp(BUGGY.detect.join('|')) : true;
	});
	
	mix(aider,{
		isXML: function(elem){
			var documentElement = (elem.ownerDocument || elem).documentElement;
			return documentElement ? documentElement.nodeName !== 'HTML' : false;
		},
		isXPath: function(selector){
			return rxpath.test(selector); 
		},
		makeArray: function(target,newly){
			try {
				PUSH.apply(target,newly);
			} catch ( e ) {
				var idx=target.length,i=0,item;
				while(item = newly[i++]){
					target[idx++] = item;
				}
			}
			return target;
		},
		unique: function(items){
			
			var ret = [];
			
			return (iCeet.unique = false) || ret;
		},
		buggy: function(){},
		//check the a include b?
		contains: function(a,b){
			return a.contains ? a!= b && a.contanins(b) : !!(a.compareDocumentPosition(b) & 16);
		},
		//iterate arr/elem/object
		iterate: function(result,iterate,match,after){
			var ret =[],idx=-1,res;
			
			while(res = result[++idx]){
				if(res = iterate(res,idx,match,result)){	
					if (res === true) {
						ret.push(result[idx]);
					} else {
						res.length !== UNDEF ? aider.makeArray(ret,res)
							: res.nodeType !==3 && ret.push(res);
					}
				}
			}
			after && after(result);

			return ret;
		},
		ID: function(){
			return BUGGY.idname ? function(name,context,isxml){
				if( !isxml ){
					var res = DOC.getElementById(name);
					if(res.id !== name){
						var elems = document.all[name] ,i=0,item;
						while(item = elems[i++]){
							if(item.id === name){
								return item;
							}
						}
					}
					return res;
				}
				return aider.XATTR('id',name,context,isxml);
			 	} : function(name,context,isxml){
					if( !isxml ) {
						return DOC.getElementById(name);	
					}
					return aider.XATTR('id',name,context,isxml)
			}
		}(),
		TAG function(name,context,isxml){

			var method = 'getElementsByTagName',ret = [],i=0,namespace,res,item;

			if((isxml || name.indexOf(':')>-1) && context.lookupNamespaceURI){
				
				if((res = name.split(':')).length==2){
					method +='NS';
					name = res[1];
					namespace = context.lookupNamespaceURI(res[0]);
				}
			}
			
			if ( (res = namespace ? context[method](namespace,name) 
				  	: context[method](name)) && res.length ){

				while ( item = res[i++] ) {
					item.nodeType === 1 && ret.push( item );
				}
			}
			return ret;
		},
		//get classname
		CLASS: function(){
			return BUGGY.class ? function(name,context,isxml){
				if(!isxml){
					var ret = [] ,res = DOC.getElementsByTagName('*') ,i =0,item;
					while(item = res[i++]){
						aider.FILTER.CLASS(item,name) && ret.push(item);
					}
					return ret;
				}
				return aider.XATTR('class',name,context,isxml);
			}: function(name,context,isxml){
				if ( !isxml ) {
					return context.getElementsByClassName(name);
				}
				return aider.XATTR('class',name,context,isxml)
			};
		}(),
		//use xpath to get node filter attr
		XATTR: function(name,value,context,doc){
			
			return iCeet.xpath('//[*[@'+name+"='"+value+"']",context,doc);
		},
		//getAttribute('attr');
		ATTR: function(){
			var 
				fixAttr = bone('tabindex,readonly,for,class,maxlength,cellspacing,cellpadding,rowspan,colspan,usemap,frameborder,contenteditable',
						   'tabIndex,readOnly,htmlFor,className,maxLength,cellSpacing,cellPadding,rowSpan,colSpan,useMap,frameBorder,contentEditable'),
				//these attribute can automatic correction when we use 'getAttribute' to get it!
				autoAttr = bone('href,action,cite,codebase,data,longdesc,lowsrc,src,usemap',1);
			return function(name,context,isxml,def){
				
				def = def === undefined ? '' : null;

				if(!isxml && BUGGY.attr ){
					if(name.toLowerCase() in autoAttr){
						return context.getAttribute(name,2) || def;
					}
					name = fixAttr[name] ||name;
				}

				return context.getAttribute(name) || def;
			}
		}(),
		FILTER: {
			//hasIdName
			ID: function(item,name){
				return item.getAttribute('id') === name;
			},
			//hasTagName
			TAG: function(item,name){
				return item.nodeName.toLowerCase() === name.toLowerCase();
			},
			//hasAttribute
			ATTR: function(item,name,isxml){
				return !!aider.ATTR(item,name,isxml,true);
			},
			//hasClass
			CLASS: function(){
				var cache = {};
				return function(item,name){
					return (cache[name] || (cache[name] = new RegExp('(?:^|\\s*)'+name+'(?:\\s*|$)','i'))).test(name);
				}
			}()
		}
	});

	mix(iCeet,{
		query: function(selector,context){
			
			var result = [],match,type,
				docu   = ( context = context||DOC ).ownerDocument || context,
				isxml  = aider.isXML(context) && docu;
			
			//deal with the xpath selector
			if ( aider.isXPath(selector) ) {
				
				return iCeet.xpath(selector,context,isxml);
				
			} else {
				//deal with the quick selector #id,.class,tagname
				if ( match = selector.match(rquick) ) {
					return iCeet.meta( match[2],match[1],context,isxml);
				} 
				
				//deal with the compose selector and system query
				result  = aider.cbuggy(selector) && !isxml
					? context.querySelectorAll(selector) 
					: iCeet[rsplit.test(selector)?'compose':'direct'](selector,context,isxml);
			}

			return iCeet.unique ? aider.unique(result) : result;
		},
		//meta selector query
		meta: function(value,type,context,isxml){
			
			return type ? (type === '#' 
						? aider.ID(value,context,isxml) 
						: aider.CLASS(value,context,isxml) )
					: aider.TAG(value,context,isxml);
		},
		xpath: function(xpath,context,doc){
			
			var ret = [],i=-1,item;
			try {
				if ( Global.DOMParser ) {
					var nodes = (doc || DOC).evaluate(xpath,context,null,7,null);
					while(item = nodes.snapshotItem(++i)){
						ret.push(item);
					}
				} else {
					var nodes = context.selectNodes(xpath);
					while( item = nodes[++i]){
						ret.push(item);
					}
				}
			} catch ( e ) {}
			return ret;
		},
		
		direct: function(selector,context,isxml){
			
			var result,item,owner,match=[],child=[],pseudo=[];
			
			selector.replace(rexcis,function(allmach,$1,$2,$3,$4,$5,$6,$7){
				if ( allmach ) {
					if ( $6 === UNDEF ) {
						return ( item = ($2 !== UNDEF ? [1,$1,$2] : 
							   ( $3 !== UNDEF ? [2,$3,$4,$5] : false )) ) && match.push(item); 
					}
					//pseudo
					$7 && ($7 = $7.toLowerCasse());
					
					rchild.test( $6 ) ? child.push([$6.toLowerCase(),$7]) : pseudo.push([$6.toLowerCase(),$7]);
				}
			});
			//规则：
			//	有E:nth-child(n)、E:nth-last-child(n)等先计算这种选择器，在过滤自身属性，灯
			//  其他伪类则在最后计算
			if ( match.length || child.length || pseudo.length ) {
				//fixed not self selectors
				( match[0])[0] !==1 ) && ( match.unshift([1,0,'*']));
				( (owner = match.shift()) && ( match[0][1] === '#')) &&
						( owner = match.splice(1,1,owner)[0] );
				
				( (owner = iCeet.meta(owner[2],owner[1],context,isxml)) 
						   instanceof Array) || (owner = [owner]);
				//计算child伪类
				( child.length ) && (owner = iCeet.child(owner,child,isxml));
				
				//过滤属性
				if ( match.length ) {
					result = aider.iterate(owner,function(item,idx){
						return iCeet.filter(item,match,isxml,owner);
					});
				}
				//过滤伪类
				if ( pseudo.length ) {
					result = iCeet.pseudo(result||owner,pseudo);
				}
			}
			return result;
		},
		compose: function(selector,context){},
		filter: function(item,match,isxml,result){
			
			var item , idx =0;
			while ( item = match[idx++] ) {
				//filter the self selector
				if ( item[0] ==1 ){
					
				} else {
					
				}
			}
			return true;
		},
		attr: function(){},
		pseudo: function(){},
		child: function(){},
		posFilters:{},
		filters: {},
		iceet: '1.0'
	});
	
	Global.iCeet = iCeet;
})(this,document)
