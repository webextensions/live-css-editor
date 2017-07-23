var CSSLint=function(){function Reporter(lines,ruleset,allow,ignore){"use strict"
this.messages=[]
this.stats=[]
this.lines=lines
this.ruleset=ruleset
this.allow=allow
this.allow||(this.allow={})
this.ignore=ignore
this.ignore||(this.ignore=[])}var module=module||{},parserlib=function(){var require
return(require=function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require
if(!u&&a)return a(o,!0)
if(i)return i(o,!0)
var f=new Error("Cannot find module '"+o+"'")
throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}}
t[o][0].call(l.exports,function(e){var n=t[o][1][e]
return s(n||e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o])
return s}({1:[function(require,module,exports){"use strict"
module.exports={__proto__:null,aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgrey:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",grey:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32",currentColor:"The value of the 'color' property.",activeBorder:"Active window border.",activecaption:"Active window caption.",appworkspace:"Background color of multiple document interface.",background:"Desktop background.",buttonface:"The face background color for 3-D elements that appear 3-D due to one layer of surrounding border.",buttonhighlight:"The color of the border facing the light source for 3-D elements that appear 3-D due to one layer of surrounding border.",buttonshadow:"The color of the border away from the light source for 3-D elements that appear 3-D due to one layer of surrounding border.",buttontext:"Text on push buttons.",captiontext:"Text in caption, size box, and scrollbar arrow box.",graytext:"Grayed (disabled) text. This color is set to #000 if the current display driver does not support a solid gray color.",greytext:"Greyed (disabled) text. This color is set to #000 if the current display driver does not support a solid grey color.",highlight:"Item(s) selected in a control.",highlighttext:"Text of item(s) selected in a control.",inactiveborder:"Inactive window border.",inactivecaption:"Inactive window caption.",inactivecaptiontext:"Color of text in an inactive caption.",infobackground:"Background color for tooltip controls.",infotext:"Text color for tooltip controls.",menu:"Menu background.",menutext:"Text in menus.",scrollbar:"Scroll bar gray area.",threeddarkshadow:"The color of the darker (generally outer) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.",threedface:"The face background color for 3-D elements that appear 3-D due to two concentric layers of surrounding border.",threedhighlight:"The color of the lighter (generally outer) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.",threedlightshadow:"The color of the darker (generally inner) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.",threedshadow:"The color of the lighter (generally inner) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border.",window:"Window background.",windowframe:"Window frame.",windowtext:"Text in windows."}},{}],2:[function(require,module,exports){"use strict"
function Combinator(text,line,col){SyntaxUnit.call(this,text,line,col,Parser.COMBINATOR_TYPE)
this.type="unknown";/^\s+$/.test(text)?this.type="descendant":">"===text?this.type="child":"+"===text?this.type="adjacent-sibling":"~"===text&&(this.type="sibling")}module.exports=Combinator
var SyntaxUnit=require("../util/SyntaxUnit"),Parser=require("./Parser");(Combinator.prototype=new SyntaxUnit).constructor=Combinator},{"../util/SyntaxUnit":26,"./Parser":6}],3:[function(require,module,exports){"use strict"
function Matcher(matchFunc,toString){this.match=function(expression){var result
expression.mark();(result=matchFunc(expression))?expression.drop():expression.restore()
return result}
this.toString="function"==typeof toString?toString:function(){return toString}}module.exports=Matcher
var StringReader=require("../util/StringReader"),SyntaxError=require("../util/SyntaxError")
Matcher.prec={MOD:5,SEQ:4,ANDAND:3,OROR:2,ALT:1}
Matcher.parse=function(str){var reader,eat,expr,oror,andand,seq,mod,term,result
reader=new StringReader(str)
eat=function(matcher){var result=reader.readMatch(matcher)
if(null===result)throw new SyntaxError("Expected "+matcher,reader.getLine(),reader.getCol())
return result}
expr=function(){for(var m=[oror()];null!==reader.readMatch(" | ");)m.push(oror())
return 1===m.length?m[0]:Matcher.alt.apply(Matcher,m)}
oror=function(){for(var m=[andand()];null!==reader.readMatch(" || ");)m.push(andand())
return 1===m.length?m[0]:Matcher.oror.apply(Matcher,m)}
andand=function(){for(var m=[seq()];null!==reader.readMatch(" && ");)m.push(seq())
return 1===m.length?m[0]:Matcher.andand.apply(Matcher,m)}
seq=function(){for(var m=[mod()];null!==reader.readMatch(/^ (?![&|\]])/);)m.push(mod())
return 1===m.length?m[0]:Matcher.seq.apply(Matcher,m)}
mod=function(){var m=term()
if(null!==reader.readMatch("?"))return m.question()
if(null!==reader.readMatch("*"))return m.star()
if(null!==reader.readMatch("+"))return m.plus()
if(null!==reader.readMatch("#"))return m.hash()
if(null!==reader.readMatch(/^\{\s*/)){var min=eat(/^\d+/)
eat(/^\s*,\s*/)
var max=eat(/^\d+/)
eat(/^\s*\}/)
return m.braces(+min,+max)}return m}
term=function(){if(null!==reader.readMatch("[ ")){var m=expr()
eat(" ]")
return m}return Matcher.fromType(eat(/^[^ ?*+#{]+/))}
result=expr()
if(!reader.eof())throw new SyntaxError("Expected end of string",reader.getLine(),reader.getCol())
return result}
Matcher.cast=function(m){return m instanceof Matcher?m:Matcher.parse(m)}
Matcher.fromType=function(type){var ValidationTypes=require("./ValidationTypes")
return new Matcher(function(expression){return expression.hasNext()&&ValidationTypes.isType(expression,type)},type)}
Matcher.seq=function(){var ms=Array.prototype.slice.call(arguments).map(Matcher.cast)
return 1===ms.length?ms[0]:new Matcher(function(expression){var i,result=!0
for(i=0;result&&i<ms.length;i++)result=ms[i].match(expression)
return result},function(prec){var p=Matcher.prec.SEQ,s=ms.map(function(m){return m.toString(p)}).join(" ")
prec>p&&(s="[ "+s+" ]")
return s})}
Matcher.alt=function(){var ms=Array.prototype.slice.call(arguments).map(Matcher.cast)
return 1===ms.length?ms[0]:new Matcher(function(expression){var i,result=!1
for(i=0;!result&&i<ms.length;i++)result=ms[i].match(expression)
return result},function(prec){var p=Matcher.prec.ALT,s=ms.map(function(m){return m.toString(p)}).join(" | ")
prec>p&&(s="[ "+s+" ]")
return s})}
Matcher.many=function(required){var ms=Array.prototype.slice.call(arguments,1).reduce(function(acc,v){if(v.expand){var ValidationTypes=require("./ValidationTypes")
acc.push.apply(acc,ValidationTypes.complex[v.expand].options)}else acc.push(Matcher.cast(v))
return acc},[])
!0===required&&(required=ms.map(function(){return!0}))
var result=new Matcher(function(expression){var seen=[],max=0,pass=0,success=function(matchCount){if(0===pass){max=Math.max(matchCount,max)
return matchCount===ms.length}return matchCount===max},tryMatch=function(matchCount){for(var i=0;i<ms.length;i++)if(!seen[i]){expression.mark()
if(ms[i].match(expression)){seen[i]=!0
if(tryMatch(matchCount+(!1===required||required[i]?1:0))){expression.drop()
return!0}expression.restore()
seen[i]=!1}else expression.drop()}return success(matchCount)}
if(!tryMatch(0)){pass++
tryMatch(0)}if(!1===required)return max>0
for(var i=0;i<ms.length;i++)if(required[i]&&!seen[i])return!1
return!0},function(prec){var p=!1===required?Matcher.prec.OROR:Matcher.prec.ANDAND,s=ms.map(function(m,i){return!1===required||required[i]?m.toString(p):m.toString(Matcher.prec.MOD)+"?"}).join(!1===required?" || ":" && ")
prec>p&&(s="[ "+s+" ]")
return s})
result.options=ms
return result}
Matcher.andand=function(){var args=Array.prototype.slice.call(arguments)
args.unshift(!0)
return Matcher.many.apply(Matcher,args)}
Matcher.oror=function(){var args=Array.prototype.slice.call(arguments)
args.unshift(!1)
return Matcher.many.apply(Matcher,args)}
Matcher.prototype={constructor:Matcher,match:function(){throw new Error("unimplemented")},toString:function(){throw new Error("unimplemented")},func:function(){return this.match.bind(this)},then:function(m){return Matcher.seq(this,m)},or:function(m){return Matcher.alt(this,m)},andand:function(m){return Matcher.many(!0,this,m)},oror:function(m){return Matcher.many(!1,this,m)},star:function(){return this.braces(0,1/0,"*")},plus:function(){return this.braces(1,1/0,"+")},question:function(){return this.braces(0,1,"?")},hash:function(){return this.braces(1,1/0,"#",Matcher.cast(","))},braces:function(min,max,marker,optSep){var m1=this,m2=optSep?optSep.then(this):this
marker||(marker="{"+min+","+max+"}")
return new Matcher(function(expression){var i
for(i=0;i<max&&(i>0&&optSep?m2.match(expression):m1.match(expression));i++);return i>=min},function(){return m1.toString(Matcher.prec.MOD)+marker})}}},{"../util/StringReader":24,"../util/SyntaxError":25,"./ValidationTypes":21}],4:[function(require,module,exports){"use strict"
function MediaFeature(name,value){SyntaxUnit.call(this,"("+name+(null!==value?":"+value:"")+")",name.startLine,name.startCol,Parser.MEDIA_FEATURE_TYPE)
this.name=name
this.value=value}module.exports=MediaFeature
var SyntaxUnit=require("../util/SyntaxUnit"),Parser=require("./Parser");(MediaFeature.prototype=new SyntaxUnit).constructor=MediaFeature},{"../util/SyntaxUnit":26,"./Parser":6}],5:[function(require,module,exports){"use strict"
function MediaQuery(modifier,mediaType,features,line,col){SyntaxUnit.call(this,(modifier?modifier+" ":"")+(mediaType||"")+(mediaType&&features.length>0?" and ":"")+features.join(" and "),line,col,Parser.MEDIA_QUERY_TYPE)
this.modifier=modifier
this.mediaType=mediaType
this.features=features}module.exports=MediaQuery
var SyntaxUnit=require("../util/SyntaxUnit"),Parser=require("./Parser");(MediaQuery.prototype=new SyntaxUnit).constructor=MediaQuery},{"../util/SyntaxUnit":26,"./Parser":6}],6:[function(require,module,exports){"use strict"
function Parser(options){EventTarget.call(this)
this.options=options||{}
this._tokenStream=null}module.exports=Parser
var EventTarget=require("../util/EventTarget"),SyntaxError=require("../util/SyntaxError"),SyntaxUnit=require("../util/SyntaxUnit"),Combinator=require("./Combinator"),MediaFeature=require("./MediaFeature"),MediaQuery=require("./MediaQuery"),PropertyName=require("./PropertyName"),PropertyValue=require("./PropertyValue"),PropertyValuePart=require("./PropertyValuePart"),Selector=require("./Selector"),SelectorPart=require("./SelectorPart"),SelectorSubPart=require("./SelectorSubPart"),TokenStream=require("./TokenStream"),Tokens=require("./Tokens"),Validation=require("./Validation")
Parser.DEFAULT_TYPE=0
Parser.COMBINATOR_TYPE=1
Parser.MEDIA_FEATURE_TYPE=2
Parser.MEDIA_QUERY_TYPE=3
Parser.PROPERTY_NAME_TYPE=4
Parser.PROPERTY_VALUE_TYPE=5
Parser.PROPERTY_VALUE_PART_TYPE=6
Parser.SELECTOR_TYPE=7
Parser.SELECTOR_PART_TYPE=8
Parser.SELECTOR_SUB_PART_TYPE=9
Parser.prototype=function(){var prop,proto=new EventTarget,additions={__proto__:null,constructor:Parser,DEFAULT_TYPE:0,COMBINATOR_TYPE:1,MEDIA_FEATURE_TYPE:2,MEDIA_QUERY_TYPE:3,PROPERTY_NAME_TYPE:4,PROPERTY_VALUE_TYPE:5,PROPERTY_VALUE_PART_TYPE:6,SELECTOR_TYPE:7,SELECTOR_PART_TYPE:8,SELECTOR_SUB_PART_TYPE:9,_stylesheet:function(){var count,token,tt,tokenStream=this._tokenStream
this.fire("startstylesheet")
this._charset()
this._skipCruft()
for(;tokenStream.peek()===Tokens.IMPORT_SYM;){this._import()
this._skipCruft()}for(;tokenStream.peek()===Tokens.NAMESPACE_SYM;){this._namespace()
this._skipCruft()}tt=tokenStream.peek()
for(;tt>Tokens.EOF;){try{switch(tt){case Tokens.MEDIA_SYM:this._media()
this._skipCruft()
break
case Tokens.PAGE_SYM:this._page()
this._skipCruft()
break
case Tokens.FONT_FACE_SYM:this._font_face()
this._skipCruft()
break
case Tokens.KEYFRAMES_SYM:this._keyframes()
this._skipCruft()
break
case Tokens.VIEWPORT_SYM:this._viewport()
this._skipCruft()
break
case Tokens.DOCUMENT_SYM:this._document()
this._skipCruft()
break
case Tokens.SUPPORTS_SYM:this._supports()
this._skipCruft()
break
case Tokens.UNKNOWN_SYM:tokenStream.get()
if(this.options.strict)throw new SyntaxError("Unknown @ rule.",tokenStream.LT(0).startLine,tokenStream.LT(0).startCol)
this.fire({type:"error",error:null,message:"Unknown @ rule: "+tokenStream.LT(0).value+".",line:tokenStream.LT(0).startLine,col:tokenStream.LT(0).startCol})
count=0
for(;tokenStream.advance([Tokens.LBRACE,Tokens.RBRACE])===Tokens.LBRACE;)count++
for(;count;){tokenStream.advance([Tokens.RBRACE])
count--}break
case Tokens.S:this._readWhitespace()
break
default:if(!this._ruleset())switch(tt){case Tokens.CHARSET_SYM:token=tokenStream.LT(1)
this._charset(!1)
throw new SyntaxError("@charset not allowed here.",token.startLine,token.startCol)
case Tokens.IMPORT_SYM:token=tokenStream.LT(1)
this._import(!1)
throw new SyntaxError("@import not allowed here.",token.startLine,token.startCol)
case Tokens.NAMESPACE_SYM:token=tokenStream.LT(1)
this._namespace(!1)
throw new SyntaxError("@namespace not allowed here.",token.startLine,token.startCol)
default:tokenStream.get()
this._unexpectedToken(tokenStream.token())}}}catch(ex){if(!(ex instanceof SyntaxError)||this.options.strict)throw ex
this.fire({type:"error",error:ex,message:ex.message,line:ex.line,col:ex.col})}tt=tokenStream.peek()}tt!==Tokens.EOF&&this._unexpectedToken(tokenStream.token())
this.fire("endstylesheet")},_charset:function(emit){var charset,line,col,tokenStream=this._tokenStream
if(tokenStream.match(Tokens.CHARSET_SYM)){line=tokenStream.token().startLine
col=tokenStream.token().startCol
this._readWhitespace()
tokenStream.mustMatch(Tokens.STRING)
charset=tokenStream.token().value
this._readWhitespace()
tokenStream.mustMatch(Tokens.SEMICOLON)
!1!==emit&&this.fire({type:"charset",charset:charset,line:line,col:col})}},_import:function(emit){var uri,importToken,tokenStream=this._tokenStream,mediaList=[]
tokenStream.mustMatch(Tokens.IMPORT_SYM)
importToken=tokenStream.token()
this._readWhitespace()
tokenStream.mustMatch([Tokens.STRING,Tokens.URI])
uri=tokenStream.token().value.replace(/^(?:url\()?["']?([^"']+?)["']?\)?$/,"$1")
this._readWhitespace()
mediaList=this._media_query_list()
tokenStream.mustMatch(Tokens.SEMICOLON)
this._readWhitespace()
!1!==emit&&this.fire({type:"import",uri:uri,media:mediaList,line:importToken.startLine,col:importToken.startCol})},_namespace:function(emit){var line,col,prefix,uri,tokenStream=this._tokenStream
tokenStream.mustMatch(Tokens.NAMESPACE_SYM)
line=tokenStream.token().startLine
col=tokenStream.token().startCol
this._readWhitespace()
if(tokenStream.match(Tokens.IDENT)){prefix=tokenStream.token().value
this._readWhitespace()}tokenStream.mustMatch([Tokens.STRING,Tokens.URI])
uri=tokenStream.token().value.replace(/(?:url\()?["']([^"']+)["']\)?/,"$1")
this._readWhitespace()
tokenStream.mustMatch(Tokens.SEMICOLON)
this._readWhitespace()
!1!==emit&&this.fire({type:"namespace",prefix:prefix,uri:uri,line:line,col:col})},_supports:function(emit){var line,col,tokenStream=this._tokenStream
if(tokenStream.match(Tokens.SUPPORTS_SYM)){line=tokenStream.token().startLine
col=tokenStream.token().startCol
this._readWhitespace()
this._supports_condition()
this._readWhitespace()
tokenStream.mustMatch(Tokens.LBRACE)
this._readWhitespace()
!1!==emit&&this.fire({type:"startsupports",line:line,col:col})
for(;;)if(!this._ruleset())break
tokenStream.mustMatch(Tokens.RBRACE)
this._readWhitespace()
this.fire({type:"endsupports",line:line,col:col})}},_supports_condition:function(){var ident,tokenStream=this._tokenStream
if(tokenStream.match(Tokens.IDENT))if("not"===(ident=tokenStream.token().value.toLowerCase())){tokenStream.mustMatch(Tokens.S)
this._supports_condition_in_parens()}else tokenStream.unget()
else{this._supports_condition_in_parens()
this._readWhitespace()
for(;tokenStream.peek()===Tokens.IDENT;)if("and"===(ident=tokenStream.LT(1).value.toLowerCase())||"or"===ident){tokenStream.mustMatch(Tokens.IDENT)
this._readWhitespace()
this._supports_condition_in_parens()
this._readWhitespace()}}},_supports_condition_in_parens:function(){var tokenStream=this._tokenStream
if(tokenStream.match(Tokens.LPAREN)){this._readWhitespace()
if(tokenStream.match(Tokens.IDENT))if("not"===tokenStream.token().value.toLowerCase()){this._readWhitespace()
this._supports_condition()
this._readWhitespace()
tokenStream.mustMatch(Tokens.RPAREN)}else{tokenStream.unget()
this._supports_declaration_condition(!1)}else{this._supports_condition()
this._readWhitespace()
tokenStream.mustMatch(Tokens.RPAREN)}}else this._supports_declaration_condition()},_supports_declaration_condition:function(requireStartParen){var tokenStream=this._tokenStream
!1!==requireStartParen&&tokenStream.mustMatch(Tokens.LPAREN)
this._readWhitespace()
this._declaration()
tokenStream.mustMatch(Tokens.RPAREN)},_media:function(){var line,col,mediaList,tokenStream=this._tokenStream
tokenStream.mustMatch(Tokens.MEDIA_SYM)
line=tokenStream.token().startLine
col=tokenStream.token().startCol
this._readWhitespace()
mediaList=this._media_query_list()
tokenStream.mustMatch(Tokens.LBRACE)
this._readWhitespace()
this.fire({type:"startmedia",media:mediaList,line:line,col:col})
for(;;)if(tokenStream.peek()===Tokens.PAGE_SYM)this._page()
else if(tokenStream.peek()===Tokens.FONT_FACE_SYM)this._font_face()
else if(tokenStream.peek()===Tokens.VIEWPORT_SYM)this._viewport()
else if(tokenStream.peek()===Tokens.DOCUMENT_SYM)this._document()
else if(tokenStream.peek()===Tokens.SUPPORTS_SYM)this._supports()
else if(tokenStream.peek()===Tokens.MEDIA_SYM)this._media()
else if(!this._ruleset())break
tokenStream.mustMatch(Tokens.RBRACE)
this._readWhitespace()
this.fire({type:"endmedia",media:mediaList,line:line,col:col})},_media_query_list:function(){var tokenStream=this._tokenStream,mediaList=[]
this._readWhitespace()
tokenStream.peek()!==Tokens.IDENT&&tokenStream.peek()!==Tokens.LPAREN||mediaList.push(this._media_query())
for(;tokenStream.match(Tokens.COMMA);){this._readWhitespace()
mediaList.push(this._media_query())}return mediaList},_media_query:function(){var tokenStream=this._tokenStream,type=null,ident=null,token=null,expressions=[]
if(tokenStream.match(Tokens.IDENT))if("only"!==(ident=tokenStream.token().value.toLowerCase())&&"not"!==ident){tokenStream.unget()
ident=null}else token=tokenStream.token()
this._readWhitespace()
if(tokenStream.peek()===Tokens.IDENT){type=this._media_type()
null===token&&(token=tokenStream.token())}else if(tokenStream.peek()===Tokens.LPAREN){null===token&&(token=tokenStream.LT(1))
expressions.push(this._media_expression())}if(null===type&&0===expressions.length)return null
this._readWhitespace()
for(;tokenStream.match(Tokens.IDENT);){"and"!==tokenStream.token().value.toLowerCase()&&this._unexpectedToken(tokenStream.token())
this._readWhitespace()
expressions.push(this._media_expression())}return new MediaQuery(ident,type,expressions,token.startLine,token.startCol)},_media_type:function(){return this._media_feature()},_media_expression:function(){var token,tokenStream=this._tokenStream,feature=null,expression=null
tokenStream.mustMatch(Tokens.LPAREN)
feature=this._media_feature()
this._readWhitespace()
if(tokenStream.match(Tokens.COLON)){this._readWhitespace()
token=tokenStream.LT(1)
expression=this._expression()}tokenStream.mustMatch(Tokens.RPAREN)
this._readWhitespace()
return new MediaFeature(feature,expression?new SyntaxUnit(expression,token.startLine,token.startCol):null)},_media_feature:function(){var tokenStream=this._tokenStream
this._readWhitespace()
tokenStream.mustMatch(Tokens.IDENT)
return SyntaxUnit.fromToken(tokenStream.token())},_page:function(){var line,col,tokenStream=this._tokenStream,identifier=null,pseudoPage=null
tokenStream.mustMatch(Tokens.PAGE_SYM)
line=tokenStream.token().startLine
col=tokenStream.token().startCol
this._readWhitespace()
tokenStream.match(Tokens.IDENT)&&"auto"===(identifier=tokenStream.token().value).toLowerCase()&&this._unexpectedToken(tokenStream.token())
tokenStream.peek()===Tokens.COLON&&(pseudoPage=this._pseudo_page())
this._readWhitespace()
this.fire({type:"startpage",id:identifier,pseudo:pseudoPage,line:line,col:col})
this._readDeclarations(!0,!0)
this.fire({type:"endpage",id:identifier,pseudo:pseudoPage,line:line,col:col})},_margin:function(){var line,col,tokenStream=this._tokenStream,marginSym=this._margin_sym()
if(marginSym){line=tokenStream.token().startLine
col=tokenStream.token().startCol
this.fire({type:"startpagemargin",margin:marginSym,line:line,col:col})
this._readDeclarations(!0)
this.fire({type:"endpagemargin",margin:marginSym,line:line,col:col})
return!0}return!1},_margin_sym:function(){var tokenStream=this._tokenStream
return tokenStream.match([Tokens.TOPLEFTCORNER_SYM,Tokens.TOPLEFT_SYM,Tokens.TOPCENTER_SYM,Tokens.TOPRIGHT_SYM,Tokens.TOPRIGHTCORNER_SYM,Tokens.BOTTOMLEFTCORNER_SYM,Tokens.BOTTOMLEFT_SYM,Tokens.BOTTOMCENTER_SYM,Tokens.BOTTOMRIGHT_SYM,Tokens.BOTTOMRIGHTCORNER_SYM,Tokens.LEFTTOP_SYM,Tokens.LEFTMIDDLE_SYM,Tokens.LEFTBOTTOM_SYM,Tokens.RIGHTTOP_SYM,Tokens.RIGHTMIDDLE_SYM,Tokens.RIGHTBOTTOM_SYM])?SyntaxUnit.fromToken(tokenStream.token()):null},_pseudo_page:function(){var tokenStream=this._tokenStream
tokenStream.mustMatch(Tokens.COLON)
tokenStream.mustMatch(Tokens.IDENT)
return tokenStream.token().value},_font_face:function(){var line,col,tokenStream=this._tokenStream
tokenStream.mustMatch(Tokens.FONT_FACE_SYM)
line=tokenStream.token().startLine
col=tokenStream.token().startCol
this._readWhitespace()
this.fire({type:"startfontface",line:line,col:col})
this._readDeclarations(!0)
this.fire({type:"endfontface",line:line,col:col})},_viewport:function(){var line,col,tokenStream=this._tokenStream
tokenStream.mustMatch(Tokens.VIEWPORT_SYM)
line=tokenStream.token().startLine
col=tokenStream.token().startCol
this._readWhitespace()
this.fire({type:"startviewport",line:line,col:col})
this._readDeclarations(!0)
this.fire({type:"endviewport",line:line,col:col})},_document:function(){var token,tokenStream=this._tokenStream,functions=[],prefix=""
tokenStream.mustMatch(Tokens.DOCUMENT_SYM)
token=tokenStream.token();/^@\-([^\-]+)\-/.test(token.value)&&(prefix=RegExp.$1)
this._readWhitespace()
functions.push(this._document_function())
for(;tokenStream.match(Tokens.COMMA);){this._readWhitespace()
functions.push(this._document_function())}tokenStream.mustMatch(Tokens.LBRACE)
this._readWhitespace()
this.fire({type:"startdocument",functions:functions,prefix:prefix,line:token.startLine,col:token.startCol})
for(var ok=!0;ok;)switch(tokenStream.peek()){case Tokens.PAGE_SYM:this._page()
break
case Tokens.FONT_FACE_SYM:this._font_face()
break
case Tokens.VIEWPORT_SYM:this._viewport()
break
case Tokens.MEDIA_SYM:this._media()
break
case Tokens.KEYFRAMES_SYM:this._keyframes()
break
case Tokens.DOCUMENT_SYM:this._document()
break
default:ok=Boolean(this._ruleset())}tokenStream.mustMatch(Tokens.RBRACE)
token=tokenStream.token()
this._readWhitespace()
this.fire({type:"enddocument",functions:functions,prefix:prefix,line:token.startLine,col:token.startCol})},_document_function:function(){var value,tokenStream=this._tokenStream
if(tokenStream.match(Tokens.URI)){value=tokenStream.token().value
this._readWhitespace()}else value=this._function()
return value},_operator:function(inFunction){var tokenStream=this._tokenStream,token=null
if(tokenStream.match([Tokens.SLASH,Tokens.COMMA])||inFunction&&tokenStream.match([Tokens.PLUS,Tokens.STAR,Tokens.MINUS])){token=tokenStream.token()
this._readWhitespace()}return token?PropertyValuePart.fromToken(token):null},_combinator:function(){var token,tokenStream=this._tokenStream,value=null
if(tokenStream.match([Tokens.PLUS,Tokens.GREATER,Tokens.TILDE])){token=tokenStream.token()
value=new Combinator(token.value,token.startLine,token.startCol)
this._readWhitespace()}return value},_unary_operator:function(){var tokenStream=this._tokenStream
return tokenStream.match([Tokens.MINUS,Tokens.PLUS])?tokenStream.token().value:null},_property:function(){var tokenValue,token,line,col,tokenStream=this._tokenStream,value=null,hack=null
if(tokenStream.peek()===Tokens.STAR&&this.options.starHack){tokenStream.get()
hack=(token=tokenStream.token()).value
line=token.startLine
col=token.startCol}if(tokenStream.match(Tokens.IDENT)){if("_"===(tokenValue=(token=tokenStream.token()).value).charAt(0)&&this.options.underscoreHack){hack="_"
tokenValue=tokenValue.substring(1)}value=new PropertyName(tokenValue,hack,line||token.startLine,col||token.startCol)
this._readWhitespace()}return value},_ruleset:function(){var selectors,tokenStream=this._tokenStream
try{selectors=this._selectors_group()}catch(ex){if(!(ex instanceof SyntaxError)||this.options.strict)throw ex
this.fire({type:"error",error:ex,message:ex.message,line:ex.line,col:ex.col})
if(tokenStream.advance([Tokens.RBRACE])!==Tokens.RBRACE)throw ex
return!0}if(selectors){this.fire({type:"startrule",selectors:selectors,line:selectors[0].line,col:selectors[0].col})
this._readDeclarations(!0)
this.fire({type:"endrule",selectors:selectors,line:selectors[0].line,col:selectors[0].col})}return selectors},_selectors_group:function(){var selector,tokenStream=this._tokenStream,selectors=[]
if(null!==(selector=this._selector())){selectors.push(selector)
for(;tokenStream.match(Tokens.COMMA);){this._readWhitespace()
null!==(selector=this._selector())?selectors.push(selector):this._unexpectedToken(tokenStream.LT(1))}}return selectors.length?selectors:null},_selector:function(){var tokenStream=this._tokenStream,selector=[],nextSelector=null,combinator=null,ws=null
if(null===(nextSelector=this._simple_selector_sequence()))return null
selector.push(nextSelector)
for(;;)if(null!==(combinator=this._combinator())){selector.push(combinator)
null===(nextSelector=this._simple_selector_sequence())?this._unexpectedToken(tokenStream.LT(1)):selector.push(nextSelector)}else{if(!this._readWhitespace())break
ws=new Combinator(tokenStream.token().value,tokenStream.token().startLine,tokenStream.token().startCol)
combinator=this._combinator()
if(null===(nextSelector=this._simple_selector_sequence()))null!==combinator&&this._unexpectedToken(tokenStream.LT(1))
else{null!==combinator?selector.push(combinator):selector.push(ws)
selector.push(nextSelector)}}return new Selector(selector,selector[0].line,selector[0].col)},_simple_selector_sequence:function(){var line,col,tokenStream=this._tokenStream,elementName=null,modifiers=[],selectorText="",components=[function(){return tokenStream.match(Tokens.HASH)?new SelectorSubPart(tokenStream.token().value,"id",tokenStream.token().startLine,tokenStream.token().startCol):null},this._class,this._attrib,this._pseudo,this._negation],i=0,len=components.length,component=null
line=tokenStream.LT(1).startLine
col=tokenStream.LT(1).startCol;(elementName=this._type_selector())||(elementName=this._universal())
null!==elementName&&(selectorText+=elementName)
for(;;){if(tokenStream.peek()===Tokens.S)break
for(;i<len&&null===component;)component=components[i++].call(this)
if(null===component){if(""===selectorText)return null
break}i=0
modifiers.push(component)
selectorText+=component.toString()
component=null}return""!==selectorText?new SelectorPart(elementName,modifiers,selectorText,line,col):null},_type_selector:function(){var tokenStream=this._tokenStream,ns=this._namespace_prefix(),elementName=this._element_name()
if(elementName){if(ns){elementName.text=ns+elementName.text
elementName.col-=ns.length}return elementName}if(ns){tokenStream.unget()
ns.length>1&&tokenStream.unget()}return null},_class:function(){var token,tokenStream=this._tokenStream
if(tokenStream.match(Tokens.DOT)){tokenStream.mustMatch(Tokens.IDENT)
token=tokenStream.token()
return new SelectorSubPart("."+token.value,"class",token.startLine,token.startCol-1)}return null},_element_name:function(){var token,tokenStream=this._tokenStream
if(tokenStream.match(Tokens.IDENT)){token=tokenStream.token()
return new SelectorSubPart(token.value,"elementName",token.startLine,token.startCol)}return null},_namespace_prefix:function(){var tokenStream=this._tokenStream,value=""
if(tokenStream.LA(1)===Tokens.PIPE||tokenStream.LA(2)===Tokens.PIPE){tokenStream.match([Tokens.IDENT,Tokens.STAR])&&(value+=tokenStream.token().value)
tokenStream.mustMatch(Tokens.PIPE)
value+="|"}return value.length?value:null},_universal:function(){var ns,tokenStream=this._tokenStream,value="";(ns=this._namespace_prefix())&&(value+=ns)
tokenStream.match(Tokens.STAR)&&(value+="*")
return value.length?value:null},_attrib:function(){var ns,token,tokenStream=this._tokenStream,value=null
if(tokenStream.match(Tokens.LBRACKET)){value=(token=tokenStream.token()).value
value+=this._readWhitespace();(ns=this._namespace_prefix())&&(value+=ns)
tokenStream.mustMatch(Tokens.IDENT)
value+=tokenStream.token().value
value+=this._readWhitespace()
if(tokenStream.match([Tokens.PREFIXMATCH,Tokens.SUFFIXMATCH,Tokens.SUBSTRINGMATCH,Tokens.EQUALS,Tokens.INCLUDES,Tokens.DASHMATCH])){value+=tokenStream.token().value
value+=this._readWhitespace()
tokenStream.mustMatch([Tokens.IDENT,Tokens.STRING])
value+=tokenStream.token().value
value+=this._readWhitespace()}tokenStream.mustMatch(Tokens.RBRACKET)
return new SelectorSubPart(value+"]","attribute",token.startLine,token.startCol)}return null},_pseudo:function(){var line,col,tokenStream=this._tokenStream,pseudo=null,colons=":"
if(tokenStream.match(Tokens.COLON)){tokenStream.match(Tokens.COLON)&&(colons+=":")
if(tokenStream.match(Tokens.IDENT)){pseudo=tokenStream.token().value
line=tokenStream.token().startLine
col=tokenStream.token().startCol-colons.length}else if(tokenStream.peek()===Tokens.FUNCTION){line=tokenStream.LT(1).startLine
col=tokenStream.LT(1).startCol-colons.length
pseudo=this._functional_pseudo()}if(!pseudo){var startLine=tokenStream.LT(1).startLine,startCol=tokenStream.LT(0).startCol
throw new SyntaxError("Expected a `FUNCTION` or `IDENT` after colon at line "+startLine+", col "+startCol+".",startLine,startCol)}pseudo=new SelectorSubPart(colons+pseudo,"pseudo",line,col)}return pseudo},_functional_pseudo:function(){var tokenStream=this._tokenStream,value=null
if(tokenStream.match(Tokens.FUNCTION)){value=tokenStream.token().value
value+=this._readWhitespace()
value+=this._expression()
tokenStream.mustMatch(Tokens.RPAREN)
value+=")"}return value},_expression:function(){for(var tokenStream=this._tokenStream,value="";tokenStream.match([Tokens.PLUS,Tokens.MINUS,Tokens.DIMENSION,Tokens.NUMBER,Tokens.STRING,Tokens.IDENT,Tokens.LENGTH,Tokens.FREQ,Tokens.ANGLE,Tokens.TIME,Tokens.RESOLUTION,Tokens.SLASH]);){value+=tokenStream.token().value
value+=this._readWhitespace()}return value.length?value:null},_negation:function(){var line,col,arg,tokenStream=this._tokenStream,value="",subpart=null
if(tokenStream.match(Tokens.NOT)){value=tokenStream.token().value
line=tokenStream.token().startLine
col=tokenStream.token().startCol
value+=this._readWhitespace()
value+=arg=this._negation_arg()
value+=this._readWhitespace()
tokenStream.match(Tokens.RPAREN)
value+=tokenStream.token().value;(subpart=new SelectorSubPart(value,"not",line,col)).args.push(arg)}return subpart},_negation_arg:function(){var line,col,tokenStream=this._tokenStream,args=[this._type_selector,this._universal,function(){return tokenStream.match(Tokens.HASH)?new SelectorSubPart(tokenStream.token().value,"id",tokenStream.token().startLine,tokenStream.token().startCol):null},this._class,this._attrib,this._pseudo],arg=null,i=0,len=args.length
line=tokenStream.LT(1).startLine
col=tokenStream.LT(1).startCol
for(;i<len&&null===arg;){arg=args[i].call(this)
i++}null===arg&&this._unexpectedToken(tokenStream.LT(1))
return"elementName"===arg.type?new SelectorPart(arg,[],arg.toString(),line,col):new SelectorPart(null,[arg],arg.toString(),line,col)},_declaration:function(){var tokenStream=this._tokenStream,property=null,expr=null,prio=null,invalid=null,propertyName=""
if(null!==(property=this._property())){tokenStream.mustMatch(Tokens.COLON)
this._readWhitespace();(expr=this._expr())&&0!==expr.length||this._unexpectedToken(tokenStream.LT(1))
prio=this._prio()
propertyName=property.toString();(this.options.starHack&&"*"===property.hack||this.options.underscoreHack&&"_"===property.hack)&&(propertyName=property.text)
try{this._validateProperty(propertyName,expr)}catch(ex){invalid=ex}this.fire({type:"property",property:property,value:expr,important:prio,line:property.line,col:property.col,invalid:invalid})
return!0}return!1},_prio:function(){var result=this._tokenStream.match(Tokens.IMPORTANT_SYM)
this._readWhitespace()
return result},_expr:function(inFunction){var values=[],value=null,operator=null
if(null!==(value=this._term(inFunction))){values.push(value)
for(;;){(operator=this._operator(inFunction))&&values.push(operator)
if(null===(value=this._term(inFunction)))break
values.push(value)}}return values.length>0?new PropertyValue(values,values[0].line,values[0].col):null},_term:function(inFunction){var token,line,col,tokenStream=this._tokenStream,unary=null,value=null,endChar=null,part=null
if(null!==(unary=this._unary_operator())){line=tokenStream.token().startLine
col=tokenStream.token().startCol}if(tokenStream.peek()===Tokens.IE_FUNCTION&&this.options.ieFilters){value=this._ie_function()
if(null===unary){line=tokenStream.token().startLine
col=tokenStream.token().startCol}}else if(inFunction&&tokenStream.match([Tokens.LPAREN,Tokens.LBRACE,Tokens.LBRACKET])){endChar=(token=tokenStream.token()).endChar
value=token.value+this._expr(inFunction).text
if(null===unary){line=tokenStream.token().startLine
col=tokenStream.token().startCol}tokenStream.mustMatch(Tokens.type(endChar))
value+=endChar
this._readWhitespace()}else if(tokenStream.match([Tokens.NUMBER,Tokens.PERCENTAGE,Tokens.LENGTH,Tokens.ANGLE,Tokens.TIME,Tokens.FREQ,Tokens.STRING,Tokens.IDENT,Tokens.URI,Tokens.UNICODE_RANGE])){value=tokenStream.token().value
if(null===unary){line=tokenStream.token().startLine
col=tokenStream.token().startCol
part=PropertyValuePart.fromToken(tokenStream.token())}this._readWhitespace()}else if(null===(token=this._hexcolor())){if(null===unary){line=tokenStream.LT(1).startLine
col=tokenStream.LT(1).startCol}null===value&&(value=tokenStream.LA(3)===Tokens.EQUALS&&this.options.ieFilters?this._ie_function():this._function())}else{value=token.value
if(null===unary){line=token.startLine
col=token.startCol}}return null!==part?part:null!==value?new PropertyValuePart(null!==unary?unary+value:value,line,col):null},_function:function(){var lt,tokenStream=this._tokenStream,functionText=null
if(tokenStream.match(Tokens.FUNCTION)){functionText=tokenStream.token().value
this._readWhitespace()
functionText+=this._expr(!0)
if(this.options.ieFilters&&tokenStream.peek()===Tokens.EQUALS)do{this._readWhitespace()&&(functionText+=tokenStream.token().value)
tokenStream.LA(0)===Tokens.COMMA&&(functionText+=tokenStream.token().value)
tokenStream.match(Tokens.IDENT)
functionText+=tokenStream.token().value
tokenStream.match(Tokens.EQUALS)
functionText+=tokenStream.token().value
lt=tokenStream.peek()
for(;lt!==Tokens.COMMA&&lt!==Tokens.S&&lt!==Tokens.RPAREN;){tokenStream.get()
functionText+=tokenStream.token().value
lt=tokenStream.peek()}}while(tokenStream.match([Tokens.COMMA,Tokens.S]))
tokenStream.match(Tokens.RPAREN)
functionText+=")"
this._readWhitespace()}return functionText},_ie_function:function(){var lt,tokenStream=this._tokenStream,functionText=null
if(tokenStream.match([Tokens.IE_FUNCTION,Tokens.FUNCTION])){functionText=tokenStream.token().value
do{this._readWhitespace()&&(functionText+=tokenStream.token().value)
tokenStream.LA(0)===Tokens.COMMA&&(functionText+=tokenStream.token().value)
tokenStream.match(Tokens.IDENT)
functionText+=tokenStream.token().value
tokenStream.match(Tokens.EQUALS)
functionText+=tokenStream.token().value
lt=tokenStream.peek()
for(;lt!==Tokens.COMMA&&lt!==Tokens.S&&lt!==Tokens.RPAREN;){tokenStream.get()
functionText+=tokenStream.token().value
lt=tokenStream.peek()}}while(tokenStream.match([Tokens.COMMA,Tokens.S]))
tokenStream.match(Tokens.RPAREN)
functionText+=")"
this._readWhitespace()}return functionText},_hexcolor:function(){var color,tokenStream=this._tokenStream,token=null
if(tokenStream.match(Tokens.HASH)){color=(token=tokenStream.token()).value
if(!/#[a-f0-9]{3,6}/i.test(color))throw new SyntaxError("Expected a hex color but found '"+color+"' at line "+token.startLine+", col "+token.startCol+".",token.startLine,token.startCol)
this._readWhitespace()}return token},_keyframes:function(){var token,tt,name,tokenStream=this._tokenStream,prefix=""
tokenStream.mustMatch(Tokens.KEYFRAMES_SYM)
token=tokenStream.token();/^@\-([^\-]+)\-/.test(token.value)&&(prefix=RegExp.$1)
this._readWhitespace()
name=this._keyframe_name()
this._readWhitespace()
tokenStream.mustMatch(Tokens.LBRACE)
this.fire({type:"startkeyframes",name:name,prefix:prefix,line:token.startLine,col:token.startCol})
this._readWhitespace()
tt=tokenStream.peek()
for(;tt===Tokens.IDENT||tt===Tokens.PERCENTAGE;){this._keyframe_rule()
this._readWhitespace()
tt=tokenStream.peek()}this.fire({type:"endkeyframes",name:name,prefix:prefix,line:token.startLine,col:token.startCol})
this._readWhitespace()
tokenStream.mustMatch(Tokens.RBRACE)
this._readWhitespace()},_keyframe_name:function(){var tokenStream=this._tokenStream
tokenStream.mustMatch([Tokens.IDENT,Tokens.STRING])
return SyntaxUnit.fromToken(tokenStream.token())},_keyframe_rule:function(){var keyList=this._key_list()
this.fire({type:"startkeyframerule",keys:keyList,line:keyList[0].line,col:keyList[0].col})
this._readDeclarations(!0)
this.fire({type:"endkeyframerule",keys:keyList,line:keyList[0].line,col:keyList[0].col})},_key_list:function(){var tokenStream=this._tokenStream,keyList=[]
keyList.push(this._key())
this._readWhitespace()
for(;tokenStream.match(Tokens.COMMA);){this._readWhitespace()
keyList.push(this._key())
this._readWhitespace()}return keyList},_key:function(){var token,tokenStream=this._tokenStream
if(tokenStream.match(Tokens.PERCENTAGE))return SyntaxUnit.fromToken(tokenStream.token())
if(tokenStream.match(Tokens.IDENT)){token=tokenStream.token()
if(/from|to/i.test(token.value))return SyntaxUnit.fromToken(token)
tokenStream.unget()}this._unexpectedToken(tokenStream.LT(1))},_skipCruft:function(){for(;this._tokenStream.match([Tokens.S,Tokens.CDO,Tokens.CDC]););},_readDeclarations:function(checkStart,readMargins){var tt,tokenStream=this._tokenStream
this._readWhitespace()
checkStart&&tokenStream.mustMatch(Tokens.LBRACE)
this._readWhitespace()
try{for(;;){if(tokenStream.match(Tokens.SEMICOLON)||readMargins&&this._margin());else{if(!this._declaration())break
if(!tokenStream.match(Tokens.SEMICOLON))break}this._readWhitespace()}tokenStream.mustMatch(Tokens.RBRACE)
this._readWhitespace()}catch(ex){if(!(ex instanceof SyntaxError)||this.options.strict)throw ex
this.fire({type:"error",error:ex,message:ex.message,line:ex.line,col:ex.col})
if((tt=tokenStream.advance([Tokens.SEMICOLON,Tokens.RBRACE]))===Tokens.SEMICOLON)this._readDeclarations(!1,readMargins)
else if(tt!==Tokens.RBRACE)throw ex}},_readWhitespace:function(){for(var tokenStream=this._tokenStream,ws="";tokenStream.match(Tokens.S);)ws+=tokenStream.token().value
return ws},_unexpectedToken:function(token){throw new SyntaxError("Unexpected token '"+token.value+"' at line "+token.startLine+", col "+token.startCol+".",token.startLine,token.startCol)},_verifyEnd:function(){this._tokenStream.LA(1)!==Tokens.EOF&&this._unexpectedToken(this._tokenStream.LT(1))},_validateProperty:function(property,value){Validation.validate(property,value)},parse:function(input){this._tokenStream=new TokenStream(input,Tokens)
this._stylesheet()},parseStyleSheet:function(input){return this.parse(input)},parseMediaQuery:function(input){this._tokenStream=new TokenStream(input,Tokens)
var result=this._media_query()
this._verifyEnd()
return result},parsePropertyValue:function(input){this._tokenStream=new TokenStream(input,Tokens)
this._readWhitespace()
var result=this._expr()
this._readWhitespace()
this._verifyEnd()
return result},parseRule:function(input){this._tokenStream=new TokenStream(input,Tokens)
this._readWhitespace()
var result=this._ruleset()
this._readWhitespace()
this._verifyEnd()
return result},parseSelector:function(input){this._tokenStream=new TokenStream(input,Tokens)
this._readWhitespace()
var result=this._selector()
this._readWhitespace()
this._verifyEnd()
return result},parseStyleAttribute:function(input){input+="}"
this._tokenStream=new TokenStream(input,Tokens)
this._readDeclarations()}}
for(prop in additions)Object.prototype.hasOwnProperty.call(additions,prop)&&(proto[prop]=additions[prop])
return proto}()},{"../util/EventTarget":23,"../util/SyntaxError":25,"../util/SyntaxUnit":26,"./Combinator":2,"./MediaFeature":4,"./MediaQuery":5,"./PropertyName":8,"./PropertyValue":9,"./PropertyValuePart":11,"./Selector":13,"./SelectorPart":14,"./SelectorSubPart":15,"./TokenStream":17,"./Tokens":18,"./Validation":19}],7:[function(require,module,exports){"use strict"
module.exports={__proto__:null,"align-items":"flex-start | flex-end | center | baseline | stretch","align-content":"flex-start | flex-end | center | space-between | space-around | stretch","align-self":"auto | flex-start | flex-end | center | baseline | stretch",all:"initial | inherit | unset","-webkit-align-items":"flex-start | flex-end | center | baseline | stretch","-webkit-align-content":"flex-start | flex-end | center | space-between | space-around | stretch","-webkit-align-self":"auto | flex-start | flex-end | center | baseline | stretch","alignment-adjust":"auto | baseline | before-edge | text-before-edge | middle | central | after-edge | text-after-edge | ideographic | alphabetic | hanging | mathematical | <percentage> | <length>","alignment-baseline":"auto | baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical",animation:1,"animation-delay":"<time>#","animation-direction":"<single-animation-direction>#","animation-duration":"<time>#","animation-fill-mode":"[ none | forwards | backwards | both ]#","animation-iteration-count":"[ <number> | infinite ]#","animation-name":"[ none | <single-animation-name> ]#","animation-play-state":"[ running | paused ]#","animation-timing-function":1,"-moz-animation-delay":"<time>#","-moz-animation-direction":"[ normal | alternate ]#","-moz-animation-duration":"<time>#","-moz-animation-iteration-count":"[ <number> | infinite ]#","-moz-animation-name":"[ none | <single-animation-name> ]#","-moz-animation-play-state":"[ running | paused ]#","-ms-animation-delay":"<time>#","-ms-animation-direction":"[ normal | alternate ]#","-ms-animation-duration":"<time>#","-ms-animation-iteration-count":"[ <number> | infinite ]#","-ms-animation-name":"[ none | <single-animation-name> ]#","-ms-animation-play-state":"[ running | paused ]#","-webkit-animation-delay":"<time>#","-webkit-animation-direction":"[ normal | alternate ]#","-webkit-animation-duration":"<time>#","-webkit-animation-fill-mode":"[ none | forwards | backwards | both ]#","-webkit-animation-iteration-count":"[ <number> | infinite ]#","-webkit-animation-name":"[ none | <single-animation-name> ]#","-webkit-animation-play-state":"[ running | paused ]#","-o-animation-delay":"<time>#","-o-animation-direction":"[ normal | alternate ]#","-o-animation-duration":"<time>#","-o-animation-iteration-count":"[ <number> | infinite ]#","-o-animation-name":"[ none | <single-animation-name> ]#","-o-animation-play-state":"[ running | paused ]#",appearance:"none | auto","-moz-appearance":"none | button | button-arrow-down | button-arrow-next | button-arrow-previous | button-arrow-up | button-bevel | button-focus | caret | checkbox | checkbox-container | checkbox-label | checkmenuitem | dualbutton | groupbox | listbox | listitem | menuarrow | menubar | menucheckbox | menuimage | menuitem | menuitemtext | menulist | menulist-button | menulist-text | menulist-textfield | menupopup | menuradio | menuseparator | meterbar | meterchunk | progressbar | progressbar-vertical | progresschunk | progresschunk-vertical | radio | radio-container | radio-label | radiomenuitem | range | range-thumb | resizer | resizerpanel | scale-horizontal | scalethumbend | scalethumb-horizontal | scalethumbstart | scalethumbtick | scalethumb-vertical | scale-vertical | scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical | searchfield | separator | sheet | spinner | spinner-downbutton | spinner-textfield | spinner-upbutton | splitter | statusbar | statusbarpanel | tab | tabpanel | tabpanels | tab-scroll-arrow-back | tab-scroll-arrow-forward | textfield | textfield-multiline | toolbar | toolbarbutton | toolbarbutton-dropdown | toolbargripper | toolbox | tooltip | treeheader | treeheadercell | treeheadersortarrow | treeitem | treeline | treetwisty | treetwistyopen | treeview | -moz-mac-unified-toolbar | -moz-win-borderless-glass | -moz-win-browsertabbar-toolbox | -moz-win-communicationstext | -moz-win-communications-toolbox | -moz-win-exclude-glass | -moz-win-glass | -moz-win-mediatext | -moz-win-media-toolbox | -moz-window-button-box | -moz-window-button-box-maximized | -moz-window-button-close | -moz-window-button-maximize | -moz-window-button-minimize | -moz-window-button-restore | -moz-window-frame-bottom | -moz-window-frame-left | -moz-window-frame-right | -moz-window-titlebar | -moz-window-titlebar-maximized","-ms-appearance":"none | icon | window | desktop | workspace | document | tooltip | dialog | button | push-button | hyperlink | radio | radio-button | checkbox | menu-item | tab | menu | menubar | pull-down-menu | pop-up-menu | list-menu | radio-group | checkbox-group | outline-tree | range | field | combo-box | signature | password | normal","-webkit-appearance":"none | button | button-bevel | caps-lock-indicator | caret | checkbox | default-button | listbox\t| listitem | media-fullscreen-button | media-mute-button | media-play-button | media-seek-back-button\t| media-seek-forward-button\t| media-slider | media-sliderthumb | menulist\t| menulist-button\t| menulist-text\t| menulist-textfield | push-button\t| radio\t| searchfield\t| searchfield-cancel-button\t| searchfield-decoration | searchfield-results-button | searchfield-results-decoration | slider-horizontal | slider-vertical | sliderthumb-horizontal | sliderthumb-vertical\t| square-button\t| textarea\t| textfield\t| scrollbarbutton-down | scrollbarbutton-left | scrollbarbutton-right | scrollbarbutton-up | scrollbargripper-horizontal | scrollbargripper-vertical | scrollbarthumb-horizontal | scrollbarthumb-vertical | scrollbartrack-horizontal | scrollbartrack-vertical","-o-appearance":"none | window | desktop | workspace | document | tooltip | dialog | button | push-button | hyperlink | radio | radio-button | checkbox | menu-item | tab | menu | menubar | pull-down-menu | pop-up-menu | list-menu | radio-group | checkbox-group | outline-tree | range | field | combo-box | signature | password | normal",azimuth:"<azimuth>","backface-visibility":"visible | hidden",background:1,"background-attachment":"<attachment>#","background-clip":"<box>#","background-color":"<color>","background-image":"<bg-image>#","background-origin":"<box>#","background-position":"<bg-position>","background-repeat":"<repeat-style>#","background-size":"<bg-size>#","baseline-shift":"baseline | sub | super | <percentage> | <length>",behavior:1,binding:1,bleed:"<length>","bookmark-label":"<content> | <attr> | <string>","bookmark-level":"none | <integer>","bookmark-state":"open | closed","bookmark-target":"none | <uri> | <attr>",border:"<border-width> || <border-style> || <color>","border-bottom":"<border-width> || <border-style> || <color>","border-bottom-color":"<color>","border-bottom-left-radius":"<x-one-radius>","border-bottom-right-radius":"<x-one-radius>","border-bottom-style":"<border-style>","border-bottom-width":"<border-width>","border-collapse":"collapse | separate","border-color":"<color>{1,4}","border-image":1,"border-image-outset":"[ <length> | <number> ]{1,4}","border-image-repeat":"[ stretch | repeat | round ]{1,2}","border-image-slice":"<border-image-slice>","border-image-source":"<image> | none","border-image-width":"[ <length> | <percentage> | <number> | auto ]{1,4}","border-left":"<border-width> || <border-style> || <color>","border-left-color":"<color>","border-left-style":"<border-style>","border-left-width":"<border-width>","border-radius":"<border-radius>","border-right":"<border-width> || <border-style> || <color>","border-right-color":"<color>","border-right-style":"<border-style>","border-right-width":"<border-width>","border-spacing":"<length>{1,2}","border-style":"<border-style>{1,4}","border-top":"<border-width> || <border-style> || <color>","border-top-color":"<color>","border-top-left-radius":"<x-one-radius>","border-top-right-radius":"<x-one-radius>","border-top-style":"<border-style>","border-top-width":"<border-width>","border-width":"<border-width>{1,4}",bottom:"<margin-width>","-moz-box-align":"start | end | center | baseline | stretch","-moz-box-decoration-break":"slice | clone","-moz-box-direction":"normal | reverse","-moz-box-flex":"<number>","-moz-box-flex-group":"<integer>","-moz-box-lines":"single | multiple","-moz-box-ordinal-group":"<integer>","-moz-box-orient":"horizontal | vertical | inline-axis | block-axis","-moz-box-pack":"start | end | center | justify","-o-box-decoration-break":"slice | clone","-webkit-box-align":"start | end | center | baseline | stretch","-webkit-box-decoration-break":"slice | clone","-webkit-box-direction":"normal | reverse","-webkit-box-flex":"<number>","-webkit-box-flex-group":"<integer>","-webkit-box-lines":"single | multiple","-webkit-box-ordinal-group":"<integer>","-webkit-box-orient":"horizontal | vertical | inline-axis | block-axis","-webkit-box-pack":"start | end | center | justify","box-decoration-break":"slice | clone","box-shadow":"<box-shadow>","box-sizing":"content-box | border-box","break-after":"auto | always | avoid | left | right | page | column | avoid-page | avoid-column","break-before":"auto | always | avoid | left | right | page | column | avoid-page | avoid-column","break-inside":"auto | avoid | avoid-page | avoid-column","caption-side":"top | bottom",clear:"none | right | left | both",clip:"<shape> | auto","-webkit-clip-path":"<clip-source> | <clip-path> | none","clip-path":"<clip-source> | <clip-path> | none","clip-rule":"nonzero | evenodd",color:"<color>","color-interpolation":"auto | sRGB | linearRGB","color-interpolation-filters":"auto | sRGB | linearRGB","color-profile":1,"color-rendering":"auto | optimizeSpeed | optimizeQuality","column-count":"<integer> | auto","column-fill":"auto | balance","column-gap":"<length> | normal","column-rule":"<border-width> || <border-style> || <color>","column-rule-color":"<color>","column-rule-style":"<border-style>","column-rule-width":"<border-width>","column-span":"none | all","column-width":"<length> | auto",columns:1,content:1,"counter-increment":1,"counter-reset":1,crop:"<shape> | auto",cue:"cue-after | cue-before","cue-after":1,"cue-before":1,cursor:1,direction:"ltr | rtl",display:"inline | block | list-item | inline-block | table | inline-table | table-row-group | table-header-group | table-footer-group | table-row | table-column-group | table-column | table-cell | table-caption | grid | inline-grid | run-in | ruby | ruby-base | ruby-text | ruby-base-container | ruby-text-container | contents | none | -moz-box | -moz-inline-block | -moz-inline-box | -moz-inline-grid | -moz-inline-stack | -moz-inline-table | -moz-grid | -moz-grid-group | -moz-grid-line | -moz-groupbox | -moz-deck | -moz-popup | -moz-stack | -moz-marker | -webkit-box | -webkit-inline-box | -ms-flexbox | -ms-inline-flexbox | flex | -webkit-flex | inline-flex | -webkit-inline-flex","dominant-baseline":"auto | use-script | no-change | reset-size | ideographic | alphabetic | hanging | mathematical | central | middle | text-after-edge | text-before-edge","drop-initial-after-adjust":"central | middle | after-edge | text-after-edge | ideographic | alphabetic | mathematical | <percentage> | <length>","drop-initial-after-align":"baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical","drop-initial-before-adjust":"before-edge | text-before-edge | central | middle | hanging | mathematical | <percentage> | <length>","drop-initial-before-align":"caps-height | baseline | use-script | before-edge | text-before-edge | after-edge | text-after-edge | central | middle | ideographic | alphabetic | hanging | mathematical","drop-initial-size":"auto | line | <length> | <percentage>","drop-initial-value":"<integer>",elevation:"<angle> | below | level | above | higher | lower","empty-cells":"show | hide","enable-background":1,fill:"<paint>","fill-opacity":"<opacity-value>","fill-rule":"nonzero | evenodd",filter:"<filter-function-list> | none",fit:"fill | hidden | meet | slice","fit-position":1,flex:"<flex>","flex-basis":"<width>","flex-direction":"row | row-reverse | column | column-reverse","flex-flow":"<flex-direction> || <flex-wrap>","flex-grow":"<number>","flex-shrink":"<number>","flex-wrap":"nowrap | wrap | wrap-reverse","-webkit-flex":"<flex>","-webkit-flex-basis":"<width>","-webkit-flex-direction":"row | row-reverse | column | column-reverse","-webkit-flex-flow":"<flex-direction> || <flex-wrap>","-webkit-flex-grow":"<number>","-webkit-flex-shrink":"<number>","-webkit-flex-wrap":"nowrap | wrap | wrap-reverse","-ms-flex":"<flex>","-ms-flex-align":"start | end | center | stretch | baseline","-ms-flex-direction":"row | row-reverse | column | column-reverse","-ms-flex-order":"<number>","-ms-flex-pack":"start | end | center | justify","-ms-flex-wrap":"nowrap | wrap | wrap-reverse",float:"left | right | none","float-offset":1,"flood-color":1,"flood-opacity":"<opacity-value>",font:"<font-shorthand> | caption | icon | menu | message-box | small-caption | status-bar","font-family":"<font-family>","font-feature-settings":"<feature-tag-value> | normal","font-kerning":"auto | normal | none","font-size":"<font-size>","font-size-adjust":"<number> | none","font-stretch":"<font-stretch>","font-style":"<font-style>","font-variant":"<font-variant> | normal | none","font-variant-alternates":"<font-variant-alternates> | normal","font-variant-caps":"<font-variant-caps> | normal","font-variant-east-asian":"<font-variant-east-asian> | normal","font-variant-ligatures":"<font-variant-ligatures> | normal | none","font-variant-numeric":"<font-variant-numeric> | normal","font-variant-position":"normal | sub | super","font-weight":"<font-weight>","glyph-orientation-horizontal":"<glyph-angle>","glyph-orientation-vertical":"auto | <glyph-angle>",grid:1,"grid-area":1,"grid-auto-columns":1,"grid-auto-flow":1,"grid-auto-position":1,"grid-auto-rows":1,"grid-cell-stacking":"columns | rows | layer","grid-column":1,"grid-columns":1,"grid-column-align":"start | end | center | stretch","grid-column-sizing":1,"grid-column-start":1,"grid-column-end":1,"grid-column-span":"<integer>","grid-flow":"none | rows | columns","grid-layer":"<integer>","grid-row":1,"grid-rows":1,"grid-row-align":"start | end | center | stretch","grid-row-start":1,"grid-row-end":1,"grid-row-span":"<integer>","grid-row-sizing":1,"grid-template":1,"grid-template-areas":1,"grid-template-columns":1,"grid-template-rows":1,"hanging-punctuation":1,height:"<margin-width> | <content-sizing>","hyphenate-after":"<integer> | auto","hyphenate-before":"<integer> | auto","hyphenate-character":"<string> | auto","hyphenate-lines":"no-limit | <integer>","hyphenate-resource":1,hyphens:"none | manual | auto",icon:1,"image-orientation":"angle | auto","image-rendering":"auto | optimizeSpeed | optimizeQuality","image-resolution":1,"ime-mode":"auto | normal | active | inactive | disabled","inline-box-align":"last | <integer>","justify-content":"flex-start | flex-end | center | space-between | space-around","-webkit-justify-content":"flex-start | flex-end | center | space-between | space-around",kerning:"auto | <length>",left:"<margin-width>","letter-spacing":"<length> | normal","line-height":"<line-height>","line-break":"auto | loose | normal | strict","line-stacking":1,"line-stacking-ruby":"exclude-ruby | include-ruby","line-stacking-shift":"consider-shifts | disregard-shifts","line-stacking-strategy":"inline-line-height | block-line-height | max-height | grid-height","list-style":1,"list-style-image":"<uri> | none","list-style-position":"inside | outside","list-style-type":"disc | circle | square | decimal | decimal-leading-zero | lower-roman | upper-roman | lower-greek | lower-latin | upper-latin | armenian | georgian | lower-alpha | upper-alpha | none",margin:"<margin-width>{1,4}","margin-bottom":"<margin-width>","margin-left":"<margin-width>","margin-right":"<margin-width>","margin-top":"<margin-width>",mark:1,"mark-after":1,"mark-before":1,marker:1,"marker-end":1,"marker-mid":1,"marker-start":1,marks:1,"marquee-direction":1,"marquee-play-count":1,"marquee-speed":1,"marquee-style":1,mask:1,"max-height":"<length> | <percentage> | <content-sizing> | none","max-width":"<length> | <percentage> | <content-sizing> | none","min-height":"<length> | <percentage> | <content-sizing> | contain-floats | -moz-contain-floats | -webkit-contain-floats","min-width":"<length> | <percentage> | <content-sizing> | contain-floats | -moz-contain-floats | -webkit-contain-floats","move-to":1,"nav-down":1,"nav-index":1,"nav-left":1,"nav-right":1,"nav-up":1,"object-fit":"fill | contain | cover | none | scale-down","object-position":"<position>",opacity:"<opacity-value>",order:"<integer>","-webkit-order":"<integer>",orphans:"<integer>",outline:1,"outline-color":"<color> | invert","outline-offset":1,"outline-style":"<border-style>","outline-width":"<border-width>",overflow:"visible | hidden | scroll | auto","overflow-style":1,"overflow-wrap":"normal | break-word","overflow-x":1,"overflow-y":1,padding:"<padding-width>{1,4}","padding-bottom":"<padding-width>","padding-left":"<padding-width>","padding-right":"<padding-width>","padding-top":"<padding-width>",page:1,"page-break-after":"auto | always | avoid | left | right","page-break-before":"auto | always | avoid | left | right","page-break-inside":"auto | avoid","page-policy":1,pause:1,"pause-after":1,"pause-before":1,perspective:1,"perspective-origin":1,phonemes:1,pitch:1,"pitch-range":1,"play-during":1,"pointer-events":"auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all",position:"static | relative | absolute | fixed","presentation-level":1,"punctuation-trim":1,quotes:1,"rendering-intent":1,resize:1,rest:1,"rest-after":1,"rest-before":1,richness:1,right:"<margin-width>",rotation:1,"rotation-point":1,"ruby-align":1,"ruby-overhang":1,"ruby-position":1,"ruby-span":1,"shape-rendering":"auto | optimizeSpeed | crispEdges | geometricPrecision",size:1,speak:"normal | none | spell-out","speak-header":"once | always","speak-numeral":"digits | continuous","speak-punctuation":"code | none","speech-rate":1,src:1,"stop-color":1,"stop-opacity":"<opacity-value>",stress:1,"string-set":1,stroke:"<paint>","stroke-dasharray":"none | <dasharray>","stroke-dashoffset":"<percentage> | <length>","stroke-linecap":"butt | round | square","stroke-linejoin":"miter | round | bevel","stroke-miterlimit":"<miterlimit>","stroke-opacity":"<opacity-value>","stroke-width":"<percentage> | <length>","table-layout":"auto | fixed","tab-size":"<integer> | <length>",target:1,"target-name":1,"target-new":1,"target-position":1,"text-align":"left | right | center | justify | match-parent | start | end","text-align-last":1,"text-anchor":"start | middle | end","text-decoration":"<text-decoration-line> || <text-decoration-style> || <text-decoration-color>","text-decoration-color":"<text-decoration-color>","text-decoration-line":"<text-decoration-line>","text-decoration-style":"<text-decoration-style>","text-emphasis":1,"text-height":1,"text-indent":"<length> | <percentage>","text-justify":"auto | none | inter-word | inter-ideograph | inter-cluster | distribute | kashida","text-outline":1,"text-overflow":1,"text-rendering":"auto | optimizeSpeed | optimizeLegibility | geometricPrecision","text-shadow":1,"text-transform":"capitalize | uppercase | lowercase | none","text-wrap":"normal | none | avoid",top:"<margin-width>","-ms-touch-action":"auto | none | pan-x | pan-y | pan-left | pan-right | pan-up | pan-down | manipulation","touch-action":"auto | none | pan-x | pan-y | pan-left | pan-right | pan-up | pan-down | manipulation",transform:1,"transform-origin":1,"transform-style":1,transition:1,"transition-delay":1,"transition-duration":1,"transition-property":1,"transition-timing-function":1,"unicode-bidi":"normal | embed | isolate | bidi-override | isolate-override | plaintext","user-modify":"read-only | read-write | write-only","user-select":"none | text | toggle | element | elements | all","vertical-align":"auto | use-script | baseline | sub | super | top | text-top | central | middle | bottom | text-bottom | <percentage> | <length>",visibility:"visible | hidden | collapse","voice-balance":1,"voice-duration":1,"voice-family":1,"voice-pitch":1,"voice-pitch-range":1,"voice-rate":1,"voice-stress":1,"voice-volume":1,volume:1,"white-space":"normal | pre | nowrap | pre-wrap | pre-line | -pre-wrap | -o-pre-wrap | -moz-pre-wrap | -hp-pre-wrap","white-space-collapse":1,widows:"<integer>",width:"<length> | <percentage> | <content-sizing> | auto","will-change":"<will-change>","word-break":"normal | keep-all | break-all","word-spacing":"<length> | normal","word-wrap":"normal | break-word","writing-mode":"horizontal-tb | vertical-rl | vertical-lr | lr-tb | rl-tb | tb-rl | bt-rl | tb-lr | bt-lr | lr-bt | rl-bt | lr | rl | tb","z-index":"<integer> | auto",zoom:"<number> | <percentage> | normal"}},{}],8:[function(require,module,exports){"use strict"
function PropertyName(text,hack,line,col){SyntaxUnit.call(this,text,line,col,Parser.PROPERTY_NAME_TYPE)
this.hack=hack}module.exports=PropertyName
var SyntaxUnit=require("../util/SyntaxUnit"),Parser=require("./Parser");(PropertyName.prototype=new SyntaxUnit).constructor=PropertyName
PropertyName.prototype.toString=function(){return(this.hack?this.hack:"")+this.text}},{"../util/SyntaxUnit":26,"./Parser":6}],9:[function(require,module,exports){"use strict"
function PropertyValue(parts,line,col){SyntaxUnit.call(this,parts.join(" "),line,col,Parser.PROPERTY_VALUE_TYPE)
this.parts=parts}module.exports=PropertyValue
var SyntaxUnit=require("../util/SyntaxUnit"),Parser=require("./Parser");(PropertyValue.prototype=new SyntaxUnit).constructor=PropertyValue},{"../util/SyntaxUnit":26,"./Parser":6}],10:[function(require,module,exports){"use strict"
function PropertyValueIterator(value){this._i=0
this._parts=value.parts
this._marks=[]
this.value=value}module.exports=PropertyValueIterator
PropertyValueIterator.prototype.count=function(){return this._parts.length}
PropertyValueIterator.prototype.isFirst=function(){return 0===this._i}
PropertyValueIterator.prototype.hasNext=function(){return this._i<this._parts.length}
PropertyValueIterator.prototype.mark=function(){this._marks.push(this._i)}
PropertyValueIterator.prototype.peek=function(count){return this.hasNext()?this._parts[this._i+(count||0)]:null}
PropertyValueIterator.prototype.next=function(){return this.hasNext()?this._parts[this._i++]:null}
PropertyValueIterator.prototype.previous=function(){return this._i>0?this._parts[--this._i]:null}
PropertyValueIterator.prototype.restore=function(){this._marks.length&&(this._i=this._marks.pop())}
PropertyValueIterator.prototype.drop=function(){this._marks.pop()}},{}],11:[function(require,module,exports){"use strict"
function PropertyValuePart(text,line,col,optionalHint){var hint=optionalHint||{}
SyntaxUnit.call(this,text,line,col,Parser.PROPERTY_VALUE_PART_TYPE)
this.type="unknown"
var temp
if(/^([+\-]?[\d\.]+)([a-z]+)$/i.test(text)){this.type="dimension"
this.value=+RegExp.$1
this.units=RegExp.$2
switch(this.units.toLowerCase()){case"em":case"rem":case"ex":case"px":case"cm":case"mm":case"in":case"pt":case"pc":case"ch":case"vh":case"vw":case"vmax":case"vmin":this.type="length"
break
case"fr":this.type="grid"
break
case"deg":case"rad":case"grad":case"turn":this.type="angle"
break
case"ms":case"s":this.type="time"
break
case"hz":case"khz":this.type="frequency"
break
case"dpi":case"dpcm":this.type="resolution"}}else if(/^([+\-]?[\d\.]+)%$/i.test(text)){this.type="percentage"
this.value=+RegExp.$1}else if(/^([+\-]?\d+)$/i.test(text)){this.type="integer"
this.value=+RegExp.$1}else if(/^([+\-]?[\d\.]+)$/i.test(text)){this.type="number"
this.value=+RegExp.$1}else if(/^#([a-f0-9]{3,6})/i.test(text)){this.type="color"
if(3===(temp=RegExp.$1).length){this.red=parseInt(temp.charAt(0)+temp.charAt(0),16)
this.green=parseInt(temp.charAt(1)+temp.charAt(1),16)
this.blue=parseInt(temp.charAt(2)+temp.charAt(2),16)}else{this.red=parseInt(temp.substring(0,2),16)
this.green=parseInt(temp.substring(2,4),16)
this.blue=parseInt(temp.substring(4,6),16)}}else if(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i.test(text)){this.type="color"
this.red=+RegExp.$1
this.green=+RegExp.$2
this.blue=+RegExp.$3}else if(/^rgb\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(text)){this.type="color"
this.red=255*+RegExp.$1/100
this.green=255*+RegExp.$2/100
this.blue=255*+RegExp.$3/100}else if(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/i.test(text)){this.type="color"
this.red=+RegExp.$1
this.green=+RegExp.$2
this.blue=+RegExp.$3
this.alpha=+RegExp.$4}else if(/^rgba\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d\.]+)\s*\)/i.test(text)){this.type="color"
this.red=255*+RegExp.$1/100
this.green=255*+RegExp.$2/100
this.blue=255*+RegExp.$3/100
this.alpha=+RegExp.$4}else if(/^hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(text)){this.type="color"
this.hue=+RegExp.$1
this.saturation=+RegExp.$2/100
this.lightness=+RegExp.$3/100}else if(/^hsla\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*([\d\.]+)\s*\)/i.test(text)){this.type="color"
this.hue=+RegExp.$1
this.saturation=+RegExp.$2/100
this.lightness=+RegExp.$3/100
this.alpha=+RegExp.$4}else if(/^url\(("([^\\"]|\\.)*")\)/i.test(text)){this.type="uri"
this.uri=PropertyValuePart.parseString(RegExp.$1)}else if(/^([^\(]+)\(/i.test(text)){this.type="function"
this.name=RegExp.$1
this.value=text}else if(/^"([^\n\r\f\\"]|\\\r\n|\\[^\r0-9a-f]|\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)*"/i.test(text)){this.type="string"
this.value=PropertyValuePart.parseString(text)}else if(/^'([^\n\r\f\\']|\\\r\n|\\[^\r0-9a-f]|\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)*'/i.test(text)){this.type="string"
this.value=PropertyValuePart.parseString(text)}else if(Colors[text.toLowerCase()]){this.type="color"
temp=Colors[text.toLowerCase()].substring(1)
this.red=parseInt(temp.substring(0,2),16)
this.green=parseInt(temp.substring(2,4),16)
this.blue=parseInt(temp.substring(4,6),16)}else if(/^[,\/]$/.test(text)){this.type="operator"
this.value=text}else if(/^-?[a-z_\u00A0-\uFFFF][a-z0-9\-_\u00A0-\uFFFF]*$/i.test(text)){this.type="identifier"
this.value=text}this.wasIdent=Boolean(hint.ident)}module.exports=PropertyValuePart
var SyntaxUnit=require("../util/SyntaxUnit"),Colors=require("./Colors"),Parser=require("./Parser"),Tokens=require("./Tokens")
PropertyValuePart.prototype=new SyntaxUnit
PropertyValuePart.prototype.constructor=PropertyValuePart
PropertyValuePart.parseString=function(str){return(str=str.slice(1,-1)).replace(/\\(\r\n|[^\r0-9a-f]|[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?)/gi,function(match,esc){if(/^(\n|\r\n|\r|\f)$/.test(esc))return""
var m=/^[0-9a-f]{1,6}/i.exec(esc)
if(m){var codePoint=parseInt(m[0],16)
return String.fromCodePoint?String.fromCodePoint(codePoint):String.fromCharCode(codePoint)}return esc})}
PropertyValuePart.serializeString=function(value){return'"'+value.replace(/["\r\n\f]/g,function(match,c){return'"'===c?"\\"+c:"\\"+(String.codePointAt?String.codePointAt(0):String.charCodeAt(0)).toString(16)+" "})+'"'}
PropertyValuePart.fromToken=function(token){return new PropertyValuePart(token.value,token.startLine,token.startCol,{ident:token.type===Tokens.IDENT})}},{"../util/SyntaxUnit":26,"./Colors":1,"./Parser":6,"./Tokens":18}],12:[function(require,module,exports){"use strict"
var Pseudos=module.exports={__proto__:null,":first-letter":1,":first-line":1,":before":1,":after":1}
Pseudos.ELEMENT=1
Pseudos.CLASS=2
Pseudos.isElement=function(pseudo){return 0===pseudo.indexOf("::")||Pseudos[pseudo.toLowerCase()]===Pseudos.ELEMENT}},{}],13:[function(require,module,exports){"use strict"
function Selector(parts,line,col){SyntaxUnit.call(this,parts.join(" "),line,col,Parser.SELECTOR_TYPE)
this.parts=parts
this.specificity=Specificity.calculate(this)}module.exports=Selector
var SyntaxUnit=require("../util/SyntaxUnit"),Parser=require("./Parser"),Specificity=require("./Specificity");(Selector.prototype=new SyntaxUnit).constructor=Selector},{"../util/SyntaxUnit":26,"./Parser":6,"./Specificity":16}],14:[function(require,module,exports){"use strict"
function SelectorPart(elementName,modifiers,text,line,col){SyntaxUnit.call(this,text,line,col,Parser.SELECTOR_PART_TYPE)
this.elementName=elementName
this.modifiers=modifiers}module.exports=SelectorPart
var SyntaxUnit=require("../util/SyntaxUnit"),Parser=require("./Parser");(SelectorPart.prototype=new SyntaxUnit).constructor=SelectorPart},{"../util/SyntaxUnit":26,"./Parser":6}],15:[function(require,module,exports){"use strict"
function SelectorSubPart(text,type,line,col){SyntaxUnit.call(this,text,line,col,Parser.SELECTOR_SUB_PART_TYPE)
this.type=type
this.args=[]}module.exports=SelectorSubPart
var SyntaxUnit=require("../util/SyntaxUnit"),Parser=require("./Parser");(SelectorSubPart.prototype=new SyntaxUnit).constructor=SelectorSubPart},{"../util/SyntaxUnit":26,"./Parser":6}],16:[function(require,module,exports){"use strict"
function Specificity(a,b,c,d){this.a=a
this.b=b
this.c=c
this.d=d}module.exports=Specificity
var Pseudos=require("./Pseudos"),SelectorPart=require("./SelectorPart")
Specificity.prototype={constructor:Specificity,compare:function(other){var i,len,comps=["a","b","c","d"]
for(i=0,len=comps.length;i<len;i++){if(this[comps[i]]<other[comps[i]])return-1
if(this[comps[i]]>other[comps[i]])return 1}return 0},valueOf:function(){return 1e3*this.a+100*this.b+10*this.c+this.d},toString:function(){return this.a+","+this.b+","+this.c+","+this.d}}
Specificity.calculate=function(selector){function updateValues(part){var i,j,len,num,modifier,elementName=part.elementName?part.elementName.text:""
elementName&&"*"!==elementName.charAt(elementName.length-1)&&d++
for(i=0,len=part.modifiers.length;i<len;i++)switch((modifier=part.modifiers[i]).type){case"class":case"attribute":c++
break
case"id":b++
break
case"pseudo":Pseudos.isElement(modifier.text)?d++:c++
break
case"not":for(j=0,num=modifier.args.length;j<num;j++)updateValues(modifier.args[j])}}var i,len,part,b=0,c=0,d=0
for(i=0,len=selector.parts.length;i<len;i++)(part=selector.parts[i])instanceof SelectorPart&&updateValues(part)
return new Specificity(0,b,c,d)}},{"./Pseudos":12,"./SelectorPart":14}],17:[function(require,module,exports){"use strict"
function isHexDigit(c){return null!==c&&h.test(c)}function isDigit(c){return null!==c&&/\d/.test(c)}function isWhitespace(c){return null!==c&&whitespace.test(c)}function isNewLine(c){return null!==c&&nl.test(c)}function isNameStart(c){return null!==c&&/[a-z_\u00A0-\uFFFF\\]/i.test(c)}function isNameChar(c){return null!==c&&(isNameStart(c)||/[0-9\-\\]/.test(c))}function isIdentStart(c){return null!==c&&(isNameStart(c)||/\-\\/.test(c))}function TokenStream(input){TokenStreamBase.call(this,input,Tokens)}module.exports=TokenStream
var TokenStreamBase=require("../util/TokenStreamBase"),PropertyValuePart=require("./PropertyValuePart"),Tokens=require("./Tokens"),h=/^[0-9a-fA-F]$/,nonascii=/^[\u00A0-\uFFFF]$/,nl=/\n|\r\n|\r|\f/,whitespace=/\u0009|\u000a|\u000c|\u000d|\u0020/
TokenStream.prototype=function(receiver,supplier){for(var prop in supplier)Object.prototype.hasOwnProperty.call(supplier,prop)&&(receiver[prop]=supplier[prop])
return receiver}(new TokenStreamBase,{_getToken:function(){var c,reader=this._reader,token=null,startLine=reader.getLine(),startCol=reader.getCol()
c=reader.read()
for(;c;){switch(c){case"/":token="*"===reader.peek()?this.commentToken(c,startLine,startCol):this.charToken(c,startLine,startCol)
break
case"|":case"~":case"^":case"$":case"*":token="="===reader.peek()?this.comparisonToken(c,startLine,startCol):this.charToken(c,startLine,startCol)
break
case'"':case"'":token=this.stringToken(c,startLine,startCol)
break
case"#":token=isNameChar(reader.peek())?this.hashToken(c,startLine,startCol):this.charToken(c,startLine,startCol)
break
case".":token=isDigit(reader.peek())?this.numberToken(c,startLine,startCol):this.charToken(c,startLine,startCol)
break
case"-":token="-"===reader.peek()?this.htmlCommentEndToken(c,startLine,startCol):isNameStart(reader.peek())?this.identOrFunctionToken(c,startLine,startCol):this.charToken(c,startLine,startCol)
break
case"!":token=this.importantToken(c,startLine,startCol)
break
case"@":token=this.atRuleToken(c,startLine,startCol)
break
case":":token=this.notToken(c,startLine,startCol)
break
case"<":token=this.htmlCommentStartToken(c,startLine,startCol)
break
case"\\":token=/[^\r\n\f]/.test(reader.peek())?this.identOrFunctionToken(this.readEscape(c,!0),startLine,startCol):this.charToken(c,startLine,startCol)
break
case"U":case"u":if("+"===reader.peek()){token=this.unicodeRangeToken(c,startLine,startCol)
break}default:token=isDigit(c)?this.numberToken(c,startLine,startCol):isWhitespace(c)?this.whitespaceToken(c,startLine,startCol):isIdentStart(c)?this.identOrFunctionToken(c,startLine,startCol):this.charToken(c,startLine,startCol)}break}token||null!==c||(token=this.createToken(Tokens.EOF,null,startLine,startCol))
return token},createToken:function(tt,value,startLine,startCol,options){var reader=this._reader
return{value:value,type:tt,channel:(options=options||{}).channel,endChar:options.endChar,hide:options.hide||!1,startLine:startLine,startCol:startCol,endLine:reader.getLine(),endCol:reader.getCol()}},atRuleToken:function(first,startLine,startCol){var rule=first,reader=this._reader,tt=Tokens.CHAR
reader.mark()
rule=first+this.readName()
if((tt=Tokens.type(rule.toLowerCase()))===Tokens.CHAR||tt===Tokens.UNKNOWN)if(rule.length>1)tt=Tokens.UNKNOWN_SYM
else{tt=Tokens.CHAR
rule=first
reader.reset()}return this.createToken(tt,rule,startLine,startCol)},charToken:function(c,startLine,startCol){var tt=Tokens.type(c),opts={};-1===tt?tt=Tokens.CHAR:opts.endChar=Tokens[tt].endChar
return this.createToken(tt,c,startLine,startCol,opts)},commentToken:function(first,startLine,startCol){var comment=this.readComment(first)
return this.createToken(Tokens.COMMENT,comment,startLine,startCol)},comparisonToken:function(c,startLine,startCol){var comparison=c+this._reader.read(),tt=Tokens.type(comparison)||Tokens.CHAR
return this.createToken(tt,comparison,startLine,startCol)},hashToken:function(first,startLine,startCol){var name=this.readName(first)
return this.createToken(Tokens.HASH,name,startLine,startCol)},htmlCommentStartToken:function(first,startLine,startCol){var reader=this._reader,text=first
reader.mark()
if("\x3c!--"===(text+=reader.readCount(3)))return this.createToken(Tokens.CDO,text,startLine,startCol)
reader.reset()
return this.charToken(first,startLine,startCol)},htmlCommentEndToken:function(first,startLine,startCol){var reader=this._reader,text=first
reader.mark()
if("--\x3e"===(text+=reader.readCount(2)))return this.createToken(Tokens.CDC,text,startLine,startCol)
reader.reset()
return this.charToken(first,startLine,startCol)},identOrFunctionToken:function(first,startLine,startCol){var uri,reader=this._reader,ident=this.readName(first),tt=Tokens.IDENT,uriFns=["url(","url-prefix(","domain("]
if("("===reader.peek()){ident+=reader.read()
if(uriFns.indexOf(ident.toLowerCase())>-1){reader.mark()
if(null===(uri=this.readURI(ident))){reader.reset()
tt=Tokens.FUNCTION}else{tt=Tokens.URI
ident=uri}}else tt=Tokens.FUNCTION}else if(":"===reader.peek()&&"progid"===ident.toLowerCase()){ident+=reader.readTo("(")
tt=Tokens.IE_FUNCTION}return this.createToken(tt,ident,startLine,startCol)},importantToken:function(first,startLine,startCol){var temp,c,reader=this._reader,important=first,tt=Tokens.CHAR
reader.mark()
c=reader.read()
for(;c;){if("/"===c){if("*"!==reader.peek())break
if(""===(temp=this.readComment(c)))break}else{if(!isWhitespace(c)){if(/i/i.test(c)){temp=reader.readCount(8)
if(/mportant/i.test(temp)){important+=c+temp
tt=Tokens.IMPORTANT_SYM}break}break}important+=c+this.readWhitespace()}c=reader.read()}if(tt===Tokens.CHAR){reader.reset()
return this.charToken(first,startLine,startCol)}return this.createToken(tt,important,startLine,startCol)},notToken:function(first,startLine,startCol){var reader=this._reader,text=first
reader.mark()
if(":not("===(text+=reader.readCount(4)).toLowerCase())return this.createToken(Tokens.NOT,text,startLine,startCol)
reader.reset()
return this.charToken(first,startLine,startCol)},numberToken:function(first,startLine,startCol){var ident,reader=this._reader,value=this.readNumber(first),tt=Tokens.NUMBER,c=reader.peek()
if(isIdentStart(c)){value+=ident=this.readName(reader.read())
tt=/^em$|^ex$|^px$|^gd$|^rem$|^vw$|^vh$|^vmax$|^vmin$|^ch$|^cm$|^mm$|^in$|^pt$|^pc$/i.test(ident)?Tokens.LENGTH:/^deg|^rad$|^grad$|^turn$/i.test(ident)?Tokens.ANGLE:/^ms$|^s$/i.test(ident)?Tokens.TIME:/^hz$|^khz$/i.test(ident)?Tokens.FREQ:/^dpi$|^dpcm$/i.test(ident)?Tokens.RESOLUTION:Tokens.DIMENSION}else if("%"===c){value+=reader.read()
tt=Tokens.PERCENTAGE}return this.createToken(tt,value,startLine,startCol)},stringToken:function(first,startLine,startCol){for(var i,delim=first,string=first,reader=this._reader,tt=Tokens.STRING,c=reader.read();c;){string+=c
if("\\"===c){if(null===(c=reader.read()))break
if(/[^\r\n\f0-9a-f]/i.test(c))string+=c
else{for(i=0;isHexDigit(c)&&i<6;i++){string+=c
c=reader.read()}if("\r"===c&&"\n"===reader.peek()){string+=c
c=reader.read()}if(!isWhitespace(c))continue
string+=c}}else{if(c===delim)break
if(isNewLine(reader.peek())){tt=Tokens.INVALID
break}}c=reader.read()}null===c&&(tt=Tokens.INVALID)
return this.createToken(tt,string,startLine,startCol)},unicodeRangeToken:function(first,startLine,startCol){var temp,reader=this._reader,value=first,tt=Tokens.CHAR
if("+"===reader.peek()){reader.mark()
value+=reader.read()
if(2===(value+=this.readUnicodeRangePart(!0)).length)reader.reset()
else{tt=Tokens.UNICODE_RANGE
if(-1===value.indexOf("?")&&"-"===reader.peek()){reader.mark()
temp=reader.read()
1===(temp+=this.readUnicodeRangePart(!1)).length?reader.reset():value+=temp}}}return this.createToken(tt,value,startLine,startCol)},whitespaceToken:function(first,startLine,startCol){var value=first+this.readWhitespace()
return this.createToken(Tokens.S,value,startLine,startCol)},readUnicodeRangePart:function(allowQuestionMark){for(var reader=this._reader,part="",c=reader.peek();isHexDigit(c)&&part.length<6;){reader.read()
part+=c
c=reader.peek()}if(allowQuestionMark)for(;"?"===c&&part.length<6;){reader.read()
part+=c
c=reader.peek()}return part},readWhitespace:function(){for(var reader=this._reader,whitespace="",c=reader.peek();isWhitespace(c);){reader.read()
whitespace+=c
c=reader.peek()}return whitespace},readNumber:function(first){for(var reader=this._reader,number=first,hasDot="."===first,c=reader.peek();c;){if(isDigit(c))number+=reader.read()
else{if("."!==c)break
if(hasDot)break
hasDot=!0
number+=reader.read()}c=reader.peek()}return number},readString:function(){var token=this.stringToken(this._reader.read(),0,0)
return token.type===Tokens.INVALID?null:token.value},readURI:function(first){for(var reader=this._reader,uri=first,inner="",c=reader.peek();c&&isWhitespace(c);){reader.read()
c=reader.peek()}"'"===c||'"'===c?null!==(inner=this.readString())&&(inner=PropertyValuePart.parseString(inner)):inner=this.readUnquotedURL()
c=reader.peek()
for(;c&&isWhitespace(c);){reader.read()
c=reader.peek()}null===inner||")"!==c?uri=null:uri+=PropertyValuePart.serializeString(inner)+reader.read()
return uri},readUnquotedURL:function(first){var c,reader=this._reader,url=first||""
for(c=reader.peek();c;c=reader.peek())if(nonascii.test(c)||/^[\-!#$%&*-\[\]-~]$/.test(c)){url+=c
reader.read()}else{if("\\"!==c)break
if(!/^[^\r\n\f]$/.test(reader.peek(2)))break
url+=this.readEscape(reader.read(),!0)}return url},readName:function(first){var c,reader=this._reader,ident=first||""
for(c=reader.peek();c;c=reader.peek())if("\\"===c){if(!/^[^\r\n\f]$/.test(reader.peek(2)))break
ident+=this.readEscape(reader.read(),!0)}else{if(!isNameChar(c))break
ident+=reader.read()}return ident},readEscape:function(first,unescape){var reader=this._reader,cssEscape=first||"",i=0,c=reader.peek()
if(isHexDigit(c))do{cssEscape+=reader.read()
c=reader.peek()}while(c&&isHexDigit(c)&&++i<6)
if(1===cssEscape.length){if(!/^[^\r\n\f0-9a-f]$/.test(c))throw new Error("Bad escape sequence.")
reader.read()
if(unescape)return c}else if("\r"===c){reader.read()
"\n"===reader.peek()&&(c+=reader.read())}else/^[ \t\n\f]$/.test(c)?reader.read():c=""
if(unescape){var cp=parseInt(cssEscape.slice(first.length),16)
return String.fromCodePoint?String.fromCodePoint(cp):String.fromCharCode(cp)}return cssEscape+c},readComment:function(first){var reader=this._reader,comment=first||"",c=reader.read()
if("*"===c){for(;c;){if((comment+=c).length>2&&"*"===c&&"/"===reader.peek()){comment+=reader.read()
break}c=reader.read()}return comment}return""}})},{"../util/TokenStreamBase":27,"./PropertyValuePart":11,"./Tokens":18}],18:[function(require,module,exports){"use strict"
var Tokens=module.exports=[{name:"CDO"},{name:"CDC"},{name:"S",whitespace:!0},{name:"COMMENT",comment:!0,hide:!0,channel:"comment"},{name:"INCLUDES",text:"~="},{name:"DASHMATCH",text:"|="},{name:"PREFIXMATCH",text:"^="},{name:"SUFFIXMATCH",text:"$="},{name:"SUBSTRINGMATCH",text:"*="},{name:"STRING"},{name:"IDENT"},{name:"HASH"},{name:"IMPORT_SYM",text:"@import"},{name:"PAGE_SYM",text:"@page"},{name:"MEDIA_SYM",text:"@media"},{name:"FONT_FACE_SYM",text:"@font-face"},{name:"CHARSET_SYM",text:"@charset"},{name:"NAMESPACE_SYM",text:"@namespace"},{name:"SUPPORTS_SYM",text:"@supports"},{name:"VIEWPORT_SYM",text:["@viewport","@-ms-viewport","@-o-viewport"]},{name:"DOCUMENT_SYM",text:["@document","@-moz-document"]},{name:"UNKNOWN_SYM"},{name:"KEYFRAMES_SYM",text:["@keyframes","@-webkit-keyframes","@-moz-keyframes","@-o-keyframes"]},{name:"IMPORTANT_SYM"},{name:"LENGTH"},{name:"ANGLE"},{name:"TIME"},{name:"FREQ"},{name:"DIMENSION"},{name:"PERCENTAGE"},{name:"NUMBER"},{name:"URI"},{name:"FUNCTION"},{name:"UNICODE_RANGE"},{name:"INVALID"},{name:"PLUS",text:"+"},{name:"GREATER",text:">"},{name:"COMMA",text:","},{name:"TILDE",text:"~"},{name:"NOT"},{name:"TOPLEFTCORNER_SYM",text:"@top-left-corner"},{name:"TOPLEFT_SYM",text:"@top-left"},{name:"TOPCENTER_SYM",text:"@top-center"},{name:"TOPRIGHT_SYM",text:"@top-right"},{name:"TOPRIGHTCORNER_SYM",text:"@top-right-corner"},{name:"BOTTOMLEFTCORNER_SYM",text:"@bottom-left-corner"},{name:"BOTTOMLEFT_SYM",text:"@bottom-left"},{name:"BOTTOMCENTER_SYM",text:"@bottom-center"},{name:"BOTTOMRIGHT_SYM",text:"@bottom-right"},{name:"BOTTOMRIGHTCORNER_SYM",text:"@bottom-right-corner"},{name:"LEFTTOP_SYM",text:"@left-top"},{name:"LEFTMIDDLE_SYM",text:"@left-middle"},{name:"LEFTBOTTOM_SYM",text:"@left-bottom"},{name:"RIGHTTOP_SYM",text:"@right-top"},{name:"RIGHTMIDDLE_SYM",text:"@right-middle"},{name:"RIGHTBOTTOM_SYM",text:"@right-bottom"},{name:"RESOLUTION",state:"media"},{name:"IE_FUNCTION"},{name:"CHAR"},{name:"PIPE",text:"|"},{name:"SLASH",text:"/"},{name:"MINUS",text:"-"},{name:"STAR",text:"*"},{name:"LBRACE",endChar:"}",text:"{"},{name:"RBRACE",text:"}"},{name:"LBRACKET",endChar:"]",text:"["},{name:"RBRACKET",text:"]"},{name:"EQUALS",text:"="},{name:"COLON",text:":"},{name:"SEMICOLON",text:";"},{name:"LPAREN",endChar:")",text:"("},{name:"RPAREN",text:")"},{name:"DOT",text:"."}]
!function(){var nameMap=[],typeMap=Object.create(null)
Tokens.UNKNOWN=-1
Tokens.unshift({name:"EOF"})
for(var i=0,len=Tokens.length;i<len;i++){nameMap.push(Tokens[i].name)
Tokens[Tokens[i].name]=i
if(Tokens[i].text)if(Tokens[i].text instanceof Array)for(var j=0;j<Tokens[i].text.length;j++)typeMap[Tokens[i].text[j]]=i
else typeMap[Tokens[i].text]=i}Tokens.name=function(tt){return nameMap[tt]}
Tokens.type=function(c){return typeMap[c]||-1}}()},{}],19:[function(require,module,exports){"use strict"
var Matcher=require("./Matcher"),Properties=require("./Properties"),ValidationTypes=require("./ValidationTypes"),ValidationError=require("./ValidationError"),PropertyValueIterator=require("./PropertyValueIterator")
module.exports={validate:function(property,value){var part,name=property.toString().toLowerCase(),expression=new PropertyValueIterator(value),spec=Properties[name]
if(spec){if("number"!=typeof spec){if(ValidationTypes.isAny(expression,"inherit | initial | unset")){if(expression.hasNext()){part=expression.next()
throw new ValidationError("Expected end of value but found '"+part+"'.",part.line,part.col)}return}this.singleProperty(spec,expression)}}else if(0!==name.indexOf("-"))throw new ValidationError("Unknown property '"+property+"'.",property.line,property.col)},singleProperty:function(types,expression){var part,value=expression.value
if(!Matcher.parse(types).match(expression)){if(expression.hasNext()&&!expression.isFirst()){part=expression.peek()
throw new ValidationError("Expected end of value but found '"+part+"'.",part.line,part.col)}throw new ValidationError("Expected ("+ValidationTypes.describe(types)+") but found '"+value+"'.",value.line,value.col)}if(expression.hasNext()){part=expression.next()
throw new ValidationError("Expected end of value but found '"+part+"'.",part.line,part.col)}}}},{"./Matcher":3,"./Properties":7,"./PropertyValueIterator":10,"./ValidationError":20,"./ValidationTypes":21}],20:[function(require,module,exports){"use strict"
function ValidationError(message,line,col){this.col=col
this.line=line
this.message=message}module.exports=ValidationError
ValidationError.prototype=new Error},{}],21:[function(require,module,exports){"use strict"
var ValidationTypes=module.exports,Matcher=require("./Matcher")
!function(to,from){Object.keys(from).forEach(function(prop){to[prop]=from[prop]})}(ValidationTypes,{isLiteral:function(part,literals){var i,len,text=part.text.toString().toLowerCase(),args=literals.split(" | "),found=!1
for(i=0,len=args.length;i<len&&!found;i++)"<"===args[i].charAt(0)?found=this.simple[args[i]](part):"()"===args[i].slice(-2)?found="function"===part.type&&part.name===args[i].slice(0,-2):text===args[i].toLowerCase()&&(found=!0)
return found},isSimple:function(type){return Boolean(this.simple[type])},isComplex:function(type){return Boolean(this.complex[type])},describe:function(type){return this.complex[type]instanceof Matcher?this.complex[type].toString(0):type},isAny:function(expression,types){var i,len,args=types.split(" | "),found=!1
for(i=0,len=args.length;i<len&&!found&&expression.hasNext();i++)found=this.isType(expression,args[i])
return found},isAnyOfGroup:function(expression,types){var i,len,args=types.split(" || "),found=!1
for(i=0,len=args.length;i<len&&!found;i++)found=this.isType(expression,args[i])
return!!found&&args[i-1]},isType:function(expression,type){var part=expression.peek(),result=!1
"<"!==type.charAt(0)?(result=this.isLiteral(part,type))&&expression.next():this.simple[type]?(result=this.simple[type](part))&&expression.next():result=this.complex[type]instanceof Matcher?this.complex[type].match(expression):this.complex[type](expression)
return result},simple:{__proto__:null,"<absolute-size>":"xx-small | x-small | small | medium | large | x-large | xx-large","<animateable-feature>":"scroll-position | contents | <animateable-feature-name>","<animateable-feature-name>":function(part){return this["<ident>"](part)&&!/^(unset|initial|inherit|will-change|auto|scroll-position|contents)$/i.test(part)},"<angle>":function(part){return"angle"===part.type},"<attachment>":"scroll | fixed | local","<attr>":"attr()","<basic-shape>":"inset() | circle() | ellipse() | polygon()","<bg-image>":"<image> | <gradient> | none","<border-style>":"none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset","<border-width>":"<length> | thin | medium | thick","<box>":"padding-box | border-box | content-box","<clip-source>":"<uri>","<color>":function(part){return"color"===part.type||"transparent"===String(part)||"currentColor"===String(part)},"<color-svg>":function(part){return"color"===part.type},"<content>":"content()","<content-sizing>":"fill-available | -moz-available | -webkit-fill-available | max-content | -moz-max-content | -webkit-max-content | min-content | -moz-min-content | -webkit-min-content | fit-content | -moz-fit-content | -webkit-fit-content","<feature-tag-value>":function(part){return"function"===part.type&&/^[A-Z0-9]{4}$/i.test(part)},"<filter-function>":"blur() | brightness() | contrast() | custom() | drop-shadow() | grayscale() | hue-rotate() | invert() | opacity() | saturate() | sepia()","<flex-basis>":"<width>","<flex-direction>":"row | row-reverse | column | column-reverse","<flex-grow>":"<number>","<flex-shrink>":"<number>","<flex-wrap>":"nowrap | wrap | wrap-reverse","<font-size>":"<absolute-size> | <relative-size> | <length> | <percentage>","<font-stretch>":"normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded","<font-style>":"normal | italic | oblique","<font-variant-caps>":"small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps","<font-variant-css21>":"normal | small-caps","<font-weight>":"normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900","<generic-family>":"serif | sans-serif | cursive | fantasy | monospace","<geometry-box>":"<shape-box> | fill-box | stroke-box | view-box","<glyph-angle>":function(part){return"angle"===part.type&&"deg"===part.units},"<gradient>":function(part){return"function"===part.type&&/^(?:\-(?:ms|moz|o|webkit)\-)?(?:repeating\-)?(?:radial\-|linear\-)?gradient/i.test(part)},"<icccolor>":"cielab() | cielch() | cielchab() | icc-color() | icc-named-color()","<ident>":function(part){return"identifier"===part.type||part.wasIdent},"<ident-not-generic-family>":function(part){return this["<ident>"](part)&&!this["<generic-family>"](part)},"<image>":"<uri>","<integer>":function(part){return"integer"===part.type},"<length>":function(part){return!("function"!==part.type||!/^(?:\-(?:ms|moz|o|webkit)\-)?calc/i.test(part))||("length"===part.type||"number"===part.type||"integer"===part.type||"0"===String(part))},"<line>":function(part){return"integer"===part.type},"<line-height>":"<number> | <length> | <percentage> | normal","<margin-width>":"<length> | <percentage> | auto","<miterlimit>":function(part){return this["<number>"](part)&&part.value>=1},"<nonnegative-length-or-percentage>":function(part){return(this["<length>"](part)||this["<percentage>"](part))&&("0"===String(part)||"function"===part.type||part.value>=0)},"<nonnegative-number-or-percentage>":function(part){return(this["<number>"](part)||this["<percentage>"](part))&&("0"===String(part)||"function"===part.type||part.value>=0)},"<number>":function(part){return"number"===part.type||this["<integer>"](part)},"<opacity-value>":function(part){return this["<number>"](part)&&part.value>=0&&part.value<=1},"<padding-width>":"<nonnegative-length-or-percentage>","<percentage>":function(part){return"percentage"===part.type||"0"===String(part)},"<relative-size>":"smaller | larger","<shape>":"rect() | inset-rect()","<shape-box>":"<box> | margin-box","<single-animation-direction>":"normal | reverse | alternate | alternate-reverse","<single-animation-name>":function(part){return this["<ident>"](part)&&/^-?[a-z_][-a-z0-9_]+$/i.test(part)&&!/^(none|unset|initial|inherit)$/i.test(part)},"<string>":function(part){return"string"===part.type},"<time>":function(part){return"time"===part.type},"<uri>":function(part){return"uri"===part.type},"<width>":"<margin-width>"},complex:{__proto__:null,"<azimuth>":"<angle> | [ [ left-side | far-left | left | center-left | center | center-right | right | far-right | right-side ] || behind ] | leftwards | rightwards","<bg-position>":"<position>#","<bg-size>":"[ <length> | <percentage> | auto ]{1,2} | cover | contain","<border-image-slice>":Matcher.many([!0],Matcher.cast("<nonnegative-number-or-percentage>"),Matcher.cast("<nonnegative-number-or-percentage>"),Matcher.cast("<nonnegative-number-or-percentage>"),Matcher.cast("<nonnegative-number-or-percentage>"),"fill"),"<border-radius>":"<nonnegative-length-or-percentage>{1,4} [ / <nonnegative-length-or-percentage>{1,4} ]?","<box-shadow>":"none | <shadow>#","<clip-path>":"<basic-shape> || <geometry-box>","<dasharray>":Matcher.cast("<nonnegative-length-or-percentage>").braces(1,1/0,"#",Matcher.cast(",").question()),"<family-name>":"<string> | <ident-not-generic-family> <ident>*","<filter-function-list>":"[ <filter-function> | <uri> ]+","<flex>":"none | [ <flex-grow> <flex-shrink>? || <flex-basis> ]","<font-family>":"[ <generic-family> | <family-name> ]#","<font-shorthand>":"[ <font-style> || <font-variant-css21> || <font-weight> || <font-stretch> ]? <font-size> [ / <line-height> ]? <font-family>","<font-variant-alternates>":"stylistic() || historical-forms || styleset() || character-variant() || swash() || ornaments() || annotation()","<font-variant-ligatures>":"[ common-ligatures | no-common-ligatures ] || [ discretionary-ligatures | no-discretionary-ligatures ] || [ historical-ligatures | no-historical-ligatures ] || [ contextual | no-contextual ]","<font-variant-numeric>":"[ lining-nums | oldstyle-nums ] || [ proportional-nums | tabular-nums ] || [ diagonal-fractions | stacked-fractions ] || ordinal || slashed-zero","<font-variant-east-asian>":"[ jis78 | jis83 | jis90 | jis04 | simplified | traditional ] || [ full-width | proportional-width ] || ruby","<paint>":"<paint-basic> | <uri> <paint-basic>?","<paint-basic>":"none | currentColor | <color-svg> <icccolor>?","<position>":"[ center | [ left | right ] [ <percentage> | <length> ]? ] && [ center | [ top | bottom ] [ <percentage> | <length> ]? ] | [ left | center | right | <percentage> | <length> ] [ top | center | bottom | <percentage> | <length> ] | [ left | center | right | top | bottom | <percentage> | <length> ]","<repeat-style>":"repeat-x | repeat-y | [ repeat | space | round | no-repeat ]{1,2}","<shadow>":Matcher.many([!0],Matcher.cast("<length>").braces(2,4),"inset","<color>"),"<text-decoration-color>":"<color>","<text-decoration-line>":"none | [ underline || overline || line-through || blink ]","<text-decoration-style>":"solid | double | dotted | dashed | wavy","<will-change>":"auto | <animateable-feature>#","<x-one-radius>":"[ <length> | <percentage> ]{1,2}"}})
Object.keys(ValidationTypes.simple).forEach(function(nt){var rule=ValidationTypes.simple[nt]
"string"==typeof rule&&(ValidationTypes.simple[nt]=function(part){return ValidationTypes.isLiteral(part,rule)})})
Object.keys(ValidationTypes.complex).forEach(function(nt){var rule=ValidationTypes.complex[nt]
"string"==typeof rule&&(ValidationTypes.complex[nt]=Matcher.parse(rule))})
ValidationTypes.complex["<font-variant>"]=Matcher.oror({expand:"<font-variant-ligatures>"},{expand:"<font-variant-alternates>"},"<font-variant-caps>",{expand:"<font-variant-numeric>"},{expand:"<font-variant-east-asian>"})},{"./Matcher":3}],22:[function(require,module,exports){"use strict"
module.exports={Colors:require("./Colors"),Combinator:require("./Combinator"),Parser:require("./Parser"),PropertyName:require("./PropertyName"),PropertyValue:require("./PropertyValue"),PropertyValuePart:require("./PropertyValuePart"),Matcher:require("./Matcher"),MediaFeature:require("./MediaFeature"),MediaQuery:require("./MediaQuery"),Selector:require("./Selector"),SelectorPart:require("./SelectorPart"),SelectorSubPart:require("./SelectorSubPart"),Specificity:require("./Specificity"),TokenStream:require("./TokenStream"),Tokens:require("./Tokens"),ValidationError:require("./ValidationError")}},{"./Colors":1,"./Combinator":2,"./Matcher":3,"./MediaFeature":4,"./MediaQuery":5,"./Parser":6,"./PropertyName":8,"./PropertyValue":9,"./PropertyValuePart":11,"./Selector":13,"./SelectorPart":14,"./SelectorSubPart":15,"./Specificity":16,"./TokenStream":17,"./Tokens":18,"./ValidationError":20}],23:[function(require,module,exports){"use strict"
function EventTarget(){this._listeners=Object.create(null)}module.exports=EventTarget
EventTarget.prototype={constructor:EventTarget,addListener:function(type,listener){this._listeners[type]||(this._listeners[type]=[])
this._listeners[type].push(listener)},fire:function(event){"string"==typeof event&&(event={type:event})
void 0!==event.target&&(event.target=this)
if(void 0===event.type)throw new Error("Event object missing 'type' property.")
if(this._listeners[event.type])for(var listeners=this._listeners[event.type].concat(),i=0,len=listeners.length;i<len;i++)listeners[i].call(this,event)},removeListener:function(type,listener){if(this._listeners[type])for(var listeners=this._listeners[type],i=0,len=listeners.length;i<len;i++)if(listeners[i]===listener){listeners.splice(i,1)
break}}}},{}],24:[function(require,module,exports){"use strict"
function StringReader(text){this._input=text.replace(/(\r\n?|\n)/g,"\n")
this._line=1
this._col=1
this._cursor=0}module.exports=StringReader
StringReader.prototype={constructor:StringReader,getCol:function(){return this._col},getLine:function(){return this._line},eof:function(){return this._cursor===this._input.length},peek:function(count){var c=null
count=void 0===count?1:count
this._cursor<this._input.length&&(c=this._input.charAt(this._cursor+count-1))
return c},read:function(){var c=null
if(this._cursor<this._input.length){if("\n"===this._input.charAt(this._cursor)){this._line++
this._col=1}else this._col++
c=this._input.charAt(this._cursor++)}return c},mark:function(){this._bookmark={cursor:this._cursor,line:this._line,col:this._col}},reset:function(){if(this._bookmark){this._cursor=this._bookmark.cursor
this._line=this._bookmark.line
this._col=this._bookmark.col
delete this._bookmark}},readTo:function(pattern){for(var c,buffer="";buffer.length<pattern.length||buffer.lastIndexOf(pattern)!==buffer.length-pattern.length;){if(!(c=this.read()))throw new Error('Expected "'+pattern+'" at line '+this._line+", col "+this._col+".")
buffer+=c}return buffer},readWhile:function(filter){for(var buffer="",c=this.peek();null!==c&&filter(c);){buffer+=this.read()
c=this.peek()}return buffer},readMatch:function(matcher){var source=this._input.substring(this._cursor),value=null
"string"==typeof matcher?source.slice(0,matcher.length)===matcher&&(value=this.readCount(matcher.length)):matcher instanceof RegExp&&matcher.test(source)&&(value=this.readCount(RegExp.lastMatch.length))
return value},readCount:function(count){for(var buffer="";count--;)buffer+=this.read()
return buffer}}},{}],25:[function(require,module,exports){"use strict"
function SyntaxError(message,line,col){Error.call(this)
this.name=this.constructor.name
this.col=col
this.line=line
this.message=message}module.exports=SyntaxError;(SyntaxError.prototype=Object.create(Error.prototype)).constructor=SyntaxError},{}],26:[function(require,module,exports){"use strict"
function SyntaxUnit(text,line,col,type){this.col=col
this.line=line
this.text=text
this.type=type}module.exports=SyntaxUnit
SyntaxUnit.fromToken=function(token){return new SyntaxUnit(token.value,token.startLine,token.startCol)}
SyntaxUnit.prototype={constructor:SyntaxUnit,valueOf:function(){return this.toString()},toString:function(){return this.text}}},{}],27:[function(require,module,exports){"use strict"
function TokenStreamBase(input,tokenData){this._reader=new StringReader(input?input.toString():"")
this._token=null
this._tokenData=tokenData
this._lt=[]
this._ltIndex=0
this._ltIndexCache=[]}module.exports=TokenStreamBase
var StringReader=require("./StringReader"),SyntaxError=require("./SyntaxError")
TokenStreamBase.createTokenData=function(tokens){var nameMap=[],typeMap=Object.create(null),tokenData=tokens.concat([]),i=0,len=tokenData.length+1
tokenData.UNKNOWN=-1
tokenData.unshift({name:"EOF"})
for(;i<len;i++){nameMap.push(tokenData[i].name)
tokenData[tokenData[i].name]=i
tokenData[i].text&&(typeMap[tokenData[i].text]=i)}tokenData.name=function(tt){return nameMap[tt]}
tokenData.type=function(c){return typeMap[c]}
return tokenData}
TokenStreamBase.prototype={constructor:TokenStreamBase,match:function(tokenTypes,channel){tokenTypes instanceof Array||(tokenTypes=[tokenTypes])
for(var tt=this.get(channel),i=0,len=tokenTypes.length;i<len;)if(tt===tokenTypes[i++])return!0
this.unget()
return!1},mustMatch:function(tokenTypes){var token
tokenTypes instanceof Array||(tokenTypes=[tokenTypes])
if(!this.match.apply(this,arguments)){token=this.LT(1)
throw new SyntaxError("Expected "+this._tokenData[tokenTypes[0]].name+" at line "+token.startLine+", col "+token.startCol+".",token.startLine,token.startCol)}},advance:function(tokenTypes,channel){for(;0!==this.LA(0)&&!this.match(tokenTypes,channel);)this.get()
return this.LA(0)},get:function(channel){var token,info,tokenInfo=this._tokenData,i=0
if(this._lt.length&&this._ltIndex>=0&&this._ltIndex<this._lt.length){i++
this._token=this._lt[this._ltIndex++]
info=tokenInfo[this._token.type]
for(;void 0!==info.channel&&channel!==info.channel&&this._ltIndex<this._lt.length;){this._token=this._lt[this._ltIndex++]
info=tokenInfo[this._token.type]
i++}if((void 0===info.channel||channel===info.channel)&&this._ltIndex<=this._lt.length){this._ltIndexCache.push(i)
return this._token.type}}if((token=this._getToken()).type>-1&&!tokenInfo[token.type].hide){token.channel=tokenInfo[token.type].channel
this._token=token
this._lt.push(token)
this._ltIndexCache.push(this._lt.length-this._ltIndex+i)
this._lt.length>5&&this._lt.shift()
this._ltIndexCache.length>5&&this._ltIndexCache.shift()
this._ltIndex=this._lt.length}return(info=tokenInfo[token.type])&&(info.hide||void 0!==info.channel&&channel!==info.channel)?this.get(channel):token.type},LA:function(index){var tt,total=index
if(index>0){if(index>5)throw new Error("Too much lookahead.")
for(;total;){tt=this.get()
total--}for(;total<index;){this.unget()
total++}}else if(index<0){if(!this._lt[this._ltIndex+index])throw new Error("Too much lookbehind.")
tt=this._lt[this._ltIndex+index].type}else tt=this._token.type
return tt},LT:function(index){this.LA(index)
return this._lt[this._ltIndex+index-1]},peek:function(){return this.LA(1)},token:function(){return this._token},tokenName:function(tokenType){return tokenType<0||tokenType>this._tokenData.length?"UNKNOWN_TOKEN":this._tokenData[tokenType].name},tokenType:function(tokenName){return this._tokenData[tokenName]||-1},unget:function(){if(!this._ltIndexCache.length)throw new Error("Too much lookahead.")
this._ltIndex-=this._ltIndexCache.pop()
this._token=this._lt[this._ltIndex-1]}}},{"./StringReader":24,"./SyntaxError":25}],28:[function(require,module,exports){"use strict"
module.exports={StringReader:require("./StringReader"),SyntaxError:require("./SyntaxError"),SyntaxUnit:require("./SyntaxUnit"),EventTarget:require("./EventTarget"),TokenStreamBase:require("./TokenStreamBase")}},{"./EventTarget":23,"./StringReader":24,"./SyntaxError":25,"./SyntaxUnit":26,"./TokenStreamBase":27}],parserlib:[function(require,module,exports){"use strict"
module.exports={css:require("./css"),util:require("./util")}},{"./css":22,"./util":28}]},{},[]))("parserlib")}(),clone=function(){"use strict"
function clone(parent,circular,depth,prototype,includeNonEnumerable){function _clone(parent,depth){if(null===parent)return null
if(0===depth)return parent
var child,proto
if("object"!=typeof parent)return parent
if(parent instanceof nativeMap)child=new nativeMap
else if(parent instanceof nativeSet)child=new nativeSet
else if(parent instanceof nativePromise)child=new nativePromise(function(resolve,reject){parent.then(function(value){resolve(_clone(value,depth-1))},function(err){reject(_clone(err,depth-1))})})
else if(clone.__isArray(parent))child=[]
else if(clone.__isRegExp(parent)){child=new RegExp(parent.source,__getRegExpFlags(parent))
parent.lastIndex&&(child.lastIndex=parent.lastIndex)}else if(clone.__isDate(parent))child=new Date(parent.getTime())
else{if(useBuffer&&Buffer.isBuffer(parent)){child=new Buffer(parent.length)
parent.copy(child)
return child}if(parent instanceof Error)child=Object.create(parent)
else if(void 0===prototype){proto=Object.getPrototypeOf(parent)
child=Object.create(proto)}else{child=Object.create(prototype)
proto=prototype}}if(circular){var index=allParents.indexOf(parent)
if(-1!=index)return allChildren[index]
allParents.push(parent)
allChildren.push(child)}if(parent instanceof nativeMap)for(var keyIterator=parent.keys();;){if((next=keyIterator.next()).done)break
var keyChild=_clone(next.value,depth-1),valueChild=_clone(parent.get(next.value),depth-1)
child.set(keyChild,valueChild)}if(parent instanceof nativeSet)for(var iterator=parent.keys();;){var next=iterator.next()
if(next.done)break
var entryChild=_clone(next.value,depth-1)
child.add(entryChild)}for(var i in parent){var attrs
proto&&(attrs=Object.getOwnPropertyDescriptor(proto,i))
attrs&&null==attrs.set||(child[i]=_clone(parent[i],depth-1))}if(Object.getOwnPropertySymbols)for(var symbols=Object.getOwnPropertySymbols(parent),i=0;i<symbols.length;i++){var symbol=symbols[i]
if(!(descriptor=Object.getOwnPropertyDescriptor(parent,symbol))||descriptor.enumerable||includeNonEnumerable){child[symbol]=_clone(parent[symbol],depth-1)
descriptor.enumerable||Object.defineProperty(child,symbol,{enumerable:!1})}}if(includeNonEnumerable)for(var allPropertyNames=Object.getOwnPropertyNames(parent),i=0;i<allPropertyNames.length;i++){var propertyName=allPropertyNames[i],descriptor=Object.getOwnPropertyDescriptor(parent,propertyName)
if(!descriptor||!descriptor.enumerable){child[propertyName]=_clone(parent[propertyName],depth-1)
Object.defineProperty(child,propertyName,{enumerable:!1})}}return child}if("object"==typeof circular){depth=circular.depth
prototype=circular.prototype
includeNonEnumerable=circular.includeNonEnumerable
circular=circular.circular}var allParents=[],allChildren=[],useBuffer="undefined"!=typeof Buffer
void 0===circular&&(circular=!0)
void 0===depth&&(depth=1/0)
return _clone(parent,depth)}function __objToStr(o){return Object.prototype.toString.call(o)}function __getRegExpFlags(re){var flags=""
re.global&&(flags+="g")
re.ignoreCase&&(flags+="i")
re.multiline&&(flags+="m")
return flags}var nativeMap
try{nativeMap=Map}catch(_){nativeMap=function(){}}var nativeSet
try{nativeSet=Set}catch(_){nativeSet=function(){}}var nativePromise
try{nativePromise=Promise}catch(_){nativePromise=function(){}}clone.clonePrototype=function(parent){if(null===parent)return null
var c=function(){}
c.prototype=parent
return new c}
clone.__objToStr=__objToStr
clone.__isDate=function(o){return"object"==typeof o&&"[object Date]"===__objToStr(o)}
clone.__isArray=function(o){return"object"==typeof o&&"[object Array]"===__objToStr(o)}
clone.__isRegExp=function(o){return"object"==typeof o&&"[object RegExp]"===__objToStr(o)}
clone.__getRegExpFlags=__getRegExpFlags
return clone}()
"object"==typeof module&&module.exports&&(module.exports=clone)
var CSSLint=function(){"use strict"
function applyEmbeddedRuleset(text,ruleset){var valueMap,embedded=text&&text.match(embeddedRuleset),rules=embedded&&embedded[1]
if(rules){valueMap={true:2,"":1,false:0,2:2,1:1,0:0}
rules.toLowerCase().split(",").forEach(function(rule){var pair=rule.split(":"),property=pair[0]||"",value=pair[1]||""
ruleset[property.trim()]=valueMap[value.trim()]})}return ruleset}var rules=[],formatters=[],embeddedRuleset=/\/\*\s*csslint([^\*]*)\*\//,api=new parserlib.util.EventTarget
api.version="1.0.4"
api.addRule=function(rule){rules.push(rule)
rules[rule.id]=rule}
api.clearRules=function(){rules=[]}
api.getRules=function(){return[].concat(rules).sort(function(a,b){return a.id>b.id?1:0})}
api.getRuleset=function(){for(var ruleset={},i=0,len=rules.length;i<len;)ruleset[rules[i++].id]=1
return ruleset}
api.addFormatter=function(formatter){formatters[formatter.id]=formatter}
api.getFormatter=function(formatId){return formatters[formatId]}
api.format=function(results,filename,formatId,options){var formatter=this.getFormatter(formatId),result=null
if(formatter){result=formatter.startFormat()
result+=formatter.formatResults(results,filename,options||{})
result+=formatter.endFormat()}return result}
api.hasFormat=function(formatId){return formatters.hasOwnProperty(formatId)}
api.verify=function(text,ruleset){var reporter,lines,report,i=0,allow={},ignore=[],parser=new parserlib.css.Parser({starHack:!0,ieFilters:!0,underscoreHack:!0,strict:!1})
lines=text.replace(/\n\r?/g,"$split$").split("$split$")
CSSLint.Util.forEach(lines,function(line,lineno){var allowLine=line&&line.match(/\/\*[ \t]*csslint[ \t]+allow:[ \t]*([^\*]*)\*\//i),allowRules=allowLine&&allowLine[1],allowRuleset={}
if(allowRules){allowRules.toLowerCase().split(",").forEach(function(allowRule){allowRuleset[allowRule.trim()]=!0})
Object.keys(allowRuleset).length>0&&(allow[lineno+1]=allowRuleset)}})
var ignoreStart=null,ignoreEnd=null
CSSLint.Util.forEach(lines,function(line,lineno){null===ignoreStart&&line.match(/\/\*[ \t]*csslint[ \t]+ignore:start[ \t]*\*\//i)&&(ignoreStart=lineno)
line.match(/\/\*[ \t]*csslint[ \t]+ignore:end[ \t]*\*\//i)&&(ignoreEnd=lineno)
if(null!==ignoreStart&&null!==ignoreEnd){ignore.push([ignoreStart,ignoreEnd])
ignoreStart=ignoreEnd=null}})
null!==ignoreStart&&ignore.push([ignoreStart,lines.length])
ruleset||(ruleset=this.getRuleset())
embeddedRuleset.test(text)&&(ruleset=applyEmbeddedRuleset(text,ruleset=clone(ruleset)))
reporter=new Reporter(lines,ruleset,allow,ignore)
ruleset.errors=2
for(i in ruleset)ruleset.hasOwnProperty(i)&&ruleset[i]&&rules[i]&&rules[i].init(parser,reporter)
try{parser.parse(text)}catch(ex){reporter.error("Fatal error, cannot continue: "+ex.message,ex.line,ex.col,{})}(report={messages:reporter.messages,stats:reporter.stats,ruleset:reporter.ruleset,allow:reporter.allow,ignore:reporter.ignore}).messages.sort(function(a,b){return a.rollup&&!b.rollup?1:!a.rollup&&b.rollup?-1:a.line-b.line})
return report}
return api}()
Reporter.prototype={constructor:Reporter,error:function(message,line,col,rule){"use strict"
this.messages.push({type:"error",line:line,col:col,message:message,evidence:this.lines[line-1],rule:rule||{}})},warn:function(message,line,col,rule){"use strict"
this.report(message,line,col,rule)},report:function(message,line,col,rule){"use strict"
if(!this.allow.hasOwnProperty(line)||!this.allow[line].hasOwnProperty(rule.id)){var ignore=!1
CSSLint.Util.forEach(this.ignore,function(range){range[0]<=line&&line<=range[1]&&(ignore=!0)})
ignore||this.messages.push({type:2===this.ruleset[rule.id]?"error":"warning",line:line,col:col,message:message,evidence:this.lines[line-1],rule:rule})}},info:function(message,line,col,rule){"use strict"
this.messages.push({type:"info",line:line,col:col,message:message,evidence:this.lines[line-1],rule:rule})},rollupError:function(message,rule){"use strict"
this.messages.push({type:"error",rollup:!0,message:message,rule:rule})},rollupWarn:function(message,rule){"use strict"
this.messages.push({type:"warning",rollup:!0,message:message,rule:rule})},stat:function(name,value){"use strict"
this.stats[name]=value}}
CSSLint._Reporter=Reporter
CSSLint.Util={mix:function(receiver,supplier){"use strict"
var prop
for(prop in supplier)supplier.hasOwnProperty(prop)&&(receiver[prop]=supplier[prop])
return prop},indexOf:function(values,value){"use strict"
if(values.indexOf)return values.indexOf(value)
for(var i=0,len=values.length;i<len;i++)if(values[i]===value)return i
return-1},forEach:function(values,func){"use strict"
if(values.forEach)return values.forEach(func)
for(var i=0,len=values.length;i<len;i++)func(values[i],i,values)}}
CSSLint.addRule({id:"adjoining-classes",name:"Disallow adjoining classes",desc:"Don't use adjoining classes.",url:"https://github.com/CSSLint/csslint/wiki/Disallow-adjoining-classes",browsers:"IE6",init:function(parser,reporter){"use strict"
var rule=this
parser.addListener("startrule",function(event){var selector,part,classCount,i,j,k,selectors=event.selectors
for(i=0;i<selectors.length;i++){selector=selectors[i]
for(j=0;j<selector.parts.length;j++)if((part=selector.parts[j]).type===parser.SELECTOR_PART_TYPE){classCount=0
for(k=0;k<part.modifiers.length;k++){"class"===part.modifiers[k].type&&classCount++
classCount>1&&reporter.report("Adjoining classes: "+selectors[i].text,part.line,part.col,rule)}}}})}})
CSSLint.addRule({id:"box-model",name:"Beware of broken box size",desc:"Don't use width or height when using padding or border.",url:"https://github.com/CSSLint/csslint/wiki/Beware-of-box-model-size",browsers:"All",init:function(parser,reporter){"use strict"
function startRule(){properties={}
boxSizing=!1}function endRule(){var prop,value
if(!boxSizing){if(properties.height)for(prop in heightProperties)if(heightProperties.hasOwnProperty(prop)&&properties[prop]){value=properties[prop].value
"padding"===prop&&2===value.parts.length&&0===value.parts[0].value||reporter.report("Using height with "+prop+" can sometimes make elements larger than you expect.",properties[prop].line,properties[prop].col,rule)}if(properties.width)for(prop in widthProperties)if(widthProperties.hasOwnProperty(prop)&&properties[prop]){value=properties[prop].value
"padding"===prop&&2===value.parts.length&&0===value.parts[1].value||reporter.report("Using width with "+prop+" can sometimes make elements larger than you expect.",properties[prop].line,properties[prop].col,rule)}}}var properties,rule=this,widthProperties={border:1,"border-left":1,"border-right":1,padding:1,"padding-left":1,"padding-right":1},heightProperties={border:1,"border-bottom":1,"border-top":1,padding:1,"padding-bottom":1,"padding-top":1},boxSizing=!1
parser.addListener("startrule",startRule)
parser.addListener("startfontface",startRule)
parser.addListener("startpage",startRule)
parser.addListener("startpagemargin",startRule)
parser.addListener("startkeyframerule",startRule)
parser.addListener("startviewport",startRule)
parser.addListener("property",function(event){var name=event.property.text.toLowerCase()
heightProperties[name]||widthProperties[name]?/^0\S*$/.test(event.value)||"border"===name&&"none"===event.value.toString()||(properties[name]={line:event.property.line,col:event.property.col,value:event.value}):/^(width|height)/i.test(name)&&/^(length|percentage)/.test(event.value.parts[0].type)?properties[name]=1:"box-sizing"===name&&(boxSizing=!0)})
parser.addListener("endrule",endRule)
parser.addListener("endfontface",endRule)
parser.addListener("endpage",endRule)
parser.addListener("endpagemargin",endRule)
parser.addListener("endkeyframerule",endRule)
parser.addListener("endviewport",endRule)}})
CSSLint.addRule({id:"box-sizing",name:"Disallow use of box-sizing",desc:"The box-sizing properties isn't supported in IE6 and IE7.",url:"https://github.com/CSSLint/csslint/wiki/Disallow-box-sizing",browsers:"IE6, IE7",tags:["Compatibility"],init:function(parser,reporter){"use strict"
var rule=this
parser.addListener("property",function(event){"box-sizing"===event.property.text.toLowerCase()&&reporter.report("The box-sizing property isn't supported in IE6 and IE7.",event.line,event.col,rule)})}})
CSSLint.addRule({id:"bulletproof-font-face",name:"Use the bulletproof @font-face syntax",desc:"Use the bulletproof @font-face syntax to avoid 404's in old IE (http://www.fontspring.com/blog/the-new-bulletproof-font-face-syntax).",url:"https://github.com/CSSLint/csslint/wiki/Bulletproof-font-face",browsers:"All",init:function(parser,reporter){"use strict"
var line,col,rule=this,fontFaceRule=!1,firstSrc=!0,ruleFailed=!1
parser.addListener("startfontface",function(){fontFaceRule=!0})
parser.addListener("property",function(event){if(fontFaceRule){var propertyName=event.property.toString().toLowerCase(),value=event.value.toString()
line=event.line
col=event.col
if("src"===propertyName){var regex=/^\s?url\(['"].+\.eot\?.*['"]\)\s*format\(['"]embedded-opentype['"]\).*$/i
if(!value.match(regex)&&firstSrc){ruleFailed=!0
firstSrc=!1}else value.match(regex)&&!firstSrc&&(ruleFailed=!1)}}})
parser.addListener("endfontface",function(){fontFaceRule=!1
ruleFailed&&reporter.report("@font-face declaration doesn't follow the fontspring bulletproof syntax.",line,col,rule)})}})
CSSLint.addRule({id:"compatible-vendor-prefixes",name:"Require compatible vendor prefixes",desc:"Include all compatible vendor prefixes to reach a wider range of users.",url:"https://github.com/CSSLint/csslint/wiki/Require-compatible-vendor-prefixes",browsers:"All",init:function(parser,reporter){"use strict"
var compatiblePrefixes,properties,prop,variations,prefixed,i,len,rule=this,inKeyFrame=!1,arrayPush=Array.prototype.push,applyTo=[]
compatiblePrefixes={animation:"webkit","animation-delay":"webkit","animation-direction":"webkit","animation-duration":"webkit","animation-fill-mode":"webkit","animation-iteration-count":"webkit","animation-name":"webkit","animation-play-state":"webkit","animation-timing-function":"webkit",appearance:"webkit moz","border-end":"webkit moz","border-end-color":"webkit moz","border-end-style":"webkit moz","border-end-width":"webkit moz","border-image":"webkit moz o","border-radius":"webkit","border-start":"webkit moz","border-start-color":"webkit moz","border-start-style":"webkit moz","border-start-width":"webkit moz","box-align":"webkit moz ms","box-direction":"webkit moz ms","box-flex":"webkit moz ms","box-lines":"webkit ms","box-ordinal-group":"webkit moz ms","box-orient":"webkit moz ms","box-pack":"webkit moz ms","box-sizing":"","box-shadow":"","column-count":"webkit moz ms","column-gap":"webkit moz ms","column-rule":"webkit moz ms","column-rule-color":"webkit moz ms","column-rule-style":"webkit moz ms","column-rule-width":"webkit moz ms","column-width":"webkit moz ms",hyphens:"epub moz","line-break":"webkit ms","margin-end":"webkit moz","margin-start":"webkit moz","marquee-speed":"webkit wap","marquee-style":"webkit wap","padding-end":"webkit moz","padding-start":"webkit moz","tab-size":"moz o","text-size-adjust":"webkit ms",transform:"webkit ms","transform-origin":"webkit ms",transition:"","transition-delay":"","transition-duration":"","transition-property":"","transition-timing-function":"","user-modify":"webkit moz","user-select":"webkit moz ms","word-break":"epub ms","writing-mode":"epub ms"}
for(prop in compatiblePrefixes)if(compatiblePrefixes.hasOwnProperty(prop)){variations=[]
for(i=0,len=(prefixed=compatiblePrefixes[prop].split(" ")).length;i<len;i++)variations.push("-"+prefixed[i]+"-"+prop)
compatiblePrefixes[prop]=variations
arrayPush.apply(applyTo,variations)}parser.addListener("startrule",function(){properties=[]})
parser.addListener("startkeyframes",function(event){inKeyFrame=event.prefix||!0})
parser.addListener("endkeyframes",function(){inKeyFrame=!1})
parser.addListener("property",function(event){var name=event.property
CSSLint.Util.indexOf(applyTo,name.text)>-1&&(inKeyFrame&&"string"==typeof inKeyFrame&&0===name.text.indexOf("-"+inKeyFrame+"-")||properties.push(name))})
parser.addListener("endrule",function(){if(properties.length){var i,len,name,prop,variations,value,full,actual,item,propertiesSpecified,propertyGroups={}
for(i=0,len=properties.length;i<len;i++){name=properties[i]
for(prop in compatiblePrefixes)if(compatiblePrefixes.hasOwnProperty(prop)){variations=compatiblePrefixes[prop]
if(CSSLint.Util.indexOf(variations,name.text)>-1){propertyGroups[prop]||(propertyGroups[prop]={full:variations.slice(0),actual:[],actualNodes:[]})
if(-1===CSSLint.Util.indexOf(propertyGroups[prop].actual,name.text)){propertyGroups[prop].actual.push(name.text)
propertyGroups[prop].actualNodes.push(name)}}}}for(prop in propertyGroups)if(propertyGroups.hasOwnProperty(prop)){full=(value=propertyGroups[prop]).full
actual=value.actual
if(full.length>actual.length)for(i=0,len=full.length;i<len;i++){item=full[i]
if(-1===CSSLint.Util.indexOf(actual,item)){propertiesSpecified=1===actual.length?actual[0]:2===actual.length?actual.join(" and "):actual.join(", ")
reporter.report("The property "+item+" is compatible with "+propertiesSpecified+" and should be included as well.",value.actualNodes[0].line,value.actualNodes[0].col,rule)}}}}})}})
CSSLint.addRule({id:"display-property-grouping",name:"Require properties appropriate for display",desc:"Certain properties shouldn't be used with certain display property values.",url:"https://github.com/CSSLint/csslint/wiki/Require-properties-appropriate-for-display",browsers:"All",init:function(parser,reporter){"use strict"
function reportProperty(name,display,msg){properties[name]&&("string"==typeof propertiesToCheck[name]&&properties[name].value.toLowerCase()===propertiesToCheck[name]||reporter.report(msg||name+" can't be used with display: "+display+".",properties[name].line,properties[name].col,rule))}function startRule(){properties={}}function endRule(){var display=properties.display?properties.display.value:null
if(display)switch(display){case"inline":reportProperty("height",display)
reportProperty("width",display)
reportProperty("margin",display)
reportProperty("margin-top",display)
reportProperty("margin-bottom",display)
reportProperty("float",display,"display:inline has no effect on floated elements (but may be used to fix the IE6 double-margin bug).")
break
case"block":reportProperty("vertical-align",display)
break
case"inline-block":reportProperty("float",display)
break
default:if(0===display.indexOf("table-")){reportProperty("margin",display)
reportProperty("margin-left",display)
reportProperty("margin-right",display)
reportProperty("margin-top",display)
reportProperty("margin-bottom",display)
reportProperty("float",display)}}}var properties,rule=this,propertiesToCheck={display:1,float:"none",height:1,width:1,margin:1,"margin-left":1,"margin-right":1,"margin-bottom":1,"margin-top":1,padding:1,"padding-left":1,"padding-right":1,"padding-bottom":1,"padding-top":1,"vertical-align":1}
parser.addListener("startrule",startRule)
parser.addListener("startfontface",startRule)
parser.addListener("startkeyframerule",startRule)
parser.addListener("startpagemargin",startRule)
parser.addListener("startpage",startRule)
parser.addListener("startviewport",startRule)
parser.addListener("property",function(event){var name=event.property.text.toLowerCase()
propertiesToCheck[name]&&(properties[name]={value:event.value.text,line:event.property.line,col:event.property.col})})
parser.addListener("endrule",endRule)
parser.addListener("endfontface",endRule)
parser.addListener("endkeyframerule",endRule)
parser.addListener("endpagemargin",endRule)
parser.addListener("endpage",endRule)
parser.addListener("endviewport",endRule)}})
CSSLint.addRule({id:"duplicate-background-images",name:"Disallow duplicate background images",desc:"Every background-image should be unique. Use a common class for e.g. sprites.",url:"https://github.com/CSSLint/csslint/wiki/Disallow-duplicate-background-images",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this,stack={}
parser.addListener("property",function(event){var i,len,name=event.property.text,value=event.value
if(name.match(/background/i))for(i=0,len=value.parts.length;i<len;i++)"uri"===value.parts[i].type&&(void 0===stack[value.parts[i].uri]?stack[value.parts[i].uri]=event:reporter.report("Background image '"+value.parts[i].uri+"' was used multiple times, first declared at line "+stack[value.parts[i].uri].line+", col "+stack[value.parts[i].uri].col+".",event.line,event.col,rule))})}})
CSSLint.addRule({id:"duplicate-properties",name:"Disallow duplicate properties",desc:"Duplicate properties must appear one after the other.",url:"https://github.com/CSSLint/csslint/wiki/Disallow-duplicate-properties",browsers:"All",init:function(parser,reporter){"use strict"
function startRule(){properties={}}var properties,lastProperty,rule=this
parser.addListener("startrule",startRule)
parser.addListener("startfontface",startRule)
parser.addListener("startpage",startRule)
parser.addListener("startpagemargin",startRule)
parser.addListener("startkeyframerule",startRule)
parser.addListener("startviewport",startRule)
parser.addListener("property",function(event){var name=event.property.text.toLowerCase()
!properties[name]||lastProperty===name&&properties[name]!==event.value.text||reporter.report("Duplicate property '"+event.property+"' found.",event.line,event.col,rule)
properties[name]=event.value.text
lastProperty=name})}})
CSSLint.addRule({id:"empty-rules",name:"Disallow empty rules",desc:"Rules without any properties specified should be removed.",url:"https://github.com/CSSLint/csslint/wiki/Disallow-empty-rules",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this,count=0
parser.addListener("startrule",function(){count=0})
parser.addListener("property",function(){count++})
parser.addListener("endrule",function(event){var selectors=event.selectors
0===count&&reporter.report("Rule is empty.",selectors[0].line,selectors[0].col,rule)})}})
CSSLint.addRule({id:"errors",name:"Parsing Errors",desc:"This rule looks for recoverable syntax errors.",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this
parser.addListener("error",function(event){reporter.error(event.message,event.line,event.col,rule)})}})
CSSLint.addRule({id:"fallback-colors",name:"Require fallback colors",desc:"For older browsers that don't support RGBA, HSL, or HSLA, provide a fallback color.",url:"https://github.com/CSSLint/csslint/wiki/Require-fallback-colors",browsers:"IE6,IE7,IE8",init:function(parser,reporter){"use strict"
function startRule(){lastProperty=null}var lastProperty,rule=this,propertiesToCheck={color:1,background:1,"border-color":1,"border-top-color":1,"border-right-color":1,"border-bottom-color":1,"border-left-color":1,border:1,"border-top":1,"border-right":1,"border-bottom":1,"border-left":1,"background-color":1}
parser.addListener("startrule",startRule)
parser.addListener("startfontface",startRule)
parser.addListener("startpage",startRule)
parser.addListener("startpagemargin",startRule)
parser.addListener("startkeyframerule",startRule)
parser.addListener("startviewport",startRule)
parser.addListener("property",function(event){var name=event.property.text.toLowerCase(),parts=event.value.parts,i=0,colorType="",len=parts.length
if(propertiesToCheck[name])for(;i<len;){if("color"===parts[i].type)if("alpha"in parts[i]||"hue"in parts[i]){/([^\)]+)\(/.test(parts[i])&&(colorType=RegExp.$1.toUpperCase())
lastProperty&&lastProperty.property.text.toLowerCase()===name&&"compat"===lastProperty.colorType||reporter.report("Fallback "+name+" (hex or RGB) should precede "+colorType+" "+name+".",event.line,event.col,rule)}else event.colorType="compat"
i++}lastProperty=event})}})
CSSLint.addRule({id:"floats",name:"Disallow too many floats",desc:"This rule tests if the float property is used too many times",url:"https://github.com/CSSLint/csslint/wiki/Disallow-too-many-floats",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this,count=0
parser.addListener("property",function(event){"float"===event.property.text.toLowerCase()&&"none"!==event.value.text.toLowerCase()&&count++})
parser.addListener("endstylesheet",function(){reporter.stat("floats",count)
count>=10&&reporter.rollupWarn("Too many floats ("+count+"), you're probably using them for layout. Consider using a grid system instead.",rule)})}})
CSSLint.addRule({id:"font-faces",name:"Don't use too many web fonts",desc:"Too many different web fonts in the same stylesheet.",url:"https://github.com/CSSLint/csslint/wiki/Don%27t-use-too-many-web-fonts",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this,count=0
parser.addListener("startfontface",function(){count++})
parser.addListener("endstylesheet",function(){count>5&&reporter.rollupWarn("Too many @font-face declarations ("+count+").",rule)})}})
CSSLint.addRule({id:"font-sizes",name:"Disallow too many font sizes",desc:"Checks the number of font-size declarations.",url:"https://github.com/CSSLint/csslint/wiki/Don%27t-use-too-many-font-size-declarations",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this,count=0
parser.addListener("property",function(event){"font-size"===event.property.toString()&&count++})
parser.addListener("endstylesheet",function(){reporter.stat("font-sizes",count)
count>=10&&reporter.rollupWarn("Too many font-size declarations ("+count+"), abstraction needed.",rule)})}})
CSSLint.addRule({id:"gradients",name:"Require all gradient definitions",desc:"When using a vendor-prefixed gradient, make sure to use them all.",url:"https://github.com/CSSLint/csslint/wiki/Require-all-gradient-definitions",browsers:"All",init:function(parser,reporter){"use strict"
var gradients,rule=this
parser.addListener("startrule",function(){gradients={moz:0,webkit:0,oldWebkit:0,o:0}})
parser.addListener("property",function(event){/\-(moz|o|webkit)(?:\-(?:linear|radial))\-gradient/i.test(event.value)?gradients[RegExp.$1]=1:/\-webkit\-gradient/i.test(event.value)&&(gradients.oldWebkit=1)})
parser.addListener("endrule",function(event){var missing=[]
gradients.moz||missing.push("Firefox 3.6+")
gradients.webkit||missing.push("Webkit (Safari 5+, Chrome)")
gradients.oldWebkit||missing.push("Old Webkit (Safari 4+, Chrome)")
gradients.o||missing.push("Opera 11.1+")
missing.length&&missing.length<4&&reporter.report("Missing vendor-prefixed CSS gradients for "+missing.join(", ")+".",event.selectors[0].line,event.selectors[0].col,rule)})}})
CSSLint.addRule({id:"ids",name:"Disallow IDs in selectors",desc:"Selectors should not contain IDs.",url:"https://github.com/CSSLint/csslint/wiki/Disallow-IDs-in-selectors",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this
parser.addListener("startrule",function(event){var selector,part,idCount,i,j,k,selectors=event.selectors
for(i=0;i<selectors.length;i++){selector=selectors[i]
idCount=0
for(j=0;j<selector.parts.length;j++)if((part=selector.parts[j]).type===parser.SELECTOR_PART_TYPE)for(k=0;k<part.modifiers.length;k++)"id"===part.modifiers[k].type&&idCount++
1===idCount?reporter.report("Don't use IDs in selectors.",selector.line,selector.col,rule):idCount>1&&reporter.report(idCount+" IDs in the selector, really?",selector.line,selector.col,rule)}})}})
CSSLint.addRule({id:"import-ie-limit",name:"@import limit on IE6-IE9",desc:"IE6-9 supports up to 31 @import per stylesheet",browsers:"IE6, IE7, IE8, IE9",init:function(parser,reporter){"use strict"
var rule=this,count=0
parser.addListener("startpage",function(){count=0})
parser.addListener("import",function(){count++})
parser.addListener("endstylesheet",function(){count>31&&reporter.rollupError("Too many @import rules ("+count+"). IE6-9 supports up to 31 import per stylesheet.",rule)})}})
CSSLint.addRule({id:"import",name:"Disallow @import",desc:"Don't use @import, use <link> instead.",url:"https://github.com/CSSLint/csslint/wiki/Disallow-%40import",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this
parser.addListener("import",function(event){reporter.report("@import prevents parallel downloads, use <link> instead.",event.line,event.col,rule)})}})
CSSLint.addRule({id:"important",name:"Disallow !important",desc:"Be careful when using !important declaration",url:"https://github.com/CSSLint/csslint/wiki/Disallow-%21important",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this,count=0
parser.addListener("property",function(event){if(!0===event.important){count++
reporter.report("Use of !important",event.line,event.col,rule)}})
parser.addListener("endstylesheet",function(){reporter.stat("important",count)
count>=10&&reporter.rollupWarn("Too many !important declarations ("+count+"), try to use less than 10 to avoid specificity issues.",rule)})}})
CSSLint.addRule({id:"known-properties",name:"Require use of known properties",desc:"Properties should be known (listed in CSS3 specification) or be a vendor-prefixed property.",url:"https://github.com/CSSLint/csslint/wiki/Require-use-of-known-properties",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this
parser.addListener("property",function(event){event.invalid&&reporter.report(event.invalid.message,event.line,event.col,rule)})}})
CSSLint.addRule({id:"order-alphabetical",name:"Alphabetical order",desc:"Assure properties are in alphabetical order",browsers:"All",init:function(parser,reporter){"use strict"
var properties,rule=this,startRule=function(){properties=[]},endRule=function(event){properties.join(",")!==properties.sort().join(",")&&reporter.report("Rule doesn't have all its properties in alphabetical order.",event.line,event.col,rule)}
parser.addListener("startrule",startRule)
parser.addListener("startfontface",startRule)
parser.addListener("startpage",startRule)
parser.addListener("startpagemargin",startRule)
parser.addListener("startkeyframerule",startRule)
parser.addListener("startviewport",startRule)
parser.addListener("property",function(event){var lowerCasePrefixLessName=event.property.text.toLowerCase().replace(/^-.*?-/,"")
properties.push(lowerCasePrefixLessName)})
parser.addListener("endrule",endRule)
parser.addListener("endfontface",endRule)
parser.addListener("endpage",endRule)
parser.addListener("endpagemargin",endRule)
parser.addListener("endkeyframerule",endRule)
parser.addListener("endviewport",endRule)}})
CSSLint.addRule({id:"outline-none",name:"Disallow outline: none",desc:"Use of outline: none or outline: 0 should be limited to :focus rules.",url:"https://github.com/CSSLint/csslint/wiki/Disallow-outline%3Anone",browsers:"All",tags:["Accessibility"],init:function(parser,reporter){"use strict"
function startRule(event){lastRule=event.selectors?{line:event.line,col:event.col,selectors:event.selectors,propCount:0,outline:!1}:null}function endRule(){lastRule&&lastRule.outline&&(-1===lastRule.selectors.toString().toLowerCase().indexOf(":focus")?reporter.report("Outlines should only be modified using :focus.",lastRule.line,lastRule.col,rule):1===lastRule.propCount&&reporter.report("Outlines shouldn't be hidden unless other visual changes are made.",lastRule.line,lastRule.col,rule))}var lastRule,rule=this
parser.addListener("startrule",startRule)
parser.addListener("startfontface",startRule)
parser.addListener("startpage",startRule)
parser.addListener("startpagemargin",startRule)
parser.addListener("startkeyframerule",startRule)
parser.addListener("startviewport",startRule)
parser.addListener("property",function(event){var name=event.property.text.toLowerCase(),value=event.value
if(lastRule){lastRule.propCount++
"outline"!==name||"none"!==value.toString()&&"0"!==value.toString()||(lastRule.outline=!0)}})
parser.addListener("endrule",endRule)
parser.addListener("endfontface",endRule)
parser.addListener("endpage",endRule)
parser.addListener("endpagemargin",endRule)
parser.addListener("endkeyframerule",endRule)
parser.addListener("endviewport",endRule)}})
CSSLint.addRule({id:"overqualified-elements",name:"Disallow overqualified elements",desc:"Don't use classes or IDs with elements (a.foo or a#foo).",url:"https://github.com/CSSLint/csslint/wiki/Disallow-overqualified-elements",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this,classes={}
parser.addListener("startrule",function(event){var selector,part,modifier,i,j,k,selectors=event.selectors
for(i=0;i<selectors.length;i++){selector=selectors[i]
for(j=0;j<selector.parts.length;j++)if((part=selector.parts[j]).type===parser.SELECTOR_PART_TYPE)for(k=0;k<part.modifiers.length;k++){modifier=part.modifiers[k]
if(part.elementName&&"id"===modifier.type)reporter.report("Element ("+part+") is overqualified, just use "+modifier+" without element name.",part.line,part.col,rule)
else if("class"===modifier.type){classes[modifier]||(classes[modifier]=[])
classes[modifier].push({modifier:modifier,part:part})}}}})
parser.addListener("endstylesheet",function(){var prop
for(prop in classes)classes.hasOwnProperty(prop)&&1===classes[prop].length&&classes[prop][0].part.elementName&&reporter.report("Element ("+classes[prop][0].part+") is overqualified, just use "+classes[prop][0].modifier+" without element name.",classes[prop][0].part.line,classes[prop][0].part.col,rule)})}})
CSSLint.addRule({id:"qualified-headings",name:"Disallow qualified headings",desc:"Headings should not be qualified (namespaced).",url:"https://github.com/CSSLint/csslint/wiki/Disallow-qualified-headings",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this
parser.addListener("startrule",function(event){var selector,part,i,j,selectors=event.selectors
for(i=0;i<selectors.length;i++){selector=selectors[i]
for(j=0;j<selector.parts.length;j++)(part=selector.parts[j]).type===parser.SELECTOR_PART_TYPE&&part.elementName&&/h[1-6]/.test(part.elementName.toString())&&j>0&&reporter.report("Heading ("+part.elementName+") should not be qualified.",part.line,part.col,rule)}})}})
CSSLint.addRule({id:"regex-selectors",name:"Disallow selectors that look like regexs",desc:"Selectors that look like regular expressions are slow and should be avoided.",url:"https://github.com/CSSLint/csslint/wiki/Disallow-selectors-that-look-like-regular-expressions",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this
parser.addListener("startrule",function(event){var selector,part,modifier,i,j,k,selectors=event.selectors
for(i=0;i<selectors.length;i++){selector=selectors[i]
for(j=0;j<selector.parts.length;j++)if((part=selector.parts[j]).type===parser.SELECTOR_PART_TYPE)for(k=0;k<part.modifiers.length;k++)"attribute"===(modifier=part.modifiers[k]).type&&/([~\|\^\$\*]=)/.test(modifier)&&reporter.report("Attribute selectors with "+RegExp.$1+" are slow!",modifier.line,modifier.col,rule)}})}})
CSSLint.addRule({id:"rules-count",name:"Rules Count",desc:"Track how many rules there are.",browsers:"All",init:function(parser,reporter){"use strict"
var count=0
parser.addListener("startrule",function(){count++})
parser.addListener("endstylesheet",function(){reporter.stat("rule-count",count)})}})
CSSLint.addRule({id:"selector-max-approaching",name:"Warn when approaching the 4095 selector limit for IE",desc:"Will warn when selector count is >= 3800 selectors.",browsers:"IE",init:function(parser,reporter){"use strict"
var rule=this,count=0
parser.addListener("startrule",function(event){count+=event.selectors.length})
parser.addListener("endstylesheet",function(){count>=3800&&reporter.report("You have "+count+" selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.",0,0,rule)})}})
CSSLint.addRule({id:"selector-max",name:"Error when past the 4095 selector limit for IE",desc:"Will error when selector count is > 4095.",browsers:"IE",init:function(parser,reporter){"use strict"
var rule=this,count=0
parser.addListener("startrule",function(event){count+=event.selectors.length})
parser.addListener("endstylesheet",function(){count>4095&&reporter.report("You have "+count+" selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.",0,0,rule)})}})
CSSLint.addRule({id:"selector-newline",name:"Disallow new-line characters in selectors",desc:"New-line characters in selectors are usually a forgotten comma and not a descendant combinator.",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this
parser.addListener("startrule",function(event){var i,len,selector,p,n,pLen,part,part2,type,currentLine,nextLine,selectors=event.selectors
for(i=0,len=selectors.length;i<len;i++)for(p=0,pLen=(selector=selectors[i]).parts.length;p<pLen;p++)for(n=p+1;n<pLen;n++){part=selector.parts[p]
part2=selector.parts[n]
type=part.type
currentLine=part.line
nextLine=part2.line
"descendant"===type&&nextLine>currentLine&&reporter.report("newline character found in selector (forgot a comma?)",currentLine,selectors[i].parts[0].col,rule)}})}})
CSSLint.addRule({id:"shorthand",name:"Require shorthand properties",desc:"Use shorthand properties where possible.",url:"https://github.com/CSSLint/csslint/wiki/Require-shorthand-properties",browsers:"All",init:function(parser,reporter){"use strict"
function startRule(){properties={}}function endRule(event){var prop,i,len,total
for(prop in mapping)if(mapping.hasOwnProperty(prop)){total=0
for(i=0,len=mapping[prop].length;i<len;i++)total+=properties[mapping[prop][i]]?1:0
total===mapping[prop].length&&reporter.report("The properties "+mapping[prop].join(", ")+" can be replaced by "+prop+".",event.line,event.col,rule)}}var prop,i,len,properties,rule=this,propertiesToCheck={},mapping={margin:["margin-top","margin-bottom","margin-left","margin-right"],padding:["padding-top","padding-bottom","padding-left","padding-right"]}
for(prop in mapping)if(mapping.hasOwnProperty(prop))for(i=0,len=mapping[prop].length;i<len;i++)propertiesToCheck[mapping[prop][i]]=prop
parser.addListener("startrule",startRule)
parser.addListener("startfontface",startRule)
parser.addListener("property",function(event){var name=event.property.toString().toLowerCase()
propertiesToCheck[name]&&(properties[name]=1)})
parser.addListener("endrule",endRule)
parser.addListener("endfontface",endRule)}})
CSSLint.addRule({id:"star-property-hack",name:"Disallow properties with a star prefix",desc:"Checks for the star property hack (targets IE6/7)",url:"https://github.com/CSSLint/csslint/wiki/Disallow-star-hack",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this
parser.addListener("property",function(event){"*"===event.property.hack&&reporter.report("Property with star prefix found.",event.property.line,event.property.col,rule)})}})
CSSLint.addRule({id:"text-indent",name:"Disallow negative text-indent",desc:"Checks for text indent less than -99px",url:"https://github.com/CSSLint/csslint/wiki/Disallow-negative-text-indent",browsers:"All",init:function(parser,reporter){"use strict"
function startRule(){textIndent=!1
direction="inherit"}function endRule(){textIndent&&"ltr"!==direction&&reporter.report("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set direction for that item to ltr.",textIndent.line,textIndent.col,rule)}var textIndent,direction,rule=this
parser.addListener("startrule",startRule)
parser.addListener("startfontface",startRule)
parser.addListener("property",function(event){var name=event.property.toString().toLowerCase(),value=event.value
"text-indent"===name&&value.parts[0].value<-99?textIndent=event.property:"direction"===name&&"ltr"===value.toString()&&(direction="ltr")})
parser.addListener("endrule",endRule)
parser.addListener("endfontface",endRule)}})
CSSLint.addRule({id:"underscore-property-hack",name:"Disallow properties with an underscore prefix",desc:"Checks for the underscore property hack (targets IE6)",url:"https://github.com/CSSLint/csslint/wiki/Disallow-underscore-hack",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this
parser.addListener("property",function(event){"_"===event.property.hack&&reporter.report("Property with underscore prefix found.",event.property.line,event.property.col,rule)})}})
CSSLint.addRule({id:"unique-headings",name:"Headings should only be defined once",desc:"Headings should be defined only once.",url:"https://github.com/CSSLint/csslint/wiki/Headings-should-only-be-defined-once",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this,headings={h1:0,h2:0,h3:0,h4:0,h5:0,h6:0}
parser.addListener("startrule",function(event){var selector,part,pseudo,i,j,selectors=event.selectors
for(i=0;i<selectors.length;i++)if((part=(selector=selectors[i]).parts[selector.parts.length-1]).elementName&&/(h[1-6])/i.test(part.elementName.toString())){for(j=0;j<part.modifiers.length;j++)if("pseudo"===part.modifiers[j].type){pseudo=!0
break}if(!pseudo){headings[RegExp.$1]++
headings[RegExp.$1]>1&&reporter.report("Heading ("+part.elementName+") has already been defined.",part.line,part.col,rule)}}})
parser.addListener("endstylesheet",function(){var prop,messages=[]
for(prop in headings)headings.hasOwnProperty(prop)&&headings[prop]>1&&messages.push(headings[prop]+" "+prop+"s")
messages.length&&reporter.rollupWarn("You have "+messages.join(", ")+" defined in this stylesheet.",rule)})}})
CSSLint.addRule({id:"universal-selector",name:"Disallow universal selector",desc:"The universal selector (*) is known to be slow.",url:"https://github.com/CSSLint/csslint/wiki/Disallow-universal-selector",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this
parser.addListener("startrule",function(event){var selector,part,i,selectors=event.selectors
for(i=0;i<selectors.length;i++)"*"===(part=(selector=selectors[i]).parts[selector.parts.length-1]).elementName&&reporter.report(rule.desc,part.line,part.col,rule)})}})
CSSLint.addRule({id:"unqualified-attributes",name:"Disallow unqualified attribute selectors",desc:"Unqualified attribute selectors are known to be slow.",url:"https://github.com/CSSLint/csslint/wiki/Disallow-unqualified-attribute-selectors",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this
parser.addListener("startrule",function(event){var selector,part,modifier,i,k,selectors=event.selectors,selectorContainsClassOrId=!1
for(i=0;i<selectors.length;i++)if((part=(selector=selectors[i]).parts[selector.parts.length-1]).type===parser.SELECTOR_PART_TYPE){for(k=0;k<part.modifiers.length;k++)if("class"===(modifier=part.modifiers[k]).type||"id"===modifier.type){selectorContainsClassOrId=!0
break}if(!selectorContainsClassOrId)for(k=0;k<part.modifiers.length;k++)"attribute"!==(modifier=part.modifiers[k]).type||part.elementName&&"*"!==part.elementName||reporter.report(rule.desc,part.line,part.col,rule)}})}})
CSSLint.addRule({id:"vendor-prefix",name:"Require standard property with vendor prefix",desc:"When using a vendor-prefixed property, make sure to include the standard one.",url:"https://github.com/CSSLint/csslint/wiki/Require-standard-property-with-vendor-prefix",browsers:"All",init:function(parser,reporter){"use strict"
function startRule(){properties={}
num=1}function endRule(){var prop,i,len,needed,actual,needsStandard=[]
for(prop in properties)propertiesToCheck[prop]&&needsStandard.push({actual:prop,needed:propertiesToCheck[prop]})
for(i=0,len=needsStandard.length;i<len;i++){needed=needsStandard[i].needed
actual=needsStandard[i].actual
properties[needed]?properties[needed][0].pos<properties[actual][0].pos&&reporter.report("Standard property '"+needed+"' should come after vendor-prefixed property '"+actual+"'.",properties[actual][0].name.line,properties[actual][0].name.col,rule):reporter.report("Missing standard property '"+needed+"' to go along with '"+actual+"'.",properties[actual][0].name.line,properties[actual][0].name.col,rule)}}var properties,num,rule=this,propertiesToCheck={"-webkit-border-radius":"border-radius","-webkit-border-top-left-radius":"border-top-left-radius","-webkit-border-top-right-radius":"border-top-right-radius","-webkit-border-bottom-left-radius":"border-bottom-left-radius","-webkit-border-bottom-right-radius":"border-bottom-right-radius","-o-border-radius":"border-radius","-o-border-top-left-radius":"border-top-left-radius","-o-border-top-right-radius":"border-top-right-radius","-o-border-bottom-left-radius":"border-bottom-left-radius","-o-border-bottom-right-radius":"border-bottom-right-radius","-moz-border-radius":"border-radius","-moz-border-radius-topleft":"border-top-left-radius","-moz-border-radius-topright":"border-top-right-radius","-moz-border-radius-bottomleft":"border-bottom-left-radius","-moz-border-radius-bottomright":"border-bottom-right-radius","-moz-column-count":"column-count","-webkit-column-count":"column-count","-moz-column-gap":"column-gap","-webkit-column-gap":"column-gap","-moz-column-rule":"column-rule","-webkit-column-rule":"column-rule","-moz-column-rule-style":"column-rule-style","-webkit-column-rule-style":"column-rule-style","-moz-column-rule-color":"column-rule-color","-webkit-column-rule-color":"column-rule-color","-moz-column-rule-width":"column-rule-width","-webkit-column-rule-width":"column-rule-width","-moz-column-width":"column-width","-webkit-column-width":"column-width","-webkit-column-span":"column-span","-webkit-columns":"columns","-moz-box-shadow":"box-shadow","-webkit-box-shadow":"box-shadow","-moz-transform":"transform","-webkit-transform":"transform","-o-transform":"transform","-ms-transform":"transform","-moz-transform-origin":"transform-origin","-webkit-transform-origin":"transform-origin","-o-transform-origin":"transform-origin","-ms-transform-origin":"transform-origin","-moz-box-sizing":"box-sizing","-webkit-box-sizing":"box-sizing"}
parser.addListener("startrule",startRule)
parser.addListener("startfontface",startRule)
parser.addListener("startpage",startRule)
parser.addListener("startpagemargin",startRule)
parser.addListener("startkeyframerule",startRule)
parser.addListener("startviewport",startRule)
parser.addListener("property",function(event){var name=event.property.text.toLowerCase()
properties[name]||(properties[name]=[])
properties[name].push({name:event.property,value:event.value,pos:num++})})
parser.addListener("endrule",endRule)
parser.addListener("endfontface",endRule)
parser.addListener("endpage",endRule)
parser.addListener("endpagemargin",endRule)
parser.addListener("endkeyframerule",endRule)
parser.addListener("endviewport",endRule)}})
CSSLint.addRule({id:"zero-units",name:"Disallow units for 0 values",desc:"You don't need to specify units when a value is 0.",url:"https://github.com/CSSLint/csslint/wiki/Disallow-units-for-zero-values",browsers:"All",init:function(parser,reporter){"use strict"
var rule=this
parser.addListener("property",function(event){for(var parts=event.value.parts,i=0,len=parts.length;i<len;){!parts[i].units&&"percentage"!==parts[i].type||0!==parts[i].value||"time"===parts[i].type||reporter.report("Values of 0 shouldn't have units specified.",parts[i].line,parts[i].col,rule)
i++}})}})
!function(){"use strict"
var xmlEscape=function(str){return str&&str.constructor===String?str.replace(/["&><]/g,function(match){switch(match){case'"':return"&quot;"
case"&":return"&amp;"
case"<":return"&lt;"
case">":return"&gt;"}}):""}
CSSLint.addFormatter({id:"checkstyle-xml",name:"Checkstyle XML format",startFormat:function(){return'<?xml version="1.0" encoding="utf-8"?><checkstyle>'},endFormat:function(){return"</checkstyle>"},readError:function(filename,message){return'<file name="'+xmlEscape(filename)+'"><error line="0" column="0" severty="error" message="'+xmlEscape(message)+'"></error></file>'},formatResults:function(results,filename){var messages=results.messages,output=[],generateSource=function(rule){return rule&&"name"in rule?"net.csslint."+rule.name.replace(/\s/g,""):""}
if(messages.length>0){output.push('<file name="'+filename+'">')
CSSLint.Util.forEach(messages,function(message){message.rollup||output.push('<error line="'+message.line+'" column="'+message.col+'" severity="'+message.type+'" message="'+xmlEscape(message.message)+'" source="'+generateSource(message.rule)+'"/>')})
output.push("</file>")}return output.join("")}})}()
CSSLint.addFormatter({id:"compact",name:"Compact, 'porcelain' format",startFormat:function(){"use strict"
return""},endFormat:function(){"use strict"
return""},formatResults:function(results,filename,options){"use strict"
var messages=results.messages,output=""
options=options||{}
var capitalize=function(str){return str.charAt(0).toUpperCase()+str.slice(1)}
if(0===messages.length)return options.quiet?"":filename+": Lint Free!"
CSSLint.Util.forEach(messages,function(message){message.rollup?output+=filename+": "+capitalize(message.type)+" - "+message.message+" ("+message.rule.id+")\n":output+=filename+": line "+message.line+", col "+message.col+", "+capitalize(message.type)+" - "+message.message+" ("+message.rule.id+")\n"})
return output}})
CSSLint.addFormatter({id:"csslint-xml",name:"CSSLint XML format",startFormat:function(){"use strict"
return'<?xml version="1.0" encoding="utf-8"?><csslint>'},endFormat:function(){"use strict"
return"</csslint>"},formatResults:function(results,filename){"use strict"
var messages=results.messages,output=[],escapeSpecialCharacters=function(str){return str&&str.constructor===String?str.replace(/"/g,"'").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}
if(messages.length>0){output.push('<file name="'+filename+'">')
CSSLint.Util.forEach(messages,function(message){message.rollup?output.push('<issue severity="'+message.type+'" reason="'+escapeSpecialCharacters(message.message)+'" evidence="'+escapeSpecialCharacters(message.evidence)+'"/>'):output.push('<issue line="'+message.line+'" char="'+message.col+'" severity="'+message.type+'" reason="'+escapeSpecialCharacters(message.message)+'" evidence="'+escapeSpecialCharacters(message.evidence)+'"/>')})
output.push("</file>")}return output.join("")}})
CSSLint.addFormatter({id:"json",name:"JSON",startFormat:function(){"use strict"
this.json=[]
return""},endFormat:function(){"use strict"
var ret=""
this.json.length>0&&(ret=1===this.json.length?JSON.stringify(this.json[0]):JSON.stringify(this.json))
return ret},formatResults:function(results,filename,options){"use strict";(results.messages.length>0||!options.quiet)&&this.json.push({filename:filename,messages:results.messages,stats:results.stats})
return""}})
CSSLint.addFormatter({id:"junit-xml",name:"JUNIT XML format",startFormat:function(){"use strict"
return'<?xml version="1.0" encoding="utf-8"?><testsuites>'},endFormat:function(){"use strict"
return"</testsuites>"},formatResults:function(results,filename){"use strict"
var messages=results.messages,output=[],tests={error:0,failure:0},generateSource=function(rule){return rule&&"name"in rule?"net.csslint."+rule.name.replace(/\s/g,""):""},escapeSpecialCharacters=function(str){return str&&str.constructor===String?str.replace(/"/g,"'").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}
if(messages.length>0){messages.forEach(function(message){var type="warning"===message.type?"error":message.type
if(!message.rollup){output.push('<testcase time="0" name="'+generateSource(message.rule)+'">')
output.push("<"+type+' message="'+escapeSpecialCharacters(message.message)+'"><![CDATA['+message.line+":"+message.col+":"+escapeSpecialCharacters(message.evidence)+"]]></"+type+">")
output.push("</testcase>")
tests[type]+=1}})
output.unshift('<testsuite time="0" tests="'+messages.length+'" skipped="0" errors="'+tests.error+'" failures="'+tests.failure+'" package="net.csslint" name="'+filename+'">')
output.push("</testsuite>")}return output.join("")}})
CSSLint.addFormatter({id:"lint-xml",name:"Lint XML format",startFormat:function(){"use strict"
return'<?xml version="1.0" encoding="utf-8"?><lint>'},endFormat:function(){"use strict"
return"</lint>"},formatResults:function(results,filename){"use strict"
var messages=results.messages,output=[],escapeSpecialCharacters=function(str){return str&&str.constructor===String?str.replace(/"/g,"'").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):""}
if(messages.length>0){output.push('<file name="'+filename+'">')
CSSLint.Util.forEach(messages,function(message){if(message.rollup)output.push('<issue severity="'+message.type+'" reason="'+escapeSpecialCharacters(message.message)+'" evidence="'+escapeSpecialCharacters(message.evidence)+'"/>')
else{var rule=""
message.rule&&message.rule.id&&(rule='rule="'+escapeSpecialCharacters(message.rule.id)+'" ')
output.push("<issue "+rule+'line="'+message.line+'" char="'+message.col+'" severity="'+message.type+'" reason="'+escapeSpecialCharacters(message.message)+'" evidence="'+escapeSpecialCharacters(message.evidence)+'"/>')}})
output.push("</file>")}return output.join("")}})
CSSLint.addFormatter({id:"text",name:"Plain Text",startFormat:function(){"use strict"
return""},endFormat:function(){"use strict"
return""},formatResults:function(results,filename,options){"use strict"
var messages=results.messages,output=""
options=options||{}
if(0===messages.length)return options.quiet?"":"\n\ncsslint: No errors in "+filename+"."
output="\n\ncsslint: There "
1===messages.length?output+="is 1 problem":output+="are "+messages.length+" problems"
output+=" in "+filename+"."
var pos=filename.lastIndexOf("/"),shortFilename=filename;-1===pos&&(pos=filename.lastIndexOf("\\"))
pos>-1&&(shortFilename=filename.substring(pos+1))
CSSLint.Util.forEach(messages,function(message,i){output=output+"\n\n"+shortFilename
if(message.rollup){output+="\n"+(i+1)+": "+message.type
output+="\n"+message.message}else{output+="\n"+(i+1)+": "+message.type+" at line "+message.line+", col "+message.col
output+="\n"+message.message
output+="\n"+message.evidence}})
return output}})
return CSSLint}()
