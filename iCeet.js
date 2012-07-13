/*
 * The javascript css3 selectors 
 * 
 * Do not know since when people almost do not want manufacture wheels!
 *
 * author iceet <iceet@uoeye.com>
 */
 
(function(Global,DOC){
var iCeet 	= function(selector,context){
		return iCeet.query(selector,context || DOC);
	},
	uuid 	= +new Date,
	expando = 'iceet'+uuid,
	aider 	= function(fn,div){fn(div=DOC.createElement('div'));div=null},
	mix 	= function(target,source){for(var p in source){target[p]=source[p]}},
	bone 	= function(a,v,ia){var ret={};a = a.match ? a.split(','):a;ia=(v instanceof Array);for(var i=0,len=a.length;i<len;i++){ret[a[i]]=ia?v[i]:v}},

	PUSH 	= Array.prototype.push,
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

			if(e.getAttribute('href') !== '#' || !e.getAttribute('class')){
				BUGGY.attr = true;
			}
		}
		//in opera 9.6 cant match the second class
		if(!DOC.getElementsByClassName || !div.getElementsByClassName('e').length || 
		   	(div.firstChild.className ='e') && div.getElementsByClassName('e').length ==1){
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
			return 
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
		unique: function(){
			
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
						res.length !== undefined ? aider.makeArray(ret,res)
							: res.nodeType !==3 && ret.push(res);
					}
				}
			}
			
			(typeof after === 'function') && after(result);

			return ret;
		},
		ID: function(){
			return BUGGY.idname ? function(name){
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
			 	} : function(name){
				return DOC.getElementById(name);	
			}
		}(),
		//杩欓噷瑕佹敞鎰忎娇鐢ㄥ懡鍚嶇┖闂寸殑
		//杩欓噷瑕佽€冭檻xml鐨勬儏鍐�
		TAG: function(name,context,isxml){
			var method = 'getElementsByTagName',ret = [],i=0,namespace,res,e;

			if((isxml || name.indexOf(':')>-1) && context.lookupNamespaceURI){
				
				if((res = name.split(':')).length==2){
					method +='NS';
					name = res[1];
					namespace = context.lookupNamespaceURI(res[0]);
				}
			}
			
			if ( (res = namespace ? context[method](namespace,name) 
				  	: context[method](name)) && res.length ){

				while(e=res[i++]){
					e.nodeType === 1 && ret.push(e);
				}
			}
			return ret;
		},
		//get classname
		CLASS: function(){
			
			return BUGGY.class ? function(name,context){
				var ret = [] ,res = DOC.getElementsByTagName('*') ,i =0,item;
				while(item = res[i++]){
					aider.FILTER.CLASS(item,name) && ret.push(item);
				}
				return ret;
			}: function(name,context){
				return context.getElementsByClassName(name);
			};
		}(),
		//use xpath to get node filter attr
		XATTR: function(name,value,context,doc){
			var xpath = '//[*[@'+name+"='"+value+"']";
			return iCeet.xpath(xpath,context,doc);
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
		query: function(selector,context){},
		xpath: function(xpath,context,doc){
			var ret = [],i=-1,item;
			
			try{
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
		direct: function(){},
		compose: function(){},
		filter: function(){},
		attr: function(){},
		pseudo: function(){},
		child: function(){},
		posFilters:{},
		filters: {},
		iceet: '1.0'
	});
	
	Global.iCeet = iCeet;
})(this,document)
192.168.4.38