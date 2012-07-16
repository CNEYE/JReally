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
	
	rexcis  = /(?:([#.]?)(\w+\\:\w+|\w+)|(?:\[([\w-_]+)([^\w'"]+)['"]?([^'"\]]+)['"]?\])|(?::([\w-]+)(?:\(([^\)]+)\))?))/g,
	rchild  = /(nth|first|last|only)-(child|of-type|last-child|last-of-type)/i，
	rxpath  = /(^[@\/]|node\(\)|^[^\/]+\/{1,2}\w+|\.\.|\[@)/i,
	//the selector splitter
	rsplit  = /\s*([+,~>\s])[^\w=+~>\.#]?\s*/,
	rinputs = /input|select|textarea|button/i,
	rformact= /input|button/i,
	rquick  = /^([#.]?)(\w+)$/,
	
	rheader = /h\d/i,
	
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
		visible: function(type){
			return function(item,visible){
				if(item.type !=='hidden'){
					if( visible = issert.style('display') || 
							aider.style('visibility') || aider.style('visible')){
						visible = visible == 'none' || visible == 'hidden' || !item.offsetHeight&&!item.offsetWeight;
						return type ? visible === false : visible === true;
					}
				}
			}
		},
		creatinp: function(type){
			return function(item){
				return item.nodeName == 'INPUT' && item.type = type;
			}
		},
		getText: function(child,childs){
			if((childs = child.childNodes) && childs.length){
				for(var i=0,ret = '',node,len = childs.length;i<len;i++){
					if((node = childs[i]).nodeType === 3 || node.nodeType === 4){
						ret += node.nodeValue;
					}else if(node.nodeType !== 8){
						ret += this.getText(node);
					}
				}
				return ret;
			}
			return child.innerHTML;
		},
		style: function(){
			return Global.getComputedStyle ? function(item,style){
					return Global.getComputedStyle(item,null)[style];
				} : function(item,style){
					return item.currentStyle[style];
			}
		}(),
		//iterate arr/elem/object
		iterate: function(result,iterate,match,after){
			var ret =[],idx=-1,res;
			
			while(res = result[++idx]){
				if(res.nodeType != 3 && (res = iterate(res,idx,match,result))){	
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
			return function(name,context,isxml,de){
				
				var ret = null,
					def = de === UNDEF ? '' : null;

				if(!isxml && BUGGY.attr ){
					if(name.toLowerCase() in autoAttr){
						return (ret = context.getAttribute(name,2)) === null ? def : ret;
					}
					name = fixAttr[name] ||name;
				}

				return (ret = context.getAttribute(name)) === null ? def : ret;
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
				return aider.ATTR(item,name,isxml,true);
			},
			//hasClass
			CLASS: function(){
				var cache = {};
				return function(item,name,isxml){
					return (cache[name] || (cache[name] = new RegExp('(?:^|\\s*)'+name+'(?:\\s*|$)','i'))).test(item[isxml?'class':'className']);
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
			
			//the first deal with the selectors like this E:nth-child(n)
			if ( match.length || child.length || pseudo.length ) {
				//fixed not self selectors
				( match[0])[0] !==1 ) && ( match.unshift([1,0,'*']));
				( (owner = match.shift()) && ( match[0][1] === '#')) &&
						( owner = match.splice(1,1,owner)[0] );
				//get the resuouce
				( (owner = iCeet.meta(owner[2],owner[1],context,isxml)) 
						   instanceof Array) || (owner = [owner]);
			
				//deal width the child pseudo
				( child.length ) && (owner = iCeet.child(owner,child[0],isxml));
				
				//deal with the attribute
				if ( match.length ) {
					result = aider.iterate(owner,function(item,idx){
						var mat,i=0;
						while(mat = match[i++]){
							if( mat[0] == 1 ? ! aider.FILTER[mat[1] ? mat[1] ==='#' 
									? 'ID' : 'CLASS' : 'TAG'](item,mat[2],isxml) : !iCeet.attr(item,mat,isxml)){
								return false;
							}
						}
						return true;
					});
				}
				//deal with the pseudo
				if ( pseudo.length ) {
					return aider.iterate(result || owner,function(item,idx,_,result){
						var mat,i=0,pse,filter;
						while(mat=pseudo[i++]){
							//filters
							if( filter = iCeet.filters[pse=mat[1]] || iCeet.posFilters[pse] ){
								if(false == filter(item,idx,mat,result)){
									return false;
								}
							} else {
								return false;
							}
						}
						return true;
					});
				}
			}
			return result || owner || [];
		},
		compose: function(selector,context){},
		attr: function(item,match,isxml){
			
			var val = match[3],
				nval   = aider.FILTER.ATTR(item,match[1],isxml);
				
			if ( val === UNDEF ) {
				return val === true || val === '';
			}
			switch( match[2] ){
				case '=':
					return val === nval;
				case '!=':
					return val !== nval;
				case '^=':
					return val.indexOf(nval) === 0;
				case '$=':
					return val.substr(-nval.length) === nval;
				case '*=':
					return val.indexOf(nval) > -1;
				case '|=':
					return val == nval || val.indexOf(nval+'-') === 0;
				case '~=':
					return val.indexOf(nval+' ') >-1 || val.indexOf(' '+nval)>-1;
			}
			
			return false;
		},
		child: function(){
			var filter = function(){};
			
			return function(owner,child,isxml){
				
			}
		}(),
		posFilters:{
			even: function(_,i){
				return (i+1) % 2 === 0;
			},
			odd: function(_,i){
				return (i+1) % 2 === 1;
			},
			eq: function(_,i,match,result){//support :eq(-1) :nth(-1)
				//return match[6] ^ 0 === i;
				return ( ( (_= match[2]^0)<0 ) ? result.length - _ :  _) === i;
			},
			nth: function(_,i,match,result){
				return ( ( (_= match[2]^0)<0 ) ? result.length - _ :  _) === i;
			},
			gt: function(_,i,match){
				return (match[2] ^ 0) > i;
			},
			lt: function(_,i,match){
				return (match[2] ^ 0) < i;
			},
			first: function(_,i){
				return i === 0;
			},
			last: function(_,i,_,result){
				return i === result.length - 1;
			}
		},
		filters: {
			enabled: function(item){
				return item.disabled === false;
			},
			disabled: function(item){
				return item.disabled === true;
			},
			checked: function(item){
				return (item.nodeName == 'INPUT' && !!item.checked ) || (item.nodeName == 'OPTION' && !!item.selected);
			},
			selected: function(item){
				item.parentNode && item.parentNode.selectedIndex;//fixed the bugs
				return !!item.selected;
			},
			parent: function(item){//match some nodes who has child node
				return !!item.lastChild;
			},
			empty:function(item){
				return !item.lastChild;
			},
			has: assert.hasnot(true),
			not: assert.hasnot(false),
			header: function(item){//match the html header tag
				return rheader.test(item.nodeName);
			},
			text: function(item){
				return item.nodeName == 'INPUT' && item.type == 'text';
			},
			radio: aider.creatinp('radio'),
			checkbox: aider.creatinp('checkbox'),
			file: aider.creatinp('file'),
			password: aider.creatinp('password'),
			image: aider.creatinp('image'),
			submit: function(item){
				return rformact.test(item.nodeName) && item.type =='submit';
			},
			reset: function(item){
				return rformact.test(item.nodeName) && item.type == 'reset';
			},
			button: function(item){
				return item.nodeName == 'BUTTON' || (item.nodeName == 'INPUT' && item.type =='button');
			},
			input: function(item){
				return rinputs.test(item.nodeName);
			},
			focus: function(item){
				return !!(item.href || item.type) && (item === item.ownerDocument.activeElement);
			},
			active: function(item){
				return item === item.ownerDocument.activeElement;
			},			
			contains: function(item,_,match){
				return ~((item.innerText||item.textContent||aider.getText(item)).indexOf(match[2]));
			},
			target: function(){
				var hash = (DOC.defaultView || DOC.parentWindow).location.hash.slice(1);
				return (item.id || item.name) === hash;
			},
			root: function(item){
				return item === (item.ownerDocument||item.document).documentElement;
			},
			visible: aider.visible(true),
			hidden: aider.visible(false)
		},
		iceet: '1.0'
	});
	Global.iCeet = iCeet;
})(this,document)
