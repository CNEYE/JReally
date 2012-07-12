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
	
	PUSH 	= Array.prototype.push,
	//buggy for querySelectorAll
	BUGGY 	= {};
	//check the buggy
	aider(function(div){
		
	});
	
	mix(aider,{
		isXML: function(elem){
			var documentElement = (elem.ownerDocument || elem).documentElement;
			return documentElement ? documentElement.nodeName !== 'HTML' : false;
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
		contains: function(){},
		//iterate arr/elem/object
		iterate: function(){},
		ID: function(){}(),
		TAG: function(){}(),
		CLASS: function(){}(),
		ATTR: function(){}(),
	});

	mix(iCeet,{
		query: function(selector,context){},
		xpath: function(){},
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
