(function($){
    $.page = function(el){
        var base = this;
        
        base.$el = $(el);
        base.el = el;
        
        base.$el.data("page", base);
        
        base.init = function(){
			this._doc = el || document;
			this._docKey = this.renderingMode() == 'Standards' ? 'documentElement' : 'body';
		};

		base.scrollSize = function(){
			var isWebkit = navigator.userAgent.indexOf("WebKit")>-1;
			var oDoc = this._doc[isWebkit?'body':this._docKey];
			
			return {
				width : Math.max(oDoc.scrollWidth, oDoc.clientWidth),
				height : Math.max(oDoc.scrollHeight, oDoc.clientHeight)
			};
		};

		base.scrollPosition = function(){
			var isWebkit = navigator.userAgent.indexOf("WebKit")>-1;
			var oDoc = this._doc[isWebkit?'body':this._docKey];
			return {
				left : oDoc.scrollLeft||window.pageXOffset||window.scrollX||0,
				top : oDoc.scrollTop||window.pageYOffset||window.scrollY||0
			};
		};

		base.clientSize = function(){
			var agent = navigator.userAgent;
			var oDoc = this._doc[this._docKey];
			
			var isSafari = agent.indexOf("WebKit")>-1 && agent.indexOf("Chrome")==-1;

			return (isSafari)?{
							width : window.innerWidth,
							height : window.innerHeight
						}:{
							width : oDoc.clientWidth,
							height : oDoc.clientHeight
						};
		};
        
		base.renderingMode = function(){
			var agent = navigator.userAgent;
			var isIe = (typeof window.opera=="undefined" && agent.indexOf("MSIE")>-1);
			var isSafari = (agent.indexOf("WebKit")>-1 && agent.indexOf("Chrome")<0 && navigator.vendor.indexOf("Apple")>-1);
			var sRet;

			if ('compatMode' in this._doc){
				sRet = this._doc.compatMode == 'CSS1Compat' ? 'Standards' : (isIe ? 'Quirks' : 'Almost');
			}else{
				sRet = isSafari ? 'Standards' : 'Quirks';
			}

			return sRet;
		};

        // Run initializer
        base.init();
		return base;
    };
    
    $.fn.page = function(){
        return this.each(function(){
            (new $.page(this));
        });
    };
    
})(jQuery);