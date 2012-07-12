/*
 * iCeet 只是简单的css3选择器（不支持xPath）
 * 
 * 依旧从适用角度出发
 * 
 * 不知道什么时候起，人们已经不爱制作车轮了。
 * 
 * 作者：蜗眼 <iceet@uoeye.com>
 */
(function(Global,document,undefined){

var iCeet    = function(){},
	uuid      = +new Date,
	expando   = 'iceet'+uuid,
	assert 	  = function(fn,div){fn(div=document.createElement('div'));div=null;},
	mix 	  = function(target,source){for(var p in source){target[p]=source[p]}},
	
	rcompose  = /([+,~>\s][^=\w.^+~>]?)/,
	rexcision = /([#\.]?)?(\w+)?(?:\[(\w+)([^'"\w]*)['"]?([\w-]*)['"]?\])?(?::([\w-]*)\(?([^\)]*)?\)?)?/g,
	rquick    = /^([#\.]?)(\w+)$/,
	
	rfirst	  = /first|nth/i,
	rsecond	  = /only|last/,
    rheader   = /h\d/i,
	rinputs   = /input|select|textarea|button/i,
	rformact  = /input|button/i,
	rchild    = /(nth|first|last|only)-(child|of-type|last-child|last-of-type)/i,
	
	PUSH      = Array.prototype.push,
	BUGGY 	  = { GY : false };//bug检测列表
	
	assert(function(div,e){
		
		if(( BUGGY.GY = [] ) && document.querySelectorAll && 
		  	 	(div.innerHTML = '<select><option selected></option></select><input type="hidden"/>')){
			//：enabled IE8不匹配隐藏域
			!div.querySelectorAll(':enabled').length && BUGGY.GY.push(':enabled',':disabled');
			//:checked IE8 不返回select元素
			!div.querySelectorAll(':checked').length && BUGGY.GY.push(':checked');
			
			if(!div.querySelectorAll('[selected]').length){
				BUGGY.GY.push('\\[\\s*(?:readonly|defer|async|value|selected|checked|disabled|ismap|multiple)');
			}
		}
		
		div.innerHTML = '<a name="'+(id='buggy'+expando)+'" href="#" class="test e"/><div class="test"></div>';
		//ie 下的name/id混淆的BUG
		(e = document.getElementById(id)) && e.length && (BUGGY.IDNAME = true);
		//ie6/7 下 return a modified href
		div.firstChild.getAttribute('href') !=='#' && (BUGGY.ATTR = true);
		
		//opera 9.6 不能匹配第二个样式名
		if(!document.getElementsByClassName || !div.getElementsByClassName('e').length ||
		//safafi 不能匹配动态修改的classname
				((div.lastChild.className = 'e') && div.getElementsByClassName('e').length == 1)){
			BUGGY.CLASS = true
		}
		//检测非标准伪类选择器材
		


		BUGGY.GY = BUGGY.GY.length ? new RegExp(BUGGY.GY.join('|')) : true;
		
	});
	
	mix(assert,{
		ID: function(){
			return BUGGY.IDNAME ? function(id){
					var res = document.getElementById(id),ret =[],i =0 ,e;
					while(e = res[i++]){
						e.getAttribute('id') == id && ret.push(e);
					}
					return ret;
				} : function(id){
					return [document.getElementById(id)];
			}
		}(),
		_ID: function(item,name){
			return item.getAttribute('id') === name;
		},
		ATTR: function(item,name){
			if(BUGGY.ATTR && name == 'href'){
				return item.getAttribute(name,2);
			}
			return item.getAttribute(name);
		},
		CLASS: function(){
			return BUGGY.CLASS ? function(name,context){
					var ret = [],i = 0, a= context.getElementsByTagName('*');
					while(e = a[i++]){
						assert._CLASS(e,name) && ret.push(e);
					}
					return ret;
				}:function(name,context){
					return context.getElementsByClassName(name)
			}
		}(),
		_CLASS: function(){
			var cache = {};
			return function(item,name){
				return (cache[name] || (cache[name]=new RegExp('(?:^|\\s*)'+name+'(?:\\s*|$)','i')) ).test(item.className);
			}
		}(),
		TAG: function(tagname,context){
			return context.getElementsByTagName(tagname);
		},
		_TAG: function(item,name){
			return item.nodeName === name.toUpperCase();
		},
		visible: function(type){
			return function(item,visible){
				if(item.type !=='hidden'){
					if( visible = issert.style('display') || 
							issert.style('visibility') || issert.style('visible')){
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
		hasnot:  function(itrue){
			return function(item,_,match){
				if((_ = (''+match[6]).match(rquick)).length){
					match = iCeet.METAFILTER(item,_[1],_[2],true);
					return itrue ? match : !match;
				}
				return false;
			}
		},
		getText: function(child,childs){
			if((childs = child.childNodes) && childs.length){
				for(var i=0,ret = '',node,len = childs.length;i<len;){
					if((node = childs[i]).nodeType === 3 || node.nodeType ===4){
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
		makeArray: function(source,newly){
			try{
				PUSH.apply(source,newly);
			}catch(e){
				var i=0;
				while(e=newly[i++]){
					source.push(e);
				}
			}
			return source;
		},
		cbuggy: function(selector){
			
			if(BUGGY.GY){
				//return (typeof BUGGY.GY !=='object') || BUGGY.GY.test(selector);
			}
			return false;
		},
	});
	
	iCeet.prototype = {
		/*
		 * 查找接口
		 * @selector {String} 选择器
		 * @context {Object} 选择上下文 
		 */ 
		FIND: function(selector,context){
			
			var result = [] , compose ,match;
			context = context || document;
			
			if(typeof selector !=='string'){
				if( selector.nodeType || selector === Global ) {
					result.push(selector.documentElement || selector);
				}
				return result;
			}
			
			//看看是否是简单选择器
			if ( match = selector.match(rquick) ){
				result = iCeet.METAFILTER(context,match[1],match[2]);
				
			}else {
				
				if(assert.cbuggy(selector)){
				
					result = context.querySelectorAll(selector);
				}else {
					result = rcompose.test(selector) ? iCeet.COMPOSE(selector.split(rcompose),context)
						   : iCeet.DIRECT(selector,context);
				}	
			}
			return assert.makeArray([],result);
		},
		/*
		 * 组合选择器
		 * @compose {Array} 简单选择器数组
		 * @context {Object} 上下文对象 
		 */ 
		COMPOSE: function(compose,context){
			
			var result = [] , supper = null;
			for(var i=0,len=compose.length;i<len;i++){
			
				switch(compose[i]){
					case '>':
						supper = this.DIRECT(compse[++i],
							this.ITERATE(supper,function(item){
								return item.childNodes;
						}),false);
						break;
					case ',':
						assert.makeArray(result,supper) && (supper = this.DIRECT(compose[++i],context));
						break;
					case '+':
						supper = this.DIRECT(compose[++i],
							this.ITERATE(supper,function(item){
								do{
									item = item.nextSibling;
								}while(item && item.nodeType!=1);

								return item;
						}),false);
						break;
					case '~':
						supper = this.DIRECT(compose[++i],
							this.ITERATE(supper,function(item){
								var ret = [];
							  	do {
									item =item.nextSibling;
									item && item.nodeType ==1 && result.push(item);
								}while(item);
								return ret;
						}),false);
						break;
					case ' ':
						supper = this.DIRECT(compose[++i],supper,false);
						break;
					default:
						supper = this.DIRECT(compose[i],context,false);
				}
			}

			return supper ? assert.makeArray(result,supper) : result;
		},
		/*
		 * 简单选择器
		 * @direct {String} 简单选择器
		 * @context {Object} 上下文
	 	 * @itself {Boolean} 是否自身遍历  
		 */ 
		DIRECT: function(direct,context,itself){
		
			var matchs = [] , match , idx = 0 , result = context ,item;
			
			direct.replace(rexcision,function(_,$1,$2,$3,$4,$5,$6,$7){
				
				$6 && ($6 = $6.toLowerCase());
				$7 && ($7 = $7.toLowerCase());
				
				//$1:选择符(#\.)
				//$2:选择名称（包括tagName）
				//$3:属性名 ; $4:属性操作符 ; $5:属性值
				//$6:伪类名 ; $7:伪类辅助符
				
				_ && matchs.push([$1,$2||'*',$3,$4,$5,$6,$7]);
			});
			while(match = matchs[idx++]){
				result = this.FILTER(match , result , idx>1 ? true : !!itself);
			}
			return result;
		},
		/*
		 * 遍历器
		 * @result {Array} 资源集合
		 * @iterate {Function} 遍历函数
		 * @match 
		 */
		ITERATE: function (result,iterate,match,after){
			
			var ret = [] , item ,idx=0;
			for(var i=0,len=result.length;i<len;i++){
				if(item = iterate(result[i],i,match,result)){
					item instanceof Array ? assert.makeArray(ret,item,this) 
								: ret.push(item === true ? result[i] : item );
				}
			}
			if(typeof after === 'function'){
				while(item = result[idx++]){
					after(item);
				}
			}
			return ret;
		},
		/*
		 * 过滤简单选择器 /自身
		 * @item {Object} 元素项
		 * @type {String} 类型
		 * @value{String} 值 
		 * @itself {Boolean} 是否自身遍历
		 */
		METAFILTER: function(item,type,value,itself){
		
			return type ? type === '#' 
					? itself ? assert._ID(item,value) : assert.ID(value) 
					: itself ? assert._CLASS(item,value) : assert.CLASS(value,item)
				    : itself ? assert._TAG(item,value) : assert.TAG(value,item);
		},
		/*
		 * 过滤器
		 * @match {Array} 简单选择器匹配
		 * @context {Object} 上下文对象
		 * @itself {Boolean} 是否自身遍历
		 */  
		FILTER: function(match,context,itself){
			
			var consult = context.length ? context : [context] , result  = [];
			
			if ( false == itself ) {
				
				this.ITERATE(consult,function(item,idx){
					if( (item = iCeet.METAFILTER(item,match[0],match[1])).length){
						//过滤属性
						if(undefined !== match[2]){
							item = iCeet.ITERATE(item,function(elem,idx){
								return iCeet.ATTR(elem,match)
							});
						}
						assert.makeArray(result,item);
					}
				});
			//自身过滤	
			} else {
				
				this.ITERATE(consult,function(item,_){
					if(item.nodeType ==1 && iCeet.METAFILTER(item,match[0],match[1],true)){
						result.push(item);
					}
				});
			}
			return match[5] ? this.PSEUDO(result,match,match[5]) : result;
		},
		/*
		 * 属性择器 
		 */ 
		ATTR: function(item,match){
			
			var val = (''+assert.ATTR(item,match[2])).toLowerCase(),nval= match[4];
			switch( match[3] ){
				case '=':
					return val === nval;
				case '!=':
					return val != nval;
				case '^=':
					return val.indexOf(nval) == 0;
				case '$=':
					return val.substr(-nval.length) == nval;
				case '*=':
					return val.indexOf(nval) > -1;
				case '|=':
					return val == nval || val.indexOf(nval+'-') == 0;
				case '~=':
					return val.indexOf(nval+' ') >-1 || val.indexOf(' '+nval)>-1;
			}
			
			return false;
		},
		//伪类处理
		PSEUDO: function(result,match,name,filter){
			//判断为child伪类
			if( name.indexOf('-') > -1 ){
				return ( name = name.match(rchild) ).length ? this.CHILD( result,match,name ) : [];
			}
			
			return ( filter = this.filters[name] || this.posFilters[name] )? this.ITERATE( result , filter , match ) : [];
		},
		
		//标准的获取子节点
		//E:nth-child(n) 匹配父元素中的第n个子元素E
		//E:nth-last-child(n) 匹配父元素中的倒数第n个结构子元素E
		//E:nth-of-type(n) 匹配同类型中的第n个同级兄弟元素E
		//E:nth-last-of-type(n)  匹配同类型中的倒数第n个同级兄弟元素E
		
		//E:first-child 匹配父元素中第一个E元素
		//E:first-of-type匹配同级兄弟元素中的第一个E元素
		//E:last-child  匹配父元素中最后一个E元素
		//E:last-of-type  配同级兄弟元素中的最后一个E元素
		//E:only-child 匹配属于父元素中唯一子元素的E 
		//E:only-of-type 匹配属于同类型中唯一兄弟元素的E
		CHILD: function(){
			
			var filter = function(item,fitcn,child,nodeName,value){
					var pchilds = item.parentNode.childNodes , ret =[], e,last,olast,
						idx = 0 , oidx = 0 , type = child[0] , i = -1 , num , onum;
						
					while ( e = pchilds[ ++i ] ) {
						if( (e.nodeType === 1) && ( last = e ) &&( ++idx ) ){
							e [ expando ] = true;
							if ( e.nodeName == nodeName ) {
								( olast = e ) && ( ++oidx );
							}
							
							if( rfirst.test( type ) ) {
								//deal with first 遍历
								if( type == 'first' ) {
									( child[2] === true ? oidx === 1 : idx === 1 ) && ret.push(e);
								//类型名敢 nth 非倒序遍历
								} else if ( child[1] !== true ) {
									fitcn(idx,oidx,child[2],value) && ret.push(e);
								}
							}
						}
					}
					
					//deal with only,last
					if( rsecond.test(type) ){
						
						if(type == 'last'){
							ret.push( child[2] === true ? olast : last );
						//only-
						} else {
							( child[2] === true ? oidx ==1 : idx == 1 ) && ret.push( item );
						}
					}
					
					//dele with nth 倒序
					if( type = 'nth' && ( ( i = -1 ) && child[1] === true )){
						
						num  = idx;
						onum = oidx;
						idx  = oidx = 0;
						
						while( e = pchilds[++i] ){
							if( e.nodeType == 1 && ( ++idx )){
								e.nodeName === nodeName && ( ++oidx );
								//last 遍历
								fitcn(idx,oidx,child[2],value,num,onum) && ret.push(e);
							}
						}
					}
					
					return ret;
				};
			
			return function(result,match,child,fitcn){
				
				//设定fitcn
				if( fitcn = match[6] ) {
					fitcn = this.chiFilters[ fitcn ] || this.chiFilters[ 'nth' ];
				}
				//修正child指令
				//child[1] 为true 表示 倒序 child[2]为true，表示类型敏感
				-1 < child[1].indexOf('of-type') && (child.push(true));
				-1 < child[1].indexOf('last') && (child[1] = true);
				
				return this.ITERATE(result,function(item) {
					//没有过滤过的元素
					if( !item[expando] ){
						
						return filter(item,fitcn,child,item.nodeName,match[6]^0);
					}
					return false;
				},match,function(item){
					item[expando] = null;
				});
			};
		}(),
		//孩子过滤器
		chiFilters: {
			// idx,oidx,last,type,val,num,onum
			nth: function(idx,oidx,type,value,num,onum){
				if( num !== undefined) {
					oidx = onum - oidx;
					idx = num - idx;
				}
				return (type === true ? oidx : idx ) === value ;
			},
			even: function(idx,oidx,type,value,num,onum){
				
				if ( num !== undefined){
					oidx = onum - oidx;
					idx = num - idx;
				}
				return (type === true ? oidx : idx) % 2 === 0;
			},
			odd: function(idx,oidx,type,value,num,onum){
				
				if ( num !== undefined ){
					oidx = onum -oidx;
					idx = num -idx;
				}
				return (type === true ? oidx : idx) % 2 === 1;
			}
		},
		//常规过滤器
		filters: {
			//以下为伪类的相关辅助函数
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
			parent: function(item){//匹配有子元素的元素
				return !!item.lastChild;
			},
			empty:function(item){
				return !item.lastChild;
			},
			has: assert.hasnot(true),
			not: assert.hasnot(false),
			header: function(item){//匹配 标题标签
				return rheader.test(item.nodeName);
			},
			text: function(item){
				return item.nodeName == 'INPUT' && item.type == 'text';
			},
			radio: assert.creatinp('radio'),
			checkbox: assert.creatinp('checkbox'),
			file: assert.creatinp('file'),
			password: assert.creatinp('password'),
			image: assert.creatinp('image'),
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
			contains: function(item,_,match){//包含指定文本的元素
				return (item.innerText || item.textContent || assert.getText(item)).indexOf(match[6]) > -1;
			},
			target: function(){
				var hash = (document.defaultView || document.parentWindow).location.hash.slice(1);
				return (item.id || item.name) === hash;
			},
			root: function(item){
				return item === (item.ownerDocument||item.document).documentElement;
			},
			visible: assert.visible(true),
			hidden: assert.visible(false)
		},
		//自定义属性相关过滤器
		posFilters : {
			even: function(_,i){
				return (i+1) % 2 === 0;
			},
			odd: function(_,i){
				return (i+1) % 2 === 1;
			},
			//支持 :eq(-1) :nth(-1)
			eq: function(_,i,match,result){
				//return match[6] ^ 0 === i;
				return ( ( (_= match[6]^0)<0 ) ? result.length - _ :  _) === i;
			},
			nth: function(_,i,match,result){
				return ( ( (_= match[6]^0)<0 ) ? result.length - _ :  _) === i;
			},
			gt: function(_,i,match){
				return (match[6] ^ 0) > i;
			},
			lt: function(_,i,match){
				return (match[6] ^ 0) < i;
			},
			first: function(_,i){
				return i === 0;
			},
			last: function(_,i,_,result){
				return i === result.length - 1;
			}
		},
		iceet: '1.0'
	};
	
 	Global['iCeet'] = (iCeet = new iCeet).FIND;
 	
 })(window,document)
