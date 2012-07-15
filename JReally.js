/**
 * JReally 选择器 A practical js selector
 * 从适用角度出发的一个选择器
 * 
 * 支持的选择器类型
 * 1、ID选择器 （#id）
 * 2、CLASS选择器 (.class)
 * 3、标签选择器 （div）
 * 4、属性选择器 （input[type=text]）
 * 
 * 5、群组选择器 （#id,.class,div,input[type=text]）
 * 6、子选择器 （div.class input[type=text]）
 * 7、后代选择器 （div>.class>input[type=text]）
 * 8、同辈选择器 单个(div + .class)
 * 9、同辈选择器 多个(div ~ .class)
 * 
 * 注意：不支持伪类选择器（带‘：’的选择器）
 * 		经过测试该选择器实现的选择器类型均比jQuery的选择器要快，要快2-4倍左右
 * 测试（在双方都关闭浏览器自带选择器querySelectorAll/querySelector的情况下，chrome）：
 * 		1、"#wrapper span b.jreally" 100次选择 测试 50次 jQuery 18-32ms JReally 5-22ms
 * 		
 * 
 * 作者：深蓝剑 <wjstudy@qq.com>
 */;;;
 (function(window,undefined){
	 
 var JReally = function(selector,context){
		
		if( !(this instanceof arguments.callee) ){
			if(selector instanceof arguments.callee){
				return selector;
			}
			return new arguments.callee(selector,context);
		}
		return this.init(selector,context || document);
	},
	//简单选择器的情况
	exprsimple   = /^\s*(?:([#\.]?)(\w+)(?:\[([^=]+)=([^\]\s]+)\])?)(?:([#\.]?)(\w+)(?:\[([^=\s]+)=([^\]\s]+)\])?)?\s*$/,
	//组合选择器 分割
	exprcomb	 = /\s*([>+~,\s])\s*/g,
	
	PUSH 		 = Array.prototype.push;
	
	JReally.prototype = {
		
		init : function(selector,context){
			
			var match = [] , simple = null;
			
			if( typeof selector !== 'string' ){
				
				if( selector.nodeType || selector === window ){
					this[0] = selector.documentElement || selector;
					this.length = 1;
				}
				return this;
			}
			
			/*关闭系统选择器*/
			
			match = 1 && context.querySelectorAll 
						? context.querySelectorAll(selector)
						: ( (simple = selector.match(exprsimple)) 
							? this.DIRECT(simple,context)
							: this.COMPOSE(selector,context) );
						
			return this.FIXPUSH([],match);
		},
		//这里是性能提升的关键。在存在class选择器的时候
		//可以提升3-5倍以上
		//这里主要是对正则的缓存
		CLASSEXP : function(){
			
			var cache = {};
			return function(name){
				return cache[name] || ( cache[name] = new RegExp('(^|\\s*)'+name+'(\\s*|$)','i') );
			}
		}(),
		//根据class获取元素
		CLASSNAME : function(){
			/*关闭系统class选择器*/
			return 1 && document.getElementsByClassName
				? function(classname,context){
					return context.getElementsByClassName(classname);
					
				}:function(classname,context){
					var ret =[];
					for(var i=0,expr = this.CLASSEXP(classname)
						,cname=context.getElementsByTagName('*'),len=cname.length;i<len;i++){
							( expr.test(cname[i].className) ) && ret.push(cname[i]);
					}
					return ret;
			};
		}(),
		//简单选择器
		DIRECT : function(muster,context,itself,result){
			console.log(muster);
			alert
			if(typeof muster == 'string'){
				muster = muster.match(exprsimple);
			}
			result = this.FILTER(muster,1,context,itself);
			
			return muster[6] ? this.FILTER(muster,5,result,true) : result;
		},
		//组合选择器
		COMPOSE : function(selector,context){
			
			var muster = selector.split(exprcomb),front = null,ret = [];
			console.log(muster);
			for(var i=0,len=muster.length;i<len;i++){
				
				switch(muster[i]){
					case '>':
						front = this.DIRECT(muster[++i],
							this.ITERATE(front,function(item){
								return item.childNodes;
							}));
						break;
					case ',':
						this.FIXPUSH(ret,front);
						front = this.DIRECT(muster[++i],context);
						break;
					case '+':
						front = this.DIRECT(muster[++i],
							this.ITERATE(front,function(item){
								do{
									item = item.nextSibling;
								}while(item && item.nodeType!=1);
								return item;
							}));
						break;
					case '~':
						console.log(front);
						front = this.DIRECT(muster[++i],
							this.ITERATE(front,function(item){
								var ret =[],nodeName = item.nodeName;
								do{
									item = item.nextSibling;
									item && item.nodeType ==1 && item.nodeName == nodeName && ret.push(item);
								}while(item);
								console.log(ret);
								return ret;
							}));
						break;
					case ' ':
						front = this.DIRECT(muster[++i],front,false);
						break;
					default:
						front = this.DIRECT(muster[i],context);
						break;
				}
			}
			
			front && this.FIXPUSH(ret,front);
			
			return ret;
		},
		//遍历器
		ITERATE : function(front,iterate){
			
			var ret =[],elem;
			for(var i=0,len=front.length;i<len;i++){
				if( elem = iterate(front[i]) ){
					elem.length ? 
						this.FIXPUSH(ret,elem) : ret.push(elem);
				}
			}
			return ret;
		},
		//过滤
		FILTER : function(muster,idx,context,itself){
			
			var result = context.length ? context : [context] , ret = [],
				expand = muster[idx++] , name  = muster[idx++],
				attr   = muster[idx++] , value = muster[idx];
			
			if( itself === false || (!itself && !context.length) ){
				
				for(var i=0,len=result.length,item;i<len;i++){
					if( (item = result[i]).getElementsByTagName ){
						
						expand ? ( expand === '#' 
								  ? ret.push(document.getElementById(name))
								  : PUSH.apply(ret,this.CLASSNAME(name,item)) ) 
						       :  this.FIXPUSH(ret,item.getElementsByTagName(name))
					}
				}
				
				if(attr === undefined) 
					return ret ;
				
				(result = ret) && (ret = []) && (itsef = false);
			}
			
			for(var i=0,len=result.length,item,push,classexp=this.CLASSEXP(name) ; i<len ; i++){
				
				if((item = result[i]).nodeType === 1){
					push = attr !== undefined && ( (''+item.getAttribute(attr))
								.toLowerCase() == (''+value).toLowerCase() );
					
					if(itself!==false && !push){
						push = expand ? ( expand === '#' 
										  ? (''+item.getAttribute('id')).toLowerCase() == name.toLowerCase()
										  : classexp.test(item.className))
									  : item.nodeName == name.toUpperCase();
					}
					
					push && ret.push(item);
				}
			}
			
			return ret;
		},
		FIXPUSH : function(result,other){
			try{
				PUSH.apply(result,other);
			}catch(e){
				for(var i=0,len=other.length;i<len;i++){
					result.push(other[i]);
				}
			}
			return result;
		},
        version : '1.0'
	};
	
	window.JReally = JReally;
 })(window)
