!function($,window,document){var defaults={animation:"fade",arrow:!0,arrowColor:"",autoClose:!0,content:null,contentAsHTML:!1,contentCloning:!0,debug:!0,delay:200,minWidth:0,maxWidth:null,functionInit:function(origin,content){},functionBefore:function(origin,continueTooltip){continueTooltip()},functionReady:function(origin,tooltip){},functionAfter:function(origin){},hideOnClick:!1,icon:"(?)",iconCloning:!0,iconDesktop:!1,iconTouch:!1,iconTheme:"tooltipster-icon",interactive:!1,interactiveTolerance:350,multiple:!1,offsetX:0,offsetY:0,onlyOne:!1,position:"top",positionTracker:!1,positionTrackerCallback:function(origin){"hover"==this.option("trigger")&&this.option("autoClose")&&this.hide()},restoration:"current",speed:350,timer:0,theme:"tooltipster-default",touchDevices:!0,trigger:"hover",updateAnimation:!0}
function Plugin(element,options){this.bodyOverflowX
this.callbacks={hide:[],show:[]}
this.checkInterval=null
this.Content
this.$el=$(element)
this.$elProxy
this.elProxyPosition
this.enabled=!0
this.options=$.extend({},defaults,options)
this.mouseIsOverProxy=!1
this.namespace="tooltipster-"+Math.round(1e5*Math.random())
this.Status="hidden"
this.timerHide=null
this.timerShow=null
this.$tooltip
this.options.iconTheme=this.options.iconTheme.replace(".","")
this.options.theme=this.options.theme.replace(".","")
this._init()}Plugin.prototype={_init:function(){var self=this
if(document.querySelector){var c=null
if(void 0===self.$el.data("tooltipster-initialTitle")){void 0===(c=self.$el.attr("title"))&&(c=null)
self.$el.data("tooltipster-initialTitle",c)}null!==self.options.content?self._content_set(self.options.content):self._content_set(c)
c=self.options.functionInit.call(self.$el,self.$el,self.Content)
void 0!==c&&self._content_set(c)
self.$el.removeAttr("title").addClass("tooltipstered")
if(!deviceHasTouchCapability&&self.options.iconDesktop||deviceHasTouchCapability&&self.options.iconTouch){if("string"==typeof self.options.icon){self.$elProxy=$('<span class="'+self.options.iconTheme+'"></span>')
self.$elProxy.text(self.options.icon)}else self.options.iconCloning?self.$elProxy=self.options.icon.clone(!0):self.$elProxy=self.options.icon
self.$elProxy.insertAfter(self.$el)}else self.$elProxy=self.$el
if("hover"==self.options.trigger){self.$elProxy.on("mouseenter."+self.namespace,function(){if(!deviceIsPureTouch()||self.options.touchDevices){self.mouseIsOverProxy=!0
self._show()}}).on("mouseleave."+self.namespace,function(){deviceIsPureTouch()&&!self.options.touchDevices||(self.mouseIsOverProxy=!1)})
deviceHasTouchCapability&&self.options.touchDevices&&self.$elProxy.on("touchstart."+self.namespace,function(){self._showNow()})}else"click"==self.options.trigger&&self.$elProxy.on("click."+self.namespace,function(){deviceIsPureTouch()&&!self.options.touchDevices||self._show()})}},_show:function(){var self=this
"shown"!=self.Status&&"appearing"!=self.Status&&(self.options.delay?self.timerShow=setTimeout(function(){("click"==self.options.trigger||"hover"==self.options.trigger&&self.mouseIsOverProxy)&&self._showNow()},self.options.delay):self._showNow())},_showNow:function(callback){var self=this
self.options.functionBefore.call(self.$el,self.$el,function(){if(self.enabled&&null!==self.Content){callback&&self.callbacks.show.push(callback)
self.callbacks.hide=[]
clearTimeout(self.timerShow)
self.timerShow=null
clearTimeout(self.timerHide)
self.timerHide=null
self.options.onlyOne&&$(".tooltipstered").not(self.$el).each(function(i,nss){var $el=$(nss),nss=$el.data("tooltipster-ns")
$.each(nss,function(i,ac){var instance=$el.data(ac),s=instance.status(),ac=instance.option("autoClose")
"hidden"!==s&&"disappearing"!==s&&ac&&instance.hide()})})
function finish(){self.Status="shown"
$.each(self.callbacks.show,function(i,c){c.call(self.$el)})
self.callbacks.show=[]}if("hidden"!==self.Status){var extraTime=0
if("disappearing"===self.Status){self.Status="appearing"
if(supportsTransitions()){self.$tooltip.clearQueue().removeClass("tooltipster-dying").addClass("tooltipster-"+self.options.animation+"-show")
0<self.options.speed&&self.$tooltip.delay(self.options.speed)
self.$tooltip.queue(finish)}else self.$tooltip.stop().fadeIn(finish)}else"shown"===self.Status&&finish()}else{self.Status="appearing"
extraTime=self.options.speed
self.bodyOverflowX=$("body").css("overflow-x")
$("body").css("overflow-x","hidden")
var animation="tooltipster-"+self.options.animation,animationSpeed="-webkit-transition-duration: "+self.options.speed+"ms; -webkit-animation-duration: "+self.options.speed+"ms; -moz-transition-duration: "+self.options.speed+"ms; -moz-animation-duration: "+self.options.speed+"ms; -o-transition-duration: "+self.options.speed+"ms; -o-animation-duration: "+self.options.speed+"ms; -ms-transition-duration: "+self.options.speed+"ms; -ms-animation-duration: "+self.options.speed+"ms; transition-duration: "+self.options.speed+"ms; animation-duration: "+self.options.speed+"ms;",minWidth=self.options.minWidth?"min-width:"+Math.round(self.options.minWidth)+"px;":"",maxWidth=self.options.maxWidth?"max-width:"+Math.round(self.options.maxWidth)+"px;":"",pointerEvents=self.options.interactive?"pointer-events: auto;":""
self.$tooltip=$('<div class="tooltipster-base '+self.options.theme+'" style="'+minWidth+" "+maxWidth+" "+pointerEvents+" "+animationSpeed+'"><div class="tooltipster-content"></div></div>')
supportsTransitions()&&self.$tooltip.addClass(animation)
self._content_insert()
self.$tooltip.appendTo("body")
self.reposition()
self.options.functionReady.call(self.$el,self.$el,self.$tooltip)
if(supportsTransitions()){self.$tooltip.addClass(animation+"-show")
0<self.options.speed&&self.$tooltip.delay(self.options.speed)
self.$tooltip.queue(finish)}else self.$tooltip.css("display","none").fadeIn(self.options.speed,finish)
self._interval_set()
$(window).on("scroll."+self.namespace+" resize."+self.namespace,function(){self.reposition()})
if(self.options.autoClose){$("body").off("."+self.namespace)
if("hover"==self.options.trigger){deviceHasTouchCapability&&setTimeout(function(){$("body").on("touchstart."+self.namespace,function(){self.hide()})},0)
if(self.options.interactive){deviceHasTouchCapability&&self.$tooltip.on("touchstart."+self.namespace,function(event){event.stopPropagation()})
var tolerance=null
self.$elProxy.add(self.$tooltip).on("mouseleave."+self.namespace+"-autoClose",function(){clearTimeout(tolerance)
tolerance=setTimeout(function(){self.hide()},self.options.interactiveTolerance)}).on("mouseenter."+self.namespace+"-autoClose",function(){clearTimeout(tolerance)})}else self.$elProxy.on("mouseleave."+self.namespace+"-autoClose",function(){self.hide()})
self.options.hideOnClick&&self.$elProxy.on("click."+self.namespace+"-autoClose",function(){self.hide()})}else if("click"==self.options.trigger){setTimeout(function(){$("body").on("click."+self.namespace+" touchstart."+self.namespace,function(){self.hide()})},0)
self.options.interactive&&self.$tooltip.on("click."+self.namespace+" touchstart."+self.namespace,function(event){event.stopPropagation()})}}}0<self.options.timer&&(self.timerHide=setTimeout(function(){self.timerHide=null
self.hide()},self.options.timer+extraTime))}})},_interval_set:function(){var self=this
self.checkInterval=setInterval(function(){if(0===$("body").find(self.$el).length||0===$("body").find(self.$elProxy).length||"hidden"==self.Status||0===$("body").find(self.$tooltip).length){"shown"!=self.Status&&"appearing"!=self.Status||self.hide()
self._interval_cancel()}else if(self.options.positionTracker){var p=self._repositionInfo(self.$elProxy),identical=!1
areEqual(p.dimension,self.elProxyPosition.dimension)&&("fixed"===self.$elProxy.css("position")?areEqual(p.position,self.elProxyPosition.position)&&(identical=!0):areEqual(p.offset,self.elProxyPosition.offset)&&(identical=!0))
if(!identical){self.reposition()
self.options.positionTrackerCallback.call(self,self.$el)}}},200)},_interval_cancel:function(){clearInterval(this.checkInterval)
this.checkInterval=null},_content_set:function(content){"object"==typeof content&&null!==content&&this.options.contentCloning&&(content=content.clone(!0))
this.Content=content},_content_insert:function(){var $d=this.$tooltip.find(".tooltipster-content")
"string"!=typeof this.Content||this.options.contentAsHTML?$d.empty().append(this.Content):$d.text(this.Content)},_update:function(content){var self=this
self._content_set(content)
if(null!==self.Content){if("hidden"!==self.Status){self._content_insert()
self.reposition()
if(self.options.updateAnimation)if(supportsTransitions()){self.$tooltip.css({width:"","-webkit-transition":"all "+self.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-moz-transition":"all "+self.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-o-transition":"all "+self.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms","-ms-transition":"all "+self.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms",transition:"all "+self.options.speed+"ms, width 0ms, height 0ms, left 0ms, top 0ms"}).addClass("tooltipster-content-changing")
setTimeout(function(){if("hidden"!=self.Status){self.$tooltip.removeClass("tooltipster-content-changing")
setTimeout(function(){"hidden"!==self.Status&&self.$tooltip.css({"-webkit-transition":self.options.speed+"ms","-moz-transition":self.options.speed+"ms","-o-transition":self.options.speed+"ms","-ms-transition":self.options.speed+"ms",transition:self.options.speed+"ms"})},self.options.speed)}},self.options.speed)}else self.$tooltip.fadeTo(self.options.speed,.5,function(){"hidden"!=self.Status&&self.$tooltip.fadeTo(self.options.speed,1)})}}else self.hide()},_repositionInfo:function($el){return{dimension:{height:$el.outerHeight(!1),width:$el.outerWidth(!1)},offset:$el.offset(),position:{left:parseInt($el.css("left")),top:parseInt($el.css("top"))}}},hide:function(finish){var self=this
finish&&self.callbacks.hide.push(finish)
self.callbacks.show=[]
clearTimeout(self.timerShow)
self.timerShow=null
clearTimeout(self.timerHide)
self.timerHide=null
function finishCallbacks(){$.each(self.callbacks.hide,function(i,c){c.call(self.$el)})
self.callbacks.hide=[]}if("shown"==self.Status||"appearing"==self.Status){self.Status="disappearing"
finish=function(){self.Status="hidden"
"object"==typeof self.Content&&null!==self.Content&&self.Content.detach()
self.$tooltip.remove()
self.$tooltip=null
$(window).off("."+self.namespace)
$("body").off("."+self.namespace).css("overflow-x",self.bodyOverflowX)
$("body").off("."+self.namespace)
self.$elProxy.off("."+self.namespace+"-autoClose")
self.options.functionAfter.call(self.$el,self.$el)
finishCallbacks()}
if(supportsTransitions()){self.$tooltip.clearQueue().removeClass("tooltipster-"+self.options.animation+"-show").addClass("tooltipster-dying")
0<self.options.speed&&self.$tooltip.delay(self.options.speed)
self.$tooltip.queue(finish)}else self.$tooltip.stop().fadeOut(self.options.speed,finish)}else"hidden"==self.Status&&finishCallbacks()
return self},show:function(callback){this._showNow(callback)
return this},update:function(c){return this.content(c)},content:function(c){if(void 0===c)return this.Content
this._update(c)
return this},reposition:function(){if(0!==$("body").find(this.$tooltip).length){this.$tooltip.css("width","")
this.elProxyPosition=this._repositionInfo(this.$elProxy)
var arrowReposition=null,windowWidth=$(window).width(),proxy=this.elProxyPosition,tooltipWidth=this.$tooltip.outerWidth(!1),tooltipHeight=(this.$tooltip.innerWidth(),this.$tooltip.outerHeight(!1))
if(this.$elProxy.is("area")){var areaShape=this.$elProxy.attr("shape"),areaRight=this.$elProxy.parent().attr("name"),map=$('img[usemap="#'+areaRight+'"]'),arrowBorderSize=map.offset().left,arrowClass=map.offset().top,areaMeasurements=void 0!==this.$elProxy.attr("coords")?this.$elProxy.attr("coords").split(","):void 0
if("circle"==areaShape){var areaLeft=parseInt(areaMeasurements[0]),areaTop=parseInt(areaMeasurements[1]),areaBottom=parseInt(areaMeasurements[2])
proxy.dimension.height=2*areaBottom
proxy.dimension.width=2*areaBottom
proxy.offset.top=arrowClass+areaTop-areaBottom
proxy.offset.left=arrowBorderSize+areaLeft-areaBottom}else if("rect"==areaShape){areaLeft=parseInt(areaMeasurements[0]),areaTop=parseInt(areaMeasurements[1]),areaRight=parseInt(areaMeasurements[2]),areaBottom=parseInt(areaMeasurements[3])
proxy.dimension.height=areaBottom-areaTop
proxy.dimension.width=areaRight-areaLeft
proxy.offset.top=arrowClass+areaTop
proxy.offset.left=arrowBorderSize+areaLeft}else if("poly"==areaShape){for(var areaSmallestX=0,areaSmallestY=0,areaGreatestX=0,areaGreatestY=0,arrayAlternate="even",i=0;i<areaMeasurements.length;i++){var areaNumber=parseInt(areaMeasurements[i])
if("even"==arrayAlternate){if(areaGreatestX<areaNumber){areaGreatestX=areaNumber
0===i&&(areaSmallestX=areaGreatestX)}areaNumber<areaSmallestX&&(areaSmallestX=areaNumber)
arrayAlternate="odd"}else{if(areaGreatestY<areaNumber){areaGreatestY=areaNumber
1==i&&(areaSmallestY=areaGreatestY)}areaNumber<areaSmallestY&&(areaSmallestY=areaNumber)
arrayAlternate="even"}}proxy.dimension.height=areaGreatestY-areaSmallestY
proxy.dimension.width=areaGreatestX-areaSmallestX
proxy.offset.top=arrowClass+areaSmallestY
proxy.offset.left=arrowBorderSize+areaSmallestX}else{proxy.dimension.height=map.outerHeight(!1)
proxy.dimension.width=map.outerWidth(!1)
proxy.offset.top=arrowClass
proxy.offset.left=arrowBorderSize}}var myLeft=0,arrowClass=0,myTop=0,offsetY=parseInt(this.options.offsetY),arrowBorderSize=parseInt(this.options.offsetX),practicalPosition=this.options.position
function dontGoOffScreenX(){var windowLeft=$(window).scrollLeft()
if(myLeft-windowLeft<0){arrowReposition=myLeft-windowLeft
myLeft=windowLeft}if(windowWidth<myLeft+tooltipWidth-windowLeft){arrowReposition=myLeft-(windowWidth+windowLeft-tooltipWidth)
myLeft=windowWidth+windowLeft-tooltipWidth}}function dontGoOffScreenY(switchTo,switchFrom){proxy.offset.top-$(window).scrollTop()-tooltipHeight-offsetY-12<0&&-1<switchFrom.indexOf("top")&&(practicalPosition=switchTo)
if(proxy.offset.top+proxy.dimension.height+tooltipHeight+12+offsetY>$(window).scrollTop()+$(window).height()&&-1<switchFrom.indexOf("bottom")){practicalPosition=switchTo
myTop=proxy.offset.top-tooltipHeight-offsetY-12}}if("top"==practicalPosition){var leftDifference=proxy.offset.left+tooltipWidth-(proxy.offset.left+proxy.dimension.width),myLeft=proxy.offset.left+arrowBorderSize-leftDifference/2,myTop=proxy.offset.top-tooltipHeight-offsetY-12
dontGoOffScreenX()
dontGoOffScreenY("bottom","top")}if("top-left"==practicalPosition){myLeft=proxy.offset.left+arrowBorderSize
myTop=proxy.offset.top-tooltipHeight-offsetY-12
dontGoOffScreenX()
dontGoOffScreenY("bottom-left","top-left")}if("top-right"==practicalPosition){myLeft=proxy.offset.left+proxy.dimension.width+arrowBorderSize-tooltipWidth
myTop=proxy.offset.top-tooltipHeight-offsetY-12
dontGoOffScreenX()
dontGoOffScreenY("bottom-right","top-right")}if("bottom"==practicalPosition){leftDifference=proxy.offset.left+tooltipWidth-(proxy.offset.left+proxy.dimension.width)
myLeft=proxy.offset.left-leftDifference/2+arrowBorderSize
myTop=proxy.offset.top+proxy.dimension.height+offsetY+12
dontGoOffScreenX()
dontGoOffScreenY("top","bottom")}if("bottom-left"==practicalPosition){myLeft=proxy.offset.left+arrowBorderSize
myTop=proxy.offset.top+proxy.dimension.height+offsetY+12
dontGoOffScreenX()
dontGoOffScreenY("top-left","bottom-left")}if("bottom-right"==practicalPosition){myLeft=proxy.offset.left+proxy.dimension.width+arrowBorderSize-tooltipWidth
myTop=proxy.offset.top+proxy.dimension.height+offsetY+12
dontGoOffScreenX()
dontGoOffScreenY("top-right","bottom-right")}if("left"==practicalPosition){myLeft=proxy.offset.left-arrowBorderSize-tooltipWidth-12
arrowClass=proxy.offset.left+arrowBorderSize+proxy.dimension.width+12
var arrowBorder=proxy.offset.top+tooltipHeight-(proxy.offset.top+proxy.dimension.height)
myTop=proxy.offset.top-arrowBorder/2-offsetY
if(myLeft<0&&windowWidth<arrowClass+tooltipWidth){var arrowConstruct=2*parseFloat(this.$tooltip.css("border-width")),arrowBorderColor=tooltipWidth+myLeft-arrowConstruct
this.$tooltip.css("width",arrowBorderColor+"px")
tooltipHeight=this.$tooltip.outerHeight(!1)
myLeft=proxy.offset.left-arrowBorderSize-arrowBorderColor-12-arrowConstruct
arrowBorder=proxy.offset.top+tooltipHeight-(proxy.offset.top+proxy.dimension.height)
myTop=proxy.offset.top-arrowBorder/2-offsetY}else if(myLeft<0){myLeft=proxy.offset.left+arrowBorderSize+proxy.dimension.width+12
arrowReposition="left"}}if("right"==practicalPosition){myLeft=proxy.offset.left+arrowBorderSize+proxy.dimension.width+12
arrowClass=proxy.offset.left-arrowBorderSize-tooltipWidth-12
arrowBorder=proxy.offset.top+tooltipHeight-(proxy.offset.top+proxy.dimension.height)
myTop=proxy.offset.top-arrowBorder/2-offsetY
if(windowWidth<myLeft+tooltipWidth&&arrowClass<0){arrowConstruct=2*parseFloat(this.$tooltip.css("border-width")),arrowBorderColor=windowWidth-myLeft-arrowConstruct
this.$tooltip.css("width",arrowBorderColor+"px")
tooltipHeight=this.$tooltip.outerHeight(!1)
arrowBorder=proxy.offset.top+tooltipHeight-(proxy.offset.top+proxy.dimension.height)
myTop=proxy.offset.top-arrowBorder/2-offsetY}else if(windowWidth<myLeft+tooltipWidth){myLeft=proxy.offset.left-arrowBorderSize-tooltipWidth-12
arrowReposition="right"}}if(this.options.arrow){var tooltipBorderWidth,arrowClass="tooltipster-arrow-"+practicalPosition
arrowConstruct=this.options.arrowColor.length<1?this.$tooltip.css("background-color"):this.options.arrowColor
if(arrowReposition)if("left"==arrowReposition){arrowClass="tooltipster-arrow-right"
arrowReposition=""}else if("right"==arrowReposition){arrowClass="tooltipster-arrow-left"
arrowReposition=""}else arrowReposition="left:"+Math.round(arrowReposition)+"px;"
else arrowReposition=""
arrowBorderColor="top"==practicalPosition||"top-left"==practicalPosition||"top-right"==practicalPosition?(tooltipBorderWidth=parseFloat(this.$tooltip.css("border-bottom-width")),this.$tooltip.css("border-bottom-color")):"bottom"==practicalPosition||"bottom-left"==practicalPosition||"bottom-right"==practicalPosition?(tooltipBorderWidth=parseFloat(this.$tooltip.css("border-top-width")),this.$tooltip.css("border-top-color")):"left"==practicalPosition?(tooltipBorderWidth=parseFloat(this.$tooltip.css("border-right-width")),this.$tooltip.css("border-right-color")):"right"==practicalPosition?(tooltipBorderWidth=parseFloat(this.$tooltip.css("border-left-width")),this.$tooltip.css("border-left-color")):(tooltipBorderWidth=parseFloat(this.$tooltip.css("border-bottom-width")),this.$tooltip.css("border-bottom-color"))
1<tooltipBorderWidth&&tooltipBorderWidth++
arrowBorder=""
if(0!==tooltipBorderWidth){arrowBorderSize="",arrowBorderColor="border-color: "+arrowBorderColor+";";-1!==arrowClass.indexOf("bottom")?arrowBorderSize="margin-top: -"+Math.round(tooltipBorderWidth)+"px;":-1!==arrowClass.indexOf("top")?arrowBorderSize="margin-bottom: -"+Math.round(tooltipBorderWidth)+"px;":-1!==arrowClass.indexOf("left")?arrowBorderSize="margin-right: -"+Math.round(tooltipBorderWidth)+"px;":-1!==arrowClass.indexOf("right")&&(arrowBorderSize="margin-left: -"+Math.round(tooltipBorderWidth)+"px;")
arrowBorder='<span class="tooltipster-arrow-border" style="'+arrowBorderSize+" "+arrowBorderColor+';"></span>'}this.$tooltip.find(".tooltipster-arrow").remove()
arrowConstruct='<div class="'+arrowClass+' tooltipster-arrow" style="'+arrowReposition+'">'+arrowBorder+'<span style="border-color:'+arrowConstruct+';"></span></div>'
this.$tooltip.append(arrowConstruct)}this.$tooltip.css({top:Math.round(myTop)+"px",left:Math.round(myLeft)+"px"})}return this},enable:function(){this.enabled=!0
return this},disable:function(){this.hide()
this.enabled=!1
return this},destroy:function(){var self=this
self.hide()
self.$el[0]!==self.$elProxy[0]&&self.$elProxy.remove()
self.$el.removeData(self.namespace).off("."+self.namespace)
var ns=self.$el.data("tooltipster-ns")
if(1===ns.length){var title=null
"previous"===self.options.restoration?title=self.$el.data("tooltipster-initialTitle"):"current"===self.options.restoration&&(title="string"==typeof self.Content?self.Content:$("<div></div>").append(self.Content).html())
title&&self.$el.attr("title",title)
self.$el.removeClass("tooltipstered").removeData("tooltipster-ns").removeData("tooltipster-initialTitle")}else{ns=$.grep(ns,function(el,i){return el!==self.namespace})
self.$el.data("tooltipster-ns",ns)}return self},elementIcon:function(){return this.$el[0]!==this.$elProxy[0]?this.$elProxy[0]:void 0},elementTooltip:function(){return this.$tooltip?this.$tooltip[0]:void 0},option:function(o,val){if(void 0===val)return this.options[o]
this.options[o]=val
return this},status:function(){return this.Status}}
$.fn.tooltipster=function(){var args=arguments
if(0===this.length){if("string"!=typeof args[0])return this
var debugIsSet=!0
"setDefaults"===args[0]?$.extend(defaults,args[1]):debugIsSet=!1
return!!debugIsSet||this}if("string"==typeof args[0]){var v="#*$~&"
this.each(function(){var resp=$(this).data("tooltipster-ns"),self=resp?$(this).data(resp[0]):null
if(!self)throw new Error("You called Tooltipster's \""+args[0]+'" method on an uninitialized element')
if("function"!=typeof self[args[0]])throw new Error('Unknown method .tooltipster("'+args[0]+'")')
resp=self[args[0]](args[1],args[2])
if(resp!==self){v=resp
return!1}})
return"#*$~&"!==v?v:this}var instances=[],debugIsSet=args[0]&&void 0!==args[0].multiple,multiple=debugIsSet&&args[0].multiple||!debugIsSet&&defaults.multiple,debugIsSet=args[0]&&void 0!==args[0].debug,debug=debugIsSet&&args[0].debug||!debugIsSet&&defaults.debug
this.each(function(){var go=!1,ns=$(this).data("tooltipster-ns"),instance=null
!ns||multiple?go=!0:debug&&console.log('Tooltipster: one or more tooltips are already attached to this element: ignoring. Use the "multiple" option to attach more tooltips.')
if(go){instance=new Plugin(this,args[0]);(ns=ns||[]).push(instance.namespace)
$(this).data("tooltipster-ns",ns)
$(this).data(instance.namespace,instance)}instances.push(instance)})
return multiple?instances:this}
function areEqual(a,b){var same=!0
$.each(a,function(i,el){if(void 0===b[i]||a[i]!==b[i])return same=!1})
return same}var deviceHasTouchCapability=!!("ontouchstart"in window),deviceHasMouse=!1
$("body").one("mousemove",function(){deviceHasMouse=!0})
function deviceIsPureTouch(){return!deviceHasMouse&&deviceHasTouchCapability}function supportsTransitions(){var p,s=(document.body||document.documentElement).style
if("string"==typeof s.transition)return 1
v=["Moz","Webkit","Khtml","O","ms"],p="transition".charAt(0).toUpperCase()+"transition".substr(1)
for(var i=0;i<v.length;i++)if("string"==typeof s[v[i]+p])return 1}}(jQuery,window,document)
