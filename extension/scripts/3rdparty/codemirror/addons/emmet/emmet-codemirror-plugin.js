!function(factory){("object"!=typeof exports||"undefined"==typeof module)&&"function"==typeof define&&define.amd?define(factory):factory()}(function(){"use strict"
var StreamReader=function(string){this.string=string
this.pos=this.string.length}
StreamReader.prototype.sol=function(){return 0===this.pos}
StreamReader.prototype.peek=function(offset){return this.string.charCodeAt(this.pos-1+(offset||0))}
StreamReader.prototype.prev=function(){if(!this.sol())return this.string.charCodeAt(--this.pos)}
StreamReader.prototype.eat=function(ok){ok="function"==typeof ok?ok(this.peek()):ok===this.peek()
ok&&this.pos--
return ok}
StreamReader.prototype.eatWhile=function(match){for(var start=this.pos;this.eat(match););return this.pos<start}
var SINGLE_QUOTE=39,DOUBLE_QUOTE=34,ESCAPE=92
function isQuote(c){return c===SINGLE_QUOTE||c===DOUBLE_QUOTE}var TAB=9,SPACE=32,COLON=58,EQUALS=61,isAtHTMLTag=function(stream){var start=stream.pos
if(!stream.eat(62))return!1
var ok=!1
stream.eat(47)
for(;!stream.sol();){stream.eatWhile(isWhiteSpace)
if(eatIdent(stream)){if(stream.eat(47)){ok=stream.eat(60)
break}if(stream.eat(60)){ok=!0
break}if(stream.eat(isWhiteSpace))continue
if(stream.eat(EQUALS)){ok=eatIdent(stream)
break}if(eatAttributeWithUnquotedValue(stream)){ok=!0
break}break}if(!function(stream){return function(stream){var start=stream.pos
if(function(stream){var start=stream.pos,quote=stream.prev()
if(isQuote(quote))for(;!stream.sol();)if(stream.prev()===quote&&stream.peek()!==ESCAPE)return 1
stream.pos=start}(stream)&&stream.eat(EQUALS)&&eatIdent(stream))return!0
stream.pos=start
return!1}(stream)||eatAttributeWithUnquotedValue(stream)}(stream))break}stream.pos=start
return ok}
function eatAttributeWithUnquotedValue(stream){var start=stream.pos
if(stream.eatWhile(isUnquotedValue)&&stream.eat(EQUALS)&&eatIdent(stream))return!0
stream.pos=start
return!1}function eatIdent(stream){return stream.eatWhile(isIdent)}function isIdent(c){return c===COLON||function(c){return 65<=(c&=-33)&&c<=90}(c)||function(c){return 47<c&&c<58}(c)}function isWhiteSpace(c){return c===SPACE||c===TAB}function isUnquotedValue(c){return c&&c!==EQUALS&&!isWhiteSpace(c)&&!isQuote(c)}var prototypeAccessors$1$1=function(ch){return ch.charCodeAt(0)},SQUARE_BRACE_L=prototypeAccessors$1$1("["),SQUARE_BRACE_R=prototypeAccessors$1$1("]"),ROUND_BRACE_L=prototypeAccessors$1$1("("),ROUND_BRACE_R=prototypeAccessors$1$1(")"),CURLY_BRACE_L=prototypeAccessors$1$1("{"),CURLY_BRACE_R=prototypeAccessors$1$1("}"),specialChars=new Set("#.*:$-_!@%^+>/".split("").map(prototypeAccessors$1$1)),bracePairs=(new Map).set(SQUARE_BRACE_L,SQUARE_BRACE_R).set(ROUND_BRACE_L,ROUND_BRACE_R).set(CURLY_BRACE_L,CURLY_BRACE_R)
function extractAbbreviation$1(abbreviation,pos,lookAhead){pos=Math.min(abbreviation.length,Math.max(0,null==pos?abbreviation.length:pos))
null!=lookAhead&&!0!==lookAhead||(pos=function(line,pos){isQuote(line.charCodeAt(pos))&&pos++
for(;isCloseBrace(line.charCodeAt(pos));)pos++
return pos}(abbreviation,pos))
var c,stream=new StreamReader(abbreviation)
stream.pos=pos
for(var stack=[];!stream.sol();){if(isCloseBrace(c=stream.peek()))stack.push(c)
else if(function(c){return c===SQUARE_BRACE_L||c===ROUND_BRACE_L||c===CURLY_BRACE_L}(c)){if(stack.pop()!==bracePairs.get(c))break}else{if(has(stack,SQUARE_BRACE_R)||has(stack,CURLY_BRACE_R)){stream.pos--
continue}if(isAtHTMLTag(stream)||!function(c){return 64<c&&c<91||96<c&&c<123||47<c&&c<58||specialChars.has(c)}(c))break}stream.pos--}if(!stack.length&&stream.pos!==pos){abbreviation=abbreviation.slice(stream.pos,pos).replace(/^[\*\+\>\^]+/,"")
return{abbreviation:abbreviation,location:pos-abbreviation.length}}}function has(arr,value){return-1!==arr.indexOf(value)}function isCloseBrace(c){return c===SQUARE_BRACE_R||c===ROUND_BRACE_R||c===CURLY_BRACE_R}var defaultOptions$1={indent:"\t",tagCase:"",attributeCase:"",attributeQuotes:"double",format:!0,formatSkip:["html"],formatForce:["body"],inlineBreak:3,compactBooleanAttributes:!1,booleanAttributes:["contenteditable","seamless","async","autofocus","autoplay","checked","controls","defer","disabled","formnovalidate","hidden","ismap","loop","multiple","muted","novalidate","readonly","required","reversed","selected","typemustmatch"],selfClosingStyle:"html",inlineElements:["a","abbr","acronym","applet","b","basefont","bdo","big","br","button","cite","code","del","dfn","em","font","i","iframe","img","input","ins","kbd","label","map","object","q","s","samp","select","small","span","strike","strong","sub","sup","textarea","tt","u","var"]},Profile=function(options){this.options=Object.assign({},defaultOptions$1,options)
this.quoteChar="single"===this.options.attributeQuotes?"'":'"'}
Profile.prototype.get=function(name){return this.options[name]}
Profile.prototype.quote=function(str){return""+this.quoteChar+(null!=str?str:"")+this.quoteChar}
Profile.prototype.name=function(name$1){return strcase(name$1,this.options.tagCase)}
Profile.prototype.attribute=function(attr){return strcase(attr,this.options.attributeCase)}
Profile.prototype.isBooleanAttribute=function(attr){return attr.options.boolean||-1!==this.get("booleanAttributes").indexOf((attr.name||"").toLowerCase())}
Profile.prototype.selfClose=function(){switch(this.options.selfClosingStyle){case"xhtml":return" /"
case"xml":return"/"
default:return""}}
Profile.prototype.indent=function(level){level=level||0
for(var output="";level--;)output+=this.options.indent
return output}
Profile.prototype.isInline=function(node){return"string"==typeof node?-1!==this.get("inlineElements").indexOf(node.toLowerCase()):null!=node.name?this.isInline(node.name):node.isTextOnly}
Profile.prototype.field=function(index,placeholder){return this.options.field(index,placeholder)}
function strcase(string,type){type&&(string="upper"===type?string.toUpperCase():string.toLowerCase())
return string}var Snippet=function(key,value){this.key=key
this.value=value},SnippetsStorage=function(data){this._string=new Map
this._regexp=new Map
this._disabled=!1
this.load(data)},prototypeAccessors$1$1={disabled:{}}
prototypeAccessors$1$1.disabled.get=function(){return this._disabled}
SnippetsStorage.prototype.disable=function(){this._disabled=!0}
SnippetsStorage.prototype.enable=function(){this._disabled=!1}
SnippetsStorage.prototype.set=function(key,value){var this$1=this
if("string"==typeof key)key.split("|").forEach(function(k){return this$1._string.set(k,new Snippet(k,value))})
else{if(!(key instanceof RegExp))throw new Error("Unknow snippet key: "+key)
this._regexp.set(key,new Snippet(key,value))}return this}
SnippetsStorage.prototype.get=function(key){if(!this.disabled){if(this._string.has(key))return this._string.get(key)
for(var keys=Array.from(this._regexp.keys()),i=0,il=keys.length;i<il;i++)if(keys[i].test(key))return this._regexp.get(keys[i])}}
SnippetsStorage.prototype.load=function(data){var this$1=this
this.reset()
data instanceof Map?data.forEach(function(value,key){return this$1.set(key,value)}):data&&"object"==typeof data&&Object.keys(data).forEach(function(key){return this$1.set(key,data[key])})}
SnippetsStorage.prototype.reset=function(){this._string.clear()
this._regexp.clear()}
SnippetsStorage.prototype.values=function(){if(this.disabled)return[]
var string=Array.from(this._string.values()),regexp=Array.from(this._regexp.values())
return string.concat(regexp)}
Object.defineProperties(SnippetsStorage.prototype,prototypeAccessors$1$1)
var SnippetsRegistry=function(data){var this$1=this
this._registry=[]
Array.isArray(data)?data.forEach(function(snippets,level){return this$1.add(level,snippets)}):"object"==typeof data&&this.add(data)}
SnippetsRegistry.prototype.get=function(level){for(var i=0;i<this._registry.length;i++){var item=this._registry[i]
if(item.level===level)return item.store}}
SnippetsRegistry.prototype.add=function(level,store){if(null!=level&&"object"==typeof level){store=level
level=0}store=new SnippetsStorage(store)
this.remove(level)
this._registry.push({level:level,store:store})
this._registry.sort(function(a,b){return b.level-a.level})
return store}
SnippetsRegistry.prototype.remove=function(data){this._registry=this._registry.filter(function(item){return item.level!==data&&item.store!==data})}
SnippetsRegistry.prototype.resolve=function(name){for(var i=0;i<this._registry.length;i++){var snippet=this._registry[i].store.get(name)
if(snippet)return snippet}}
SnippetsRegistry.prototype.all=function(options){options=options||{}
function fillResult(snippet){var type=snippet.key instanceof RegExp?"regexp":"string"
options.type&&options.type!==type||result.has(snippet.key)||result.set(snippet.key,snippet)}var result=new Map
this._registry.forEach(function(item){item.store.values().forEach(fillResult)})
return Array.from(result.values())}
SnippetsRegistry.prototype.clear=function(){this._registry.length=0}
var Attribute=function(name,value,options){this.name=name
this.value=null!=value?value:null
this.options=options||{}}
Attribute.prototype.clone=function(){return new Attribute(this.name,this.value,Object.assign({},this.options))}
Attribute.prototype.valueOf=function(){return this.name+'="'+this.value+'"'}
var Node=function(name,attributes){var this$1=this
this.name=name||null
this.value=null
this.repeat=null
this.selfClosing=!1
this.children=[]
this.parent=null
this.next=null
this.previous=null
this._attributes=[]
Array.isArray(attributes)&&attributes.forEach(function(attr){return this$1.setAttribute(attr)})},prototypeAccessors$1$1={attributes:{},attributesMap:{},isGroup:{},isTextOnly:{},firstChild:{},lastChild:{},childIndex:{},nextSibling:{},previousSibling:{},classList:{}}
prototypeAccessors$1$1.attributes.get=function(){return this._attributes}
prototypeAccessors$1$1.attributesMap.get=function(){return this.attributes.reduce(function(out,attr){out[attr.name]=attr.options.boolean?attr.name:attr.value
return out},{})}
prototypeAccessors$1$1.isGroup.get=function(){return!this.name&&!this.value&&!this._attributes.length}
prototypeAccessors$1$1.isTextOnly.get=function(){return!this.name&&!!this.value&&!this._attributes.length}
prototypeAccessors$1$1.firstChild.get=function(){return this.children[0]}
prototypeAccessors$1$1.lastChild.get=function(){return this.children[this.children.length-1]}
prototypeAccessors$1$1.childIndex.get=function(){return this.parent?this.parent.children.indexOf(this):-1}
prototypeAccessors$1$1.nextSibling.get=function(){return this.next}
prototypeAccessors$1$1.previousSibling.get=function(){return this.previous}
prototypeAccessors$1$1.classList.get=function(){var attr=this.getAttribute("class")
return attr&&attr.value?attr.value.split(/\s+/g).filter(uniqueClass):[]}
Node.prototype.create=function(name,attributes){return new Node(name,attributes)}
Node.prototype.setAttribute=function(curAttr,attr){attr=createAttribute(curAttr,attr),curAttr=this.getAttribute(curAttr)
curAttr?this.replaceAttribute(curAttr,attr):this._attributes.push(attr)}
Node.prototype.hasAttribute=function(name){return!!this.getAttribute(name)}
Node.prototype.getAttribute=function(name){"object"==typeof name&&(name=name.name)
for(var i=0;i<this._attributes.length;i++){var attr=this._attributes[i]
if(attr.name===name)return attr}}
Node.prototype.replaceAttribute=function(ix,newName,newValue){"string"==typeof ix&&(ix=this.getAttribute(ix))
ix=this._attributes.indexOf(ix);-1!==ix&&this._attributes.splice(ix,1,createAttribute(newName,newValue))}
Node.prototype.removeAttribute=function(ix){"string"==typeof ix&&(ix=this.getAttribute(ix))
ix=this._attributes.indexOf(ix);-1!==ix&&this._attributes.splice(ix,1)}
Node.prototype.clearAttributes=function(){this._attributes.length=0}
Node.prototype.addClass=function(token){token=normalize(token)
this.hasAttribute("class")?token&&!this.hasClass(token)&&this.setAttribute("class",this.classList.concat(token).join(" ")):this.setAttribute("class",token)}
Node.prototype.hasClass=function(token){return-1!==this.classList.indexOf(normalize(token))}
Node.prototype.removeClass=function(token){token=normalize(token)
this.hasClass(token)&&this.setAttribute("class",this.classList.filter(function(name){return name!==token}).join(" "))}
Node.prototype.appendChild=function(node){this.insertAt(node,this.children.length)}
Node.prototype.insertBefore=function(newNode,refNode){this.insertAt(newNode,this.children.indexOf(refNode))}
Node.prototype.insertAt=function(node,pos){if(pos<0||pos>this.children.length)throw new Error("Unable to insert node: position is out of child list range")
var prev=this.children[pos-1],next=this.children[pos]
node.remove();(node.parent=this).children.splice(pos,0,node)
prev&&((node.previous=prev).next=node)
next&&((node.next=next).previous=node)}
Node.prototype.removeChild=function(node){var ix=this.children.indexOf(node)
if(-1!==ix){this.children.splice(ix,1)
node.previous&&(node.previous.next=node.next)
node.next&&(node.next.previous=node.previous)
node.parent=node.next=node.previous=null}}
Node.prototype.remove=function(){this.parent&&this.parent.removeChild(this)}
Node.prototype.clone=function(deep){var clone=new Node(this.name)
clone.value=this.value
clone.selfClosing=this.selfClosing
this.repeat&&(clone.repeat=Object.assign({},this.repeat))
this._attributes.forEach(function(attr){return clone.setAttribute(attr.clone())})
deep&&this.children.forEach(function(child){return clone.appendChild(child.clone(!0))})
return clone}
Node.prototype.walk=function(fn,_level){_level=_level||0
for(var ctx=this.firstChild;ctx;){var next=ctx.next
if(!1===fn(ctx,_level)||!1===ctx.walk(fn,_level+1))return!1
ctx=next}}
Node.prototype.use=function(fn){for(var arguments$1=arguments,args=[this],i=1;i<arguments.length;i++)args.push(arguments$1[i])
fn.apply(null,args)
return this}
Node.prototype.toString=function(){var this$1=this,attrs=this.attributes.map(function(attr){var opt=(attr=this$1.getAttribute(attr.name)).options,out=(opt&&opt.implied?"!":"")+(attr.name||"")
opt&&opt.boolean?out+=".":null!=attr.value&&(out+='="'+attr.value+'"')
return out}),out=""+(this.name||"")
attrs.length&&(out+="["+attrs.join(" ")+"]")
null!=this.value&&(out+="{"+this.value+"}")
this.selfClosing&&(out+="/")
if(this.repeat){out+="*"+(this.repeat.count||"")
null!=this.repeat.value&&(out+="@"+this.repeat.value)}return out}
Object.defineProperties(Node.prototype,prototypeAccessors$1$1)
function createAttribute(name,value){return name instanceof Attribute?name:"string"==typeof name?new Attribute(name,value):name&&"object"==typeof name?new Attribute(name.name,name.value,name.options):void 0}function normalize(str){return String(str).trim()}function uniqueClass(item,i,arr){return item&&arr.indexOf(item)===i}var StreamReader$1=function(string,start,end){null==end&&"string"==typeof string&&(end=string.length)
this.string=string
this.pos=this.start=start||0
this.end=end}
StreamReader$1.prototype.eof=function(){return this.pos>=this.end}
StreamReader$1.prototype.limit=function(start,end){return new this.constructor(this.string,start,end)}
StreamReader$1.prototype.peek=function(){return this.string.charCodeAt(this.pos)}
StreamReader$1.prototype.next=function(){if(this.pos<this.string.length)return this.string.charCodeAt(this.pos++)}
StreamReader$1.prototype.eat=function(ok){var ch=this.peek(),ok="function"==typeof ok?ok(ch):ch===ok
ok&&this.next()
return ok}
StreamReader$1.prototype.eatWhile=function(match){for(var start=this.pos;!this.eof()&&this.eat(match););return this.pos!==start}
StreamReader$1.prototype.backUp=function(n){this.pos-=n||1}
StreamReader$1.prototype.current=function(){return this.substring(this.start,this.pos)}
StreamReader$1.prototype.substring=function(start,end){return this.string.slice(start,end)}
StreamReader$1.prototype.error=function(message){var err=new Error(message+" at char "+(this.pos+1))
err.originalMessage=message
err.pos=this.pos
err.string=this.string
return err}
var SINGLE_QUOTE$1=39,DOUBLE_QUOTE$1=34,defaultOptions$2={escape:92,throws:!1},eatQuoted$1=function(stream,options){options=options?Object.assign({},defaultOptions$2,options):defaultOptions$2
var start=stream.pos,quote=stream.peek()
if(stream.eat(isQuote$1)){for(;!stream.eof();)switch(stream.next()){case quote:stream.start=start
return!0
case options.escape:stream.next()}stream.pos=start
if(options.throws)throw stream.error("Unable to consume quoted string")}return!1}
function isQuote$1(code){return code===SINGLE_QUOTE$1||code===DOUBLE_QUOTE$1}function isNumber$1(code){return 47<code&&code<58}function isAlpha$1(code,from,to){to=to||90
return(from=from||65)<=(code&=-33)&&code<=to}function isAlphaNumeric(code){return isNumber$1(code)||isAlpha$1(code)}function isWhiteSpace$1(code){return 32===code||9===code||160===code}function isSpace(code){return isWhiteSpace$1(code)||10===code||13===code}var defaultOptions$1$1={escape:92,throws:!1}
function eatPair(stream,open,close,options){options=options?Object.assign({},defaultOptions$1$1,options):defaultOptions$1$1
var start=stream.pos
if(stream.eat(open)){for(var ch,stack=1;!stream.eof();)if(!eatQuoted$1(stream,options))if((ch=stream.next())===open)stack++
else if(ch===close){if(!--stack){stream.start=start
return!0}}else ch===options.escape&&stream.next()
stream.pos=start
if(options.throws)throw stream.error("Unable to find matching pair for "+String.fromCharCode(open))}return!1}function consumeRepeat(stream){if(stream.eat(42)){stream.start=stream.pos
return{count:stream.eatWhile(isNumber$1)?+stream.current():null}}}function consumeQuoted(stream){if(eatQuoted$1(stream,opt))return stream.current().slice(1,-1)}function consumeTextNode(stream){return eatPair(stream,123,125,opt$1)?stream.current().slice(1,-1):null}function consumeAttributes(stream){if(!stream.eat(ATTR_OPEN))return null
for(var token,attr,result=[];!stream.eof();){stream.eatWhile(isWhiteSpace$1)
if(stream.eat(ATTR_CLOSE))return result
if(null!=(token=consumeQuoted(stream)))result.push({name:null,value:token})
else{if(!eatUnquoted(stream))throw stream.error("Expected attribute name")
token=stream.current()
if(reAttributeName.test(token)){attr=function(attr){var options={}
if(attr.charCodeAt(0)===EXCL){attr=attr.slice(1)
options.implied=!0}if(attr.charCodeAt(attr.length-1)===DOT$1){attr=attr.slice(0,attr.length-1)
options.boolean=!0}attr={name:attr}
Object.keys(options).length&&(attr.options=options)
return attr}(token)
result.push(attr)
if(stream.eat(EQUALS$1))if(null!=(token=consumeQuoted(stream)))attr.value=token
else if(null!=(token=consumeTextNode(stream))){attr.value=token
attr.options={before:"{",after:"}"}}else eatUnquoted(stream)&&(attr.value=stream.current())}else result.push({name:null,value:token})}}throw stream.error('Expected closing "]" brace')}var opt={throws:!0},opt$1={throws:!0},EXCL=33,DOT$1=46,EQUALS$1=61,ATTR_OPEN=91,ATTR_CLOSE=93,reAttributeName=/^\!?[\w\-:\$@]+\.?$/
function eatUnquoted(stream){var start=stream.pos
if(stream.eatWhile(isUnquoted)){stream.start=start
return 1}}function isUnquoted(code){return!isSpace(code)&&!isQuote$1(code)&&code!==ATTR_OPEN&&code!==ATTR_CLOSE&&code!==EQUALS$1}function eatName(stream){stream.start=stream.pos
stream.eatWhile(isName)
return stream.current()}function isName(code){return isAlphaNumeric(code)||45===code||58===code||36===code||64===code||33===code||95===code||37===code}function parse(root){for(var ch,stream=new StreamReader$1(root.trim()),root=new Node,ctx=root,groupStack=[];!stream.eof();)if(40!==(ch=stream.peek()))if(41!==ch){var node$2=function(stream){for(var next,start=stream.pos,node=new Node(eatName(stream));!stream.eof();)if(stream.eat(46))node.addClass(eatName(stream))
else if(stream.eat(35))node.setAttribute("id",eatName(stream))
else{if(stream.eat(47)){if(node.isGroup){stream.backUp(1)
throw stream.error("Unexpected self-closing indicator")}node.selfClosing=!0;(next=consumeRepeat(stream))&&(node.repeat=next)
break}if(next=consumeAttributes(stream))for(var i=0,il=next.length;i<il;i++)node.setAttribute(next[i])
else if(null!==(next=consumeTextNode(stream)))node.value=next
else{if(!(next=consumeRepeat(stream)))break
node.repeat=next}}if(start===stream.pos)throw stream.error("Unable to consume abbreviation node, unexpected "+stream.peek())
return node}(stream)
ctx.appendChild(node$2)
if(stream.eof())break
switch(stream.peek()){case 43:stream.next()
continue
case 62:stream.next()
ctx=node$2
continue
case 94:for(;stream.eat(94);)ctx=ctx.parent||ctx
continue}}else{var node=groupStack.pop()
if(!node)throw stream.error('Unexpected ")" group end')
var node$1=node[0],ctx=node[1]
stream.next()
if(node$1.repeat=consumeRepeat(stream))ctx.appendChild(node$1)
else{for(;node$1.firstChild;)ctx.appendChild(node$1.firstChild)
stream.eat(43)}}else{var node=new Node,groupCtx=groupStack.length?(groupCtx=groupStack)[groupCtx.length-1][0]:ctx
groupStack.push([node,groupCtx,stream.pos])
ctx=node
stream.next()}if(groupStack.length){stream.pos=groupStack.pop()[2]
throw stream.error("Expected group close")}return root}var index=function(tree){tree=parse(tree)
tree.walk(unroll)
return tree}
function unroll(node){if(node.repeat&&node.repeat.count){for(var i=1;i<node.repeat.count;i++){var clone=node.clone(!0)
clone.repeat.value=i
clone.walk(unroll)
node.parent.insertBefore(clone,node)}node.repeat.value=node.repeat.count}}var index$1=function(tree,registry){tree.walk(function(node){return function(node,registry){var stack=new Set,resolve=function(node){var childTarget=registry.resolve(node.name)
if(childTarget&&!stack.has(childTarget)){if("function"==typeof childTarget.value)return childTarget.value(node,registry,resolve)
var tree=index(childTarget.value)
stack.add(childTarget)
tree.walk(resolve)
stack.delete(childTarget)
childTarget=function(node){for(;node.children.length;)node=node.children[node.children.length-1]
return node}(tree)
!function(from,to){to.name=from.name
from.selfClosing&&(to.selfClosing=!0)
null!=from.value&&(to.value=from.value)
from.repeat&&(to.repeat=Object.assign({},from.repeat))
!function(from,to){!function(from,to){for(var classNames=from.classList,i=0;i<classNames.length;i++)to.addClass(classNames[i])}(from,to)
for(var attrMap=new Map,attrs=from.attributes,i=0;i<attrs.length;i++)attrMap.set(attrs[i].name,attrs[i].clone())
attrs=to.attributes.slice()
for(var i$1=0,attr=void 0,a=void 0;i$1<attrs.length;i$1++){attr=attrs[i$1]
if(attrMap.has(attr.name)){(a=attrMap.get(attr.name)).value=attr.value
a.options.implied&&(a.options.implied=!1)}else attrMap.set(attr.name,attr)
to.removeAttribute(attr)}for(var newAttrs=Array.from(attrMap.values()),i$2=0;i$2<newAttrs.length;i$2++)to.setAttribute(newAttrs[i$2])}(from,to)}(childTarget,node)
for(;tree.firstChild;)node.parent.insertBefore(tree.firstChild,node)
childTarget.parent.insertBefore(node,childTarget)
childTarget.remove()}}
resolve(node)}(node,registry)})
return tree}
var inlineElements=new Set("a,abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,code,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,select,small,span,strike,strong,sub,sup,textarea,tt,u,var".split(",")),elementMap={p:"span",ul:"li",ol:"li",table:"tr",tr:"td",tbody:"tr",thead:"tr",tfoot:"tr",colgroup:"col",select:"option",optgroup:"option",audio:"source",video:"source",object:"param",map:"area"}
function resolveImplicitName(parentName){parentName=(parentName||"").toLowerCase()
return elementMap[parentName]||(inlineElements.has(parentName)?"span":"div")}function implicitTags(tree){tree.walk(function(node){null==node.name&&node.attributes.length&&(node.name=resolveImplicitName(node.parent.name))})
return tree}function findUnescapedTokens(str,token){for(var result=new Set,tlen=token.length,pos=0;-1!==(pos=str.indexOf(token,pos));){result.add(pos)
pos+=tlen}if(result.size)for(var pos$1=0,len=str.length;pos$1<len;)"\\"===str[pos$1++]&&result.delete(pos$1++)
return Array.from(result).map(function(ix){return[ix,tlen]})}function replaceRanges(str,ranges,value){for(var i=ranges.length-1;0<=i;i--){var r=ranges[i]
str=str.substring(0,r[0])+("function"==typeof value?value(str.substr(r[0],r[1])):value)+str.substring(r[0]+r[1])}return str}function applyNumbering(tree){tree.walk(applyNumbering$1)
return tree}var numberingToken="$"
function applyNumbering$1(node){var repeater=function(node){for(;node;){if(node.repeat)return node.repeat
node=node.parent}}(node)
if(repeater&&null!=repeater.value){var value=repeater.value
node.name=replaceNumbering(node.name,value)
node.value=replaceNumbering(node.value,value)
node.attributes.forEach(function(attr){var copy=node.getAttribute(attr.name).clone()
copy.name=replaceNumbering(attr.name,value)
copy.value=replaceNumbering(attr.value,value)
node.replaceAttribute(attr.name,copy)})}return node}function replaceNumbering(str,value){return"string"!=typeof str?str:function(str,ranges,value){return function(str){var i=0,result="",len=str.length
for(;i<len;){var ch=str[i++]
result+="\\"===ch?str[i++]||"":ch}return result}(replaceRanges(str,ranges,function(token){for(var _value=String(value);_value.length<token.length;)_value="0"+_value
return _value}))}(str,function(str){return findUnescapedTokens(str||"",numberingToken).reduce(function(out,range$$1){if(!/[#{]/.test(str[range$$1[0]+1]||"")){var lastRange=out[out.length-1]
lastRange&&lastRange[0]+lastRange[1]===range$$1[0]?lastRange[1]+=range$$1[1]:out.push(range$$1)}return out},[])}(str),value)}var placeholder="$#",caret="|",reUrl=/^((?:https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,reEmail=/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,reProto=/^([a-z]+:)?\/\//i
function prepare(tree,amount){amount=amount||1
tree.walk(function(node){if(node.repeat&&null===node.repeat.count){for(var i=0;i<amount;i++){var clone=node.clone(!0)
clone.repeat.implicit=!0
clone.repeat.count=amount
clone.repeat.value=i+1
clone.repeat.index=i
node.parent.insertBefore(clone,node)}node.remove()}})
return tree}function insert(tree,content){if(Array.isArray(content)&&content.length){var updated=!1
tree.walk(function(node){if(node.repeat&&node.repeat.implicit){updated=!0
!function(node,content){var inserted=insertContentIntoPlaceholder(node,content)
node.walk(function(child){return inserted|=insertContentIntoPlaceholder(child,content)})
inserted||setNodeContent(findDeepestNode$1(node),content)}(node,content[node.repeat.index])}})
updated||setNodeContent(findDeepestNode$1(tree),content.join("\n"))}return tree}function insertContentIntoPlaceholder(node,content){var state={replaced:!1}
node.value=replacePlaceholder(node.value,content,state)
node.attributes.forEach(function(attr){attr.value&&node.setAttribute(attr.name,replacePlaceholder(attr.value,content,state))})
return state.replaced}function replacePlaceholder(str,value,_state){if("string"==typeof str){var ranges=findUnescapedTokens(str,placeholder)
if(ranges.length){_state&&(_state.replaced=!0)
str=replaceRanges(str,ranges,value)}}return str}function findDeepestNode$1(node){for(;node.children.length;)node=node.children[node.children.length-1]
return node}function setNodeContent(node,content){if(node.value){var ranges=findUnescapedTokens(node.value,caret)
if(ranges.length){node.value=replaceRanges(node.value,ranges,content)
return}}(node.name.toLowerCase("a")||node.hasAttribute("href"))&&(reUrl.test(content)?node.setAttribute("href",(reProto.test(content)?"":"http://")+content):reEmail.test(content)&&node.setAttribute("href","mailto:"+content))
node.value=content}function blockCandidates1(className){return/^[a-z]\-/i.test(className)}function blockCandidates2(className){return/^[a-z]/i.test(className)}var defaultOptions$3={element:"__",modifier:"_"},reElement=/^(-+)([a-z0-9]+)/i,reModifier=/^(_+)([a-z0-9]+)/i
function getBlockName(node,lookup,prefix){for(var depth=1<prefix.length?prefix.length:0;node.parent&&depth--;)node=node.parent
return lookup.get(node)}function find(arr,filter){return arr.filter(filter)[0]}function replace(node,attr,newName){attr=node.getAttribute(attr)
attr&&(attr.name=newName)}var reSupporterNames=/^xsl:(variable|with\-param)$/i,supportedAddons={bem:function(tree,options){options=Object.assign({},defaultOptions$3,options)
tree.walk(function(node){return function(node,options){var classNames=node.classList.reduce(function(out,cl){var ix=cl.indexOf(options.modifier);-1!==ix&&out.add(cl.slice(0,ix))
return out.add(cl)},new Set)
classNames.size&&node.setAttribute("class",Array.from(classNames).join(" "))}(node,options)})
var lookup=function(tree){var lookup=new Map
tree.walk(function(node){var classNames=node.classList
classNames.length&&lookup.set(node,find(classNames,blockCandidates1)||find(classNames,blockCandidates2)||lookup.get(node.parent))})
return lookup}(tree)
tree.walk(function(node){return function(node,lookup,options){var classNames=node.classList.reduce(function(out,cl){var prefix,m,originalClass=cl
if(m=cl.match(reElement)){prefix=getBlockName(node,lookup,m[1])+options.element+m[2]
out.add(prefix)
cl=cl.slice(m[0].length)}for(;m=cl.match(reModifier);){if(!prefix){prefix=getBlockName(node,lookup,m[1])
out.add(prefix)}out.add(""+prefix+options.modifier+m[2])
cl=cl.slice(m[0].length)}cl===originalClass&&out.add(originalClass)
return out},new Set)
node.setAttribute("class",Array.from(classNames).join(" "))}(node,lookup,options)})
return tree},jsx:function(tree){tree.walk(function(node){replace(node,"class","className")
replace(node,"for","htmlFor")})
return tree},xsl:function(tree){tree.walk(function(node){reSupporterNames.test(node.name||"")&&(node.children.length||node.value)&&node.removeAttribute("select")})
return tree}},addons=function(tree,addons){Object.keys(addons||{}).forEach(function(key){if(key in supportedAddons){var addonOpt="object"==typeof addons[key]?addons[key]:null
tree=tree.use(supportedAddons[key],addonOpt)}})
return tree},index$2=function(tree,content,appliedAddons){if("string"==typeof content)content=[content]
else if(content&&"object"==typeof content&&!Array.isArray(content)){appliedAddons=content
content=null}return tree.use(implicitTags).use(prepare,Array.isArray(content)?content.length:null).use(applyNumbering).use(insert,content).use(addons,appliedAddons)}
function replaceVariables(tree,variables){variables=variables||{}
tree.walk(function(node){return function(node,variables){for(var attrs=node.attributes,i=0,il=attrs.length;i<il;i++){var attr=attrs[i]
"string"==typeof attr.value&&node.setAttribute(attr.name,replaceInString(attr.value,variables))}null!=node.value&&(node.value=replaceInString(node.value,variables))
return node}(node,variables)})
return tree}function replaceInString(string,variables){for(var model=function(string){var m,reVariable=/\$\{([a-z][\w\-]*)\}/gi,variables=[],tokens=new Map
for(;m=reVariable.exec(string);)tokens.set(m.index,m)
if(tokens.size){for(var start=0,pos=0,len=string.length,output="";pos<len;)if(92===string.charCodeAt(pos)&&tokens.has(pos+1)){var token=tokens.get(pos+1)
output+=string.slice(start,pos)+token[0]
start=pos=token.index+token[0].length
tokens.delete(pos+1)}else pos++
string=output+string.slice(start)
for(var validMatches=Array.from(tokens.values()),i=0,il=validMatches.length;i<il;i++){var token$1=validMatches[i]
variables.push({name:token$1[1],location:token$1.index,length:token$1[0].length})}}return{string:string,variables:variables}}(string),offset=0,output="",i=0,il=model.variables.length;i<il;i++){var v=model.variables[i],value=v.name in variables?variables[v.name]:v.name
"function"==typeof value&&(value=value(model.string,v,offset+v.location))
output+=model.string.slice(offset,v.location)+value
offset=v.location+v.length}return output+model.string.slice(offset)}var DOLLAR=36,COLON$1=58,ESCAPE$1=92,OPEN_BRACE=123,CLOSE_BRACE=125
function parse$2$1(string){for(var pos,field,stream=new StreamReader$1(string),fields=[],cleanString="",offset=0;!stream.eof();){field=stream.peek()
pos=stream.pos
if(field===ESCAPE$1){stream.next()
stream.next()}else if(field=function(stream,location){var start=stream.pos
if(stream.eat(DOLLAR)){var index=consumeIndex(stream),placeholder=""
if(null!=index)return new Field(index,placeholder,location)
if(stream.eat(OPEN_BRACE)&&null!=(index=consumeIndex(stream))){stream.eat(COLON$1)&&(placeholder=function(stream){var code,stack=[]
stream.start=stream.pos
for(;!stream.eof();){if((code=stream.peek())===OPEN_BRACE)stack.push(stream.pos)
else if(code===CLOSE_BRACE){if(!stack.length)break
stack.pop()}stream.next()}if(stack.length)throw stream.error('Unable to find matching "}" for curly brace at '+stack.pop())
return stream.current()}(stream))
if(stream.eat(CLOSE_BRACE))return new Field(index,placeholder,location)}}stream.pos=start}(stream,cleanString.length+pos-offset)){fields.push(field)
cleanString+=stream.string.slice(offset,pos)+field.placeholder
offset=stream.pos}else stream.next()}return new FieldString(cleanString+stream.string.slice(offset),fields)}function createToken(index,placeholder){return placeholder?"${"+index+":"+placeholder+"}":"${"+index+"}"}function consumeIndex(stream){stream.start=stream.pos
if(stream.eatWhile(isNumber$1))return Number(stream.current())}var Field=function(index,placeholder,location){this.index=index
this.placeholder=placeholder
this.location=location
this.length=this.placeholder.length},FieldString=function(string,fields){this.string=string
this.fields=fields}
FieldString.prototype.mark=function(token){return function(string,ordered,token){token=token||createToken
var ordered=ordered.map(function(field,order){return{order:order,field:field,end:field.location+field.length}}).sort(function(a,b){return a.end-b.end||a.order-b.order}),offset=0
return ordered.map(function(item){var placeholder=string.substr(item.field.location,item.field.length),prefix=string.slice(offset,item.field.location)
offset=item.end
return prefix+token(item.field.index,placeholder)}).join("")+string.slice(offset)}(this.string,this.fields,token)}
FieldString.prototype.toString=function(){return string}
function defaultFieldsRenderer(text){return text}var OutputNode=function(node,fieldsRenderer,options){if("object"==typeof fieldsRenderer){options=fieldsRenderer
fieldsRenderer=null}this.node=node
this._fieldsRenderer=fieldsRenderer||defaultFieldsRenderer
this.open=null
this.beforeOpen=""
this.afterOpen=""
this.close=null
this.beforeClose=""
this.afterClose=""
this.text=null
this.beforeText=""
this.afterText=""
this.indent=""
this.newline=""
options&&Object.assign(this,options)}
OutputNode.prototype.clone=function(){return new this.constructor(this.node,this)}
OutputNode.prototype.indentText=function(nl){var this$1=this,lines=function(text){return(text||"").split(/\r\n|\r|\n/g)}(nl)
if(1===lines.length)return nl
nl=this.newline||this.indent?this.newline:" "
return lines.map(function(line,i){return i?this$1.indent+line:line}).join(nl)}
OutputNode.prototype.renderFields=function(text){return this._fieldsRenderer(text)}
OutputNode.prototype.toString=function(children){var open=this._wrap(this.open,this.beforeOpen,this.afterOpen),close=this._wrap(this.close,this.beforeClose,this.afterClose)
return open+this._wrap(this.text,this.beforeText,this.afterText)+(null!=children?children:"")+close}
OutputNode.prototype._wrap=function(str,before,after){after=null!=after?after:""
if(null==str)return""
str=(before=null!=before?before:"")?str.replace(/^\s+/,""):str
str=after?str.replace(/\s+$/,""):str
return before+this.indentText(str)+after}
var defaultField=function(index,placeholder){return placeholder||""}
function render(tree,field,formatter){if(void 0===formatter){formatter=field
field=null}field=field||defaultField
var fieldState={index:1}
return function run(nodes,formatter,fieldsRenderer){return nodes.filter(notGroup).map(function(node){var outNode=formatter(new OutputNode(node,fieldsRenderer))
return outNode?outNode.toString(run(node.children,formatter,fieldsRenderer)):""}).join("")}(tree.children,formatter,function(text){return null==text?field(fieldState.index++):function(model,fieldState){var model="object"==typeof model?model:parse$2$1(model),largestIndex=-1
model.fields.forEach(function(field){field.index+=fieldState.index
field.index>largestIndex&&(largestIndex=field.index)});-1!==largestIndex&&(fieldState.index=largestIndex+1)
return model}(text,fieldState).mark(field)})}function notGroup(node){return!node.isGroup}var TOKEN=/^(.*?)([A-Z_]+)(.*?)$/,TOKEN_OPEN=91,TOKEN_CLOSE=93
function template(str,data){if(null==str)return str
for(var lastPos,stack=[],replacer=function(str,left,token,right){return null!=data[token]?left+data[token]+right:""},output="",offset=0,i=0;i<str.length;){if((lastPos=str.charCodeAt(i))===TOKEN_OPEN)stack.push(i)
else if(lastPos===TOKEN_CLOSE){lastPos=stack.pop()
if(!stack.length){output+=str.slice(offset,lastPos)+str.slice(lastPos+1,i).replace(TOKEN,replacer)
offset=i+1}}i++}return output+str.slice(offset)}function splitByLines(text){return(text||"").split(/\r\n|\r|\n/g)}function isFirstChild(node){return node.parent.firstChild===node}function isRoot(node){return node&&!node.parent}function isPseudoSnippet(node){return node.isTextOnly&&node.children.length}function handlePseudoSnippet(outNode){var parts=outNode.node
if(isPseudoSnippet(parts)){var fieldsModel=parse$2$1(parts.value),parts=fieldsModel.fields.reduce(function(result,field){return!result||field.index<result.index?field:result},null)
if(parts){parts=function(model,field){var right=model.fields.indexOf(field),left=new model.constructor(model.string.slice(0,field.location),model.fields.slice(0,right)),right=new model.constructor(model.string.slice(field.location+field.length),model.fields.slice(right+1))
return[left,right]}(fieldsModel,parts)
outNode.open=outNode.renderFields(parts[0])
outNode.close=outNode.renderFields(parts[1])}else outNode.text=outNode.renderFields(fieldsModel)
return 1}}var commentOptions={enabled:!1,trigger:["id","class"],before:"",after:"\n\x3c!-- /[#ID][.CLASS] --\x3e"}
function shouldFormatNode(node,profile){return profile.get("format")&&((!node.parent.isTextOnly||1!==node.parent.children.length||!parse$2$1(node.parent.value).fields.length)&&(!isInline(node,profile)||function(node,profile){if(!isInline(node,profile))return
if(isPseudoSnippet(node))return 1
if(0===node.childIndex){for(var next=node;next=next.nextSibling;)if(!isInline(next,profile))return 1}else if(!isInline(node.previousSibling,profile))return 1
if(profile.get("inlineBreak")){for(var adjacentInline=1,before=node,after=node;isInlineElement(before=before.previousSibling,profile);)adjacentInline++
for(;isInlineElement(after=after.nextSibling,profile);)adjacentInline++
if(adjacentInline>=profile.get("inlineBreak"))return 1}for(var i=0,il=node.children.length;i<il;i++)if(shouldFormatNode(node.children[i],profile))return 1
return}(node,profile)))}function isInline(node,profile){return node&&node.isTextOnly||isInlineElement(node,profile)}function isInlineElement(node,profile){return node&&profile.isInline(node)}var reId=/^id$/i,reClass=/^class$/i,defaultAttrOptions={primary:function(attrs){return attrs.join("")},secondary:function(attrs){return attrs.map(function(attr){return attr.isBoolean?attr.name:attr.name+"="+attr.value}).join(", ")}},defaultNodeOptions={open:null,close:null,omitName:/^div$/i,attributes:defaultAttrOptions}
function indentFormat(outNode,data,options){options=Object.assign({},defaultNodeOptions,options)
var node=outNode.node
outNode.indent=data.indent(function(node){var level=node.parent.isTextOnly?-2:-1,ctx=node
for(;ctx=ctx.parent;)level++
return level<0?0:level}(node))
outNode.newline="\n"
isRoot(node.parent)&&isFirstChild(node)||(outNode.beforeOpen=outNode.newline+outNode.indent)
if(node.name){data=Object.assign({NAME:data.name(node.name),SELF_CLOSE:node.selfClosing?options.selfClose:null},function(outNode,profile,options){options=Object.assign({},defaultAttrOptions,options)
var primary=[],secondary=[]
outNode.node.attributes.forEach(function(isBoolean){if(isBoolean.options.implied&&null==isBoolean.value)return null
var name=profile.attribute(isBoolean.name),value=outNode.renderFields(isBoolean.value)
if(reId.test(name))value&&primary.push("#"+value)
else if(reClass.test(name))value&&primary.push("."+value.replace(/\s+/g,"."))
else{isBoolean=null==isBoolean.value&&(isBoolean.options.boolean||-1!==profile.get("booleanAttributes").indexOf(name.toLowerCase()))
secondary.push({name:name,value:value,isBoolean:isBoolean})}})
return{PRIMARY_ATTRS:options.primary(primary)||null,SECONDARY_ATTRS:options.secondary(secondary)||null}}(outNode,data,options.attributes))
options.omitName&&options.omitName.test(data.NAME)&&data.PRIMARY_ATTRS&&(data.NAME=null)
null!=options.open&&(outNode.open=template(options.open,data))
null!=options.close&&(outNode.close=template(options.close,data))}return outNode}var reNl=/\n|\r/
var reNl$1=/\n|\r/,secondaryAttrs={none:"[ SECONDARY_ATTRS]",round:"[(SECONDARY_ATTRS)]",curly:"[{SECONDARY_ATTRS}]",square:"[[SECONDARY_ATTRS]"}
var reNl$2=/\n|\r/
var supportedSyntaxed={html:function(tree,profile,options){(options=Object.assign({},options)).comment=Object.assign({},commentOptions,options.comment)
return render(tree,options.field,function(outNode){if(!handlePseudoSnippet(outNode=function(outNode,profile){var node=outNode.node
if(shouldFormatNode(node,profile)){outNode.indent=profile.indent(function(node,profile){var skip=profile.get("formatSkip")||[],level=node.parent.isTextOnly?-2:-1,ctx=node
for(;ctx=ctx.parent;)-1===skip.indexOf((ctx.name||"").toLowerCase())&&level++
return level<0?0:level}(node,profile))
outNode.newline="\n"
var prefix=outNode.newline+outNode.indent
if(!isRoot(node.parent)||!isFirstChild(node)){outNode.beforeOpen=prefix
node.isTextOnly&&(outNode.beforeText=prefix)}if(function(node,profile){var nodeName=(node.name||"").toLowerCase()
if(-1!==profile.get("formatForce").indexOf(nodeName))return!0
for(var i=0;i<node.children.length;i++)if(shouldFormatNode(node.children[i],profile))return!0
return!1}(node,profile)){node.isTextOnly||(outNode.beforeText=prefix+profile.indent(1))
outNode.beforeClose=prefix}}return outNode}(outNode,profile))){var node=outNode.node
if(node.name){var name=profile.name(node.name),attrs=function(outNode,profile){return outNode.node.attributes.map(function(attr){if(attr.options.implied&&null==attr.value)return null
var attrName=profile.attribute(attr.name),attrValue=null
if(attr.options.boolean||-1!==profile.get("booleanAttributes").indexOf(attrName.toLowerCase())){if(profile.get("compactBooleanAttributes")&&null==attr.value)return" "+attrName
null==attr.value&&(attrValue=attrName)}null==attrValue&&(attrValue=outNode.renderFields(attr.value))
return" "+attrName+"="+profile.quote(attrValue)}).join("")}(outNode,profile)
outNode.open="<"+name+attrs+(node.selfClosing?profile.selfClose():"")+">"
node.selfClosing||(outNode.close="</"+name+">")
!function(outNode,options){var node=outNode.node
if(options.enabled&&options.trigger&&node.name)for(var attrs=outNode.node.attributes.reduce(function(out,attr){attr.name&&null!=attr.value&&(out[attr.name.toUpperCase().replace(/-/g,"_")]=attr.value)
return out},{}),i=0,il=options.trigger.length;i<il;i++)if(options.trigger[i].toUpperCase()in attrs){outNode.open=template(options.before,attrs)+outNode.open
outNode.close&&(outNode.close+=template(options.after,attrs))
break}}(outNode,options.comment)}!node.value&&(node.children.length||node.selfClosing)||(outNode.text=outNode.renderFields(node.value))}return outNode})},haml:function(tree,profile,options){var nodeOptions={open:"[%NAME][PRIMARY_ATTRS][(SECONDARY_ATTRS)][SELF_CLOSE]",selfClose:"/",attributes:{secondary:function(attrs){return attrs.map(function(attr){return attr.isBoolean?attr.name+(profile.get("compactBooleanAttributes")?"":"=true"):attr.name+"="+profile.quote(attr.value)}).join(" ")}}}
return render(tree,(options=options||{}).field,function(outNode){if(!handlePseudoSnippet(outNode=function(outNode,profile){var node=outNode.node
!node.isTextOnly&&node.value&&(outNode.beforeText=reNl.test(node.value)?outNode.newline+outNode.indent+profile.indent(1):" ")
return outNode}(outNode=indentFormat(outNode,profile,nodeOptions),profile))){var node=outNode.node
!node.value&&(node.children.length||node.selfClosing)||(outNode.text=outNode.renderFields(function(node,profile){if(null!=node.value&&reNl.test(node.value)){var lines=splitByLines(node.value),indent=profile.indent(1),maxLength=lines.reduce(function(prev,line){return Math.max(prev,line.length)},0)
return lines.map(function(line,i){return""+(i?indent:"")+function(text,len){for(;text.length<len;)text+=" "
return text}(line,maxLength)+" |"}).join("\n")}return node.value}(node,profile)))}return outNode})},slim:function(tree,profile,options){var SECONDARY_ATTRS=(options=options||{}).attributeWrap&&secondaryAttrs[options.attributeWrap]||secondaryAttrs.none,booleanAttr=SECONDARY_ATTRS===secondaryAttrs.none?function(attr){return attr.name+"=true"}:function(attr){return attr.name},nodeOptions={open:"[NAME][PRIMARY_ATTRS]"+SECONDARY_ATTRS+"[SELF_CLOSE]",selfClose:"/",attributes:{secondary:function(attrs){return attrs.map(function(attr){return attr.isBoolean?booleanAttr(attr):attr.name+"="+profile.quote(attr.value)}).join(" ")}}}
return render(tree,options.field,function(outNode,renderFields){if(!handlePseudoSnippet(outNode=function(outNode,profile){var node=outNode.node,parent=node.parent
0===profile.get("inlineBreak")&&function(node,profile){return node&&(node.isTextOnly||profile.isInline(node))}(node,profile)&&!isRoot(parent)&&null==parent.value&&1===parent.children.length&&(outNode.beforeOpen=": ")
!node.isTextOnly&&node.value&&(outNode.beforeText=reNl$1.test(node.value)?outNode.newline+outNode.indent+profile.indent(1):" ")
return outNode}(outNode=indentFormat(outNode,profile,nodeOptions),profile))){var node=outNode.node
!node.value&&(node.children.length||node.selfClosing)||(outNode.text=outNode.renderFields(function(node,profile){if(null!=node.value&&reNl$1.test(node.value)){var indent=profile.indent(1)
return splitByLines(node.value).map(function(line,i){return indent+(i?" ":"|")+" "+line}).join("\n")}return node.value}(node,profile)))}return outNode})},pug:function(tree,profile,options){var nodeOptions={open:"[NAME][PRIMARY_ATTRS][(SECONDARY_ATTRS)]",attributes:{secondary:function(attrs){return attrs.map(function(attr){return attr.isBoolean?attr.name:attr.name+"="+profile.quote(attr.value)}).join(", ")}}}
return render(tree,(options=options||{}).field,function(outNode){if(!handlePseudoSnippet(outNode=function(outNode,profile){var node=outNode.node
!node.isTextOnly&&node.value&&(outNode.beforeText=reNl$2.test(node.value)?outNode.newline+outNode.indent+profile.indent(1):" ")
return outNode}(outNode=indentFormat(outNode,profile,nodeOptions),profile))){var node=outNode.node
!node.value&&(node.children.length||node.selfClosing)||(outNode.text=outNode.renderFields(function(node,profile){if(null!=node.value&&reNl$2.test(node.value)){var indent=profile.indent(1)
return splitByLines(node.value).map(function(line){return indent+"| "+line}).join("\n")}return node.value}(node,profile)))}return outNode})}},index$3=function(tree,profile,syntax,options){if("object"==typeof syntax){options=syntax
syntax=null}!function(syntax){return!!syntax&&syntax in supportedSyntaxed}(syntax)&&(syntax="html")
return supportedSyntaxed[syntax](tree,profile,options)}
var CSSValue=function(){this.type="css-value"
this.value=[]},prototypeAccessors$1$1={size:{}}
prototypeAccessors$1$1.size.get=function(){return this.value.length}
CSSValue.prototype.add=function(value){this.value.push(value)}
CSSValue.prototype.has=function(value){return-1!==this.value.indexOf(value)}
CSSValue.prototype.toString=function(){return this.value.join(" ")}
Object.defineProperties(CSSValue.prototype,prototypeAccessors$1$1)
var consumeColor=function(stream){if(35===stream.peek()){stream.start=stream.pos
stream.next()
stream.eat(116)||stream.eatWhile(isHex)
var base=stream.current()
stream.start=stream.pos
if(stream.eat(46)&&!stream.eatWhile(isNumber$1))throw stream.error("Unexpected character for alpha value of color")
return new Color(base,stream.current())}},Color=function(value,alpha){this.type="color"
this.raw=value
this.alpha=Number(null!=alpha&&""!==alpha?alpha:1)
var r=0,g=0,b=0
if("t"===(value=value.slice(1)))this.alpha=0
else switch(value.length){case 0:break
case 1:r=g=b=value+value
break
case 2:r=g=b=value
break
case 3:r=value[0]+value[0]
g=value[1]+value[1]
b=value[2]+value[2]
break
default:r=(value+=value).slice(0,2)
g=value.slice(2,4)
b=value.slice(4,6)}this.r=parseInt(r,16)
this.g=parseInt(g,16)
this.b=parseInt(b,16)}
Color.prototype.toHex=function(fn){fn=!fn||this.r%17||this.g%17||this.b%17?toHex:toShortHex
return"#"+fn(this.r)+fn(this.g)+fn(this.b)}
Color.prototype.toRGB=function(){var values=[this.r,this.g,this.b]
1!==this.alpha&&values.push(this.alpha.toFixed(8).replace(/\.?0+$/,""))
return(3===values.length?"rgb":"rgba")+"("+values.join(", ")+")"}
Color.prototype.toString=function(short){return this.r||this.g||this.b||this.alpha?1===this.alpha?this.toHex(short):this.toRGB():"transparent"}
function isHex(code){return isNumber$1(code)||isAlpha$1(code,65,70)}function toShortHex(num){return(num>>4).toString(16)}function toHex(num){return function(value,len){for(;value.length<len;)value="0"+value
return value}(num.toString(16),2)}function isAlphaNumericWord(code){return isNumber$1(code)||isAlphaWord(code)}function isAlphaWord(code){return 95===code||isAlpha$1(code)}var consumeNumericValue=function(stream){stream.start=stream.pos
if(function(stream){var code,start=stream.pos,negative=stream.eat(45),hadDot=!1,consumed=!1
for(;!stream.eof()&&(46===(code=stream.peek())?!hadDot:isNumber$1(code));){consumed=!0
46===code&&(hadDot=!0)
stream.next()}negative&&!consumed&&(stream.pos=start)
return start!==stream.pos}(stream)){var num=stream.current()
stream.start=stream.pos
stream.eat(37)||stream.eatWhile(isAlphaWord)
return new NumericValue(num,stream.current())}},NumericValue=function(value,unit){this.type="numeric"
this.value=Number(value)
this.unit=unit||""}
NumericValue.prototype.toString=function(){return""+this.value+this.unit}
var consumeKeyword=function(stream,short){stream.start=stream.pos
stream.eat(36)||stream.eat(64)?stream.eatWhile(isVariableName):short?stream.eatWhile(isAlphaWord):stream.eatWhile(isKeyword)
return stream.start!==stream.pos?new Keyword(stream.current()):null},Keyword=function(value){this.type="keyword"
this.value=value}
Keyword.prototype.toString=function(){return this.value}
function isKeyword(code){return isAlphaNumericWord(code)||45===code}function isVariableName(code){return 45===code||isAlphaNumericWord(code)}var opt$1$1={throws:!0},consumeQuoted$1=function(stream){if(eatQuoted$1(stream,opt$1$1))return new QuotedString(stream.current())},QuotedString=function(value){this.type="string"
this.value=value}
QuotedString.prototype.toString=function(){return this.value}
var LBRACE=40,RBRACE=41,COMMA=44
function consumeArgumentList(stream){if(!stream.eat(LBRACE))return null
for(var arg,argsList=[];!stream.eof();)if(arg=function(stream){var value,result=new CSSValue
for(;!stream.eof();){stream.eatWhile(isWhiteSpace$1)
if(!(value=consumeNumericValue(stream)||consumeColor(stream)||consumeQuoted$1(stream)||function(args){var kw=consumeKeyword(args)
if(kw){args=consumeArgumentList(args)
return args?new FunctionCall(kw.toString(),args):kw}}(stream)))break
result.add(value)}return result.size?result:null}(stream))argsList.push(arg)
else{stream.eatWhile(isWhiteSpace$1)
if(stream.eat(RBRACE))break
if(!stream.eat(COMMA))throw stream.error("Expected , or )")}return argsList}var FunctionCall=function(name,args){this.type="function"
this.name=name
this.args=args||[]}
FunctionCall.prototype.toString=function(){return this.name+"("+this.args.join(", ")+")"}
var EXCL$1=33,DOLLAR$1$1=36,DASH=45,COLON$2=58,AT=64,index$4=function(abbr){for(var root=new Node,stream=new StreamReader$1(abbr);!stream.eof();){var node$1=new Node(function(stream){stream.start=stream.pos
stream.eatWhile(isIdentPrefix)
stream.eatWhile(isIdent$1)
return stream.start!==stream.pos?stream.current():null}(stream))
node$1.value=function(stream){var value,values=new CSSValue
for(;!stream.eof();){stream.eat(COLON$2)
if(value=consumeNumericValue(stream)||consumeColor(stream))value.unit||stream.eat(DASH)
else{stream.eat(DASH)
value=consumeKeyword(stream,!0)}if(!value)break
values.add(value)}return values}(stream)
var args=consumeArgumentList(stream)
if(args)for(var i=0;i<args.length;i++)node$1.setAttribute(String(i),args[i])
stream.eat(EXCL$1)&&node$1.value.add("!")
root.appendChild(node$1)
if(!stream.eat(43))break}if(!stream.eof())throw stream.error("Unexpected character")
return root}
function isIdent$1(code){return isAlphaWord(code)}function isIdentPrefix(code){return code===AT||code===DOLLAR$1$1||code===EXCL$1}var stringScore=function(abbr,string){if(abbr===string)return 1
if(!string||abbr.charCodeAt(0)!==string.charCodeAt(0))return 0
for(var ch1,ch2,found,acronym,n,abbrLength=abbr.length,stringLength=string.length,i=1,j=1,score=stringLength;i<abbrLength;){ch1=abbr.charCodeAt(i)
acronym=found=!1
for(;j<stringLength;){if(ch1===(ch2=string.charCodeAt(j))){found=!0
score+=(stringLength-j)*(acronym?2:1)
break}acronym=45===ch2
j++}if(!found)break
i++}return score&&score*(i/abbrLength)/((n=stringLength)*(n+1)/2)}
var reProperty=/^([a-z\-]+)(?:\s*:\s*([^\n\r]+))?$/,cssSnippets=function(snippets){return function(snippets){snippets=snippets.sort(snippetsSort)
for(var stack=[],i=0,cur=void 0,prev=void 0;i<snippets.length;i++)if((cur=snippets[i]).property){for(;stack.length;){prev=stack[stack.length-1]
if(0===cur.property.indexOf(prev.property)&&45===cur.property.charCodeAt(prev.property.length)){prev.addDependency(cur)
stack.push(cur)
break}stack.pop()}stack.length||stack.push(cur)}return snippets}(snippets.map(function(snippet){return new CSSSnippet(snippet.key,snippet.value)}))},CSSSnippet=function(key,m){this.key=key
this.value=m
this.property=null
m=m&&m.match(reProperty)
if(m){this.property=m[1]
this.value=m[2]}this.dependencies=[]},prototypeAccessors$1$1={defaulValue:{}}
CSSSnippet.prototype.addDependency=function(dep){this.dependencies.push(dep)}
prototypeAccessors$1$1.defaulValue.get=function(){return null!=this.value?splitValue(this.value)[0]:null}
CSSSnippet.prototype.keywords=function(){var item,candidates,stack=[],keywords=new Set,i=0
this.property&&stack.push(this)
for(;i<stack.length;)if((item=stack[i++]).value){candidates=splitValue(item.value).filter(isKeyword$1)
for(var j=0;j<candidates.length;j++)keywords.add(candidates[j].trim())
for(var j$1=0,deps=item.dependencies;j$1<deps.length;j$1++)-1===stack.indexOf(deps[j$1])&&stack.push(deps[j$1])}return Array.from(keywords)}
Object.defineProperties(CSSSnippet.prototype,prototypeAccessors$1$1)
function snippetsSort(a,b){return a.key===b.key?0:a.key<b.key?-1:1}function isKeyword$1(str){return/^\s*[\w\-]+/.test(str)}function splitValue(value){return String(value).split("|")}var globalKeywords=["auto","inherit","unset"],unitlessProperties=["z-index","line-height","opacity","font-weight","zoom","flex","flex-grow","flex-shrink"],unitAliases={e:"em",p:"%",x:"ex",r:"rem"},index$5=function(tree,registry){var snippets=convertToCSSSnippets(registry)
tree.walk(function(node){return function(node,snippet){snippet=findBestMatch(node.name,snippet,"key")
return snippet?(snippet.property?function(node,snippet){var kw=node.name
node.name=snippet.property
if(node.value&&"object"==typeof node.value){var keywords=snippet.keywords()
if(node.value.size)for(var i=0,token=void 0;i<node.value.value.length;i++){"!"===(token=node.value.value[i])?token=(i?"":"${1} ")+"!important":!function(token){return tokenTypeOf(token,"keyword")}(token)?function(token){return tokenTypeOf(token,"numeric")}(token)&&(token=function(property,token){token.unit?token.unit=unitAliases[token.unit]||token.unit:0!==token.value&&-1===unitlessProperties.indexOf(property)&&(token.unit=token.value===(0|token.value)?"px":"em")
return token}(node.name,token)):token=findBestMatch(token.value,keywords)||findBestMatch(token.value,globalKeywords)||token
node.value.value[i]=token}else{kw=findBestMatch(function(abbr,string){for(var i=0,lastPos=0;i<abbr.length;i++){if(-1===(lastPos=string.indexOf(abbr[i],lastPos)))return abbr.slice(i)
lastPos++}return""}(kw,snippet.key),keywords)
kw||(kw=snippet.defaulValue)&&-1===kw.indexOf("${")&&(kw="${1:"+kw+"}")
kw&&node.value.add(kw)}}return node}:function(node,snippet){return setNodeAsText(node,snippet.value)})(node,snippet):"!"===node.name?setNodeAsText(node,"!important"):node}(node,snippets)})
return tree}
function convertToCSSSnippets(registry){return cssSnippets(registry.all({type:"string"}))}function setNodeAsText(node,text){node.name=null
node.value=text
return node}function findBestMatch(abbr,items,key){if(!abbr)return null
for(var item,matchedItem=null,maxScore=0,i=0;i<items.length;i++){item=items[i]
var score=stringScore(abbr,function(m,value){value=m&&"object"==typeof m?m[value]:m,m=(value||"").match(/^[\w-@]+/)
return m?m[0]:value}(item,key))
if(1===score)return item
if(score&&maxScore<=score){maxScore=score
matchedItem=item}}return matchedItem}function tokenTypeOf(token,type){return token&&"object"==typeof token&&token.type===type}var defaultOptions$4={shortHex:!0,format:{between:": ",after:";"}}
function css(tree,profile,options){options=Object.assign({},defaultOptions$4,options)
return render(tree,options.field,function(outNode){var node=outNode.node,value=String(node.value||"")
node.attributes.length&&(value=function(fieldsAmount,values){var fieldsModel=parse$2$1(fieldsAmount),fieldsAmount=fieldsModel.fields.length
if(fieldsAmount){(values=values.slice()).length>fieldsAmount&&(values=values.slice(0,fieldsAmount-1).concat(values.slice(fieldsAmount-1).join(", ")))
for(;values.length;){var value=values.shift(),field=fieldsModel.fields.shift(),delta=value.length-field.length
fieldsModel.string=fieldsModel.string.slice(0,field.location)+value+fieldsModel.string.slice(field.location+field.length)
for(var i=0,il=fieldsModel.fields.length;i<il;i++)fieldsModel.fields[i].location+=delta}}return fieldsModel}(value,node.attributes.map(function(attr){return function(attr,options){if(attr.value&&"object"==typeof attr.value&&"css-value"===attr.value.type)return attr.value.value.map(function(token){return token&&"object"==typeof token?"color"===token.type?token.toString(options.shortHex):token.toString():String(token)}).join(" ")
return null!=attr.value?String(attr.value):""}(attr,options)})))
outNode.open=node.name&&profile.name(node.name)
outNode.afterOpen=options.format.between
outNode.text=outNode.renderFields(value||null)
outNode.open&&(outNode.afterText=options.format.after)
if(profile.get("format")){outNode.newline="\n"
tree.lastChild!==node&&(outNode.afterText+=outNode.newline)}return outNode})}var syntaxFormat={css:{between:": ",after:";"},scss:"css",less:"css",sass:{between:": ",after:""},stylus:{between:" ",after:""}},index$6=function(tree,profile,syntax,options){if("object"==typeof syntax){options=syntax
syntax=null}!function(syntax){return!!syntax&&syntax in syntaxFormat}(syntax)&&(syntax="css")
return css(tree,profile,options=Object.assign({},options,{format:function(format,options){format=syntaxFormat[format]
"string"==typeof format&&(format=syntaxFormat[format])
return Object.assign({},format,options&&options.format)}(syntax,options)}))}
var index$7={html:{a:"a[href]","a:link":"a[href='http://${0}']","a:mail":"a[href='mailto:${0}']",abbr:"abbr[title]","acr|acronym":"acronym[title]",base:"base[href]/",basefont:"basefont/",br:"br/",frame:"frame/",hr:"hr/",bdo:"bdo[dir]","bdo:r":"bdo[dir=rtl]","bdo:l":"bdo[dir=ltr]",col:"col/",link:"link[rel=stylesheet href]/","link:css":"link[href='${1:style}.css']","link:print":"link[href='${1:print}.css' media=print]","link:favicon":"link[rel='shortcut icon' type=image/x-icon href='${1:favicon.ico}']","link:touch":"link[rel=apple-touch-icon href='${1:favicon.png}']","link:rss":"link[rel=alternate type=application/rss+xml title=RSS href='${1:rss.xml}']","link:atom":"link[rel=alternate type=application/atom+xml title=Atom href='${1:atom.xml}']","link:im|link:import":"link[rel=import href='${1:component}.html']",meta:"meta/","meta:utf":"meta[http-equiv=Content-Type content='text/html;charset=UTF-8']","meta:vp":"meta[name=viewport content='width=${1:device-width}, initial-scale=${2:1.0}']","meta:compat":"meta[http-equiv=X-UA-Compatible content='${1:IE=7}']","meta:edge":"meta:compat[content='${1:ie=edge}']","meta:redirect":"meta[http-equiv=refresh content='0; url=${1:http://example.com}']",style:"style",script:"script[!src]","script:src":"script[src]",img:"img[src alt]/","img:s|img:srcset":"img[srcset src alt]","img:z|img:sizes":"img[sizes srcset src alt]",picture:"picture","src|source":"source/","src:sc|source:src":"source[src type]","src:s|source:srcset":"source[srcset]","src:t|source:type":"source[srcset type='${1:image/}']","src:z|source:sizes":"source[sizes srcset]","src:m|source:media":"source[media='(${1:min-width: })' srcset]","src:mt|source:media:type":"source:media[type='${2:image/}']","src:mz|source:media:sizes":"source:media[sizes srcset]","src:zt|source:sizes:type":"source[sizes srcset type='${1:image/}']",iframe:"iframe[src frameborder=0]",embed:"embed[src type]/",object:"object[data type]",param:"param[name value]/",map:"map[name]",area:"area[shape coords href alt]/","area:d":"area[shape=default]","area:c":"area[shape=circle]","area:r":"area[shape=rect]","area:p":"area[shape=poly]",form:"form[action]","form:get":"form[method=get]","form:post":"form[method=post]",label:"label[for]",input:"input[type=${1:text}]/",inp:"input[name=${1} id=${1}]","input:h|input:hidden":"input[type=hidden name]","input:t|input:text":"inp","input:search":"inp[type=search]","input:email":"inp[type=email]","input:url":"inp[type=url]","input:p|input:password":"inp[type=password]","input:datetime":"inp[type=datetime]","input:date":"inp[type=date]","input:datetime-local":"inp[type=datetime-local]","input:month":"inp[type=month]","input:week":"inp[type=week]","input:time":"inp[type=time]","input:tel":"inp[type=tel]","input:number":"inp[type=number]","input:color":"inp[type=color]","input:c|input:checkbox":"inp[type=checkbox]","input:r|input:radio":"inp[type=radio]","input:range":"inp[type=range]","input:f|input:file":"inp[type=file]","input:s|input:submit":"input[type=submit value]","input:i|input:image":"input[type=image src alt]","input:b|input:button":"input[type=button value]","input:reset":"input:button[type=reset]",isindex:"isindex/",select:"select[name=${1} id=${1}]","select:d|select:disabled":"select[disabled.]","opt|option":"option[value]",textarea:"textarea[name=${1} id=${1} cols=${2:30} rows=${3:10}]",marquee:"marquee[behavior direction]","menu:c|menu:context":"menu[type=context]","menu:t|menu:toolbar":"menu[type=toolbar]",video:"video[src]",audio:"audio[src]","html:xml":"html[xmlns=http://www.w3.org/1999/xhtml]",keygen:"keygen/",command:"command/","btn:s|button:s|button:submit":"button[type=submit]","btn:r|button:r|button:reset":"button[type=reset]","btn:d|button:d|button:disabled":"button[disabled.]","fst:d|fset:d|fieldset:d|fieldset:disabled":"fieldset[disabled.]",bq:"blockquote",fig:"figure",figc:"figcaption",pic:"picture",ifr:"iframe",emb:"embed",obj:"object",cap:"caption",colg:"colgroup",fst:"fieldset",btn:"button",optg:"optgroup",tarea:"textarea",leg:"legend",sect:"section",art:"article",hdr:"header",ftr:"footer",adr:"address",dlg:"dialog",str:"strong",prog:"progress",mn:"main",tem:"template",fset:"fieldset",datag:"datagrid",datal:"datalist",kg:"keygen",out:"output",det:"details",cmd:"command","ri:d|ri:dpr":"img:s","ri:v|ri:viewport":"img:z","ri:a|ri:art":"pic>src:m+img","ri:t|ri:type":"pic>src:t+img","!!!":"{<!DOCTYPE html>}",doc:"html[lang=${lang}]>(head>meta[charset=${charset}]+meta:vp+meta:edge+title{${1:Document}})+body","!|html:5":"!!!+doc",c:"{\x3c!-- ${0} --\x3e}","cc:ie":"{\x3c!--[if IE]>${0}<![endif]--\x3e}","cc:noie":"{\x3c!--[if !IE]>\x3c!--\x3e${0}\x3c!--<![endif]--\x3e}"},css:{"@f":"@font-face {\n\tfont-family: ${1};\n\tsrc: url(${1});\n}","@ff":"@font-face {\n\tfont-family: '${1:FontName}';\n\tsrc: url('${2:FileName}.eot');\n\tsrc: url('${2:FileName}.eot?#iefix') format('embedded-opentype'),\n\t\t url('${2:FileName}.woff') format('woff'),\n\t\t url('${2:FileName}.ttf') format('truetype'),\n\t\t url('${2:FileName}.svg#${1:FontName}') format('svg');\n\tfont-style: ${3:normal};\n\tfont-weight: ${4:normal};\n}","@i|@import":"@import url(${0});","@kf":"@keyframes ${1:identifier} {\n\t${2}\n}","@m|@media":"@media ${1:screen} {\n\t${0}\n}",ac:"align-content:flex-start|flex-end|center|space-between|space-around|stretch",ai:"align-items:flex-start|flex-end|center|baseline|stretch",anim:"animation:${1:name} ${2:duration} ${3:timing-function} ${4:delay} ${5:iteration-count} ${6:direction} ${7:fill-mode}",animdel:"animation-delay:${1:time}",animdir:"animation-direction:normal|reverse|alternate|alternate-reverse",animdur:"animation-duration:${1:0}s",animfm:"animation-fill-mode:both|forwards|backwards",animic:"animation-iteration-count:1|infinite",animn:"animation-name",animps:"animation-play-state:running|paused",animtf:"animation-timing-function:linear|ease|ease-in|ease-out|ease-in-out|cubic-bezier(${1:0.1}, ${2:0.7}, ${3:1.0}, ${3:0.1})",ap:"appearance:none",as:"align-self:auto|flex-start|flex-end|center|baseline|stretch",b:"bottom",bd:"border:${1:1px} ${2:solid} ${3:#000}",bdb:"border-bottom:${1:1px} ${2:solid} ${3:#000}",bdbc:"border-bottom-color:#${1:000}",bdbi:"border-bottom-image:url(${0})",bdbk:"border-break:close",bdbli:"border-bottom-left-image:url(${0})|continue",bdblrs:"border-bottom-left-radius",bdbri:"border-bottom-right-image:url(${0})|continue",bdbrrs:"border-bottom-right-radius",bdbs:"border-bottom-style",bdbw:"border-bottom-width",bdc:"border-color:#${1:000}",bdci:"border-corner-image:url(${0})|continue",bdcl:"border-collapse:collapse|separate",bdf:"border-fit:repeat|clip|scale|stretch|overwrite|overflow|space",bdi:"border-image:url(${0})",bdl:"border-left:${1:1px} ${2:solid} ${3:#000}",bdlc:"border-left-color:#${1:000}",bdlen:"border-length",bdli:"border-left-image:url(${0})",bdls:"border-left-style",bdlw:"border-left-width",bdr:"border-right:${1:1px} ${2:solid} ${3:#000}",bdrc:"border-right-color:#${1:000}",bdri:"border-right-image:url(${0})",bdrs:"border-radius",bdrst:"border-right-style",bdrw:"border-right-width",bds:"border-style:hidden|dotted|dashed|solid|double|dot-dash|dot-dot-dash|wave|groove|ridge|inset|outset",bdsp:"border-spacing",bdt:"border-top:${1:1px} ${2:solid} ${3:#000}",bdtc:"border-top-color:#${1:000}",bdti:"border-top-image:url(${0})",bdtli:"border-top-left-image:url(${0})|continue",bdtlrs:"border-top-left-radius",bdtri:"border-top-right-image:url(${0})|continue",bdtrrs:"border-top-right-radius",bdts:"border-top-style",bdtw:"border-top-width",bdw:"border-width",bfv:"backface-visibility:hidden|visible",bg:"background:#${1:000}",bga:"background-attachment:fixed|scroll",bgbk:"background-break:bounding-box|each-box|continuous",bgc:"background-color:#${1:fff}",bgcp:"background-clip:padding-box|border-box|content-box|no-clip",bgi:"background-image:url(${0})",bgo:"background-origin:padding-box|border-box|content-box",bgp:"background-position:${1:0} ${2:0}",bgpx:"background-position-x",bgpy:"background-position-y",bgr:"background-repeat:no-repeat|repeat-x|repeat-y|space|round",bgsz:"background-size:contain|cover",bxsh:"box-shadow:${1:inset }${2:hoff} ${3:voff} ${4:blur} ${5:color}|none",bxsz:"box-sizing:border-box|content-box|border-box",c:"color:#${1:000}",cl:"clear:both|left|right|none",cm:"/* ${0} */",cnt:"content:'${0}'|normal|open-quote|no-open-quote|close-quote|no-close-quote|attr(${0})|counter(${0})|counters({$0})",coi:"counter-increment",colm:"columns",colmc:"column-count",colmf:"column-fill",colmg:"column-gap",colmr:"column-rule",colmrc:"column-rule-color",colmrs:"column-rule-style",colmrw:"column-rule-width",colms:"column-span",colmw:"column-width",cor:"counter-reset",cp:"clip:auto|rect(${1:top} ${2:right} ${3:bottom} ${4:left})",cps:"caption-side:top|bottom",cur:"cursor:pointer|auto|default|crosshair|hand|help|move|pointer|text",d:"display:block|none|flex|inline-flex|inline|inline-block|list-item|run-in|compact|table|inline-table|table-caption|table-column|table-column-group|table-header-group|table-footer-group|table-row|table-row-group|table-cell|ruby|ruby-base|ruby-base-group|ruby-text|ruby-text-group",ec:"empty-cells:show|hide",f:"font:${1:1em} ${2:sans-serif}",fef:"font-effect:none|engrave|emboss|outline",fem:"font-emphasize",femp:"font-emphasize-position:before|after",fems:"font-emphasize-style:none|accent|dot|circle|disc",ff:"font-family:serif|sans-serif|cursive|fantasy|monospace",fl:"float:left|right|none",fs:"font-style:italic|normal|oblique",fsm:"font-smoothing:antialiased|subpixel-antialiased|none",fst:"font-stretch:normal|ultra-condensed|extra-condensed|condensed|semi-condensed|semi-expanded|expanded|extra-expanded|ultra-expanded",fv:"font-variant:normal|small-caps",fw:"font-weight:normal|bold|bolder|lighter",fx:"flex",fxb:"flex-basis:fill|max-content|min-content|fit-content|content",fxd:"flex-direction:row|row-reverse|column|column-reverse",fxf:"flex-flow",fxg:"flex-grow",fxsh:"flex-shrink",fxw:"flex-wrap:nowrap|wrap|wrap-reverse",fz:"font-size",fza:"font-size-adjust",h:"height",jc:"justify-content:flex-start|flex-end|center|space-between|space-around",l:"left",lg:"background-image:linear-gradient(${1})",lh:"line-height",lis:"list-style",lisi:"list-style-image",lisp:"list-style-position:inside|outside",list:"list-style-type:disc|circle|square|decimal|decimal-leading-zero|lower-roman|upper-roman",lts:"letter-spacing:normal",m:"margin",mah:"max-height",mar:"max-resolution",maw:"max-width",mb:"margin-bottom",mih:"min-height",mir:"min-resolution",miw:"min-width",ml:"margin-left",mr:"margin-right",mt:"margin-top",ol:"outline",olc:"outline-color:#${1:000}|invert",olo:"outline-offset",ols:"outline-style:none|dotted|dashed|solid|double|groove|ridge|inset|outset",olw:"outline-width|thin|medium|thick",op:"opacity",ord:"order",ori:"orientation:landscape|portrait",orp:"orphans",ov:"overflow:hidden|visible|hidden|scroll|auto",ovs:"overflow-style:scrollbar|auto|scrollbar|panner|move|marquee",ovx:"overflow-x:hidden|visible|hidden|scroll|auto",ovy:"overflow-y:hidden|visible|hidden|scroll|auto",p:"padding",pb:"padding-bottom",pgba:"page-break-after:auto|always|left|right",pgbb:"page-break-before:auto|always|left|right",pgbi:"page-break-inside:auto|avoid",pl:"padding-left",pos:"position:relative|absolute|relative|fixed|static",pr:"padding-right",pt:"padding-top",q:"quotes",qen:"quotes:'\\201C' '\\201D' '\\2018' '\\2019'",qru:"quotes:'\\00AB' '\\00BB' '\\201E' '\\201C'",r:"right",rsz:"resize:none|both|horizontal|vertical",t:"top",ta:"text-align:left|center|right|justify",tal:"text-align-last:left|center|right",tbl:"table-layout:fixed",td:"text-decoration:none|underline|overline|line-through",te:"text-emphasis:none|accent|dot|circle|disc|before|after",th:"text-height:auto|font-size|text-size|max-size",ti:"text-indent",tj:"text-justify:auto|inter-word|inter-ideograph|inter-cluster|distribute|kashida|tibetan",to:"text-outline:${1:0} ${2:0} ${3:#000}",tov:"text-overflow:ellipsis|clip",tr:"text-replace",trf:"transform:${1}|skewX(${1:angle})|skewY(${1:angle})|scale(${1:x}, ${2:y})|scaleX(${1:x})|scaleY(${1:y})|scaleZ(${1:z})|scale3d(${1:x}, ${2:y}, ${3:z})|rotate(${1:angle})|rotateX(${1:angle})|rotateY(${1:angle})|rotateZ(${1:angle})|translate(${1:x}, ${2:y})|translateX(${1:x})|translateY(${1:y})|translateZ(${1:z})|translate3d(${1:tx}, ${2:ty}, ${3:tz})",trfo:"transform-origin",trfs:"transform-style:preserve-3d",trs:"transition:${1:prop} ${2:time}",trsde:"transition-delay:${1:time}",trsdu:"transition-duration:${1:time}",trsp:"transition-property:${1:prop}",trstf:"transition-timing-function:${1:fn}",tsh:"text-shadow:${1:hoff} ${2:voff} ${3:blur} ${4:#000}",tt:"text-transform:uppercase|lowercase|capitalize|none",tw:"text-wrap:none|normal|unrestricted|suppress",us:"user-select:none",v:"visibility:hidden|visible|collapse",va:"vertical-align:top|super|text-top|middle|baseline|bottom|text-bottom|sub",w:"width",whs:"white-space:nowrap|pre|pre-wrap|pre-line|normal",whsc:"white-space-collapse:normal|keep-all|loose|break-strict|break-all",wid:"widows",wm:"writing-mode:lr-tb|lr-tb|lr-bt|rl-tb|rl-bt|tb-rl|tb-lr|bt-lr|bt-rl",wob:"word-break:normal|keep-all|break-all",wos:"word-spacing",wow:"word-wrap:none|unrestricted|suppress|break-word|normal",z:"z-index",zom:"zoom:1"}},langs={latin:{common:["lorem","ipsum","dolor","sit","amet","consectetur","adipisicing","elit"],words:["exercitationem","perferendis","perspiciatis","laborum","eveniet","sunt","iure","nam","nobis","eum","cum","officiis","excepturi","odio","consectetur","quasi","aut","quisquam","vel","eligendi","itaque","non","odit","tempore","quaerat","dignissimos","facilis","neque","nihil","expedita","vitae","vero","ipsum","nisi","animi","cumque","pariatur","velit","modi","natus","iusto","eaque","sequi","illo","sed","ex","et","voluptatibus","tempora","veritatis","ratione","assumenda","incidunt","nostrum","placeat","aliquid","fuga","provident","praesentium","rem","necessitatibus","suscipit","adipisci","quidem","possimus","voluptas","debitis","sint","accusantium","unde","sapiente","voluptate","qui","aspernatur","laudantium","soluta","amet","quo","aliquam","saepe","culpa","libero","ipsa","dicta","reiciendis","nesciunt","doloribus","autem","impedit","minima","maiores","repudiandae","ipsam","obcaecati","ullam","enim","totam","delectus","ducimus","quis","voluptates","dolores","molestiae","harum","dolorem","quia","voluptatem","molestias","magni","distinctio","omnis","illum","dolorum","voluptatum","ea","quas","quam","corporis","quae","blanditiis","atque","deserunt","laboriosam","earum","consequuntur","hic","cupiditate","quibusdam","accusamus","ut","rerum","error","minus","eius","ab","ad","nemo","fugit","officia","at","in","id","quos","reprehenderit","numquam","iste","fugiat","sit","inventore","beatae","repellendus","magnam","recusandae","quod","explicabo","doloremque","aperiam","consequatur","asperiores","commodi","optio","dolor","labore","temporibus","repellat","veniam","architecto","est","esse","mollitia","nulla","a","similique","eos","alias","dolore","tenetur","deleniti","porro","facere","maxime","corrupti"]},ru:{common:["далеко-далеко","за","словесными","горами","в стране","гласных","и согласных","живут","рыбные","тексты"],words:["вдали","от всех","они","буквенных","домах","на берегу","семантика","большого","языкового","океана","маленький","ручеек","даль","журчит","по всей","обеспечивает","ее","всеми","необходимыми","правилами","эта","парадигматическая","страна","которой","жаренные","предложения","залетают","прямо","рот","даже","всемогущая","пунктуация","не","имеет","власти","над","рыбными","текстами","ведущими","безорфографичный","образ","жизни","однажды","одна","маленькая","строчка","рыбного","текста","имени","lorem","ipsum","решила","выйти","большой","мир","грамматики","великий","оксмокс","предупреждал","о","злых","запятых","диких","знаках","вопроса","коварных","точках","запятой","но","текст","дал","сбить","себя","толку","он","собрал","семь","своих","заглавных","букв","подпоясал","инициал","за","пояс","пустился","дорогу","взобравшись","первую","вершину","курсивных","гор","бросил","последний","взгляд","назад","силуэт","своего","родного","города","буквоград","заголовок","деревни","алфавит","подзаголовок","своего","переулка","грустный","реторический","вопрос","скатился","его","щеке","продолжил","свой","путь","дороге","встретил","рукопись","она","предупредила","моей","все","переписывается","несколько","раз","единственное","что","меня","осталось","это","приставка","возвращайся","ты","лучше","свою","безопасную","страну","послушавшись","рукописи","наш","продолжил","свой","путь","вскоре","ему","повстречался","коварный","составитель","рекламных","текстов","напоивший","языком","речью","заманивший","свое","агентство","которое","использовало","снова","снова","своих","проектах","если","переписали","то","живет","там","до","сих","пор"]},sp:{common:["mujer","uno","dolor","más","de","poder","mismo","si"],words:["ejercicio","preferencia","perspicacia","laboral","paño","suntuoso","molde","namibia","planeador","mirar","demás","oficinista","excepción","odio","consecuencia","casi","auto","chicharra","velo","elixir","ataque","no","odio","temporal","cuórum","dignísimo","facilismo","letra","nihilista","expedición","alma","alveolar","aparte","león","animal","como","paria","belleza","modo","natividad","justo","ataque","séquito","pillo","sed","ex","y","voluminoso","temporalidad","verdades","racional","asunción","incidente","marejada","placenta","amanecer","fuga","previsor","presentación","lejos","necesariamente","sospechoso","adiposidad","quindío","pócima","voluble","débito","sintió","accesorio","falda","sapiencia","volutas","queso","permacultura","laudo","soluciones","entero","pan","litro","tonelada","culpa","libertario","mosca","dictado","reincidente","nascimiento","dolor","escolar","impedimento","mínima","mayores","repugnante","dulce","obcecado","montaña","enigma","total","deletéreo","décima","cábala","fotografía","dolores","molesto","olvido","paciencia","resiliencia","voluntad","molestias","magnífico","distinción","ovni","marejada","cerro","torre","y","abogada","manantial","corporal","agua","crepúsculo","ataque","desierto","laboriosamente","angustia","afortunado","alma","encefalograma","materialidad","cosas","o","renuncia","error","menos","conejo","abadía","analfabeto","remo","fugacidad","oficio","en","almácigo","vos","pan","represión","números","triste","refugiado","trote","inventor","corchea","repelente","magma","recusado","patrón","explícito","paloma","síndrome","inmune","autoinmune","comodidad","ley","vietnamita","demonio","tasmania","repeler","apéndice","arquitecto","columna","yugo","computador","mula","a","propósito","fantasía","alias","rayo","tenedor","deleznable","ventana","cara","anemia","corrupto"]}},defaultOptions$5={wordCount:30,skipCommon:!1,lang:"latin"}
function rand(from,to){return Math.floor(Math.random()*(to-from)+from)}function sentence(words,val){words.length&&(words=[(word=words[0])[0].toUpperCase()+word.slice(1)].concat(words.slice(1)))
var word
return words.join(" ")+(val||(val="?!...")[rand(0,val.length-1)])}function insertCommas(words){if(words.length<2)return words
for(var pos,len=(words=words.slice()).length,hasComma=/,$/,totalCommas=0,totalCommas=3<len&&len<=6?rand(0,1):6<len&&len<=12?rand(0,2):rand(1,4),i=0;i<totalCommas;i++){pos=rand(0,len-2)
hasComma.test(words[pos])||(words[pos]+=",")}return words}function paragraph(dict,wordCount,startWithCommon){var words,result=[],totalWords=0
if(startWithCommon&&dict.common){totalWords+=(words=dict.common.slice(0,wordCount)).length
result.push(sentence(insertCommas(words),"."))}for(;totalWords<wordCount;){totalWords+=(words=function(arr,count){for(var len=arr.length,iterations=Math.min(len,count),result=new Set;result.size<iterations;)result.add(arr[rand(0,len)])
return Array.from(result)}(dict.words,Math.min(rand(2,30),wordCount-totalWords))).length
result.push(sentence(insertCommas(words)))}return result.join(" ")}function parse$1(abbr,options){return index(abbr).use(index$1,options.snippets).use(replaceVariables,options.variables).use(index$2,options.text,options.addons)}function parse$2(abbr,options){"string"==typeof abbr&&(abbr=index$4(abbr))
return abbr.use(index$5,options.snippets)}var reLorem=/^lorem([a-z]*)(\d*)$/,snippetsRegistryFactory=function(syntax,registry){var registrySnippets=[index$7[syntax]||index$7.html]
Array.isArray(registry)?registry.forEach(function(item){registrySnippets.push("string"==typeof item?index$7[item]:item)}):"object"==typeof registry&&registrySnippets.push(registry)
registry=new SnippetsRegistry(registrySnippets.filter(Boolean))
"css"!==syntax&&registry.get(0).set(reLorem,loremGenerator)
return registry}
function loremGenerator(node){var options={},m=node.name.match(reLorem)
m[1]&&(options.lang=m[1])
m[2]&&(options.wordCount=+m[2])
return function(node,options){options=Object.assign({},defaultOptions$5,options)
var dict=langs[options.lang]||langs.latin,startWithCommon=!options.skipCommon&&!function(node){for(;node.parent;){if(node.repeat&&node.repeat.value&&1<node.repeat.value)return!0
node=node.parent}return!1}(node)
if(!node.repeat&&node.parent.parent){node.parent.value=paragraph(dict,options.wordCount,startWithCommon)
node.remove()}else{node.value=paragraph(dict,options.wordCount,startWithCommon)
node.name=resolveImplicitName(node.parent.name)}return node}(node,options)}var defaultVariables={lang:"en",locale:"en-US",charset:"UTF-8"},stylesheetSyntaxes=new Set(["css","sass","scss","less","stylus","sss"]),defaultOptions={syntax:"html",field:function(index$$1,placeholder){return placeholder||""},text:null,profile:null,variables:{},snippets:{},addons:null,format:null}
function expand$$1(abbr,options){return(isStylesheet((options=createOptions(options)).syntax)?function(abbr,options){options=options||{}
"string"==typeof abbr&&(abbr=parse$2(abbr,options))
return index$6(abbr,options.profile,options.syntax,options.format)}:function(abbr,options){options=options||{}
"string"==typeof abbr&&(abbr=parse$1(abbr,options))
return index$3(abbr,options.profile,options.syntax,options.format)})(abbr,options)}function createSnippetsRegistry(syntax,snippets){return snippets instanceof SnippetsRegistry?snippets:snippetsRegistryFactory(isStylesheet(syntax)?"css":syntax,snippets)}function createOptions(options){"string"==typeof options&&(options={syntax:options});(options=Object.assign({},defaultOptions,options)).format=Object.assign({field:options.field},options.format)
options.profile=function(options){return options.profile instanceof Profile?options.profile:new Profile(options.profile)}(options)
options.variables=Object.assign({},defaultVariables,options.variables)
options.snippets=createSnippetsRegistry(isStylesheet(options.syntax)?"css":options.syntax,options.snippets)
return options}function isStylesheet(syntax){return stylesheetSyntaxes.has(syntax)}var knownSyntaxes=new Set(["html","xml","xsl","jsx","js","pug","slim","haml","css","sass","scss","less","sss","stylus"]),prototypeAccessors$1$1=function(tokenType,pos){tokenType=tokenType.getTokenTypeAt(pos||tokenType.getCursor())
return tokenType&&/^property\b/.test(tokenType)},autoActivationContext={html:function(editor,pos){return null===editor.getTokenTypeAt(pos||editor.getCursor())},css:prototypeAccessors$1$1,less:prototypeAccessors$1$1,sass:prototypeAccessors$1$1,scss:prototypeAccessors$1$1}
function detectSyntax(emmetOpt,syntax){syntax=emmetOpt.getModeAt(syntax||emmetOpt.getCursor()),syntax="xml"===syntax.name?"html":syntax.name
if(isSupported(syntax))return syntax
emmetOpt=emmetOpt.getOption("emmet")
return emmetOpt&&isSupported(emmetOpt.syntax)?emmetOpt.syntax:null}function isSupported(syntax){return knownSyntaxes.has(syntax)}function getIndentation(editor){return editor.getOption("indentWithTabs")?"\t":repeatString(" ",editor.getOption("indentUnit"))}function normalizeText(editor,lines,indentation){var lines=function(text){return Array.isArray(text)?text:text.split(/\r\n|\r|\n/g)}(lines),indent=getIndentation(editor)
"\t"!==indent&&(lines=lines.map(function(line){return line.replace(/^\t+/,function(tabs){return repeatString(indent,tabs.length)})}))
indentation&&(lines=lines.map(function(line,i){return i?indentation+line:line}))
return lines.join("\n")}function repeatString(str,count){for(var result="";0<count--;)result+=str
return result}function containsPos(range,pos,exclude){return exclude?0<comparePos(pos,range.from)&&comparePos(pos,range.to)<0:0<=comparePos(pos,range.from)&&comparePos(pos,range.to)<=0}function comparePos(a,b){return a.line-b.line||a.ch-b.ch}var cursorMark="[[::emmet-cursor::]]",editorField=function(index,placeholder){void 0===placeholder&&(placeholder="")
return placeholder}
function expandAbbreviation(abbr,editor,options){return expand$$1(abbr,Object.assign({syntax:detectSyntax(editor),field:editorField},getExpandOptions(editor),options))}function parseAbbreviation(abbr,editor){return function(abbr,options){return(isStylesheet((options=createOptions(options)).syntax)?parse$2:parse$1)(abbr,options)}(abbr,Object.assign({syntax:detectSyntax(editor)},getExpandOptions(editor)))}function extractAbbreviation(editor,pos){pos=pos||pos.getCursor()
return extractAbbreviation$1(editor.getLine(pos.line),pos.ch,!0)}function createAbbreviationModel(abbreviation,editor){try{return{ast:parseAbbreviation(abbreviation,editor),abbreviation:abbreviation,snippet:expandAbbreviation(abbreviation,editor)}}catch(err){return null}}function expandAndInsert(editor,abbr,range){var cursorMarked=!1,newSelectionSize=0
try{expanded=expandAbbreviation(abbr,editor,{field:function(index,placeholder){void 0===placeholder&&(placeholder="")
if(!cursorMarked){cursorMarked=!0
newSelectionSize=placeholder.length
placeholder=cursorMark+placeholder}return placeholder}})}catch(err){return!1}var expanded,matchIndent=editor.getLine(range.from.line).match(/^\s+/),newCursorPos=(expanded=normalizeText(editor,expanded,matchIndent&&matchIndent[0])).length
if(cursorMarked){newCursorPos=expanded.indexOf(cursorMark)
expanded=expanded.slice(0,newCursorPos)+expanded.slice(newCursorPos+cursorMark.length)}return editor.operation(function(){editor.replaceRange(expanded,range.from,range.to)
var newCursor=editor.indexFromPos(range.from),newCursor=editor.posFromIndex(newCursorPos+newCursor)
newSelectionSize?editor.setSelection(newCursor,{line:newCursor.line,ch:newCursor.ch+newSelectionSize}):editor.setCursor(newCursor)
return!0})}function getExpandOptions(editor,pos){var mode=editor.getModeAt(pos||editor.getCursor()),emmetOpt=editor.getOption("emmet"),profile=emmetOpt&&emmetOpt.profile
"xml"===mode.name&&(profile=Object.assign({selfClosingStyle:mode.configuration},profile))
return Object.assign({profile:profile,snippets:snippetsFromOptions(editor,detectSyntax(editor,pos))},emmetOpt)}function snippetsFromOptions(emmetOpt,syntax){emmetOpt=emmetOpt.getOption("emmet")
if(emmetOpt)return isStylesheet(syntax)?emmetOpt.stylesheetSnippets:emmetOpt.markupSnippets}var emmetMarkerClass="emmet-abbreviation"
function markOnEditorChange(editor){var marker=findMarker(editor,editor.getCursor())
if(!marker||!function(editor,marker){var text=marker.find()
if(text.from.line!==text.to.line)return!1
text=editor.getRange(text.from,text.to)
if(!text||/^\s|\s$/g.test(text))return!1
marker.model&&marker.model.abbreviation===text||(marker.model=createAbbreviationModel(text,editor))
return!(!marker.model||!marker.model.snippet)}(editor,marker)){clearMarkers(editor)
!function(editor,pos){var syntax=detectSyntax(editor,pos)
return syntax&&(!autoActivationContext[syntax]||autoActivationContext[syntax](editor,pos))}(editor)||markAbbreviation(editor,editor.getCursor())}}function findMarker(editor,pos){for(var markers=editor.findMarksAt(pos),i=0;i<markers.length;i++)if(markers[i].className===emmetMarkerClass)return markers[i]}function markAbbreviation(editor,pos,from){var model=findMarker(editor,pos)
if(model)return model
clearMarkers(editor)
var marker$1=extractAbbreviation(editor,pos),model=marker$1&&createAbbreviationModel(marker$1.abbreviation,editor)
if(model&&(from||function(rootNode){rootNode=rootNode.ast.children[0]
return rootNode&&/^[a-z]/i.test(rootNode.name)}(model))){from={line:pos.line,ch:marker$1.location},marker$1={line:pos.line,ch:marker$1.location+marker$1.abbreviation.length},marker$1=editor.markText(from,marker$1,{inclusiveRight:!0,clearWhenEmpty:!0,className:emmetMarkerClass})
marker$1.model=model
return marker$1}}function clearMarkers(editor){for(var markers=editor.getAllMarks(),i=0;i<markers.length;i++)markers[i].className===emmetMarkerClass&&markers[i].clear()}function autocompleteProvider(editor,abbrModel,abbrPos,cursorPos){cursorPos=cursorPos||editor.getCursor()
var syntax=detectSyntax(editor,cursorPos)
return syntax?(isStylesheet(syntax)?function(editor,abbrModel,abbrPos,completions){var result=[]
completions=completions||editor.getCursor()
var abbrRange={from:abbrPos,to:{line:abbrPos.line,ch:abbrPos.ch+abbrModel.abbreviation.length}}
result.push(new EmmetCompletion("expanded-abbreviation",editor,abbrRange,"Expand abbreviation",abbrModel.snippet,function(){return expandAndInsert(editor,abbrModel.abbreviation,abbrRange)}))
var prefix=function(abbr,pos){return getPrefix(abbr,pos,/[\w-@$]+$/)}(abbrModel.abbreviation,completions.ch-abbrPos.ch)
if(null!==prefix){var prefixRange={from:{line:completions.line,ch:completions.ch-prefix.length},to:completions},completions=getSnippetCompletions(editor,completions).filter(function(snippet){return snippet.key!==prefix&&0===snippet.key.indexOf(prefix)}).map(function(snippet){return new EmmetCompletion("snippet",editor,prefixRange,snippet.key,snippet.preview,snippet.key)})
result=result.concat(completions)}return result}:function(editor,abbrModel,abbrPos,completions){var result=[]
completions=completions||editor.getCursor()
var abbrRange={from:abbrPos,to:{line:abbrPos.line,ch:abbrPos.ch+abbrModel.abbreviation.length}}
result.push(new EmmetCompletion("expanded-abbreviation",editor,abbrRange,"Expand abbreviation",abbrModel.snippet,function(){return expandAndInsert(editor,abbrModel.abbreviation,abbrRange)}))
var prefix=function(abbr,pos){return getPrefix(abbr,pos,/[\w:\-\$@]+$/)}(abbrModel.abbreviation,completions.ch-abbrPos.ch)
if(null!==prefix){var prefixRange={from:{line:completions.line,ch:completions.ch-prefix.length},to:completions},completions=getSnippetCompletions(editor,completions).filter(function(snippet){return snippet.key!==prefix&&0===snippet.key.indexOf(prefix)}).map(function(snippet){return new EmmetCompletion("snippet",editor,prefixRange,snippet.key,snippet.preview,snippet.key)})
result=result.concat(completions)}return result})(editor,abbrModel,abbrPos,cursorPos):[]}function getSnippetCompletions(editor,registry){var syntax=detectSyntax(editor,registry)
editor.state.emmetCompletions||(editor.state.emmetCompletions={})
var cache=editor.state.emmetCompletions
if(!(syntax in cache)){registry=createSnippetsRegistry(syntax,snippetsFromOptions(editor,syntax))
if(isStylesheet(syntax))cache[syntax]=convertToCSSSnippets(registry).map(function(snippet){var preview=snippet.property,keywords=snippet.keywords()
keywords.length&&(preview+=": "+keywords.join(" | ").replace(/\$\{\d+(:[^\}]+)?\}/g,""))
return{key:snippet.key,value:snippet.value,keywords:keywords,preview:preview}})
else{var expandOpt={syntax:syntax,field:function(index,placeholder){return placeholder||""}}
cache[syntax]=registry.all({type:"string"}).map(function(snippet){return{key:snippet.key,value:snippet.value,preview:expandAbbreviation(snippet.value,editor,expandOpt)}})}}return cache[syntax]}function getPrefix(abbr,pos,prefix){if(0===pos)return""
prefix=abbr.slice(0,pos).match(prefix),prefix=prefix&&prefix[0]||""
return prefix&&(prefix===abbr||/[>\^\+\(\)]/.test(abbr[pos-prefix.length-1]))?prefix:null}var EmmetCompletion=function(type,editor,range,label,preview,snippet){this.type=type
this.editor=editor
this.range=range
this.label=label
this.preview=preview
this.snippet=snippet
this._inserted=!1}
EmmetCompletion.prototype.insert=function(){if(!this._inserted){this._inserted=!0
if("function"==typeof this.snippet)this.snippet(this.editor,this.range)
else{this.editor.replaceRange(this.snippet,this.range.from,this.range.to)
var newCursor=this.editor.indexFromPos(this.range.from),newCursor=this.editor.posFromIndex(newCursor+this.snippet.length)
this.editor.setCursor(newCursor)}}}
var Node$2=function(stream,type,open,close){this.stream=stream
this.type=type
this.open=open
this.close=close
this.children=[]
this.parent=null},prototypeAccessors$1$1={name:{},attributes:{},start:{},end:{},firstChild:{},nextSibling:{},previousSibling:{}}
prototypeAccessors$1$1.name.get=function(){return"tag"===this.type&&this.open?this.open&&this.open.name&&this.open.name.value:"#"+this.type}
prototypeAccessors$1$1.attributes.get=function(){return this.open&&this.open.attributes}
prototypeAccessors$1$1.start.get=function(){return this.open&&this.open.start}
prototypeAccessors$1$1.end.get=function(){return this.close?this.close.end:this.open&&this.open.end}
prototypeAccessors$1$1.firstChild.get=function(){return this.children[0]}
prototypeAccessors$1$1.nextSibling.get=function(){var ix=this.getIndex()
return-1!==ix?this.parent.children[ix+1]:null}
prototypeAccessors$1$1.previousSibling.get=function(){var ix=this.getIndex()
return-1!==ix?this.parent.children[ix-1]:null}
Node$2.prototype.getIndex=function(){return this.parent?this.parent.children.indexOf(this):-1}
Node$2.prototype.addChild=function(node){this.removeChild(node)
this.children.push(node)
return node.parent=this}
Node$2.prototype.removeChild=function(node){var ix=this.children.indexOf(node)
if(-1!==ix){this.children.splice(ix,1)
node.parent=null}return this}
Object.defineProperties(Node$2.prototype,prototypeAccessors$1$1)
var token=function(stream,start,end){return"function"==typeof start?function(stream,test){var start=stream.pos
if(stream.eatWhile(test))return new Token(stream,start,stream.pos)
stream.pos=start}(stream,start):new Token(stream,start,end)}
var Token=function(stream,start,end){this.stream=stream
this.start=null!=start?start:stream.start
this.end=null!=end?end:stream.pos
this._value=null},prototypeAccessors$1$1={value:{}}
prototypeAccessors$1$1.value.get=function(){if(null===this._value){var start=this.stream.start,end=this.stream.pos
this.stream.start=this.start
this.stream.pos=this.end
this._value=this.stream.current()
this.stream.start=start
this.stream.pos=end}return this._value}
Token.prototype.toString=function(){return this.value}
Token.prototype.valueOf=function(){return this.value+" ["+this.start+"; "+this.end+"]"}
Object.defineProperties(Token.prototype,prototypeAccessors$1$1)
function eatAttributes(stream){for(var attr,result=[];!stream.eof();){stream.eatWhile(isSpace)
if((attr={start:stream.pos}).name=function(stream){return eatPaired(stream)||token(stream,isAttributeName)}(stream)){stream.eat(EQUALS$2)?attr.value=function(stream){var valueStart,result=stream.pos
if(eatQuoted$1(stream)){var current=stream.pos
stream.pos=result
stream.next()
valueStart=stream.start=stream.pos
stream.pos=current
stream.backUp(1)
result=stream.pos
result=token(stream,valueStart,result)
stream.pos=current
return result}return eatPaired(stream)||function(stream){return token(stream,isUnquoted$1)}(stream)}(stream):attr.boolean=!0
attr.end=stream.pos
result.push(attr)}else{if(isTerminator(stream.peek()))break
stream.next()}}return result}var opt$2={throws:!0},eatPaired=function(stream){var start=stream.pos
if(eatPair(stream,60,62,opt$2)||eatPair(stream,91,93,opt$2)||eatPair(stream,40,41,opt$2)||eatPair(stream,123,125,opt$2))return token(stream,start)},SLASH$1$1=47,EQUALS$2=61,RIGHT_ANGLE$1=62
function isAttributeName(code){return code!==EQUALS$2&&!isTerminator(code)&&!isSpace(code)}function isTerminator(code){return code===RIGHT_ANGLE$1||code===SLASH$1$1}function isUnquoted$1(code){return!(isNaN(code)||isQuote$1(code)||isSpace(code)||isTerminator(code))}var DASH$2$1=45,DOT$2=46,COLON$3=58,UNDERSCORE=95,tag=function(stream){var start=stream.pos
if(stream.eat(60)){var model={type:stream.eat(47)?"close":"open"}
if(model.name=function(stream){return token(stream,isTagName)}(stream)){if("close"!==model.type){model.attributes=eatAttributes(stream)
stream.eatWhile(isSpace)
model.selfClosing=stream.eat(47)}if(stream.eat(62))return Object.assign(token(stream,start),model)}}stream.pos=start
return null}
function isTagName(code){return isAlphaNumeric(code)||code===COLON$3||code===DOT$2||code===DASH$2$1||code===UNDERSCORE}function eatArray(stream,codes){for(var start=stream.pos,i=0;i<codes.length;i++)if(!stream.eat(codes[i])){stream.pos=start
return}stream.start=start
return 1}function eatSection(stream,open,close,allowUnclosed){var start=stream.pos
if(eatArray(stream,open)){for(;!stream.eof();){if(eatArray(stream,close))return 1
stream.next()}if(allowUnclosed)return 1
stream.pos=start}else stream.pos=start}function toCharCodes(str){return str.split("").map(function(ch){return ch.charCodeAt(0)})}var open=toCharCodes("\x3c!--"),close=toCharCodes("--\x3e"),comment=function(stream){var result=stream.pos
if(eatSection(stream,open,close,!0)){result=token(stream,result)
result.type="comment"
return result}return null},open$1=toCharCodes("<![CDATA["),close$1=toCharCodes("]]>"),cdata=function(stream){var result=stream.pos
if(eatSection(stream,open$1,close$1,!0)){result=token(stream,result)
result.type="cdata"
return result}return null},defaultOptions$6={xml:!1,special:["script","style"],empty:["img","meta","link","br","base","hr","area","wbr"]}
function parse$3(root,options){options=Object.assign({},defaultOptions$6,options)
for(var m,name,node,stream="string"==typeof root?new StreamReader$1(root):root,root=new Node$2(stream,"root"),empty=new Set(options.empty),special=options.special.reduce(function(map,name){return map.set(name,toCharCodes("</"+name+">"))},new Map),stack=[root];!stream.eof();)if(m=function(stream){if(60===stream.peek())return comment(stream)||cdata(stream)||tag(stream)}(stream)){name=(node=m).name?node.name.value.toLowerCase():"#"+node.type
if("open"===m.type){node=new Node$2(stream,"tag",m)
last$1(stack).addChild(node)
special.has(name)?node.close=function(stream,codes){var start=stream.pos
for(;!stream.eof();){if(eatArray(stream,codes)){stream.pos=stream.start
return tag(stream)}stream.next()}stream.pos=start
return null}(stream,special.get(name)):function(token,name){return token.selfClosing||!options.xml&&empty.has(name)}(m,name)||stack.push(node)}else if("close"===m.type){for(var i=stack.length-1;0<i;i--)if(stack[i].name.toLowerCase()===name){stack[i].close=m
stack=stack.slice(0,i)
break}}else last$1(stack).addChild(new Node$2(stream,m.type,m))}else stream.next()
return root}function last$1(arr){return arr[arr.length-1]}var SyntaxModel=function(dom,type,syntax){this.dom=dom
this.type=type
this.syntax=syntax}
SyntaxModel.prototype.nodeForPoint=function(pos,exclude){for(var node,ctx=this.dom.firstChild,found=null;ctx;)ctx=containsPos({from:(node=ctx).start,to:node.end},pos,exclude)?(found=ctx).firstChild:ctx.nextSibling
return found}
var CodeMirrorStreamReader=function(StreamReader){function CodeMirrorStreamReader(lastLine,pos,limit){StreamReader.call(this)
var CodeMirror=lastLine.constructor
this.editor=lastLine
this.start=this.pos=pos||CodeMirror.Pos(0,0)
lastLine=lastLine.lastLine()
this._eof=limit?limit.to:CodeMirror.Pos(lastLine,this._lineLength(lastLine))
this._sof=limit?limit.from:CodeMirror.Pos(0,0)}StreamReader&&(CodeMirrorStreamReader.__proto__=StreamReader);((CodeMirrorStreamReader.prototype=Object.create(StreamReader&&StreamReader.prototype)).constructor=CodeMirrorStreamReader).prototype.sof=function(){return comparePos(this.pos,this._sof)<=0}
CodeMirrorStreamReader.prototype.eof=function(){return 0<=comparePos(this.pos,this._eof)}
CodeMirrorStreamReader.prototype.limit=function(from,to){return new this.constructor(this.editor,from,{from:from,to:to})}
CodeMirrorStreamReader.prototype.peek=function(){var lineStr=this.pos,ch=(lineStr.line,lineStr.ch),lineStr=this.editor.getLine(this.pos.line)
return ch<lineStr.length?lineStr.charCodeAt(ch):10}
CodeMirrorStreamReader.prototype.next=function(){if(this.eof())return NaN
var code=this.peek()
this.pos=Object.assign({},this.pos,{ch:this.pos.ch+1})
if(this.pos.ch>=this._lineLength(this.pos.line)){this.pos.line++
this.pos.ch=0}this.eof()&&(this.pos=Object.assign({},this._eof))
return code}
CodeMirrorStreamReader.prototype.backUp=function(n){var CodeMirror=this.editor.constructor,ref=this.pos,line=ref.line,ch=ref.ch
ch-=n||1
for(;0<=line&&ch<0;){line--
ch+=this._lineLength(line)}this.pos=line<0||ch<0?CodeMirror.Pos(0,0):CodeMirror.Pos(line,ch)
return this.peek()}
CodeMirrorStreamReader.prototype.current=function(){return this.substring(this.start,this.pos)}
CodeMirrorStreamReader.prototype.substring=function(from,to){return this.editor.getRange(from,to)}
CodeMirrorStreamReader.prototype.error=function(message){var err=new Error(message+" at line "+this.pos.line+", column "+this.pos.ch)
err.originalMessage=message
err.pos=this.pos
err.string=this.string
return err}
CodeMirrorStreamReader.prototype._lineLength=function(line){var isLast=line===this.editor.lastLine()
return this.editor.getLine(line).length+(isLast?0:1)}
return CodeMirrorStreamReader}(StreamReader$1)
function getModel(editor){return function(editor,syntax){var stream=new CodeMirrorStreamReader(editor),xml="xml"===syntax
try{return new SyntaxModel(parse$3(stream,{xml:xml}),"html",syntax||"html")}catch(err){console.warn(err)}}(editor,function(mode){mode=mode.getMode()
return"htmlmixed"!==mode.name?"xml"===mode.name?mode.configuration:mode.name:"html"}(editor))}function resetCachedModel(editor){editor.state._emmetModel=null}var openTagMark="emmet-open-tag",closeTagMark="emmet-close-tag"
function matchTag(editor,node){node=node||editor.getCursor()
var marked=getMarkedTag(editor)
if(marked)if(containsPos(marked.open.find(),node)){if(!marked.close||text(editor,marked.open)===text(editor,marked.close))return marked}else if(marked.close&&containsPos(marked.close.find(),node)&&text(editor,marked.open)===text(editor,marked.close))return marked
clearTagMatch(editor)
node=function(editor,pos){var model=editor.getEmmetDocumentModel()
return model&&model.nodeForPoint(pos||editor.getCursor())}(editor,node)
if(node&&"tag"===node.type)return{open:createTagMark(editor,node.open.name,openTagMark),close:node.close&&createTagMark(editor,node.close.name,closeTagMark)}}function getMarkedTag(editor){var open,close
editor.getAllMarks().forEach(function(mark){mark.className===openTagMark?open=mark:mark.className===closeTagMark&&(close=mark)})
return open?{open:open,close:close}:null}function clearTagMatch(editor){editor.getAllMarks().forEach(function(mark){mark.className!==openTagMark&&mark.className!==closeTagMark||mark.clear()})}function createTagMark(editor,tag,className){return editor.markText(tag.start,tag.end,{className:className,inclusiveLeft:!0,inclusiveRight:!0,clearWhenEmpty:!1})}function text(editor,range){range=range.find()
return range?editor.getRange(range.from,range.to):""}function renameTag(editor,pos){var tag=getMarkedTag(editor),pos=pos.from
tag&&(containsPos(tag.open.find(),pos)&&tag.close?updateTag(editor,tag.open,tag.close):tag.close&&containsPos(tag.close.find(),pos)&&updateTag(editor,tag.close,tag.open))}function updateTag(editor,range,newName){var name=function(editor,range){range=range.find()
return range?editor.getRange(range.from,range.to):""}(editor,range),range=newName.find(),newName=name.match(/[\w:\-]+/),newName=name?newName&&newName[0]:""
null!=newName?editor.getRange(range.from,range.to)!==newName&&editor.replaceRange(newName,range.from,range.to):clearTagMatch(editor)}var commands={emmetExpandAbbreviation:function(editor){if(editor.somethingSelected())return editor.constructor.Pass
var range=editor.getCursor(),abbrData=findMarker(editor,range),result=!1
if(abbrData)result=expandAndInsert(editor,abbrData.model.ast,abbrData.find())
else{abbrData=extractAbbreviation(editor,range)
abbrData&&(range={from:{line:range.line,ch:abbrData.location},to:{line:range.line,ch:abbrData.location+abbrData.abbreviation.length}},result=expandAndInsert(editor,abbrData.abbreviation,range))}clearMarkers(editor)
return result||editor.constructor.Pass},emmetInsertLineBreak:function(editor){var startIx=editor.getCursor()
if("xml"===editor.getModeAt(startIx).name){Object.assign({},startIx,{ch:startIx.ch+1})
var newCursor=editor.getTokenAt(startIx),after=editor.getTokenAt(Object.assign({},startIx,{ch:startIx.ch+1}))
if("tag bracket"===newCursor.type&&">"===newCursor.string&&"tag bracket"===after.type&&"</"===after.string){newCursor=editor.getLine(startIx.line).match(/^\s+/),after=newCursor?newCursor[0]:"",newCursor="\n"+after+getIndentation(editor),after="\n"+after
editor.replaceRange(newCursor+after,startIx,startIx)
startIx=editor.indexFromPos(startIx),newCursor=editor.posFromIndex(startIx+newCursor.length)
editor.setCursor(newCursor)
return}}return editor.constructor.Pass}}
"undefined"!=typeof CodeMirror&&function(CodeMirror){Object.assign(CodeMirror.commands,commands)
CodeMirror.defineOption("markEmmetAbbreviation",!0,function(editor,value){if(value)editor.on("change",markOnEditorChange)
else{editor.off("change",markOnEditorChange)
clearMarkers(editor)}})
CodeMirror.defineOption("autoRenameTags",!0,function(editor,value){value?editor.on("change",renameTag):editor.off("change",renameTag)})
CodeMirror.defineOption("markTagPairs",!1,function(editor,value){if(value){editor.on("cursorActivity",matchTag)
editor.on("change",resetCachedModel)}else{editor.off("cursorActivity",matchTag)
editor.off("change",resetCachedModel)
resetCachedModel(editor)
clearTagMatch(editor)}})
CodeMirror.defineOption("emmet",{})
CodeMirror.defineExtension("getEmmetCompletions",function(pos,extracted){var abbrRange,list
if("boolean"==typeof pos){extracted=pos
pos=null}pos=pos||this.getCursor()
if(this.getOption("markEmmetAbbreviation")){var model=findMarker(this,pos)||extracted&&markAbbreviation(this,pos,!0)
if(model){abbrRange=model.find()
list=autocompleteProvider(this,model.model,abbrRange.from,pos)}}else{extracted=extractAbbreviation(this,pos)
if(extracted){model=createAbbreviationModel(extracted.abbreviation,this)
if(model){abbrRange={from:{line:pos.line,ch:extracted.location},to:{line:pos.line,ch:extracted.location+extracted.abbreviation.length}}
list=autocompleteProvider(this,model,abbrRange.from,pos)}}}if(list&&list.length)return{from:abbrRange.from,to:abbrRange.to,list:list}})
CodeMirror.defineExtension("getEmmetAbbreviation",function(pos){pos=pos||this.getCursor()
var marker=findMarker(this,pos)
if(marker)return{abbreviation:marker.model.abbreviation,ast:marker.model.ast,location:marker.find().from,fromMarker:!0}
var extracted=extractAbbreviation(this,pos)
if(extracted)try{return{abbreviation:extracted.abbreviation,ast:parseAbbreviation(extracted.abbreviation,this),location:{line:pos.line,ch:extracted.location},fromMarker:!1}}catch(err){}return null})
CodeMirror.defineExtension("findEmmetMarker",function(pos){return findMarker(this,pos||this.getCursor())})
CodeMirror.defineExtension("getEmmetDocumentModel",function(){return(this.getOption("markTagPairs")?function(editor){editor.state._emmetModel||(editor.state._emmetModel=getModel(editor))
return editor.state._emmetModel}:getModel)(this)})}(CodeMirror)})
