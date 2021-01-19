!function($){"use strict"
function MagicSuggest(element,conf){var ms=this,conf=$.extend({},conf),cfg=$.extend(!0,{},{allowFreeEntries:!0,allowDuplicates:!1,ajaxConfig:{},autoSelect:!0,selectFirst:!1,queryParam:"query",beforeSend:function(){},cls:"",data:null,dataUrlParams:{},disabled:!1,disabledField:null,displayField:"name",editable:!0,expanded:!1,expandOnFocus:!1,groupBy:null,hideTrigger:!1,highlight:!0,id:null,infoMsgCls:"",inputCfg:{},invalidCls:"ms-inv",matchCase:!1,maxDropHeight:290,maxEntryLength:null,maxEntryRenderer:function(v){return"Please reduce your entry by "+v+" character"+(1<v?"s":"")},maxSuggestions:null,maxSelection:10,maxSelectionRenderer:function(v){return"You cannot choose more than "+v+" item"+(1<v?"s":"")},method:"POST",minChars:0,minCharsRenderer:function(v){return"Please type "+v+" more character"+(1<v?"s":"")},mode:"local",name:null,noSuggestionText:"No suggestions",placeholder:"Type or click here",renderer:null,required:!1,resultAsString:!1,resultAsStringDelimiter:",",resultsField:"results",selectionCls:"",selectionContainer:null,selectionPosition:"inner",selectionRenderer:null,selectionStacked:!1,sortDir:"asc",sortOrder:null,strictSuggest:!1,style:"",toggleOnClick:!1,typeDelay:400,useTabKey:!1,useCommaKey:!0,useZebraStyle:!1,value:null,valueField:"id",vregex:null,vtype:null},conf)
this.addToSelection=function(items,isSilent){if(!cfg.maxSelection||_selection.length<cfg.maxSelection){$.isArray(items)||(items=[items])
var valuechanged=!1
$.each(items,function(index,json){if(cfg.allowDuplicates||-1===$.inArray(json[cfg.valueField],ms.getValue())){_selection.push(json)
valuechanged=!0}})
if(!0===valuechanged){self._renderSelection()
this.empty()
!0!==isSilent&&$(this).trigger("selectionchange",[this,this.getSelection()])}}this.input.attr("placeholder","inner"===cfg.selectionPosition&&0<this.getValue().length?"":cfg.placeholder)}
this.clear=function(isSilent){this.removeFromSelection(_selection.slice(0),isSilent)}
this.collapse=function(){if(!0===cfg.expanded){this.combobox.detach()
cfg.expanded=!1
$(this).trigger("collapse",[this])}}
this.disable=function(){this.container.addClass("ms-ctn-disabled")
cfg.disabled=!0
ms.input.attr("disabled",!0)}
this.empty=function(){this.input.val("")}
this.enable=function(){this.container.removeClass("ms-ctn-disabled")
cfg.disabled=!1
ms.input.attr("disabled",!1)}
this.expand=function(){if(!cfg.expanded&&(this.input.val().length>=cfg.minChars||0<this.combobox.children().size())){this.combobox.appendTo(this.container)
self._processSuggestions()
cfg.expanded=!0
$(this).trigger("expand",[this])}}
this.isDisabled=function(){return cfg.disabled}
this.isValid=function(){var valid=!1===cfg.required||0<_selection.length;(cfg.vtype||cfg.vregex)&&$.each(_selection,function(index,item){valid=valid&&self._validateSingleItem(item[cfg.valueField])})
return valid}
this.getDataUrlParams=function(){return cfg.dataUrlParams}
this.getName=function(){return cfg.name}
this.getSelection=function(){return _selection}
this.getRawValue=function(){return ms.input.val()}
this.getValue=function(){return $.map(_selection,function(o){return o[cfg.valueField]})}
this.removeFromSelection=function(items,isSilent){$.isArray(items)||(items=[items])
var valuechanged=!1
$.each(items,function(index,i){i=$.inArray(i[cfg.valueField],ms.getValue())
if(-1<i){_selection.splice(i,1)
valuechanged=!0}})
if(!0===valuechanged){self._renderSelection()
!0!==isSilent&&$(this).trigger("selectionchange",[this,this.getSelection()])
cfg.expandOnFocus&&ms.expand()
cfg.expanded&&self._processSuggestions()}this.input.attr("placeholder","inner"===cfg.selectionPosition&&0<this.getValue().length?"":cfg.placeholder)}
this.getData=function(){return _cbData}
this.setData=function(data){cfg.data=data
self._processSuggestions()}
this.setName=function(name){(cfg.name=name)&&(cfg.name+=0<name.indexOf("[]")?"":"[]")
ms._valueContainer&&$.each(ms._valueContainer.children(),function(i,el){el.name=cfg.name})}
this.setSelection=function(items){this.clear()
this.addToSelection(items)}
this.setValue=function(values){var items=[]
$.each(values,function(index,value){var found=!1
$.each(_cbData,function(i,item){if(item[cfg.valueField]==value){items.push(item)
return!(found=!0)}})
if(!found)if("object"==typeof value)items.push(value)
else{var json={}
json[cfg.valueField]=value
json[cfg.displayField]=value
items.push(json)}})
0<items.length&&this.addToSelection(items)}
this.setDataUrlParams=function(params){cfg.dataUrlParams=$.extend({},params)}
var _timer,_selection=[],_comboItemHeight=0,_hasFocus=!1,_groups=null,_cbData=[],_ctrlDown=!1,KEYCODES_BACKSPACE=8,KEYCODES_TAB=9,KEYCODES_ENTER=13,KEYCODES_CTRL=17,KEYCODES_ESC=27,KEYCODES_SPACE=32,KEYCODES_UPARROW=38,KEYCODES_DOWNARROW=40,KEYCODES_COMMA=188,self={_displaySuggestions:function(data){ms.combobox.show()
ms.combobox.empty()
var noSuggestionText=0,nbGroups=0
if(null===_groups){self._renderComboItems(data)
noSuggestionText=_comboItemHeight*data.length}else{for(var grpName in _groups){nbGroups+=1
$("<div/>",{class:"ms-res-group",html:grpName}).appendTo(ms.combobox)
self._renderComboItems(_groups[grpName].items,!0)}var tmpResHeight=ms.combobox.find(".ms-res-group").outerHeight()
noSuggestionText=null!==tmpResHeight?(tmpResHeight=nbGroups*tmpResHeight,_comboItemHeight*data.length+tmpResHeight):_comboItemHeight*(data.length+nbGroups)}noSuggestionText<ms.combobox.height()||noSuggestionText<=cfg.maxDropHeight?ms.combobox.height(noSuggestionText):noSuggestionText>=ms.combobox.height()&&noSuggestionText>cfg.maxDropHeight&&ms.combobox.height(cfg.maxDropHeight)
1===data.length&&!0===cfg.autoSelect&&ms.combobox.children().filter(":not(.ms-res-item-disabled):last").addClass("ms-res-item-active")
!0===cfg.selectFirst&&ms.combobox.children().filter(":not(.ms-res-item-disabled):first").addClass("ms-res-item-active")
if(0===data.length&&""!==ms.getRawValue()){noSuggestionText=cfg.noSuggestionText.replace(/\{\{.*\}\}/,ms.input.val())
self._updateHelper(noSuggestionText)
ms.collapse()}if(!1===cfg.allowFreeEntries)if(0===data.length){$(ms.input).addClass(cfg.invalidCls)
ms.combobox.hide()}else $(ms.input).removeClass(cfg.invalidCls)},_getEntriesFromStringArray:function(data){var json=[]
$.each(data,function(index,s){var entry={}
entry[cfg.displayField]=entry[cfg.valueField]=$.trim(s)
json.push(entry)})
return json},_highlightSuggestion:function(html){var q=ms.input.val()
$.each(["^","$","*","+","?",".","(",")",":","!","|","{","}","[","]"],function(index,value){q=q.replace(value,"\\"+value)})
if(0===q.length)return html
var glob=!0===cfg.matchCase?"g":"gi"
return html.replace(new RegExp("("+q+")(?!([^<]+)?>)",glob),"<em>$1</em>")},_moveSelectedRow:function(scrollPos){cfg.expanded||ms.expand()
var list=ms.combobox.find(".ms-res-item:not(.ms-res-item-disabled)"),start="down"===scrollPos?list.eq(0):list.filter(":last"),active=ms.combobox.find(".ms-res-item-active:not(.ms-res-item-disabled):first")
if(0<active.length)if("down"===scrollPos){0===(start=active.nextAll(".ms-res-item:not(.ms-res-item-disabled)").first()).length&&(start=list.eq(0))
scrollPos=ms.combobox.scrollTop()
ms.combobox.scrollTop(0)
start[0].offsetTop+start.outerHeight()>ms.combobox.height()&&ms.combobox.scrollTop(scrollPos+_comboItemHeight)}else{if(0===(start=active.prevAll(".ms-res-item:not(.ms-res-item-disabled)").first()).length){start=list.filter(":last")
ms.combobox.scrollTop(_comboItemHeight*list.length)}start[0].offsetTop<ms.combobox.scrollTop()&&ms.combobox.scrollTop(ms.combobox.scrollTop()-_comboItemHeight)}list.removeClass("ms-res-item-active")
start.addClass("ms-res-item-active")},_processSuggestions:function(data){var json,data=data||cfg.data
if(null!==data){"function"==typeof data&&(data=data.call(ms,ms.getRawValue()))
if("string"!=typeof data){_cbData=0<data.length&&"string"==typeof data[0]?self._getEntriesFromStringArray(data):data[cfg.resultsField]||data
var params="remote"===cfg.mode?_cbData:self._sortAndTrim(_cbData)
self._displaySuggestions(self._group(params))}else{$(ms).trigger("beforeload",[ms])
params={}
params[cfg.queryParam]=ms.input.val()
params=$.extend(params,cfg.dataUrlParams)
$.ajax($.extend({type:cfg.method,url:data,data:params,beforeSend:cfg.beforeSend,success:function(asyncData){json="string"==typeof asyncData?JSON.parse(asyncData):asyncData
self._processSuggestions(json)
$(ms).trigger("load",[ms,json])
if(self._asyncValues){ms.setValue("string"==typeof self._asyncValues?JSON.parse(self._asyncValues):self._asyncValues)
self._renderSelection()
delete self._asyncValues}},error:function(){throw"Could not reach server"}},cfg.ajaxConfig))}}},_render:function(el){ms.setName(cfg.name)
ms.container=$("<div/>",{class:"ms-ctn form-control "+(cfg.resultAsString?"ms-as-string ":"")+cfg.cls+($(el).hasClass("input-lg")?" input-lg":"")+($(el).hasClass("input-sm")?" input-sm":"")+(!0===cfg.disabled?" ms-ctn-disabled":"")+(!0===cfg.editable?"":" ms-ctn-readonly")+(!1===cfg.hideTrigger?"":" ms-no-trigger"),style:cfg.style,id:cfg.id})
ms.container.focus($.proxy(handlers._onFocus,this))
ms.container.blur($.proxy(handlers._onBlur,this))
ms.container.keydown($.proxy(handlers._onKeyDown,this))
ms.container.keyup($.proxy(handlers._onKeyUp,this))
ms.input=$("<input/>",$.extend({type:"text",class:!0===cfg.editable?"":" ms-input-readonly",readonly:!cfg.editable,placeholder:cfg.placeholder,disabled:cfg.disabled},cfg.inputCfg))
ms.input.focus($.proxy(handlers._onInputFocus,this))
ms.input.click($.proxy(handlers._onInputClick,this))
ms.combobox=$("<div/>",{class:"ms-res-ctn dropdown-menu"}).height(cfg.maxDropHeight)
ms.combobox.on("click","div.ms-res-item",$.proxy(handlers._onComboItemSelected,this))
ms.combobox.on("mouseover","div.ms-res-item",$.proxy(handlers._onComboItemMouseOver,this))
if(cfg.selectionContainer){ms.selectionContainer=cfg.selectionContainer
$(ms.selectionContainer).addClass("ms-sel-ctn")}else ms.selectionContainer=$("<div/>",{class:"ms-sel-ctn"})
ms.selectionContainer.click($.proxy(handlers._onFocus,this));("inner"!==cfg.selectionPosition||cfg.selectionContainer?ms.container:ms.selectionContainer).append(ms.input)
ms.helper=$("<span/>",{class:"ms-helper "+cfg.infoMsgCls})
self._updateHelper()
ms.container.append(ms.helper)
$(el).replaceWith(ms.container)
if(!cfg.selectionContainer)switch(cfg.selectionPosition){case"bottom":ms.selectionContainer.insertAfter(ms.container)
if(!0===cfg.selectionStacked){ms.selectionContainer.width(ms.container.width())
ms.selectionContainer.addClass("ms-stacked")}break
case"right":ms.selectionContainer.insertAfter(ms.container)
ms.container.css("float","left")
break
default:ms.container.append(ms.selectionContainer)}if(!1===cfg.hideTrigger){ms.trigger=$("<div/>",{class:"ms-trigger",html:'<div class="ms-trigger-ico"></div>'})
ms.trigger.click($.proxy(handlers._onTriggerClick,this))
ms.container.append(ms.trigger)}$(window).resize($.proxy(handlers._onWindowResized,this))
if(null!==cfg.value||null!==cfg.data)if("string"==typeof cfg.data){self._asyncValues=cfg.value
self._processSuggestions()}else{self._processSuggestions()
if(null!==cfg.value){ms.setValue(cfg.value)
self._renderSelection()}}$("body").click(function(e){ms.container.hasClass("ms-ctn-focus")&&0===ms.container.has(e.target).length&&e.target.className.indexOf("ms-res-item")<0&&e.target.className.indexOf("ms-close-btn")<0&&ms.container[0]!==e.target&&handlers._onBlur()})
if(!0===cfg.expanded){cfg.expanded=!1
ms.expand()}},_renderComboItems:function(items,isGrouped){var ref=this,html=""
$.each(items,function(index,resultItemEl){var displayed=null!==cfg.renderer?cfg.renderer.call(ref,resultItemEl):resultItemEl[cfg.displayField],disabled=null!==cfg.disabledField&&!0===resultItemEl[cfg.disabledField],resultItemEl=$("<div/>",{class:"ms-res-item "+(isGrouped?"ms-res-item-grouped ":"")+(disabled?"ms-res-item-disabled ":"")+(index%2==1&&!0===cfg.useZebraStyle?"ms-res-odd":""),html:!0===cfg.highlight?self._highlightSuggestion(displayed):displayed,"data-json":JSON.stringify(resultItemEl)})
html+=$("<div/>").append(resultItemEl).html()})
ms.combobox.append(html)
_comboItemHeight=ms.combobox.find(".ms-res-item:first").outerHeight()},_renderSelection:function(){var w,inputOffset,ref=this,items=[],asText=!0===cfg.resultAsString&&!_hasFocus
ms.selectionContainer.find(".ms-sel-item").remove()
void 0!==ms._valueContainer&&ms._valueContainer.remove()
$.each(_selection,function(index,value){var selectedItemEl,selectedItemHtml=null!==cfg.selectionRenderer?cfg.selectionRenderer.call(ref,value):value[cfg.displayField],validCls=self._validateSingleItem(value[cfg.displayField])?"":" ms-sel-invalid"
if(!0==asText)selectedItemEl=$("<div/>",{class:"ms-sel-item ms-sel-text "+cfg.selectionCls+validCls,html:selectedItemHtml+(index===_selection.length-1?"":cfg.resultAsStringDelimiter)}).data("json",value)
else{selectedItemEl=$("<div/>",{class:"ms-sel-item "+cfg.selectionCls+validCls,html:selectedItemHtml}).data("json",value)
!1===cfg.disabled&&$("<span/>",{class:"ms-close-btn"}).data("json",value).appendTo(selectedItemEl).click($.proxy(handlers._onTagTriggerClick,ref))}items.push(selectedItemEl)})
ms.selectionContainer.prepend(items)
ms._valueContainer=$("<div/>",{style:"display: none;"})
$.each(ms.getValue(),function(i,val){$("<input/>",{type:"hidden",name:cfg.name,value:val}).appendTo(ms._valueContainer)})
ms._valueContainer.appendTo(ms.selectionContainer)
if("inner"===cfg.selectionPosition&&!cfg.selectionContainer){ms.input.width(0)
inputOffset=ms.input.offset().left-ms.selectionContainer.offset().left
w=ms.container.width()-inputOffset-42
ms.input.width(w)}_selection.length===cfg.maxSelection?self._updateHelper(cfg.maxSelectionRenderer.call(this,_selection.length)):ms.helper.hide()},_selectItem:function(item){1===cfg.maxSelection&&(_selection=[])
ms.addToSelection(item.data("json"))
item.removeClass("ms-res-item-active")
!1!==cfg.expandOnFocus&&_selection.length!==cfg.maxSelection||ms.collapse()
if(_hasFocus){if(_hasFocus&&(cfg.expandOnFocus||_ctrlDown)){self._processSuggestions()
_ctrlDown&&ms.expand()}}else ms.input.focus()},_sortAndTrim:function(data){var q=ms.getRawValue(),filtered=[],newSuggestions=[],selectedValues=ms.getValue()
0<q.length?$.each(data,function(index,obj){var name=obj[cfg.displayField];(!0===cfg.matchCase&&-1<name.indexOf(q)||!1===cfg.matchCase&&-1<name.toLowerCase().indexOf(q.toLowerCase()))&&(!1!==cfg.strictSuggest&&0!==name.toLowerCase().indexOf(q.toLowerCase())||filtered.push(obj))}):filtered=data
$.each(filtered,function(index,obj){!cfg.allowDuplicates&&-1!==$.inArray(obj[cfg.valueField],selectedValues)||newSuggestions.push(obj)})
null!==cfg.sortOrder&&newSuggestions.sort(function(a,b){return a[cfg.sortOrder]<b[cfg.sortOrder]?"asc"===cfg.sortDir?-1:1:a[cfg.sortOrder]>b[cfg.sortOrder]?"asc"===cfg.sortDir?1:-1:0})
cfg.maxSuggestions&&0<cfg.maxSuggestions&&(newSuggestions=newSuggestions.slice(0,cfg.maxSuggestions))
return newSuggestions},_group:function(data){if(null!==cfg.groupBy){_groups={}
$.each(data,function(index,value){var props=-1<cfg.groupBy.indexOf(".")?cfg.groupBy.split("."):cfg.groupBy,prop=value[cfg.groupBy]
if("string"!=typeof props){prop=value
for(;0<props.length;)prop=prop[props.shift()]}void 0===_groups[prop]?_groups[prop]={title:prop,items:[value]}:_groups[prop].items.push(value)})}return data},_updateHelper:function(html){ms.helper.html(html)
ms.helper.is(":visible")||ms.helper.fadeIn()},_validateSingleItem:function(value){if(null!==cfg.vregex&&cfg.vregex instanceof RegExp)return cfg.vregex.test(value)
if(null!==cfg.vtype)switch(cfg.vtype){case"alpha":return/^[a-zA-Z_]+$/.test(value)
case"alphanum":return/^[a-zA-Z0-9_]+$/.test(value)
case"email":return/^(\w+)([\-+.][\w]+)*@(\w[\-\w]*\.){1,5}([A-Za-z]){2,6}$/.test(value)
case"url":return/(((^https?)|(^ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i.test(value)
case"ipaddress":return/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(value)}return!0}},handlers={_onBlur:function(){ms.container.removeClass("ms-ctn-focus")
ms.collapse()
_hasFocus=!1
if(""!==ms.getRawValue()&&!0===cfg.allowFreeEntries){var obj={}
obj[cfg.displayField]=obj[cfg.valueField]=ms.getRawValue().trim()
ms.addToSelection(obj)}self._renderSelection()
if(!1===ms.isValid())ms.container.addClass(cfg.invalidCls)
else if(""!==ms.input.val()&&!1===cfg.allowFreeEntries){ms.empty()
self._updateHelper("")}$(ms).trigger("blur",[ms])},_onComboItemMouseOver:function(target){target=$(target.currentTarget)
if(!target.hasClass("ms-res-item-disabled")){ms.combobox.children().removeClass("ms-res-item-active")
target.addClass("ms-res-item-active")}},_onComboItemSelected:function(e){$(e.currentTarget).hasClass("ms-res-item-disabled")||self._selectItem($(e.currentTarget))},_onFocus:function(){ms.input.focus()},_onInputClick:function(){!1===ms.isDisabled()&&_hasFocus&&!0===cfg.toggleOnClick&&(cfg.expanded?ms.collapse():ms.expand())},_onInputFocus:function(){if(!1===ms.isDisabled()&&!_hasFocus){_hasFocus=!0
ms.container.addClass("ms-ctn-focus")
ms.container.removeClass(cfg.invalidCls)
var curLength=ms.getRawValue().length
!0===cfg.expandOnFocus&&ms.expand()
_selection.length===cfg.maxSelection?self._updateHelper(cfg.maxSelectionRenderer.call(this,_selection.length)):curLength<cfg.minChars&&self._updateHelper(cfg.minCharsRenderer.call(this,cfg.minChars-curLength))
self._renderSelection()
$(ms).trigger("focus",[ms])}},_onKeyDown:function(e){var active=ms.combobox.find(".ms-res-item-active:not(.ms-res-item-disabled):first"),freeInput=ms.input.val()
$(ms).trigger("keydown",[ms,e])
if(e.keyCode!==KEYCODES_TAB||!1!==cfg.useTabKey&&(!0!==cfg.useTabKey||0!==active.length||0!==ms.input.val().length))switch(e.keyCode){case KEYCODES_BACKSPACE:if(0===freeInput.length&&0<ms.getSelection().length&&"inner"===cfg.selectionPosition){_selection.pop()
self._renderSelection()
$(ms).trigger("selectionchange",[ms,ms.getSelection()])
ms.input.attr("placeholder","inner"===cfg.selectionPosition&&0<ms.getValue().length?"":cfg.placeholder)
ms.input.focus()
e.preventDefault()}break
case KEYCODES_TAB:case KEYCODES_ESC:e.preventDefault()
break
case KEYCODES_ENTER:""===freeInput&&!cfg.expanded||e.preventDefault()
break
case KEYCODES_COMMA:!0===cfg.useCommaKey&&e.preventDefault()
break
case KEYCODES_CTRL:_ctrlDown=!0
break
case KEYCODES_DOWNARROW:e.preventDefault()
self._moveSelectedRow("down")
break
case KEYCODES_UPARROW:e.preventDefault()
self._moveSelectedRow("up")
break
default:_selection.length===cfg.maxSelection&&e.preventDefault()}else handlers._onBlur()},_onKeyUp:function(e){var selected,freeInput=ms.getRawValue(),inputValid=0<$.trim(ms.input.val()).length&&(!cfg.maxEntryLength||$.trim(ms.input.val()).length<=cfg.maxEntryLength),obj={}
$(ms).trigger("keyup",[ms,e])
clearTimeout(_timer)
e.keyCode===KEYCODES_ESC&&cfg.expanded&&ms.combobox.hide()
if(e.keyCode===KEYCODES_TAB&&!1===cfg.useTabKey||e.keyCode>KEYCODES_ENTER&&e.keyCode<KEYCODES_SPACE)e.keyCode===KEYCODES_CTRL&&(_ctrlDown=!1)
else switch(e.keyCode){case KEYCODES_UPARROW:case KEYCODES_DOWNARROW:e.preventDefault()
break
case KEYCODES_ENTER:case KEYCODES_TAB:case KEYCODES_COMMA:if(e.keyCode!==KEYCODES_COMMA||!0===cfg.useCommaKey){e.preventDefault()
if(!0===cfg.expanded&&0<(selected=ms.combobox.find(".ms-res-item-active:not(.ms-res-item-disabled):first")).length){self._selectItem(selected)
return}if(!0==inputValid&&!0===cfg.allowFreeEntries){obj[cfg.displayField]=obj[cfg.valueField]=freeInput.trim()
ms.addToSelection(obj)
ms.collapse()
ms.input.focus()}break}default:if(_selection.length===cfg.maxSelection)self._updateHelper(cfg.maxSelectionRenderer.call(this,_selection.length))
else if(freeInput.length<cfg.minChars){self._updateHelper(cfg.minCharsRenderer.call(this,cfg.minChars-freeInput.length))
!0===cfg.expanded&&ms.collapse()}else if(cfg.maxEntryLength&&freeInput.length>cfg.maxEntryLength){self._updateHelper(cfg.maxEntryRenderer.call(this,freeInput.length-cfg.maxEntryLength))
!0===cfg.expanded&&ms.collapse()}else{ms.helper.hide()
cfg.minChars<=freeInput.length&&(_timer=setTimeout(function(){!0===cfg.expanded?self._processSuggestions():ms.expand()},cfg.typeDelay))}}},_onTagTriggerClick:function(e){ms.removeFromSelection($(e.currentTarget).data("json"))},_onTriggerClick:function(){if(!1===ms.isDisabled()&&(!0!==cfg.expandOnFocus||_selection.length!==cfg.maxSelection)){$(ms).trigger("triggerclick",[ms])
if(!0===cfg.expanded)ms.collapse()
else{var curLength=ms.getRawValue().length
if(curLength>=cfg.minChars){ms.input.focus()
ms.expand()}else self._updateHelper(cfg.minCharsRenderer.call(this,cfg.minChars-curLength))}}},_onWindowResized:function(){self._renderSelection()}}
null!==element&&self._render(element)}$.fn.magicSuggest=function(options){var obj=$(this)
if(1===obj.size()&&obj.data("magicSuggest"))return obj.data("magicSuggest")
obj.each(function(i){var cntr=$(this)
if(!cntr.data("magicSuggest")){if("select"===this.nodeName.toLowerCase()){options.data=[]
options.value=[]
$.each(this.children,function(index,child){if(child.nodeName&&"option"===child.nodeName.toLowerCase()){options.data.push({id:child.value,name:child.text})
$(child).attr("selected")&&options.value.push(child.value)}})}var def={}
$.each(this.attributes,function(i,att){def[att.name]="value"===att.name&&""!==att.value?JSON.parse(att.value):att.value})
var field=new MagicSuggest(this,$.extend([],$.fn.magicSuggest.defaults,options,def))
cntr.data("magicSuggest",field)
field.container.data("magicSuggest",field)}})
return 1===obj.size()?obj.data("magicSuggest"):obj}
$.fn.magicSuggest.defaults={}}(jQuery)
