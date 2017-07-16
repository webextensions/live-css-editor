!function(f){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=f()
else if("function"==typeof define&&define.amd)define([],f)
else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).less=f()}}(function(){return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require
if(!u&&a)return a(o,!0)
if(i)return i(o,!0)
var f=new Error("Cannot find module '"+o+"'")
throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}}
t[o][0].call(l.exports,function(e){var n=t[o][1][e]
return s(n||e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o])
return s}({1:[function(require,module,exports){module.exports={getSourceMapGenerator:function(){return require("source-map").SourceMapGenerator}}},{"source-map":111}],2:[function(require,module,exports){var environment=require("./environment-basic-less-with-sourcemap-support"),createFromEnvironment=require("../less"),less=createFromEnvironment(environment,[])
less.createFromEnvironment=createFromEnvironment
less.PluginLoader=require("./plugin-loader")
less.options=require("../less/default-options")()
module.exports=less},{"../less":27,"../less/default-options":8,"./environment-basic-less-with-sourcemap-support":1,"./plugin-loader":3}],3:[function(require,module,exports){(function(process){var path=require("path"),AbstractPluginLoader=require("../less/environment/abstract-plugin-loader.js"),PluginLoader=function(less){this.less=less
this.require=require
this.requireRelative=function(prefix){prefix=path.dirname(prefix)
return function(id){var str=id.substr(0,2)
return require(".."===str||"./"===str?path.join(prefix,id):id)}}};(PluginLoader.prototype=new AbstractPluginLoader).tryLoadPlugin=function(name,basePath,callback){var self=this,prefix=name.slice(0,1),explicit="."===prefix||"/"===prefix||".js"===name.slice(-3).toLowerCase()
explicit?this.tryLoadFromEnvironment(name,basePath,explicit,callback):this.tryLoadFromEnvironment("less-plugin-"+name,basePath,explicit,function(err,data){err?self.tryLoadFromEnvironment(name,basePath,explicit,callback):callback(null,data)})}
PluginLoader.prototype.tryLoadFromEnvironment=function(name,basePath,explicit,callback){function getFile(filename){var fileManager=new self.less.FileManager
filename=fileManager.tryAppendExtension(filename,".js")
fileManager.loadFile(filename).then(function(data){try{self.require=self.requireRelative(filename)}catch(e){callback(e)}callback(null,data)},function(err){callback(err)})}var filename=name,self=this
if(explicit){basePath&&(filename=path.join(basePath,name))
getFile(filename)}else{try{filename=require.resolve(path.join("../../../",name))}catch(e){}try{filename=require.resolve(path.join(process.cwd(),"node_modules",name))}catch(e){}try{filename=require.resolve(path.join(process.cwd(),name))}catch(e){}if("."!==name[0])try{filename=require.resolve(name)}catch(e){}basePath&&(filename=path.join(basePath,name))
filename?getFile(filename):callback({message:"Plugin could not be found."})}}
module.exports=PluginLoader}).call(this,require("_process"))},{"../less/environment/abstract-plugin-loader.js":10,_process:92,path:91}],4:[function(require,module,exports){var contexts={}
module.exports=contexts
var copyFromOriginal=function(original,destination,propertiesToCopy){if(original)for(var i=0;i<propertiesToCopy.length;i++)original.hasOwnProperty(propertiesToCopy[i])&&(destination[propertiesToCopy[i]]=original[propertiesToCopy[i]])},parseCopyProperties=["paths","relativeUrls","rootpath","strictImports","insecure","dumpLineNumbers","compress","syncImport","chunkInput","mime","useFileCache","processImports","pluginManager"]
contexts.Parse=function(options){copyFromOriginal(options,this,parseCopyProperties)
"string"==typeof this.paths&&(this.paths=[this.paths])}
var evalCopyProperties=["paths","compress","ieCompat","strictMath","strictUnits","sourceMap","importMultiple","urlArgs","javascriptEnabled","pluginManager","importantScope"]
contexts.Eval=function(options,frames){copyFromOriginal(options,this,evalCopyProperties)
"string"==typeof this.paths&&(this.paths=[this.paths])
this.frames=frames||[]
this.importantScope=this.importantScope||[]}
contexts.Eval.prototype.inParenthesis=function(){this.parensStack||(this.parensStack=[])
this.parensStack.push(!0)}
contexts.Eval.prototype.outOfParenthesis=function(){this.parensStack.pop()}
contexts.Eval.prototype.isMathOn=function(){return!this.strictMath||this.parensStack&&this.parensStack.length}
contexts.Eval.prototype.isPathRelative=function(path){return!/^(?:[a-z-]+:|\/|#)/i.test(path)}
contexts.Eval.prototype.normalizePath=function(path){var segment,segments=path.split("/").reverse()
path=[]
for(;0!==segments.length;)switch(segment=segments.pop()){case".":break
case"..":0===path.length||".."===path[path.length-1]?path.push(segment):path.pop()
break
default:path.push(segment)}return path.join("/")}},{}],5:[function(require,module,exports){module.exports={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgrey:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",grey:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgrey:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370d8",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#d87093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"}},{}],6:[function(require,module,exports){module.exports={colors:require("./colors"),unitConversions:require("./unit-conversions")}},{"./colors":5,"./unit-conversions":7}],7:[function(require,module,exports){module.exports={length:{m:1,cm:.01,mm:.001,in:.0254,px:.0254/96,pt:.0254/72,pc:.0254/72*12},duration:{s:1,ms:.001},angle:{rad:1/(2*Math.PI),deg:1/360,grad:.0025,turn:1}}},{}],8:[function(require,module,exports){module.exports=function(){return{depends:!1,compress:!1,lint:!1,paths:[],color:!0,strictImports:!1,insecure:!1,rootpath:"",relativeUrls:!1,ieCompat:!1,strictMath:!1,strictUnits:!1,globalVars:null,modifyVars:null,urlArgs:""}}},{}],9:[function(require,module,exports){var abstractFileManager=function(){}
abstractFileManager.prototype.getPath=function(filename){var j=filename.lastIndexOf("?")
j>0&&(filename=filename.slice(0,j));(j=filename.lastIndexOf("/"))<0&&(j=filename.lastIndexOf("\\"))
return j<0?"":filename.slice(0,j+1)}
abstractFileManager.prototype.tryAppendExtension=function(path,ext){return/(\.[a-z]*$)|([\?;].*)$/.test(path)?path:path+ext}
abstractFileManager.prototype.tryAppendLessExtension=function(path){return this.tryAppendExtension(path,".less")}
abstractFileManager.prototype.supportsSync=function(){return!1}
abstractFileManager.prototype.alwaysMakePathsAbsolute=function(){return!1}
abstractFileManager.prototype.isPathAbsolute=function(filename){return/^(?:[a-z-]+:|\/|\\|#)/i.test(filename)}
abstractFileManager.prototype.join=function(basePath,laterPath){return basePath?basePath+laterPath:laterPath}
abstractFileManager.prototype.pathDiff=function(url,baseUrl){var i,max,urlDirectories,baseUrlDirectories,urlParts=this.extractUrlParts(url),baseUrlParts=this.extractUrlParts(baseUrl),diff=""
if(urlParts.hostPart!==baseUrlParts.hostPart)return""
max=Math.max(baseUrlParts.directories.length,urlParts.directories.length)
for(i=0;i<max&&baseUrlParts.directories[i]===urlParts.directories[i];i++);baseUrlDirectories=baseUrlParts.directories.slice(i)
urlDirectories=urlParts.directories.slice(i)
for(i=0;i<baseUrlDirectories.length-1;i++)diff+="../"
for(i=0;i<urlDirectories.length-1;i++)diff+=urlDirectories[i]+"/"
return diff}
abstractFileManager.prototype.extractUrlParts=function(url,baseUrl){var i,baseUrlParts,urlPartsRegex=/^((?:[a-z-]+:)?\/{2}(?:[^\/\?#]*\/)|([\/\\]))?((?:[^\/\\\?#]*[\/\\])*)([^\/\\\?#]*)([#\?].*)?$/i,urlParts=url.match(urlPartsRegex),returner={},directories=[]
if(!urlParts)throw new Error("Could not parse sheet href - '"+url+"'")
if(baseUrl&&(!urlParts[1]||urlParts[2])){if(!(baseUrlParts=baseUrl.match(urlPartsRegex)))throw new Error("Could not parse page url - '"+baseUrl+"'")
urlParts[1]=urlParts[1]||baseUrlParts[1]||""
urlParts[2]||(urlParts[3]=baseUrlParts[3]+urlParts[3])}if(urlParts[3]){directories=urlParts[3].replace(/\\/g,"/").split("/")
for(i=0;i<directories.length;i++)if("."===directories[i]){directories.splice(i,1)
i-=1}for(i=0;i<directories.length;i++)if(".."===directories[i]&&i>0){directories.splice(i-1,2)
i-=2}}returner.hostPart=urlParts[1]
returner.directories=directories
returner.path=(urlParts[1]||"")+directories.join("/")
returner.filename=urlParts[4]
returner.fileUrl=returner.path+(urlParts[4]||"")
returner.url=returner.fileUrl+(urlParts[5]||"")
return returner}
module.exports=abstractFileManager},{}],10:[function(require,module,exports){function error(msg,type){throw new LessError({type:type||"Syntax",message:msg})}var functionRegistry=require("../functions/function-registry"),LessError=require("../less-error"),AbstractPluginLoader=function(){}
AbstractPluginLoader.prototype.evalPlugin=function(contents,context,imports,pluginOptions,fileInfo){var registry,pluginObj,localModule,pluginManager,filename
pluginManager=context.pluginManager
fileInfo&&(filename="string"==typeof fileInfo?fileInfo:fileInfo.filename)
var shortname=(new this.less.FileManager).extractUrlParts(filename).filename
if(filename&&(pluginObj=pluginManager.get(filename))){this.trySetOptions(pluginObj,filename,shortname,pluginOptions)
try{pluginObj.use&&pluginObj.use.call(this.context,pluginObj)}catch(e){e.message="Error during @plugin call"
return new this.less.LessError(e,imports,filename)}return pluginObj}(localModule={exports:{},pluginManager:pluginManager,fileInfo:fileInfo}).exports
registry=functionRegistry.create()
try{new Function("module","require","registerPlugin","functions","tree","less","fileInfo",contents)(localModule,this.require,function(obj){pluginObj=obj},registry,this.less.tree,this.less,fileInfo)}catch(e){return new this.less.LessError({message:"Parse error"},imports,filename)}pluginObj||(pluginObj=localModule.exports)
if(!(pluginObj=this.validatePlugin(pluginObj,filename,shortname)))return new this.less.LessError({message:"Not a valid plugin"})
pluginManager.addPlugin(pluginObj,fileInfo.filename,registry)
pluginObj.functions=registry.getLocalFunctions()
pluginObj.imports=imports
pluginObj.filename=filename
this.trySetOptions(pluginObj,filename,shortname,pluginOptions)
try{pluginObj.use&&pluginObj.use.call(this.context,pluginObj)}catch(e){e.message="Error during @plugin call"
return new this.less.LessError(e,imports,filename)}return pluginObj}
AbstractPluginLoader.prototype.trySetOptions=function(plugin,filename,name,options){if(options){if(!plugin.setOptions){error("Options have been provided but the plugin "+name+" does not support any options.")
return null}try{plugin.setOptions(options)}catch(e){error("Error setting options on plugin "+name+"\n"+e.message)
return null}}}
AbstractPluginLoader.prototype.validatePlugin=function(plugin,filename,name){if(plugin){"function"==typeof plugin&&(plugin=new plugin)
if(plugin.minVersion&&this.compareVersion(plugin.minVersion,this.less.version)<0){error("Plugin "+name+" requires version "+this.versionToString(plugin.minVersion))
return null}return plugin}return null}
AbstractPluginLoader.prototype.compareVersion=function(aVersion,bVersion){"string"==typeof aVersion&&(aVersion=aVersion.match(/^(\d+)\.?(\d+)?\.?(\d+)?/)).shift()
for(var i=0;i<aVersion.length;i++)if(aVersion[i]!==bVersion[i])return parseInt(aVersion[i])>parseInt(bVersion[i])?-1:1
return 0}
AbstractPluginLoader.prototype.versionToString=function(version){for(var versionString="",i=0;i<version.length;i++)versionString+=(versionString?".":"")+version[i]
return versionString}
AbstractPluginLoader.prototype.printUsage=function(plugins){for(var i=0;i<plugins.length;i++){var plugin=plugins[i]
plugin.printUsage&&plugin.printUsage()}}
module.exports=AbstractPluginLoader},{"../functions/function-registry":18,"../less-error":28}],11:[function(require,module,exports){var logger=require("../logger"),environment=function(externalEnvironment,fileManagers){this.fileManagers=fileManagers||[]
externalEnvironment=externalEnvironment||{}
for(var optionalFunctions=["encodeBase64","mimeLookup","charsetLookup","getSourceMapGenerator"],requiredFunctions=[],functions=requiredFunctions.concat(optionalFunctions),i=0;i<functions.length;i++){var propName=functions[i],environmentFunc=externalEnvironment[propName]
environmentFunc?this[propName]=environmentFunc.bind(externalEnvironment):i<requiredFunctions.length&&this.warn("missing required function in environment - "+propName)}}
environment.prototype.getFileManager=function(filename,currentDirectory,options,environment,isSync){filename||logger.warn("getFileManager called with no filename.. Please report this issue. continuing.")
null==currentDirectory&&logger.warn("getFileManager called with null directory.. Please report this issue. continuing.")
var fileManagers=this.fileManagers
options.pluginManager&&(fileManagers=[].concat(fileManagers).concat(options.pluginManager.getFileManagers()))
for(var i=fileManagers.length-1;i>=0;i--){var fileManager=fileManagers[i]
if(fileManager[isSync?"supportsSync":"supports"](filename,currentDirectory,options,environment))return fileManager}return null}
environment.prototype.addFileManager=function(fileManager){this.fileManagers.push(fileManager)}
environment.prototype.clearFileManagers=function(){this.fileManagers=[]}
module.exports=environment},{"../logger":29}],12:[function(require,module,exports){var functionRegistry=require("./function-registry"),Anonymous=require("../tree/anonymous"),Keyword=require("../tree/keyword")
functionRegistry.addMultiple({boolean:function(condition){return condition?Keyword.True:Keyword.False},if:function(condition,trueValue,falseValue){return condition?trueValue:falseValue||new Anonymous}})},{"../tree/anonymous":40,"../tree/keyword":61,"./function-registry":18}],13:[function(require,module,exports){function colorBlend(mode,color1,color2){var cb,cs,ar,cr,ab=color1.alpha,as=color2.alpha,r=[]
ar=as+ab*(1-as)
for(var i=0;i<3;i++){cr=mode(cb=color1.rgb[i]/255,cs=color2.rgb[i]/255)
ar&&(cr=(as*cs+ab*(cb-as*(cb+cs-cr)))/ar)
r[i]=255*cr}return new Color(r,ar)}var Color=require("../tree/color"),functionRegistry=require("./function-registry"),colorBlendModeFunctions={multiply:function(cb,cs){return cb*cs},screen:function(cb,cs){return cb+cs-cb*cs},overlay:function(cb,cs){return(cb*=2)<=1?colorBlendModeFunctions.multiply(cb,cs):colorBlendModeFunctions.screen(cb-1,cs)},softlight:function(cb,cs){var d=1,e=cb
if(cs>.5){e=1
d=cb>.25?Math.sqrt(cb):((16*cb-12)*cb+4)*cb}return cb-(1-2*cs)*e*(d-cb)},hardlight:function(cb,cs){return colorBlendModeFunctions.overlay(cs,cb)},difference:function(cb,cs){return Math.abs(cb-cs)},exclusion:function(cb,cs){return cb+cs-2*cb*cs},average:function(cb,cs){return(cb+cs)/2},negation:function(cb,cs){return 1-Math.abs(cb+cs-1)}}
for(var f in colorBlendModeFunctions)colorBlendModeFunctions.hasOwnProperty(f)&&(colorBlend[f]=colorBlend.bind(null,colorBlendModeFunctions[f]))
functionRegistry.addMultiple(colorBlend)},{"../tree/color":45,"./function-registry":18}],14:[function(require,module,exports){function clamp(val){return Math.min(1,Math.max(0,val))}function hsla(color){return colorFunctions.hsla(color.h,color.s,color.l,color.a)}function number(n){if(n instanceof Dimension)return parseFloat(n.unit.is("%")?n.value/100:n.value)
if("number"==typeof n)return n
throw{type:"Argument",message:"color functions take numbers as parameters"}}function scaled(n,size){return n instanceof Dimension&&n.unit.is("%")?parseFloat(n.value*size/100):number(n)}var colorFunctions,Dimension=require("../tree/dimension"),Color=require("../tree/color"),Quoted=require("../tree/quoted"),Anonymous=require("../tree/anonymous"),functionRegistry=require("./function-registry")
colorFunctions={rgb:function(r,g,b){return colorFunctions.rgba(r,g,b,1)},rgba:function(r,g,b,a){var rgb=[r,g,b].map(function(c){return scaled(c,255)})
a=number(a)
return new Color(rgb,a)},hsl:function(h,s,l){return colorFunctions.hsla(h,s,l,1)},hsla:function(h,s,l,a){function hue(h){return 6*(h=h<0?h+1:h>1?h-1:h)<1?m1+(m2-m1)*h*6:2*h<1?m2:3*h<2?m1+(m2-m1)*(2/3-h)*6:m1}var m1,m2
h=number(h)%360/360
s=clamp(number(s))
l=clamp(number(l))
a=clamp(number(a))
m1=2*l-(m2=l<=.5?l*(s+1):l+s-l*s)
return colorFunctions.rgba(255*hue(h+1/3),255*hue(h),255*hue(h-1/3),a)},hsv:function(h,s,v){return colorFunctions.hsva(h,s,v,1)},hsva:function(h,s,v,a){h=number(h)%360/360*360
s=number(s)
v=number(v)
a=number(a)
var i,f,vs=[v,v*(1-s),v*(1-(f=h/60-(i=Math.floor(h/60%6)))*s),v*(1-(1-f)*s)],perm=[[0,3,1],[2,0,1],[1,0,3],[1,2,0],[3,1,0],[0,1,2]]
return colorFunctions.rgba(255*vs[perm[i][0]],255*vs[perm[i][1]],255*vs[perm[i][2]],a)},hue:function(color){return new Dimension(color.toHSL().h)},saturation:function(color){return new Dimension(100*color.toHSL().s,"%")},lightness:function(color){return new Dimension(100*color.toHSL().l,"%")},hsvhue:function(color){return new Dimension(color.toHSV().h)},hsvsaturation:function(color){return new Dimension(100*color.toHSV().s,"%")},hsvvalue:function(color){return new Dimension(100*color.toHSV().v,"%")},red:function(color){return new Dimension(color.rgb[0])},green:function(color){return new Dimension(color.rgb[1])},blue:function(color){return new Dimension(color.rgb[2])},alpha:function(color){return new Dimension(color.toHSL().a)},luma:function(color){return new Dimension(color.luma()*color.alpha*100,"%")},luminance:function(color){var luminance=.2126*color.rgb[0]/255+.7152*color.rgb[1]/255+.0722*color.rgb[2]/255
return new Dimension(luminance*color.alpha*100,"%")},saturate:function(color,amount,method){if(!color.rgb)return null
var hsl=color.toHSL()
void 0!==method&&"relative"===method.value?hsl.s+=hsl.s*amount.value/100:hsl.s+=amount.value/100
hsl.s=clamp(hsl.s)
return hsla(hsl)},desaturate:function(color,amount,method){var hsl=color.toHSL()
void 0!==method&&"relative"===method.value?hsl.s-=hsl.s*amount.value/100:hsl.s-=amount.value/100
hsl.s=clamp(hsl.s)
return hsla(hsl)},lighten:function(color,amount,method){var hsl=color.toHSL()
void 0!==method&&"relative"===method.value?hsl.l+=hsl.l*amount.value/100:hsl.l+=amount.value/100
hsl.l=clamp(hsl.l)
return hsla(hsl)},darken:function(color,amount,method){var hsl=color.toHSL()
void 0!==method&&"relative"===method.value?hsl.l-=hsl.l*amount.value/100:hsl.l-=amount.value/100
hsl.l=clamp(hsl.l)
return hsla(hsl)},fadein:function(color,amount,method){var hsl=color.toHSL()
void 0!==method&&"relative"===method.value?hsl.a+=hsl.a*amount.value/100:hsl.a+=amount.value/100
hsl.a=clamp(hsl.a)
return hsla(hsl)},fadeout:function(color,amount,method){var hsl=color.toHSL()
void 0!==method&&"relative"===method.value?hsl.a-=hsl.a*amount.value/100:hsl.a-=amount.value/100
hsl.a=clamp(hsl.a)
return hsla(hsl)},fade:function(color,amount){var hsl=color.toHSL()
hsl.a=amount.value/100
hsl.a=clamp(hsl.a)
return hsla(hsl)},spin:function(color,amount){var hsl=color.toHSL(),hue=(hsl.h+amount.value)%360
hsl.h=hue<0?360+hue:hue
return hsla(hsl)},mix:function(color1,color2,weight){if(!color1.toHSL||!color2.toHSL){console.log(color2.type)
console.dir(color2)}weight||(weight=new Dimension(50))
var p=weight.value/100,w=2*p-1,a=color1.toHSL().a-color2.toHSL().a,w1=((w*a==-1?w:(w+a)/(1+w*a))+1)/2,w2=1-w1,rgb=[color1.rgb[0]*w1+color2.rgb[0]*w2,color1.rgb[1]*w1+color2.rgb[1]*w2,color1.rgb[2]*w1+color2.rgb[2]*w2],alpha=color1.alpha*p+color2.alpha*(1-p)
return new Color(rgb,alpha)},greyscale:function(color){return colorFunctions.desaturate(color,new Dimension(100))},contrast:function(color,dark,light,threshold){if(!color.rgb)return null
void 0===light&&(light=colorFunctions.rgba(255,255,255,1))
void 0===dark&&(dark=colorFunctions.rgba(0,0,0,1))
if(dark.luma()>light.luma()){var t=light
light=dark
dark=t}threshold=void 0===threshold?.43:number(threshold)
return color.luma()<threshold?light:dark},argb:function(color){return new Anonymous(color.toARGB())},color:function(c){if(c instanceof Quoted&&/^#([a-f0-9]{6}|[a-f0-9]{3})$/i.test(c.value))return new Color(c.value.slice(1))
if(c instanceof Color||(c=Color.fromKeyword(c.value))){c.value=void 0
return c}throw{type:"Argument",message:"argument must be a color keyword or 3/6 digit hex e.g. #FFF"}},tint:function(color,amount){return colorFunctions.mix(colorFunctions.rgb(255,255,255),color,amount)},shade:function(color,amount){return colorFunctions.mix(colorFunctions.rgb(0,0,0),color,amount)}}
functionRegistry.addMultiple(colorFunctions)},{"../tree/anonymous":40,"../tree/color":45,"../tree/dimension":52,"../tree/quoted":70,"./function-registry":18}],15:[function(require,module,exports){module.exports=function(environment){var Quoted=require("../tree/quoted"),URL=require("../tree/url"),functionRegistry=require("./function-registry"),fallback=function(functionThis,node){return new URL(node,functionThis.index,functionThis.currentFileInfo).eval(functionThis.context)},logger=require("../logger")
functionRegistry.add("data-uri",function(mimetypeNode,filePathNode){if(!filePathNode){filePathNode=mimetypeNode
mimetypeNode=null}var mimetype=mimetypeNode&&mimetypeNode.value,filePath=filePathNode.value,currentFileInfo=this.currentFileInfo,currentDirectory=currentFileInfo.relativeUrls?currentFileInfo.currentDirectory:currentFileInfo.entryPath,fragmentStart=filePath.indexOf("#"),fragment=""
if(-1!==fragmentStart){fragment=filePath.slice(fragmentStart)
filePath=filePath.slice(0,fragmentStart)}var fileManager=environment.getFileManager(filePath,currentDirectory,this.context,environment,!0)
if(!fileManager)return fallback(this,filePathNode)
var useBase64=!1
if(mimetypeNode)useBase64=/;base64$/.test(mimetype)
else{if("image/svg+xml"===(mimetype=environment.mimeLookup(filePath)))useBase64=!1
else{var charset=environment.charsetLookup(mimetype)
useBase64=["US-ASCII","UTF-8"].indexOf(charset)<0}useBase64&&(mimetype+=";base64")}var fileSync=fileManager.loadFileSync(filePath,currentDirectory,this.context,environment)
if(!fileSync.contents){logger.warn("Skipped data-uri embedding of "+filePath+" because file not found")
return fallback(this,filePathNode||mimetypeNode)}var buf=fileSync.contents
if(useBase64&&!environment.encodeBase64)return fallback(this,filePathNode)
var uri="data:"+mimetype+","+(buf=useBase64?environment.encodeBase64(buf):encodeURIComponent(buf))+fragment
if(uri.length>=32768&&!1!==this.context.ieCompat){logger.warn("Skipped data-uri embedding of "+filePath+" because its size ("+uri.length+" characters) exceeds IE8-safe 32768 characters!")
return fallback(this,filePathNode||mimetypeNode)}return new URL(new Quoted('"'+uri+'"',uri,!1,this.index,this.currentFileInfo),this.index,this.currentFileInfo)})}},{"../logger":29,"../tree/quoted":70,"../tree/url":76,"./function-registry":18}],16:[function(require,module,exports){var Keyword=require("../tree/keyword"),defaultFunc={eval:function(){var v=this.value_,e=this.error_
if(e)throw e
if(null!=v)return v?Keyword.True:Keyword.False},value:function(v){this.value_=v},error:function(e){this.error_=e},reset:function(){this.value_=this.error_=null}}
require("./function-registry").add("default",defaultFunc.eval.bind(defaultFunc))
module.exports=defaultFunc},{"../tree/keyword":61,"./function-registry":18}],17:[function(require,module,exports){var Expression=require("../tree/expression"),functionCaller=function(name,context,index,currentFileInfo){this.name=name.toLowerCase()
this.index=index
this.context=context
this.currentFileInfo=currentFileInfo
this.func=context.frames[0].functionRegistry.get(this.name)}
functionCaller.prototype.isValid=function(){return Boolean(this.func)}
functionCaller.prototype.call=function(args){Array.isArray(args)&&(args=args.filter(function(item){return"Comment"!==item.type}).map(function(item){if("Expression"===item.type){var subNodes=item.value.filter(function(item){return"Comment"!==item.type})
return 1===subNodes.length?subNodes[0]:new Expression(subNodes)}return item}))
return this.func.apply(this,args)}
module.exports=functionCaller},{"../tree/expression":55}],18:[function(require,module,exports){function makeRegistry(base){return{_data:{},add:function(name,func){name=name.toLowerCase()
this._data.hasOwnProperty(name)
this._data[name]=func},addMultiple:function(functions){Object.keys(functions).forEach(function(name){this.add(name,functions[name])}.bind(this))},get:function(name){return this._data[name]||base&&base.get(name)},getLocalFunctions:function(){return this._data},inherit:function(){return makeRegistry(this)},create:function(base){return makeRegistry(base)}}}module.exports=makeRegistry(null)},{}],19:[function(require,module,exports){module.exports=function(environment){var functions={functionRegistry:require("./function-registry"),functionCaller:require("./function-caller")}
require("./boolean")
require("./default")
require("./color")
require("./color-blending")
require("./data-uri")(environment)
require("./math")
require("./number")
require("./string")
require("./svg")(environment)
require("./types")
return functions}},{"./boolean":12,"./color":14,"./color-blending":13,"./data-uri":15,"./default":16,"./function-caller":17,"./function-registry":18,"./math":21,"./number":22,"./string":23,"./svg":24,"./types":25}],20:[function(require,module,exports){var Dimension=require("../tree/dimension"),MathHelper=function(){}
MathHelper._math=function(fn,unit,n){if(!(n instanceof Dimension))throw{type:"Argument",message:"argument must be a number"}
null==unit?unit=n.unit:n=n.unify()
return new Dimension(fn(parseFloat(n.value)),unit)}
module.exports=MathHelper},{"../tree/dimension":52}],21:[function(require,module,exports){var functionRegistry=require("./function-registry"),mathHelper=require("./math-helper.js"),mathFunctions={ceil:null,floor:null,sqrt:null,abs:null,tan:"",sin:"",cos:"",atan:"rad",asin:"rad",acos:"rad"}
for(var f in mathFunctions)mathFunctions.hasOwnProperty(f)&&(mathFunctions[f]=mathHelper._math.bind(null,Math[f],mathFunctions[f]))
mathFunctions.round=function(n,f){var fraction=void 0===f?0:f.value
return mathHelper._math(function(num){return num.toFixed(fraction)},null,n)}
functionRegistry.addMultiple(mathFunctions)},{"./function-registry":18,"./math-helper.js":20}],22:[function(require,module,exports){var Dimension=require("../tree/dimension"),Anonymous=require("../tree/anonymous"),functionRegistry=require("./function-registry"),mathHelper=require("./math-helper.js"),minMax=function(isMin,args){switch((args=Array.prototype.slice.call(args)).length){case 0:throw{type:"Argument",message:"one or more arguments required"}}var i,j,current,currentUnified,referenceUnified,unit,unitStatic,unitClone,order=[],values={}
for(i=0;i<args.length;i++)if((current=args[i])instanceof Dimension){unitStatic=""!==(unit=""===(currentUnified=""===current.unit.toString()&&void 0!==unitClone?new Dimension(current.value,unitClone).unify():current.unify()).unit.toString()&&void 0!==unitStatic?unitStatic:currentUnified.unit.toString())&&void 0===unitStatic||""!==unit&&""===order[0].unify().unit.toString()?unit:unitStatic
unitClone=""!==unit&&void 0===unitClone?current.unit.toString():unitClone
if(void 0!==(j=void 0!==values[""]&&""!==unit&&unit===unitStatic?values[""]:values[unit])){referenceUnified=""===order[j].unit.toString()&&void 0!==unitClone?new Dimension(order[j].value,unitClone).unify():order[j].unify();(isMin&&currentUnified.value<referenceUnified.value||!isMin&&currentUnified.value>referenceUnified.value)&&(order[j]=current)}else{if(void 0!==unitStatic&&unit!==unitStatic)throw{type:"Argument",message:"incompatible types"}
values[unit]=order.length
order.push(current)}}else Array.isArray(args[i].value)&&Array.prototype.push.apply(args,Array.prototype.slice.call(args[i].value))
if(1==order.length)return order[0]
args=order.map(function(a){return a.toCSS(this.context)}).join(this.context.compress?",":", ")
return new Anonymous((isMin?"min":"max")+"("+args+")")}
functionRegistry.addMultiple({min:function(){return minMax(!0,arguments)},max:function(){return minMax(!1,arguments)},convert:function(val,unit){return val.convertTo(unit.value)},pi:function(){return new Dimension(Math.PI)},mod:function(a,b){return new Dimension(a.value%b.value,a.unit)},pow:function(x,y){if("number"==typeof x&&"number"==typeof y){x=new Dimension(x)
y=new Dimension(y)}else if(!(x instanceof Dimension&&y instanceof Dimension))throw{type:"Argument",message:"arguments must be numbers"}
return new Dimension(Math.pow(x.value,y.value),x.unit)},percentage:function(n){return mathHelper._math(function(num){return 100*num},"%",n)}})},{"../tree/anonymous":40,"../tree/dimension":52,"./function-registry":18,"./math-helper.js":20}],23:[function(require,module,exports){var Quoted=require("../tree/quoted"),Anonymous=require("../tree/anonymous"),JavaScript=require("../tree/javascript")
require("./function-registry").addMultiple({e:function(str){return new Anonymous(str instanceof JavaScript?str.evaluated:str.value)},escape:function(str){return new Anonymous(encodeURI(str.value).replace(/=/g,"%3D").replace(/:/g,"%3A").replace(/#/g,"%23").replace(/;/g,"%3B").replace(/\(/g,"%28").replace(/\)/g,"%29"))},replace:function(string,pattern,replacement,flags){var result=string.value
replacement="Quoted"===replacement.type?replacement.value:replacement.toCSS()
result=result.replace(new RegExp(pattern.value,flags?flags.value:""),replacement)
return new Quoted(string.quote||"",result,string.escaped)},"%":function(string){for(var args=Array.prototype.slice.call(arguments,1),result=string.value,i=0;i<args.length;i++)result=result.replace(/%[sda]/i,function(token){var value="Quoted"===args[i].type&&token.match(/s/i)?args[i].value:args[i].toCSS()
return token.match(/[A-Z]$/)?encodeURIComponent(value):value})
result=result.replace(/%%/g,"%")
return new Quoted(string.quote||"",result,string.escaped)}})},{"../tree/anonymous":40,"../tree/javascript":59,"../tree/quoted":70,"./function-registry":18}],24:[function(require,module,exports){module.exports=function(environment){var Dimension=require("../tree/dimension"),Color=require("../tree/color"),Expression=require("../tree/expression"),Quoted=require("../tree/quoted"),URL=require("../tree/url")
require("./function-registry").add("svg-gradient",function(direction){function throwArgumentDescriptor(){throw{type:"Argument",message:"svg-gradient expects direction, start_color [start_position], [color position,]..., end_color [end_position] or direction, color list"}}var stops,gradientDirectionSvg,returner,i,color,position,positionValue,alpha,gradientType="linear",rectangleDimension='x="0" y="0" width="1" height="1"',renderEnv={compress:!1},directionValue=direction.toCSS(renderEnv)
if(2==arguments.length){arguments[1].value.length<2&&throwArgumentDescriptor()
stops=arguments[1].value}else arguments.length<3?throwArgumentDescriptor():stops=Array.prototype.slice.call(arguments,1)
switch(directionValue){case"to bottom":gradientDirectionSvg='x1="0%" y1="0%" x2="0%" y2="100%"'
break
case"to right":gradientDirectionSvg='x1="0%" y1="0%" x2="100%" y2="0%"'
break
case"to bottom right":gradientDirectionSvg='x1="0%" y1="0%" x2="100%" y2="100%"'
break
case"to top right":gradientDirectionSvg='x1="0%" y1="100%" x2="100%" y2="0%"'
break
case"ellipse":case"ellipse at center":gradientType="radial"
gradientDirectionSvg='cx="50%" cy="50%" r="75%"'
rectangleDimension='x="-50" y="-50" width="101" height="101"'
break
default:throw{type:"Argument",message:"svg-gradient direction must be 'to bottom', 'to right', 'to bottom right', 'to top right' or 'ellipse at center'"}}returner='<?xml version="1.0" ?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none"><'+gradientType+'Gradient id="gradient" gradientUnits="userSpaceOnUse" '+gradientDirectionSvg+">"
for(i=0;i<stops.length;i+=1){if(stops[i]instanceof Expression){color=stops[i].value[0]
position=stops[i].value[1]}else{color=stops[i]
position=void 0}color instanceof Color&&((0===i||i+1===stops.length)&&void 0===position||position instanceof Dimension)||throwArgumentDescriptor()
positionValue=position?position.toCSS(renderEnv):0===i?"0%":"100%"
alpha=color.alpha
returner+='<stop offset="'+positionValue+'" stop-color="'+color.toRGB()+'"'+(alpha<1?' stop-opacity="'+alpha+'"':"")+"/>"}returner+="</"+gradientType+"Gradient><rect "+rectangleDimension+' fill="url(#gradient)" /></svg>'
returner=encodeURIComponent(returner)
return new URL(new Quoted("'"+(returner="data:image/svg+xml,"+returner)+"'",returner,!1,this.index,this.currentFileInfo),this.index,this.currentFileInfo)})}},{"../tree/color":45,"../tree/dimension":52,"../tree/expression":55,"../tree/quoted":70,"../tree/url":76,"./function-registry":18}],25:[function(require,module,exports){var Keyword=require("../tree/keyword"),DetachedRuleset=require("../tree/detached-ruleset"),Dimension=require("../tree/dimension"),Color=require("../tree/color"),Quoted=require("../tree/quoted"),Anonymous=require("../tree/anonymous"),URL=require("../tree/url"),Operation=require("../tree/operation"),isa=function(n,Type){return n instanceof Type?Keyword.True:Keyword.False},isunit=function(n,unit){if(void 0===unit)throw{type:"Argument",message:"missing the required second argument to isunit."}
if("string"!=typeof(unit="string"==typeof unit.value?unit.value:unit))throw{type:"Argument",message:"Second argument to isunit should be a unit or a string."}
return n instanceof Dimension&&n.unit.is(unit)?Keyword.True:Keyword.False},getItemsFromNode=function(node){return Array.isArray(node.value)?node.value:Array(node)}
require("./function-registry").addMultiple({isruleset:function(n){return isa(n,DetachedRuleset)},iscolor:function(n){return isa(n,Color)},isnumber:function(n){return isa(n,Dimension)},isstring:function(n){return isa(n,Quoted)},iskeyword:function(n){return isa(n,Keyword)},isurl:function(n){return isa(n,URL)},ispixel:function(n){return isunit(n,"px")},ispercentage:function(n){return isunit(n,"%")},isem:function(n){return isunit(n,"em")},isunit:isunit,unit:function(val,unit){if(!(val instanceof Dimension))throw{type:"Argument",message:"the first argument to unit must be a number"+(val instanceof Operation?". Have you forgotten parenthesis?":"")}
unit=unit?unit instanceof Keyword?unit.value:unit.toCSS():""
return new Dimension(val.value,unit)},"get-unit":function(n){return new Anonymous(n.unit)},extract:function(values,index){index=index.value-1
return getItemsFromNode(values)[index]},length:function(values){return new Dimension(getItemsFromNode(values).length)}})},{"../tree/anonymous":40,"../tree/color":45,"../tree/detached-ruleset":51,"../tree/dimension":52,"../tree/keyword":61,"../tree/operation":67,"../tree/quoted":70,"../tree/url":76,"./function-registry":18}],26:[function(require,module,exports){var contexts=require("./contexts"),Parser=require("./parser/parser"),LessError=require("./less-error")
module.exports=function(environment){var ImportManager=function(less,context,rootFileInfo){this.less=less
this.rootFilename=rootFileInfo.filename
this.paths=context.paths||[]
this.contents={}
this.contentsIgnoredChars={}
this.mime=context.mime
this.error=null
this.context=context
this.queue=[]
this.files={}}
ImportManager.prototype.push=function(path,tryAppendExtension,currentFileInfo,importOptions,callback){var importManager=this,pluginLoader=this.context.pluginManager.Loader
this.queue.push(path)
var fileParsedFunc=function(e,root,fullPath){importManager.queue.splice(importManager.queue.indexOf(path),1)
var importedEqualsRoot=fullPath===importManager.rootFilename
if(importOptions.optional&&e)callback(null,{rules:[]},!1,null)
else{importManager.files[fullPath]=root
e&&!importManager.error&&(importManager.error=e)
callback(e,root,importedEqualsRoot,fullPath)}},newFileInfo={relativeUrls:this.context.relativeUrls,entryPath:currentFileInfo.entryPath,rootpath:currentFileInfo.rootpath,rootFilename:currentFileInfo.rootFilename},fileManager=environment.getFileManager(path,currentFileInfo.currentDirectory,this.context,environment)
if(fileManager){tryAppendExtension&&(path=importOptions.isPlugin?path:fileManager.tryAppendExtension(path,".less"))
var promise,loadFileCallback=function(loadedFile){var plugin,resolvedFilename=loadedFile.filename,contents=loadedFile.contents.replace(/^\uFEFF/,"")
newFileInfo.currentDirectory=fileManager.getPath(resolvedFilename)
if(newFileInfo.relativeUrls){newFileInfo.rootpath=fileManager.join(importManager.context.rootpath||"",fileManager.pathDiff(newFileInfo.currentDirectory,newFileInfo.entryPath))
!fileManager.isPathAbsolute(newFileInfo.rootpath)&&fileManager.alwaysMakePathsAbsolute()&&(newFileInfo.rootpath=fileManager.join(newFileInfo.entryPath,newFileInfo.rootpath))}newFileInfo.filename=resolvedFilename
var newEnv=new contexts.Parse(importManager.context)
newEnv.processImports=!1
importManager.contents[resolvedFilename]=contents;(currentFileInfo.reference||importOptions.reference)&&(newFileInfo.reference=!0)
importOptions.isPlugin?(plugin=pluginLoader.evalPlugin(contents,newEnv,importManager,importOptions.pluginArgs,newFileInfo))instanceof LessError?fileParsedFunc(plugin,null,resolvedFilename):fileParsedFunc(null,plugin,resolvedFilename):importOptions.inline?fileParsedFunc(null,contents,resolvedFilename):new Parser(newEnv,importManager,newFileInfo).parse(contents,function(e,root){fileParsedFunc(e,root,resolvedFilename)})},done=function(err,loadedFile){err?fileParsedFunc(err):loadFileCallback(loadedFile)}
if(importOptions.isPlugin)try{pluginLoader.tryLoadPlugin(path,currentFileInfo.currentDirectory,done)}catch(e){callback(e)}else(promise=fileManager.loadFile(path,currentFileInfo.currentDirectory,this.context,environment,done))&&promise.then(loadFileCallback,fileParsedFunc)}else fileParsedFunc({message:"Could not find a file-manager for "+path})}
return ImportManager}},{"./contexts":4,"./less-error":28,"./parser/parser":34}],27:[function(require,module,exports){module.exports=function(environment,fileManagers){var SourceMapOutput,SourceMapBuilder,ParseTree,ImportManager,Environment,t,initial={version:[3,0,0],data:require("./data"),tree:require("./tree"),Environment:Environment=require("./environment/environment"),AbstractFileManager:require("./environment/abstract-file-manager"),AbstractPluginLoader:require("./environment/abstract-plugin-loader"),environment:environment=new Environment(environment,fileManagers),visitors:require("./visitors"),Parser:require("./parser/parser"),functions:require("./functions")(environment),contexts:require("./contexts"),SourceMapOutput:SourceMapOutput=require("./source-map-output")(environment),SourceMapBuilder:SourceMapBuilder=require("./source-map-builder")(SourceMapOutput,environment),ParseTree:ParseTree=require("./parse-tree")(SourceMapBuilder),ImportManager:ImportManager=require("./import-manager")(environment),render:require("./render")(environment,ParseTree,ImportManager),parse:require("./parse")(environment,ParseTree,ImportManager),LessError:require("./less-error"),transformTree:require("./transform-tree"),utils:require("./utils"),PluginManager:require("./plugin-manager"),logger:require("./logger")},ctor=function(t){return function(){var obj=Object.create(t.prototype)
t.apply(obj,Array.prototype.slice.call(arguments,0))
return obj}},api=Object.create(initial)
for(var n in initial.tree)if("function"==typeof(t=initial.tree[n]))api[n]=ctor(t)
else{api[n]=Object.create(null)
for(var o in t)api[n][o]=ctor(t[o])}return api}},{"./contexts":4,"./data":6,"./environment/abstract-file-manager":9,"./environment/abstract-plugin-loader":10,"./environment/environment":11,"./functions":19,"./import-manager":26,"./less-error":28,"./logger":29,"./parse":31,"./parse-tree":30,"./parser/parser":34,"./plugin-manager":35,"./render":36,"./source-map-builder":37,"./source-map-output":38,"./transform-tree":39,"./tree":58,"./utils":80,"./visitors":84}],28:[function(require,module,exports){var utils=require("./utils"),LessError=module.exports=function(e,importManager,currentFilename){Error.call(this)
var filename=e.filename||currentFilename
this.message=e.message
this.stack=e.stack
if(importManager&&filename){var input=importManager.contents[filename],loc=utils.getLocation(e.index,input),line=loc.line,col=loc.column,callLine=e.call&&utils.getLocation(e.call,input).line,lines=input.split("\n")
this.type=e.type||"Syntax"
this.filename=filename
this.index=e.index
this.line="number"==typeof line?line+1:null
this.column=col
if(!this.line&&this.stack){var found=this.stack.match(/(<anonymous>|Function):(\d+):(\d+)/)
if(found){found[2]&&(this.line=parseInt(found[2])-2)
found[3]&&(this.column=parseInt(found[3]))}}this.callLine=callLine+1
this.callExtract=lines[callLine]
this.extract=[lines[this.line-2],lines[this.line-1],lines[this.line]]}}
if(void 0===Object.create){var F=function(){}
F.prototype=Error.prototype
LessError.prototype=new F}else LessError.prototype=Object.create(Error.prototype)
LessError.prototype.constructor=LessError
LessError.prototype.toString=function(options){options=options||{}
var message="",extract=this.extract||[],error=[],stylize=function(str){return str}
if(options.stylize){var type=typeof options.stylize
if("function"!==type)throw Error("options.stylize should be a function, got a "+type+"!")
stylize=options.stylize}if(null!==this.line){"string"==typeof extract[0]&&error.push(stylize(this.line-1+" "+extract[0],"grey"))
if("string"==typeof extract[1]){var errorTxt=this.line+" "
extract[1]&&(errorTxt+=extract[1].slice(0,this.column)+stylize(stylize(stylize(extract[1].substr(this.column,1),"bold")+extract[1].slice(this.column+1),"red"),"inverse"))
error.push(errorTxt)}"string"==typeof extract[2]&&error.push(stylize(this.line+1+" "+extract[2],"grey"))
error=error.join("\n")+stylize("","reset")+"\n"}message+=stylize(this.type+"Error: "+this.message,"red")
this.filename&&(message+=stylize(" in ","red")+this.filename)
this.line&&(message+=stylize(" on line "+this.line+", column "+(this.column+1)+":","grey"))
message+="\n"+error
if(this.callLine){message+=stylize("from ","red")+(this.filename||"")+"/n"
message+=stylize(this.callLine,"grey")+" "+this.callExtract+"/n"}return message}},{"./utils":80}],29:[function(require,module,exports){module.exports={error:function(msg){this._fireEvent("error",msg)},warn:function(msg){this._fireEvent("warn",msg)},info:function(msg){this._fireEvent("info",msg)},debug:function(msg){this._fireEvent("debug",msg)},addListener:function(listener){this._listeners.push(listener)},removeListener:function(listener){for(var i=0;i<this._listeners.length;i++)if(this._listeners[i]===listener){this._listeners.splice(i,1)
return}},_fireEvent:function(type,msg){for(var i=0;i<this._listeners.length;i++){var logFunction=this._listeners[i][type]
logFunction&&logFunction(msg)}},_listeners:[]}},{}],30:[function(require,module,exports){var LessError=require("./less-error"),transformTree=require("./transform-tree"),logger=require("./logger")
module.exports=function(SourceMapBuilder){var ParseTree=function(root,imports){this.root=root
this.imports=imports}
ParseTree.prototype.toCSS=function(options){var evaldRoot,sourceMapBuilder,result={}
try{evaldRoot=transformTree(this.root,options)}catch(e){throw new LessError(e,this.imports)}try{var compress=Boolean(options.compress)
compress&&logger.warn("The compress option has been deprecated. We recommend you use a dedicated css minifier, for instance see less-plugin-clean-css.")
var toCSSOptions={compress:compress,dumpLineNumbers:options.dumpLineNumbers,strictUnits:Boolean(options.strictUnits),numPrecision:8}
if(options.sourceMap){sourceMapBuilder=new SourceMapBuilder(options.sourceMap)
result.css=sourceMapBuilder.toCSS(evaldRoot,toCSSOptions,this.imports)}else result.css=evaldRoot.toCSS(toCSSOptions)}catch(e){throw new LessError(e,this.imports)}if(options.pluginManager)for(var postProcessors=options.pluginManager.getPostProcessors(),i=0;i<postProcessors.length;i++)result.css=postProcessors[i].process(result.css,{sourceMap:sourceMapBuilder,options:options,imports:this.imports})
options.sourceMap&&(result.map=sourceMapBuilder.getExternalSourceMap())
result.imports=[]
for(var file in this.imports.files)this.imports.files.hasOwnProperty(file)&&file!==this.imports.rootFilename&&result.imports.push(file)
return result}
return ParseTree}},{"./less-error":28,"./logger":29,"./transform-tree":39}],31:[function(require,module,exports){var PromiseConstructor,contexts=require("./contexts"),Parser=require("./parser/parser"),PluginManager=require("./plugin-manager"),LessError=require("./less-error")
module.exports=function(environment,ParseTree,ImportManager){var parse=function(input,options,callback){if("function"==typeof(options=options||{})){callback=options
options={}}if(!callback){PromiseConstructor||(PromiseConstructor="undefined"==typeof Promise?require("promise"):Promise)
var self=this
return new PromiseConstructor(function(resolve,reject){parse.call(self,input,options,function(err,output){err?reject(err):resolve(output)})})}var context,rootFileInfo,pluginManager=new PluginManager(this,!0)
options.pluginManager=pluginManager
context=new contexts.Parse(options)
if(options.rootFileInfo)rootFileInfo=options.rootFileInfo
else{var filename=options.filename||"input",entryPath=filename.replace(/[^\/\\]*$/,"");(rootFileInfo={filename:filename,relativeUrls:context.relativeUrls,rootpath:context.rootpath||"",currentDirectory:entryPath,entryPath:entryPath,rootFilename:filename}).rootpath&&"/"!==rootFileInfo.rootpath.slice(-1)&&(rootFileInfo.rootpath+="/")}var imports=new ImportManager(this,context,rootFileInfo)
this.importManager=imports
options.plugins&&options.plugins.forEach(function(plugin){var evalResult,contents
if(plugin.fileContent){contents=plugin.fileContent.replace(/^\uFEFF/,"")
if((evalResult=pluginManager.Loader.evalPlugin(contents,context,imports,plugin.options,plugin.filename))instanceof LessError)return callback(evalResult)}else pluginManager.addPlugin(plugin)})
new Parser(context,imports,rootFileInfo).parse(input,function(e,root){if(e)return callback(e)
callback(null,root,imports,options)},options)}
return parse}},{"./contexts":4,"./less-error":28,"./parser/parser":34,"./plugin-manager":35,promise:93}],32:[function(require,module,exports){module.exports=function(input,fail){function emitChunk(force){var len=chunkerCurrentIndex-emitFrom
if(!(len<512&&!force||!len)){chunks.push(input.slice(emitFrom,chunkerCurrentIndex+1))
emitFrom=chunkerCurrentIndex+1}}var lastOpening,lastOpeningParen,lastMultiComment,lastMultiCommentEndBrace,chunkerCurrentIndex,currentChunkStartIndex,cc,cc2,matched,len=input.length,level=0,parenLevel=0,chunks=[],emitFrom=0
for(chunkerCurrentIndex=0;chunkerCurrentIndex<len;chunkerCurrentIndex++)if(!((cc=input.charCodeAt(chunkerCurrentIndex))>=97&&cc<=122||cc<34))switch(cc){case 40:parenLevel++
lastOpeningParen=chunkerCurrentIndex
continue
case 41:if(--parenLevel<0)return fail("missing opening `(`",chunkerCurrentIndex)
continue
case 59:parenLevel||emitChunk()
continue
case 123:level++
lastOpening=chunkerCurrentIndex
continue
case 125:if(--level<0)return fail("missing opening `{`",chunkerCurrentIndex)
level||parenLevel||emitChunk()
continue
case 92:if(chunkerCurrentIndex<len-1){chunkerCurrentIndex++
continue}return fail("unescaped `\\`",chunkerCurrentIndex)
case 34:case 39:case 96:matched=0
currentChunkStartIndex=chunkerCurrentIndex
for(chunkerCurrentIndex+=1;chunkerCurrentIndex<len;chunkerCurrentIndex++)if(!((cc2=input.charCodeAt(chunkerCurrentIndex))>96)){if(cc2==cc){matched=1
break}if(92==cc2){if(chunkerCurrentIndex==len-1)return fail("unescaped `\\`",chunkerCurrentIndex)
chunkerCurrentIndex++}}if(matched)continue
return fail("unmatched `"+String.fromCharCode(cc)+"`",currentChunkStartIndex)
case 47:if(parenLevel||chunkerCurrentIndex==len-1)continue
if(47==(cc2=input.charCodeAt(chunkerCurrentIndex+1)))for(chunkerCurrentIndex+=2;chunkerCurrentIndex<len&&(!((cc2=input.charCodeAt(chunkerCurrentIndex))<=13)||10!=cc2&&13!=cc2);chunkerCurrentIndex++);else if(42==cc2){lastMultiComment=currentChunkStartIndex=chunkerCurrentIndex
for(chunkerCurrentIndex+=2;chunkerCurrentIndex<len-1;chunkerCurrentIndex++){125==(cc2=input.charCodeAt(chunkerCurrentIndex))&&(lastMultiCommentEndBrace=chunkerCurrentIndex)
if(42==cc2&&47==input.charCodeAt(chunkerCurrentIndex+1))break}if(chunkerCurrentIndex==len-1)return fail("missing closing `*/`",currentChunkStartIndex)
chunkerCurrentIndex++}continue
case 42:if(chunkerCurrentIndex<len-1&&47==input.charCodeAt(chunkerCurrentIndex+1))return fail("unmatched `/*`",chunkerCurrentIndex)
continue}if(0!==level)return lastMultiComment>lastOpening&&lastMultiCommentEndBrace>lastMultiComment?fail("missing closing `}` or `*/`",lastOpening):fail("missing closing `}`",lastOpening)
if(0!==parenLevel)return fail("missing closing `)`",lastOpeningParen)
emitChunk(!0)
return chunks}},{}],33:[function(require,module,exports){var chunker=require("./chunker")
module.exports=function(){function skipWhitespace(length){for(var c,nextChar,comment,oldi=parserInput.i,oldj=j,curr=parserInput.i-currentPos,endIndex=parserInput.i+current.length-curr,mem=parserInput.i+=length,inp=input;parserInput.i<endIndex;parserInput.i++){c=inp.charCodeAt(parserInput.i)
if(parserInput.autoCommentAbsorb&&c===CHARCODE_FORWARD_SLASH){if("/"===(nextChar=inp.charAt(parserInput.i+1))){comment={index:parserInput.i,isLineComment:!0}
var nextNewLine=inp.indexOf("\n",parserInput.i+2)
nextNewLine<0&&(nextNewLine=endIndex)
parserInput.i=nextNewLine
comment.text=inp.substr(comment.index,parserInput.i-comment.index)
parserInput.commentStore.push(comment)
continue}if("*"===nextChar){var nextStarSlash=inp.indexOf("*/",parserInput.i+2)
if(nextStarSlash>=0){comment={index:parserInput.i,text:inp.substr(parserInput.i,nextStarSlash+2-parserInput.i),isLineComment:!1}
parserInput.i+=comment.text.length-1
parserInput.commentStore.push(comment)
continue}}break}if(c!==CHARCODE_SPACE&&c!==CHARCODE_LF&&c!==CHARCODE_TAB&&c!==CHARCODE_CR)break}current=current.slice(length+parserInput.i-mem+curr)
currentPos=parserInput.i
if(!current.length){if(j<chunks.length-1){current=chunks[++j]
skipWhitespace(0)
return!0}parserInput.finished=!0}return oldi!==parserInput.i||oldj!==j}var input,j,furthest,furthestPossibleErrorMessage,chunks,current,currentPos,saveStack=[],parserInput={},CHARCODE_SPACE=32,CHARCODE_TAB=9,CHARCODE_LF=10,CHARCODE_CR=13,CHARCODE_FORWARD_SLASH=47
parserInput.save=function(){currentPos=parserInput.i
saveStack.push({current:current,i:parserInput.i,j:j})}
parserInput.restore=function(possibleErrorMessage){if(parserInput.i>furthest||parserInput.i===furthest&&possibleErrorMessage&&!furthestPossibleErrorMessage){furthest=parserInput.i
furthestPossibleErrorMessage=possibleErrorMessage}var state=saveStack.pop()
current=state.current
currentPos=parserInput.i=state.i
j=state.j}
parserInput.forget=function(){saveStack.pop()}
parserInput.isWhitespace=function(offset){var pos=parserInput.i+(offset||0),code=input.charCodeAt(pos)
return code===CHARCODE_SPACE||code===CHARCODE_CR||code===CHARCODE_TAB||code===CHARCODE_LF}
parserInput.$re=function(tok){if(parserInput.i>currentPos){current=current.slice(parserInput.i-currentPos)
currentPos=parserInput.i}var m=tok.exec(current)
if(!m)return null
skipWhitespace(m[0].length)
return"string"==typeof m?m:1===m.length?m[0]:m}
parserInput.$char=function(tok){if(input.charAt(parserInput.i)!==tok)return null
skipWhitespace(1)
return tok}
parserInput.$str=function(tok){for(var tokLength=tok.length,i=0;i<tokLength;i++)if(input.charAt(parserInput.i+i)!==tok.charAt(i))return null
skipWhitespace(tokLength)
return tok}
parserInput.$quoted=function(){var startChar=input.charAt(parserInput.i)
if("'"===startChar||'"'===startChar){for(var length=input.length,currentPosition=parserInput.i,i=1;i+currentPosition<length;i++)switch(input.charAt(i+currentPosition)){case"\\":i++
continue
case"\r":case"\n":break
case startChar:var str=input.substr(currentPosition,i+1)
skipWhitespace(i+1)
return str}return null}}
parserInput.autoCommentAbsorb=!0
parserInput.commentStore=[]
parserInput.finished=!1
parserInput.peek=function(tok){if("string"==typeof tok){for(var i=0;i<tok.length;i++)if(input.charAt(parserInput.i+i)!==tok.charAt(i))return!1
return!0}return tok.test(current)}
parserInput.peekChar=function(tok){return input.charAt(parserInput.i)===tok}
parserInput.currentChar=function(){return input.charAt(parserInput.i)}
parserInput.getInput=function(){return input}
parserInput.peekNotNumeric=function(){var c=input.charCodeAt(parserInput.i)
return c>57||c<43||c===CHARCODE_FORWARD_SLASH||44===c}
parserInput.start=function(str,chunkInput,failFunction){input=str
parserInput.i=j=currentPos=furthest=0
chunks=chunkInput?chunker(str,failFunction):[str]
current=chunks[0]
skipWhitespace(0)}
parserInput.end=function(){var message,isFinished=parserInput.i>=input.length
if(parserInput.i<furthest){message=furthestPossibleErrorMessage
parserInput.i=furthest}return{isFinished:isFinished,furthest:parserInput.i,furthestPossibleErrorMessage:message,furthestReachedEnd:parserInput.i>=input.length-1,furthestChar:input[parserInput.i]}}
return parserInput}},{"./chunker":32}],34:[function(require,module,exports){var LessError=require("../less-error"),tree=require("../tree"),visitors=require("../visitors"),getParserInput=require("./parser-input"),utils=require("../utils"),Parser=function Parser(context,imports,fileInfo){function error(msg,type){throw new LessError({index:parserInput.i,filename:fileInfo.filename,type:type||"Syntax",message:msg},imports)}function expect(arg,msg,index){var result=arg instanceof Function?arg.call(parsers):parserInput.$re(arg)
if(result)return result
error(msg||("string"==typeof arg?"expected '"+arg+"' got '"+parserInput.currentChar()+"'":"unexpected token"))}function expectChar(arg,msg){if(parserInput.$char(arg))return arg
error(msg||"expected '"+arg+"' got '"+parserInput.currentChar()+"'")}function getDebugInfo(index){var filename=fileInfo.filename
return{lineNumber:utils.getLocation(index,parserInput.getInput()).line+1,fileName:filename}}var parsers,parserInput=getParserInput()
return{parserInput:parserInput,imports:imports,fileInfo:fileInfo,parseNode:function(str,parseList,currentIndex,fileInfo,callback){var result,returnNodes=[],parser=parserInput
try{parser.start(str,!1,function(msg,index){callback({message:msg,index:index+currentIndex})})
for(var p,i,x=0;p=parseList[x];x++){i=parser.i
if(result=parsers[p]()){result._index=i+currentIndex
result._fileInfo=fileInfo
returnNodes.push(result)}else returnNodes.push(null)}parser.end().isFinished?callback(null,returnNodes):callback(!0,null)}catch(e){throw new LessError({index:e.index+currentIndex,message:e.message},imports,fileInfo.filename)}},parse:function(str,callback,additionalData){var root,globalVars,modifyVars,ignored,error=null,preText=""
globalVars=additionalData&&additionalData.globalVars?Parser.serializeVars(additionalData.globalVars)+"\n":""
modifyVars=additionalData&&additionalData.modifyVars?"\n"+Parser.serializeVars(additionalData.modifyVars):""
if(context.pluginManager)for(var preProcessors=context.pluginManager.getPreProcessors(),i=0;i<preProcessors.length;i++)str=preProcessors[i].process(str,{context:context,imports:imports,fileInfo:fileInfo})
if(globalVars||additionalData&&additionalData.banner){preText=(additionalData&&additionalData.banner?additionalData.banner:"")+globalVars;(ignored=imports.contentsIgnoredChars)[fileInfo.filename]=ignored[fileInfo.filename]||0
ignored[fileInfo.filename]+=preText.length}str=preText+(str=str.replace(/\r\n?/g,"\n")).replace(/^\uFEFF/,"")+modifyVars
imports.contents[fileInfo.filename]=str
try{parserInput.start(str,context.chunkInput,function(msg,index){throw new LessError({index:index,type:"Parse",message:msg,filename:fileInfo.filename},imports)})
tree.Node.prototype.parse=this
root=new tree.Ruleset(null,this.parsers.primary())
tree.Node.prototype.rootNode=root
root.root=!0
root.firstRoot=!0}catch(e){return callback(new LessError(e,imports,fileInfo.filename))}var endInfo=parserInput.end()
if(!endInfo.isFinished){var message=endInfo.furthestPossibleErrorMessage
if(!message){message="Unrecognised input"
"}"===endInfo.furthestChar?message+=". Possibly missing opening '{'":")"===endInfo.furthestChar?message+=". Possibly missing opening '('":endInfo.furthestReachedEnd&&(message+=". Possibly missing something")}error=new LessError({type:"Parse",message:message,index:endInfo.furthest,filename:fileInfo.filename},imports)}var finish=function(e){if(e=error||e||imports.error){e instanceof LessError||(e=new LessError(e,imports,fileInfo.filename))
return callback(e)}return callback(null,root)}
if(!1===context.processImports)return finish()
new visitors.ImportVisitor(imports,finish).run(root)},parsers:parsers={primary:function(){for(var node,mixin=this.mixin,root=[];;){for(;;){if(!(node=this.comment()))break
root.push(node)}if(parserInput.finished)break
if(parserInput.peek("}"))break
if(node=this.extendRule())root=root.concat(node)
else if(node=mixin.definition()||this.declaration()||this.ruleset()||mixin.call()||this.variableCall()||this.entities.call()||this.atrule())root.push(node)
else{for(var foundSemiColon=!1;parserInput.$char(";");)foundSemiColon=!0
if(!foundSemiColon)break}}return root},comment:function(){if(parserInput.commentStore.length){var comment=parserInput.commentStore.shift()
return new tree.Comment(comment.text,comment.isLineComment,comment.index,fileInfo)}},entities:{quoted:function(){var str,index=parserInput.i,isEscaped=!1
parserInput.save()
parserInput.$char("~")&&(isEscaped=!0)
if(str=parserInput.$quoted()){parserInput.forget()
return new tree.Quoted(str.charAt(0),str.substr(1,str.length-2),isEscaped,index,fileInfo)}parserInput.restore()},keyword:function(){var k=parserInput.$char("%")||parserInput.$re(/^[_A-Za-z-][_A-Za-z0-9-]*/)
if(k)return tree.Color.fromKeyword(k)||new tree.Keyword(k)},call:function(){var name,args,func,index=parserInput.i
if(!parserInput.peek(/^url\(/i)){parserInput.save()
if(name=parserInput.$re(/^([\w-]+|%|progid:[\w\.]+)\(/)){name=name[1]
if((func=this.customFuncCall(name))&&(args=func.parse())&&func.stop){parserInput.forget()
return args}args=this.arguments(args)
if(parserInput.$char(")")){parserInput.forget()
return new tree.Call(name,args,index,fileInfo)}parserInput.restore("Could not parse call arguments or missing ')'")}else parserInput.forget()}},customFuncCall:function(name){function f(parse,stop){return{parse:parse,stop:stop}}function condition(){return[expect(parsers.condition,"expected condition")]}return{alpha:f(parsers.ieAlpha,!0),boolean:f(condition),if:f(condition)}[name.toLowerCase()]},arguments:function(prevArgs){var isSemiColonSeparated,value,argsComma=prevArgs||[],argsSemiColon=[]
parserInput.save()
for(;;){if(prevArgs)prevArgs=!1
else{if(!(value=parsers.detachedRuleset()||this.assignment()||parsers.expression()))break
value.value&&1==value.value.length&&(value=value.value[0])
argsComma.push(value)}if(!parserInput.$char(",")&&(parserInput.$char(";")||isSemiColonSeparated)){isSemiColonSeparated=!0
value=argsComma.length<1?argsComma[0]:new tree.Value(argsComma)
argsSemiColon.push(value)
argsComma=[]}}parserInput.forget()
return isSemiColonSeparated?argsSemiColon:argsComma},literal:function(){return this.dimension()||this.color()||this.quoted()||this.unicodeDescriptor()},assignment:function(){var key,value
parserInput.save()
if(key=parserInput.$re(/^\w+(?=\s?=)/i))if(parserInput.$char("=")){if(value=parsers.entity()){parserInput.forget()
return new tree.Assignment(key,value)}parserInput.restore()}else parserInput.restore()
else parserInput.restore()},url:function(){var value,index=parserInput.i
parserInput.autoCommentAbsorb=!1
if(parserInput.$str("url(")){value=this.quoted()||this.variable()||this.property()||parserInput.$re(/^(?:(?:\\[\(\)'"])|[^\(\)'"])+/)||""
parserInput.autoCommentAbsorb=!0
expectChar(")")
return new tree.URL(null!=value.value||value instanceof tree.Variable||value instanceof tree.Property?value:new tree.Anonymous(value,index),index,fileInfo)}parserInput.autoCommentAbsorb=!0},variable:function(){var name,index=parserInput.i
if("@"===parserInput.currentChar()&&(name=parserInput.$re(/^@@?[\w-]+/)))return new tree.Variable(name,index,fileInfo)},variableCurly:function(){var curly,index=parserInput.i
if("@"===parserInput.currentChar()&&(curly=parserInput.$re(/^@\{([\w-]+)\}/)))return new tree.Variable("@"+curly[1],index,fileInfo)},property:function(){var name,index=parserInput.i
if("$"===parserInput.currentChar()&&(name=parserInput.$re(/^\$[\w-]+/)))return new tree.Property(name,index,fileInfo)},propertyCurly:function(){var curly,index=parserInput.i
if("$"===parserInput.currentChar()&&(curly=parserInput.$re(/^\$\{([\w-]+)\}/)))return new tree.Property("$"+curly[1],index,fileInfo)},color:function(){var rgb
if("#"===parserInput.currentChar()&&(rgb=parserInput.$re(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/))){var colorCandidateString=rgb.input.match(/^#([\w]+).*/);(colorCandidateString=colorCandidateString[1]).match(/^[A-Fa-f0-9]+$/)||error("Invalid HEX color code")
return new tree.Color(rgb[1],void 0,"#"+colorCandidateString)}},colorKeyword:function(){parserInput.save()
var autoCommentAbsorb=parserInput.autoCommentAbsorb
parserInput.autoCommentAbsorb=!1
var k=parserInput.$re(/^[_A-Za-z-][_A-Za-z0-9-]+/)
parserInput.autoCommentAbsorb=autoCommentAbsorb
if(k){parserInput.restore()
var color=tree.Color.fromKeyword(k)
if(color){parserInput.$str(k)
return color}}else parserInput.forget()},dimension:function(){if(!parserInput.peekNotNumeric()){var value=parserInput.$re(/^([+-]?\d*\.?\d+)(%|[a-z_]+)?/i)
return value?new tree.Dimension(value[1],value[2]):void 0}},unicodeDescriptor:function(){var ud
if(ud=parserInput.$re(/^U\+[0-9a-fA-F?]+(\-[0-9a-fA-F?]+)?/))return new tree.UnicodeDescriptor(ud[0])},javascript:function(){var js,index=parserInput.i
parserInput.save()
var escape=parserInput.$char("~")
if(parserInput.$char("`")){if(js=parserInput.$re(/^[^`]*`/)){parserInput.forget()
return new tree.JavaScript(js.substr(0,js.length-1),Boolean(escape),index,fileInfo)}parserInput.restore("invalid javascript definition")}else parserInput.restore()}},variable:function(){var name
if("@"===parserInput.currentChar()&&(name=parserInput.$re(/^(@[\w-]+)\s*:/)))return name[1]},variableCall:function(){var name
if("@"===parserInput.currentChar()&&(name=parserInput.$re(/^(@[\w-]+)\(\s*\)/))&&parsers.end())return new tree.VariableCall(name[1])},extend:function(isRule){var elements,e,option,extendList,extend,index=parserInput.i
if(parserInput.$str(isRule?"&:extend(":":extend(")){do{option=null
elements=null
for(;!(option=parserInput.$re(/^(all)(?=\s*(\)|,))/))&&(e=this.element());)elements?elements.push(e):elements=[e]
option=option&&option[1]
elements||error("Missing target selector for :extend().")
extend=new tree.Extend(new tree.Selector(elements),option,index,fileInfo)
extendList?extendList.push(extend):extendList=[extend]}while(parserInput.$char(","))
expect(/^\)/)
isRule&&expect(/^;/)
return extendList}},extendRule:function(){return this.extend(!0)},mixin:{call:function(){var elemIndex,elements,elem,e,c,args,s=parserInput.currentChar(),important=!1,index=parserInput.i
if("."===s||"#"===s){parserInput.save()
for(;;){elemIndex=parserInput.i
if(!(e=parserInput.$re(/^[#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/)))break
elem=new tree.Element(c,e,elemIndex,fileInfo)
elements?elements.push(elem):elements=[elem]
c=parserInput.$char(">")}if(elements){if(parserInput.$char("(")){args=this.args(!0).args
expectChar(")")}parsers.important()&&(important=!0)
if(parsers.end()){parserInput.forget()
return new tree.mixin.Call(elements,args,index,fileInfo,important)}}parserInput.restore()}},args:function(isCall){var isSemiColonSeparated,expressionContainsNamed,name,nameLoop,value,arg,expand,entities=parsers.entities,returner={args:null,variadic:!1},expressions=[],argsSemiColon=[],argsComma=[]
parserInput.save()
for(;;){if(isCall)arg=parsers.detachedRuleset()||parsers.expression()
else{parserInput.commentStore.length=0
if(parserInput.$str("...")){returner.variadic=!0
parserInput.$char(";")&&!isSemiColonSeparated&&(isSemiColonSeparated=!0);(isSemiColonSeparated?argsSemiColon:argsComma).push({variadic:!0})
break}arg=entities.variable()||entities.property()||entities.literal()||entities.keyword()}if(!arg)break
nameLoop=null
arg.throwAwayComments&&arg.throwAwayComments()
value=arg
var val=null
isCall?arg.value&&1==arg.value.length&&(val=arg.value[0]):val=arg
if(val&&(val instanceof tree.Variable||val instanceof tree.Property))if(parserInput.$char(":")){if(expressions.length>0){isSemiColonSeparated&&error("Cannot mix ; and , as delimiter types")
expressionContainsNamed=!0}if(!(value=parsers.detachedRuleset()||parsers.expression())){if(!isCall){parserInput.restore()
returner.args=[]
return returner}error("could not understand value for named argument")}nameLoop=name=val.name}else if(parserInput.$str("...")){if(!isCall){returner.variadic=!0
parserInput.$char(";")&&!isSemiColonSeparated&&(isSemiColonSeparated=!0);(isSemiColonSeparated?argsSemiColon:argsComma).push({name:arg.name,variadic:!0})
break}expand=!0}else if(!isCall){name=nameLoop=val.name
value=null}value&&expressions.push(value)
argsComma.push({name:nameLoop,value:value,expand:expand})
if(!parserInput.$char(",")&&(parserInput.$char(";")||isSemiColonSeparated)){expressionContainsNamed&&error("Cannot mix ; and , as delimiter types")
isSemiColonSeparated=!0
expressions.length>1&&(value=new tree.Value(expressions))
argsSemiColon.push({name:name,value:value,expand:expand})
name=null
expressions=[]
expressionContainsNamed=!1}}parserInput.forget()
returner.args=isSemiColonSeparated?argsSemiColon:argsComma
return returner},definition:function(){var name,match,ruleset,cond,params=[],variadic=!1
if(!("."!==parserInput.currentChar()&&"#"!==parserInput.currentChar()||parserInput.peek(/^[^{]*\}/))){parserInput.save()
if(match=parserInput.$re(/^([#.](?:[\w-]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+)\s*\(/)){name=match[1]
var argInfo=this.args(!1)
params=argInfo.args
variadic=argInfo.variadic
if(!parserInput.$char(")")){parserInput.restore("Missing closing ')'")
return}parserInput.commentStore.length=0
parserInput.$str("when")&&(cond=expect(parsers.conditions,"expected condition"))
if(ruleset=parsers.block()){parserInput.forget()
return new tree.mixin.Definition(name,params,ruleset,cond,variadic)}parserInput.restore()}else parserInput.forget()}}},entity:function(){var entities=this.entities
return this.comment()||entities.literal()||entities.variable()||entities.url()||entities.property()||entities.call()||entities.keyword()||entities.javascript()},end:function(){return parserInput.$char(";")||parserInput.peek("}")},ieAlpha:function(){var value
if(parserInput.$re(/^opacity=/i)){(value=parserInput.$re(/^\d+/))||(value="@{"+(value=expect(parsers.entities.variable,"Could not parse alpha")).name.slice(1)+"}")
expectChar(")")
return new tree.Quoted("","alpha(opacity="+value+")")}},element:function(){var e,c,v,index=parserInput.i
c=this.combinator()
if(!(e=parserInput.$re(/^(?:\d+\.\d+|\d+)%/)||parserInput.$re(/^(?:[.#]?|:*)(?:[\w-]|[^\x00-\x9f]|\\(?:[A-Fa-f0-9]{1,6} ?|[^A-Fa-f0-9]))+/)||parserInput.$char("*")||parserInput.$char("&")||this.attribute()||parserInput.$re(/^\([^&()@]+\)/)||parserInput.$re(/^[\.#:](?=@)/)||this.entities.variableCurly())){parserInput.save()
if(parserInput.$char("("))if((v=this.selector(!1))&&parserInput.$char(")")){e=new tree.Paren(v)
parserInput.forget()}else parserInput.restore("Missing closing ')'")
else parserInput.forget()}if(e)return new tree.Element(c,e,index,fileInfo)},combinator:function(){var c=parserInput.currentChar()
if("/"===c){parserInput.save()
var slashedCombinator=parserInput.$re(/^\/[a-z]+\//i)
if(slashedCombinator){parserInput.forget()
return new tree.Combinator(slashedCombinator)}parserInput.restore()}if(">"===c||"+"===c||"~"===c||"|"===c||"^"===c){parserInput.i++
if("^"===c&&"^"===parserInput.currentChar()){c="^^"
parserInput.i++}for(;parserInput.isWhitespace();)parserInput.i++
return new tree.Combinator(c)}return parserInput.isWhitespace(-1)?new tree.Combinator(" "):new tree.Combinator(null)},selector:function(isLess){var elements,extendList,c,e,allExtends,when,condition,index=parserInput.i
isLess=!1!==isLess
for(;isLess&&(extendList=this.extend())||isLess&&(when=parserInput.$str("when"))||(e=this.element());){if(when)condition=expect(this.conditions,"expected condition")
else if(condition)error("CSS guard can only be used at the end of selector")
else if(extendList)allExtends=allExtends?allExtends.concat(extendList):extendList
else{allExtends&&error("Extend can only be used at the end of selector")
c=parserInput.currentChar()
elements?elements.push(e):elements=[e]
e=null}if("{"===c||"}"===c||";"===c||","===c||")"===c)break}if(elements)return new tree.Selector(elements,allExtends,condition,index,fileInfo)
allExtends&&error("Extend must be used to extend a selector, it cannot be used on its own")},attribute:function(){if(parserInput.$char("[")){var key,val,op,entities=this.entities;(key=entities.variableCurly())||(key=expect(/^(?:[_A-Za-z0-9-\*]*\|)?(?:[_A-Za-z0-9-]|\\.)+/));(op=parserInput.$re(/^[|~*$^]?=/))&&(val=entities.quoted()||parserInput.$re(/^[0-9]+%/)||parserInput.$re(/^[\w-]+/)||entities.variableCurly())
expectChar("]")
return new tree.Attribute(key,op,val)}},block:function(){var content
if(parserInput.$char("{")&&(content=this.primary())&&parserInput.$char("}"))return content},blockRuleset:function(){var block=this.block()
block&&(block=new tree.Ruleset(null,block))
return block},detachedRuleset:function(){var blockRuleset=this.blockRuleset()
if(blockRuleset)return new tree.DetachedRuleset(blockRuleset)},ruleset:function(){var selectors,s,rules,debugInfo
parserInput.save()
context.dumpLineNumbers&&(debugInfo=getDebugInfo(parserInput.i))
for(;;){if(!(s=this.selector()))break
selectors?selectors.push(s):selectors=[s]
parserInput.commentStore.length=0
s.condition&&selectors.length>1&&error("Guards are only currently allowed on a single selector.")
if(!parserInput.$char(","))break
s.condition&&error("Guards are only currently allowed on a single selector.")
parserInput.commentStore.length=0}if(selectors&&(rules=this.block())){parserInput.forget()
var ruleset=new tree.Ruleset(selectors,rules,context.strictImports)
context.dumpLineNumbers&&(ruleset.debugInfo=debugInfo)
return ruleset}parserInput.restore()},declaration:function(){var name,value,important,merge,isVariable,startOfRule=parserInput.i,c=parserInput.currentChar()
if("."!==c&&"#"!==c&&"&"!==c&&":"!==c){parserInput.save()
if(name=this.variable()||this.ruleProperty()){(isVariable="string"==typeof name)&&(value=this.detachedRuleset())
parserInput.commentStore.length=0
if(!value){merge=!isVariable&&name.length>1&&name.pop().value
if(value=this.anonymousValue()){parserInput.forget()
return new tree.Declaration(name,value,!1,merge,startOfRule,fileInfo)}value||(value=this.value())
important=this.important()}if(value&&this.end()){parserInput.forget()
return new tree.Declaration(name,value,important,merge,startOfRule,fileInfo)}parserInput.restore()}else parserInput.restore()}},anonymousValue:function(){var index=parserInput.i,match=parserInput.$re(/^([^@\$+\/'"*`(;{}-]*);/)
if(match)return new tree.Anonymous(match[1],index)},import:function(){var path,features,index=parserInput.i,dir=parserInput.$re(/^@import?\s+/)
if(dir){var options=(dir?this.importOptions():null)||{}
if(path=this.entities.quoted()||this.entities.url()){features=this.mediaFeatures()
if(!parserInput.$char(";")){parserInput.i=index
error("missing semi-colon or unrecognised media features on import")}features=features&&new tree.Value(features)
return new tree.Import(path,features,options,index,fileInfo)}parserInput.i=index
error("malformed import statement")}},importOptions:function(){var o,optionName,value,options={}
if(!parserInput.$char("("))return null
do{if(o=this.importOption()){value=!0
switch(optionName=o){case"css":optionName="less"
value=!1
break
case"once":optionName="multiple"
value=!1}options[optionName]=value
if(!parserInput.$char(","))break}}while(o)
expectChar(")")
return options},importOption:function(){var opt=parserInput.$re(/^(less|css|multiple|once|inline|reference|optional)/)
if(opt)return opt[1]},mediaFeature:function(){var e,p,entities=this.entities,nodes=[]
parserInput.save()
do{if(e=entities.keyword()||entities.variable())nodes.push(e)
else if(parserInput.$char("(")){p=this.property()
e=this.value()
parserInput.$char(")")?p&&e?nodes.push(new tree.Paren(new tree.Declaration(p,e,null,null,parserInput.i,fileInfo,!0))):e?nodes.push(new tree.Paren(e)):error("badly formed media feature definition"):error("Missing closing ')'","Parse")}}while(e)
parserInput.forget()
if(nodes.length>0)return new tree.Expression(nodes)},mediaFeatures:function(){var e,entities=this.entities,features=[]
do{if(e=this.mediaFeature()){features.push(e)
if(!parserInput.$char(","))break}else if(e=entities.variable()){features.push(e)
if(!parserInput.$char(","))break}}while(e)
return features.length>0?features:null},media:function(){var features,rules,media,debugInfo,index=parserInput.i
context.dumpLineNumbers&&(debugInfo=getDebugInfo(index))
parserInput.save()
if(parserInput.$str("@media")){features=this.mediaFeatures();(rules=this.block())||error("media definitions require block statements after any features")
parserInput.forget()
media=new tree.Media(rules,features,index,fileInfo)
context.dumpLineNumbers&&(media.debugInfo=debugInfo)
return media}parserInput.restore()},plugin:function(){var path,args,options,index=parserInput.i
if(parserInput.$re(/^@plugin?\s+/)){options=(args=this.pluginArgs())?{pluginArgs:args,isPlugin:!0}:{isPlugin:!0}
if(path=this.entities.quoted()||this.entities.url()){if(!parserInput.$char(";")){parserInput.i=index
error("missing semi-colon on @plugin")}return new tree.Import(path,null,options,index,fileInfo)}parserInput.i=index
error("malformed @plugin statement")}},pluginArgs:function(){parserInput.save()
if(!parserInput.$char("(")){parserInput.restore()
return null}var args=parserInput.$re(/^\s*([^\);]+)\)\s*/)
if(args[1]){parserInput.forget()
return args[1].trim()}parserInput.restore()
return null},atrule:function(){var name,value,rules,nonVendorSpecificName,hasIdentifier,hasExpression,hasUnknown,index=parserInput.i,hasBlock=!0,isRooted=!0
if("@"===parserInput.currentChar()){if(value=this.import()||this.plugin()||this.media())return value
parserInput.save()
if(name=parserInput.$re(/^@[a-z-]+/)){nonVendorSpecificName=name
"-"==name.charAt(1)&&name.indexOf("-",2)>0&&(nonVendorSpecificName="@"+name.slice(name.indexOf("-",2)+1))
switch(nonVendorSpecificName){case"@charset":hasIdentifier=!0
hasBlock=!1
break
case"@namespace":hasExpression=!0
hasBlock=!1
break
case"@keyframes":case"@counter-style":hasIdentifier=!0
break
case"@document":case"@supports":hasUnknown=!0
isRooted=!1
break
default:hasUnknown=!0}parserInput.commentStore.length=0
if(hasIdentifier)(value=this.entity())||error("expected "+name+" identifier")
else if(hasExpression)(value=this.expression())||error("expected "+name+" expression")
else if(hasUnknown){value=(parserInput.$re(/^[^{;]+/)||"").trim()
hasBlock="{"==parserInput.currentChar()
value&&(value=new tree.Anonymous(value))}hasBlock&&(rules=this.blockRuleset())
if(rules||!hasBlock&&value&&parserInput.$char(";")){parserInput.forget()
return new tree.AtRule(name,value,rules,index,fileInfo,context.dumpLineNumbers?getDebugInfo(index):null,isRooted)}parserInput.restore("at-rule options not recognised")}}},value:function(){var e,expressions=[],index=parserInput.i
do{if(e=this.expression()){expressions.push(e)
if(!parserInput.$char(","))break}}while(e)
if(expressions.length>0)return new tree.Value(expressions,index)},important:function(){if("!"===parserInput.currentChar())return parserInput.$re(/^! *important/)},sub:function(){var a,e
parserInput.save()
if(parserInput.$char("(")){if((a=this.addition())&&parserInput.$char(")")){parserInput.forget();(e=new tree.Expression([a])).parens=!0
return e}parserInput.restore("Expected ')'")}else parserInput.restore()},multiplication:function(){var m,a,op,operation,isSpaced
if(m=this.operand()){isSpaced=parserInput.isWhitespace(-1)
for(;;){if(parserInput.peek(/^\/[*\/]/))break
parserInput.save()
if(!(op=parserInput.$char("/")||parserInput.$char("*"))){parserInput.forget()
break}if(!(a=this.operand())){parserInput.restore()
break}parserInput.forget()
m.parensInOp=!0
a.parensInOp=!0
operation=new tree.Operation(op,[operation||m,a],isSpaced)
isSpaced=parserInput.isWhitespace(-1)}return operation||m}},addition:function(){var m,a,op,operation,isSpaced
if(m=this.multiplication()){isSpaced=parserInput.isWhitespace(-1)
for(;;){if(!(op=parserInput.$re(/^[-+]\s+/)||!isSpaced&&(parserInput.$char("+")||parserInput.$char("-"))))break
if(!(a=this.multiplication()))break
m.parensInOp=!0
a.parensInOp=!0
operation=new tree.Operation(op,[operation||m,a],isSpaced)
isSpaced=parserInput.isWhitespace(-1)}return operation||m}},conditions:function(){var a,b,condition,index=parserInput.i
if(a=this.condition()){for(;;){if(!parserInput.peek(/^,\s*(not\s*)?\(/)||!parserInput.$char(","))break
if(!(b=this.condition()))break
condition=new tree.Condition("or",condition||a,b,index)}return condition||a}},condition:function(){var result,logical,next
if(result=this.conditionAnd(this)){if(logical=parserInput.$str("or")){if(!(next=this.condition()))return
result=new tree.Condition(logical,result,next)}return result}},conditionAnd:function(){var result,logical,next
if(result=function(me){return me.negatedCondition()||me.parenthesisCondition()}(this)){if(logical=parserInput.$str("and")){if(!(next=this.conditionAnd()))return
result=new tree.Condition(logical,result,next)}return result}},negatedCondition:function(){if(parserInput.$str("not")){var result=this.parenthesisCondition()
result&&(result.negate=!result.negate)
return result}},parenthesisCondition:function(){var body
parserInput.save()
if(parserInput.$str("(")){if(body=function(me){var body
parserInput.save()
if(body=me.condition()){if(parserInput.$char(")")){parserInput.forget()
return body}parserInput.restore()}else parserInput.restore()}(this)){parserInput.forget()
return body}if(body=this.atomicCondition()){if(parserInput.$char(")")){parserInput.forget()
return body}parserInput.restore("expected ')' got '"+parserInput.currentChar()+"'")}else parserInput.restore()}else parserInput.restore()},atomicCondition:function(){var a,b,c,op,entities=this.entities,index=parserInput.i
if(a=this.addition()||entities.keyword()||entities.quoted()){parserInput.$char(">")?op=parserInput.$char("=")?">=":">":parserInput.$char("<")?op=parserInput.$char("=")?"<=":"<":parserInput.$char("=")&&(op=parserInput.$char(">")?"=>":parserInput.$char("<")?"=<":"=")
op?(b=this.addition()||entities.keyword()||entities.quoted())?c=new tree.Condition(op,a,b,index,!1):error("expected expression"):c=new tree.Condition("=",a,new tree.Keyword("true"),index,!1)
return c}},operand:function(){var negate,entities=this.entities
parserInput.peek(/^-[@\$\(]/)&&(negate=parserInput.$char("-"))
var o=this.sub()||entities.dimension()||entities.color()||entities.variable()||entities.property()||entities.call()||entities.colorKeyword()
if(negate){o.parensInOp=!0
o=new tree.Negative(o)}return o},expression:function(){var e,delim,entities=[],index=parserInput.i
do{if(e=this.comment())entities.push(e)
else if(e=this.addition()||this.entity()){entities.push(e)
parserInput.peek(/^\/[\/*]/)||(delim=parserInput.$char("/"))&&entities.push(new tree.Anonymous(delim,index))}}while(e)
if(entities.length>0)return new tree.Expression(entities)},property:function(){var name=parserInput.$re(/^(\*?-?[_a-zA-Z0-9-]+)\s*:/)
if(name)return name[1]},ruleProperty:function(){function match(re){var i=parserInput.i,chunk=parserInput.$re(re)
if(chunk){index.push(i)
return name.push(chunk[1])}}var s,k,name=[],index=[]
parserInput.save()
var simpleProperty=parserInput.$re(/^([_a-zA-Z0-9-]+)\s*:/)
if(simpleProperty){name=[new tree.Keyword(simpleProperty[1])]
parserInput.forget()
return name}match(/^(\*?)/)
for(;;)if(!match(/^((?:[\w-]+)|(?:[@\$]\{[\w-]+\}))/))break
if(name.length>1&&match(/^((?:\+_|\+)?)\s*:/)){parserInput.forget()
if(""===name[0]){name.shift()
index.shift()}for(k=0;k<name.length;k++){s=name[k]
name[k]="@"!==s.charAt(0)&&"$"!==s.charAt(0)?new tree.Keyword(s):"@"===s.charAt(0)?new tree.Variable("@"+s.slice(2,-1),index[k],fileInfo):new tree.Property("$"+s.slice(2,-1),index[k],fileInfo)}return name}parserInput.restore()}}}}
Parser.serializeVars=function(vars){var s=""
for(var name in vars)if(Object.hasOwnProperty.call(vars,name)){var value=vars[name]
s+=("@"===name[0]?"":"@")+name+": "+value+(";"===String(value).slice(-1)?"":";")}return s}
module.exports=Parser},{"../less-error":28,"../tree":58,"../utils":80,"../visitors":84,"./parser-input":33}],35:[function(require,module,exports){function upgradeVisitors(visitor,oldType,newType){visitor["visit"+oldType]&&!visitor["visit"+newType]&&(visitor["visit"+newType]=visitor["visit"+oldType])
visitor["visit"+oldType+"Out"]&&!visitor["visit"+newType+"Out"]&&(visitor["visit"+newType+"Out"]=visitor["visit"+oldType+"Out"])}var pm,utils=require("./utils"),PluginManager=function(less){this.less=less
this.visitors=[]
this.preProcessors=[]
this.postProcessors=[]
this.installedPlugins=[]
this.fileManagers=[]
this.iterator=-1
this.pluginCache={}
this.Loader=new less.PluginLoader(less)}
PluginManager.prototype.addPlugins=function(plugins){if(plugins)for(var i=0;i<plugins.length;i++)this.addPlugin(plugins[i])}
PluginManager.prototype.addPlugin=function(plugin,filename,functionRegistry){this.installedPlugins.push(plugin)
filename&&(this.pluginCache[filename]=plugin)
plugin.install&&plugin.install(this.less,this,functionRegistry||this.less.functions.functionRegistry)}
PluginManager.prototype.get=function(filename){return this.pluginCache[filename]}
PluginManager.prototype.addVisitor=function(visitor){var proto
try{upgradeVisitors(proto=utils.getPrototype(visitor),"Directive","AtRule")
upgradeVisitors(proto,"Rule","Declaration")}catch(e){}this.visitors.push(visitor)}
PluginManager.prototype.addPreProcessor=function(preProcessor,priority){var indexToInsertAt
for(indexToInsertAt=0;indexToInsertAt<this.preProcessors.length&&!(this.preProcessors[indexToInsertAt].priority>=priority);indexToInsertAt++);this.preProcessors.splice(indexToInsertAt,0,{preProcessor:preProcessor,priority:priority})}
PluginManager.prototype.addPostProcessor=function(postProcessor,priority){var indexToInsertAt
for(indexToInsertAt=0;indexToInsertAt<this.postProcessors.length&&!(this.postProcessors[indexToInsertAt].priority>=priority);indexToInsertAt++);this.postProcessors.splice(indexToInsertAt,0,{postProcessor:postProcessor,priority:priority})}
PluginManager.prototype.addFileManager=function(manager){this.fileManagers.push(manager)}
PluginManager.prototype.getPreProcessors=function(){for(var preProcessors=[],i=0;i<this.preProcessors.length;i++)preProcessors.push(this.preProcessors[i].preProcessor)
return preProcessors}
PluginManager.prototype.getPostProcessors=function(){for(var postProcessors=[],i=0;i<this.postProcessors.length;i++)postProcessors.push(this.postProcessors[i].postProcessor)
return postProcessors}
PluginManager.prototype.getVisitors=function(){return this.visitors}
PluginManager.prototype.visitor=function(){var self=this
return{first:function(){self.iterator=-1
return self.visitors[self.iterator]},get:function(){self.iterator+=1
return self.visitors[self.iterator]}}}
PluginManager.prototype.getFileManagers=function(){return this.fileManagers}
module.exports=function(less,newFactory){!newFactory&&pm||(pm=new PluginManager(less))
return pm}},{"./utils":80}],36:[function(require,module,exports){var PromiseConstructor
module.exports=function(environment,ParseTree,ImportManager){var render=function(input,options,callback){if("function"==typeof options){callback=options
options={}}if(!callback){PromiseConstructor||(PromiseConstructor="undefined"==typeof Promise?require("promise"):Promise)
var self=this
return new PromiseConstructor(function(resolve,reject){render.call(self,input,options,function(err,output){err?reject(err):resolve(output)})})}this.parse(input,options,function(err,root,imports,options){if(err)return callback(err)
var result
try{result=new ParseTree(root,imports).toCSS(options)}catch(err){return callback(err)}callback(null,result)})}
return render}},{promise:93}],37:[function(require,module,exports){module.exports=function(SourceMapOutput,environment){var SourceMapBuilder=function(options){this.options=options}
SourceMapBuilder.prototype.toCSS=function(rootNode,options,imports){var sourceMapOutput=new SourceMapOutput({contentsIgnoredCharsMap:imports.contentsIgnoredChars,rootNode:rootNode,contentsMap:imports.contents,sourceMapFilename:this.options.sourceMapFilename,sourceMapURL:this.options.sourceMapURL,outputFilename:this.options.sourceMapOutputFilename,sourceMapBasepath:this.options.sourceMapBasepath,sourceMapRootpath:this.options.sourceMapRootpath,outputSourceFiles:this.options.outputSourceFiles,sourceMapGenerator:this.options.sourceMapGenerator,sourceMapFileInline:this.options.sourceMapFileInline}),css=sourceMapOutput.toCSS(options)
this.sourceMap=sourceMapOutput.sourceMap
this.sourceMapURL=sourceMapOutput.sourceMapURL
this.options.sourceMapInputFilename&&(this.sourceMapInputFilename=sourceMapOutput.normalizeFilename(this.options.sourceMapInputFilename))
void 0!==this.options.sourceMapBasepath&&void 0!==this.sourceMapURL&&(this.sourceMapURL=sourceMapOutput.removeBasepath(this.sourceMapURL))
return css+this.getCSSAppendage()}
SourceMapBuilder.prototype.getCSSAppendage=function(){var sourceMapURL=this.sourceMapURL
if(this.options.sourceMapFileInline){if(void 0===this.sourceMap)return""
sourceMapURL="data:application/json;base64,"+environment.encodeBase64(this.sourceMap)}return sourceMapURL?"/*# sourceMappingURL="+sourceMapURL+" */":""}
SourceMapBuilder.prototype.getExternalSourceMap=function(){return this.sourceMap}
SourceMapBuilder.prototype.setExternalSourceMap=function(sourceMap){this.sourceMap=sourceMap}
SourceMapBuilder.prototype.isInline=function(){return this.options.sourceMapFileInline}
SourceMapBuilder.prototype.getSourceMapURL=function(){return this.sourceMapURL}
SourceMapBuilder.prototype.getOutputFilename=function(){return this.options.sourceMapOutputFilename}
SourceMapBuilder.prototype.getInputFilename=function(){return this.sourceMapInputFilename}
return SourceMapBuilder}},{}],38:[function(require,module,exports){module.exports=function(environment){var SourceMapOutput=function(options){this._css=[]
this._rootNode=options.rootNode
this._contentsMap=options.contentsMap
this._contentsIgnoredCharsMap=options.contentsIgnoredCharsMap
options.sourceMapFilename&&(this._sourceMapFilename=options.sourceMapFilename.replace(/\\/g,"/"))
this._outputFilename=options.outputFilename
this.sourceMapURL=options.sourceMapURL
options.sourceMapBasepath&&(this._sourceMapBasepath=options.sourceMapBasepath.replace(/\\/g,"/"))
if(options.sourceMapRootpath){this._sourceMapRootpath=options.sourceMapRootpath.replace(/\\/g,"/")
"/"!==this._sourceMapRootpath.charAt(this._sourceMapRootpath.length-1)&&(this._sourceMapRootpath+="/")}else this._sourceMapRootpath=""
this._outputSourceFiles=options.outputSourceFiles
this._sourceMapGeneratorConstructor=environment.getSourceMapGenerator()
this._lineNumber=0
this._column=0}
SourceMapOutput.prototype.removeBasepath=function(path){this._sourceMapBasepath&&0===path.indexOf(this._sourceMapBasepath)&&("\\"!==(path=path.substring(this._sourceMapBasepath.length)).charAt(0)&&"/"!==path.charAt(0)||(path=path.substring(1)))
return path}
SourceMapOutput.prototype.normalizeFilename=function(filename){filename=filename.replace(/\\/g,"/")
filename=this.removeBasepath(filename)
return(this._sourceMapRootpath||"")+filename}
SourceMapOutput.prototype.add=function(chunk,fileInfo,index,mapLines){if(chunk){var lines,sourceLines,columns,sourceColumns,i
if(fileInfo){var inputSource=this._contentsMap[fileInfo.filename]
if(this._contentsIgnoredCharsMap[fileInfo.filename]){(index-=this._contentsIgnoredCharsMap[fileInfo.filename])<0&&(index=0)
inputSource=inputSource.slice(this._contentsIgnoredCharsMap[fileInfo.filename])}sourceColumns=(sourceLines=(inputSource=inputSource.substring(0,index)).split("\n"))[sourceLines.length-1]}columns=(lines=chunk.split("\n"))[lines.length-1]
if(fileInfo)if(mapLines)for(i=0;i<lines.length;i++)this._sourceMapGenerator.addMapping({generated:{line:this._lineNumber+i+1,column:0===i?this._column:0},original:{line:sourceLines.length+i,column:0===i?sourceColumns.length:0},source:this.normalizeFilename(fileInfo.filename)})
else this._sourceMapGenerator.addMapping({generated:{line:this._lineNumber+1,column:this._column},original:{line:sourceLines.length,column:sourceColumns.length},source:this.normalizeFilename(fileInfo.filename)})
if(1===lines.length)this._column+=columns.length
else{this._lineNumber+=lines.length-1
this._column=columns.length}this._css.push(chunk)}}
SourceMapOutput.prototype.isEmpty=function(){return 0===this._css.length}
SourceMapOutput.prototype.toCSS=function(context){this._sourceMapGenerator=new this._sourceMapGeneratorConstructor({file:this._outputFilename,sourceRoot:null})
if(this._outputSourceFiles)for(var filename in this._contentsMap)if(this._contentsMap.hasOwnProperty(filename)){var source=this._contentsMap[filename]
this._contentsIgnoredCharsMap[filename]&&(source=source.slice(this._contentsIgnoredCharsMap[filename]))
this._sourceMapGenerator.setSourceContent(this.normalizeFilename(filename),source)}this._rootNode.genCSS(context,this)
if(this._css.length>0){var sourceMapURL,sourceMapContent=JSON.stringify(this._sourceMapGenerator.toJSON())
this.sourceMapURL?sourceMapURL=this.sourceMapURL:this._sourceMapFilename&&(sourceMapURL=this._sourceMapFilename)
this.sourceMapURL=sourceMapURL
this.sourceMap=sourceMapContent}return this._css.join("")}
return SourceMapOutput}},{}],39:[function(require,module,exports){var contexts=require("./contexts"),visitor=require("./visitors"),tree=require("./tree")
module.exports=function(root,options){var evaldRoot,variables=(options=options||{}).variables,evalEnv=new contexts.Eval(options)
if("object"==typeof variables&&!Array.isArray(variables)){variables=Object.keys(variables).map(function(k){var value=variables[k]
if(!(value instanceof tree.Value)){value instanceof tree.Expression||(value=new tree.Expression([value]))
value=new tree.Value([value])}return new tree.Declaration("@"+k,value,!1,null,0)})
evalEnv.frames=[new tree.Ruleset(null,variables)]}var v,visitorIterator,visitors=[new visitor.JoinSelectorVisitor,new visitor.MarkVisibleSelectorsVisitor(!0),new visitor.ExtendVisitor,new visitor.ToCSSVisitor({compress:Boolean(options.compress)})]
if(options.pluginManager){(visitorIterator=options.pluginManager.visitor()).first()
for(;v=visitorIterator.get();)v.isPreEvalVisitor&&v.run(root)}evaldRoot=root.eval(evalEnv)
for(var i=0;i<visitors.length;i++)visitors[i].run(evaldRoot)
if(options.pluginManager){visitorIterator.first()
for(;v=visitorIterator.get();)v.isPreEvalVisitor||v.run(evaldRoot)}return evaldRoot}},{"./contexts":4,"./tree":58,"./visitors":84}],40:[function(require,module,exports){var Node=require("./node"),Anonymous=function(value,index,currentFileInfo,mapLines,rulesetLike,visibilityInfo){this.value=value
this._index=index
this._fileInfo=currentFileInfo
this.mapLines=mapLines
this.rulesetLike=void 0!==rulesetLike&&rulesetLike
this.allowRoot=!0
this.copyVisibilityInfo(visibilityInfo)};(Anonymous.prototype=new Node).type="Anonymous"
Anonymous.prototype.eval=function(){return new Anonymous(this.value,this._index,this._fileInfo,this.mapLines,this.rulesetLike,this.visibilityInfo())}
Anonymous.prototype.compare=function(other){return other.toCSS&&this.toCSS()===other.toCSS()?0:void 0}
Anonymous.prototype.isRulesetLike=function(){return this.rulesetLike}
Anonymous.prototype.genCSS=function(context,output){this.nodeVisible=Boolean(this.value)
this.nodeVisible&&output.add(this.value,this._fileInfo,this._index,this.mapLines)}
module.exports=Anonymous},{"./node":66}],41:[function(require,module,exports){var Node=require("./node"),Assignment=function(key,val){this.key=key
this.value=val};(Assignment.prototype=new Node).type="Assignment"
Assignment.prototype.accept=function(visitor){this.value=visitor.visit(this.value)}
Assignment.prototype.eval=function(context){return this.value.eval?new Assignment(this.key,this.value.eval(context)):this}
Assignment.prototype.genCSS=function(context,output){output.add(this.key+"=")
this.value.genCSS?this.value.genCSS(context,output):output.add(this.value)}
module.exports=Assignment},{"./node":66}],42:[function(require,module,exports){var Node=require("./node"),Selector=require("./selector"),Ruleset=require("./ruleset"),Anonymous=require("./anonymous"),AtRule=function(name,value,rules,index,currentFileInfo,debugInfo,isRooted,visibilityInfo){var i
this.name=name
this.value=value instanceof Node?value:value?new Anonymous(value):value
if(rules){if(Array.isArray(rules))this.rules=rules
else{this.rules=[rules]
this.rules[0].selectors=new Selector([],null,null,index,currentFileInfo).createEmptySelectors()}for(i=0;i<this.rules.length;i++)this.rules[i].allowImports=!0
this.setParent(this.rules,this)}this._index=index
this._fileInfo=currentFileInfo
this.debugInfo=debugInfo
this.isRooted=isRooted||!1
this.copyVisibilityInfo(visibilityInfo)
this.allowRoot=!0};(AtRule.prototype=new Node).type="AtRule"
AtRule.prototype.accept=function(visitor){var value=this.value,rules=this.rules
rules&&(this.rules=visitor.visitArray(rules))
value&&(this.value=visitor.visit(value))}
AtRule.prototype.isRulesetLike=function(){return this.rules||!this.isCharset()}
AtRule.prototype.isCharset=function(){return"@charset"===this.name}
AtRule.prototype.genCSS=function(context,output){var value=this.value,rules=this.rules
output.add(this.name,this.fileInfo(),this.getIndex())
if(value){output.add(" ")
value.genCSS(context,output)}rules?this.outputRuleset(context,output,rules):output.add(";")}
AtRule.prototype.eval=function(context){var mediaPathBackup,mediaBlocksBackup,value=this.value,rules=this.rules
mediaPathBackup=context.mediaPath
mediaBlocksBackup=context.mediaBlocks
context.mediaPath=[]
context.mediaBlocks=[]
value&&(value=value.eval(context))
rules&&((rules=[rules[0].eval(context)])[0].root=!0)
context.mediaPath=mediaPathBackup
context.mediaBlocks=mediaBlocksBackup
return new AtRule(this.name,value,rules,this.getIndex(),this.fileInfo(),this.debugInfo,this.isRooted,this.visibilityInfo())}
AtRule.prototype.variable=function(name){if(this.rules)return Ruleset.prototype.variable.call(this.rules[0],name)}
AtRule.prototype.find=function(){if(this.rules)return Ruleset.prototype.find.apply(this.rules[0],arguments)}
AtRule.prototype.rulesets=function(){if(this.rules)return Ruleset.prototype.rulesets.apply(this.rules[0])}
AtRule.prototype.outputRuleset=function(context,output,rules){var i,ruleCnt=rules.length
context.tabLevel=1+(0|context.tabLevel)
if(context.compress){output.add("{")
for(i=0;i<ruleCnt;i++)rules[i].genCSS(context,output)
output.add("}")
context.tabLevel--}else{var tabSetStr="\n"+Array(context.tabLevel).join("  "),tabRuleStr=tabSetStr+"  "
if(ruleCnt){output.add(" {"+tabRuleStr)
rules[0].genCSS(context,output)
for(i=1;i<ruleCnt;i++){output.add(tabRuleStr)
rules[i].genCSS(context,output)}output.add(tabSetStr+"}")}else output.add(" {"+tabSetStr+"}")
context.tabLevel--}}
module.exports=AtRule},{"./anonymous":40,"./node":66,"./ruleset":72,"./selector":73}],43:[function(require,module,exports){var Node=require("./node"),Attribute=function(key,op,value){this.key=key
this.op=op
this.value=value};(Attribute.prototype=new Node).type="Attribute"
Attribute.prototype.eval=function(context){return new Attribute(this.key.eval?this.key.eval(context):this.key,this.op,this.value&&this.value.eval?this.value.eval(context):this.value)}
Attribute.prototype.genCSS=function(context,output){output.add(this.toCSS(context))}
Attribute.prototype.toCSS=function(context){var value=this.key.toCSS?this.key.toCSS(context):this.key
if(this.op){value+=this.op
value+=this.value.toCSS?this.value.toCSS(context):this.value}return"["+value+"]"}
module.exports=Attribute},{"./node":66}],44:[function(require,module,exports){var Node=require("./node"),Anonymous=require("./anonymous"),FunctionCaller=require("../functions/function-caller"),Call=function(name,args,index,currentFileInfo){this.name=name
this.args=args
this._index=index
this._fileInfo=currentFileInfo};(Call.prototype=new Node).type="Call"
Call.prototype.accept=function(visitor){this.args&&(this.args=visitor.visitArray(this.args))}
Call.prototype.eval=function(context){var result,args=this.args.map(function(a){return a.eval(context)}),funcCaller=new FunctionCaller(this.name,context,this.getIndex(),this.fileInfo())
if(funcCaller.isValid()){try{result=funcCaller.call(args)}catch(e){throw{type:e.type||"Runtime",message:"error evaluating function `"+this.name+"`"+(e.message?": "+e.message:""),index:this.getIndex(),filename:this.fileInfo().filename,line:e.lineNumber,column:e.columnNumber}}if(null!==result&&void 0!==result){result instanceof Node||(result=new Anonymous(result&&!0!==result?result.toString():null))
result._index=this._index
result._fileInfo=this._fileInfo
return result}}return new Call(this.name,args,this.getIndex(),this.fileInfo())}
Call.prototype.genCSS=function(context,output){output.add(this.name+"(",this.fileInfo(),this.getIndex())
for(var i=0;i<this.args.length;i++){this.args[i].genCSS(context,output)
i+1<this.args.length&&output.add(", ")}output.add(")")}
module.exports=Call},{"../functions/function-caller":17,"./anonymous":40,"./node":66}],45:[function(require,module,exports){function clamp(v,max){return Math.min(Math.max(v,0),max)}function toHex(v){return"#"+v.map(function(c){return((c=clamp(Math.round(c),255))<16?"0":"")+c.toString(16)}).join("")}var Node=require("./node"),colors=require("../data/colors"),Color=function(rgb,a,originalForm){Array.isArray(rgb)?this.rgb=rgb:6==rgb.length?this.rgb=rgb.match(/.{2}/g).map(function(c){return parseInt(c,16)}):this.rgb=rgb.split("").map(function(c){return parseInt(c+c,16)})
this.alpha="number"==typeof a?a:1
void 0!==originalForm&&(this.value=originalForm)};(Color.prototype=new Node).type="Color"
Color.prototype.luma=function(){var r=this.rgb[0]/255,g=this.rgb[1]/255,b=this.rgb[2]/255
return.2126*(r=r<=.03928?r/12.92:Math.pow((r+.055)/1.055,2.4))+.7152*(g=g<=.03928?g/12.92:Math.pow((g+.055)/1.055,2.4))+.0722*(b=b<=.03928?b/12.92:Math.pow((b+.055)/1.055,2.4))}
Color.prototype.genCSS=function(context,output){output.add(this.toCSS(context))}
Color.prototype.toCSS=function(context,doNotCompress){var color,alpha,compress=context&&context.compress&&!doNotCompress
if(this.value)return this.value
if((alpha=this.fround(context,this.alpha))<1)return"rgba("+this.rgb.map(function(c){return clamp(Math.round(c),255)}).concat(clamp(alpha,1)).join(","+(compress?"":" "))+")"
color=this.toRGB()
if(compress){var splitcolor=color.split("")
splitcolor[1]===splitcolor[2]&&splitcolor[3]===splitcolor[4]&&splitcolor[5]===splitcolor[6]&&(color="#"+splitcolor[1]+splitcolor[3]+splitcolor[5])}return color}
Color.prototype.operate=function(context,op,other){for(var rgb=new Array(3),alpha=this.alpha*(1-other.alpha)+other.alpha,c=0;c<3;c++)rgb[c]=this._operate(context,op,this.rgb[c],other.rgb[c])
return new Color(rgb,alpha)}
Color.prototype.toRGB=function(){return toHex(this.rgb)}
Color.prototype.toHSL=function(){var h,s,r=this.rgb[0]/255,g=this.rgb[1]/255,b=this.rgb[2]/255,a=this.alpha,max=Math.max(r,g,b),min=Math.min(r,g,b),l=(max+min)/2,d=max-min
if(max===min)h=s=0
else{s=l>.5?d/(2-max-min):d/(max+min)
switch(max){case r:h=(g-b)/d+(g<b?6:0)
break
case g:h=(b-r)/d+2
break
case b:h=(r-g)/d+4}h/=6}return{h:360*h,s:s,l:l,a:a}}
Color.prototype.toHSV=function(){var h,s,r=this.rgb[0]/255,g=this.rgb[1]/255,b=this.rgb[2]/255,a=this.alpha,max=Math.max(r,g,b),min=Math.min(r,g,b),v=max,d=max-min
s=0===max?0:d/max
if(max===min)h=0
else{switch(max){case r:h=(g-b)/d+(g<b?6:0)
break
case g:h=(b-r)/d+2
break
case b:h=(r-g)/d+4}h/=6}return{h:360*h,s:s,v:v,a:a}}
Color.prototype.toARGB=function(){return toHex([255*this.alpha].concat(this.rgb))}
Color.prototype.compare=function(x){return x.rgb&&x.rgb[0]===this.rgb[0]&&x.rgb[1]===this.rgb[1]&&x.rgb[2]===this.rgb[2]&&x.alpha===this.alpha?0:void 0}
Color.fromKeyword=function(keyword){var c,key=keyword.toLowerCase()
colors.hasOwnProperty(key)?c=new Color(colors[key].slice(1)):"transparent"===key&&(c=new Color([0,0,0],0))
if(c){c.value=keyword
return c}}
module.exports=Color},{"../data/colors":5,"./node":66}],46:[function(require,module,exports){var Node=require("./node"),Combinator=function(value){if(" "===value){this.value=" "
this.emptyOrWhitespace=!0}else{this.value=value?value.trim():""
this.emptyOrWhitespace=""===this.value}};(Combinator.prototype=new Node).type="Combinator"
var _noSpaceCombinators={"":!0," ":!0,"|":!0}
Combinator.prototype.genCSS=function(context,output){var spaceOrEmpty=context.compress||_noSpaceCombinators[this.value]?"":" "
output.add(spaceOrEmpty+this.value+spaceOrEmpty)}
module.exports=Combinator},{"./node":66}],47:[function(require,module,exports){var Node=require("./node"),getDebugInfo=require("./debug-info"),Comment=function(value,isLineComment,index,currentFileInfo){this.value=value
this.isLineComment=isLineComment
this._index=index
this._fileInfo=currentFileInfo
this.allowRoot=!0};(Comment.prototype=new Node).type="Comment"
Comment.prototype.genCSS=function(context,output){this.debugInfo&&output.add(getDebugInfo(context,this),this.fileInfo(),this.getIndex())
output.add(this.value)}
Comment.prototype.isSilent=function(context){var isCompressed=context.compress&&"!"!==this.value[2]
return this.isLineComment||isCompressed}
module.exports=Comment},{"./debug-info":49,"./node":66}],48:[function(require,module,exports){var Node=require("./node"),Condition=function(op,l,r,i,negate){this.op=op.trim()
this.lvalue=l
this.rvalue=r
this._index=i
this.negate=negate};(Condition.prototype=new Node).type="Condition"
Condition.prototype.accept=function(visitor){this.lvalue=visitor.visit(this.lvalue)
this.rvalue=visitor.visit(this.rvalue)}
Condition.prototype.eval=function(context){var result=function(op,a,b){switch(op){case"and":return a&&b
case"or":return a||b
default:switch(Node.compare(a,b)){case-1:return"<"===op||"=<"===op||"<="===op
case 0:return"="===op||">="===op||"=<"===op||"<="===op
case 1:return">"===op||">="===op
default:return!1}}}(this.op,this.lvalue.eval(context),this.rvalue.eval(context))
return this.negate?!result:result}
module.exports=Condition},{"./node":66}],49:[function(require,module,exports){var debugInfo=function(context,ctx,lineSeparator){var result=""
if(context.dumpLineNumbers&&!context.compress)switch(context.dumpLineNumbers){case"comments":result=debugInfo.asComment(ctx)
break
case"mediaquery":result=debugInfo.asMediaQuery(ctx)
break
case"all":result=debugInfo.asComment(ctx)+(lineSeparator||"")+debugInfo.asMediaQuery(ctx)}return result}
debugInfo.asComment=function(ctx){return"/* line "+ctx.debugInfo.lineNumber+", "+ctx.debugInfo.fileName+" */\n"}
debugInfo.asMediaQuery=function(ctx){var filenameWithProtocol=ctx.debugInfo.fileName;/^[a-z]+:\/\//i.test(filenameWithProtocol)||(filenameWithProtocol="file://"+filenameWithProtocol)
return"@media -sass-debug-info{filename{font-family:"+filenameWithProtocol.replace(/([.:\/\\])/g,function(a){"\\"==a&&(a="/")
return"\\"+a})+"}line{font-family:\\00003"+ctx.debugInfo.lineNumber+"}}\n"}
module.exports=debugInfo},{}],50:[function(require,module,exports){function evalName(context,name){var i,value="",n=name.length,output={add:function(s){value+=s}}
for(i=0;i<n;i++)name[i].eval(context).genCSS(context,output)
return value}var Node=require("./node"),Value=require("./value"),Keyword=require("./keyword"),Anonymous=require("./anonymous"),Declaration=function(name,value,important,merge,index,currentFileInfo,inline,variable){this.name=name
this.value=value instanceof Node?value:new Value([value?new Anonymous(value):null])
this.important=important?" "+important.trim():""
this.merge=merge
this._index=index
this._fileInfo=currentFileInfo
this.inline=inline||!1
this.variable=void 0!==variable?variable:name.charAt&&"@"===name.charAt(0)
this.allowRoot=!0
this.setParent(this.value,this)};(Declaration.prototype=new Node).type="Declaration"
Declaration.prototype.genCSS=function(context,output){output.add(this.name+(context.compress?":":": "),this.fileInfo(),this.getIndex())
try{this.value.genCSS(context,output)}catch(e){e.index=this._index
e.filename=this._fileInfo.filename
throw e}output.add(this.important+(this.inline||context.lastRule&&context.compress?"":";"),this._fileInfo,this._index)}
Declaration.prototype.eval=function(context){var evaldValue,strictMathBypass=!1,name=this.name,variable=this.variable
if("string"!=typeof name){name=1===name.length&&name[0]instanceof Keyword?name[0].value:evalName(context,name)
variable=!1}if("font"===name&&!context.strictMath){strictMathBypass=!0
context.strictMath=!0}try{context.importantScope.push({})
evaldValue=this.value.eval(context)
if(!this.variable&&"DetachedRuleset"===evaldValue.type)throw{message:"Rulesets cannot be evaluated on a property.",index:this.getIndex(),filename:this.fileInfo().filename}
var important=this.important,importantResult=context.importantScope.pop()
!important&&importantResult.important&&(important=importantResult.important)
return new Declaration(name,evaldValue,important,this.merge,this.getIndex(),this.fileInfo(),this.inline,variable)}catch(e){if("number"!=typeof e.index){e.index=this.getIndex()
e.filename=this.fileInfo().filename}throw e}finally{strictMathBypass&&(context.strictMath=!1)}}
Declaration.prototype.makeImportant=function(){return new Declaration(this.name,this.value,"!important",this.merge,this.getIndex(),this.fileInfo(),this.inline)}
module.exports=Declaration},{"./anonymous":40,"./keyword":61,"./node":66,"./value":77}],51:[function(require,module,exports){var Node=require("./node"),contexts=require("../contexts"),utils=require("../utils"),DetachedRuleset=function(ruleset,frames){this.ruleset=ruleset
this.frames=frames
this.setParent(this.ruleset,this)};(DetachedRuleset.prototype=new Node).type="DetachedRuleset"
DetachedRuleset.prototype.evalFirst=!0
DetachedRuleset.prototype.accept=function(visitor){this.ruleset=visitor.visit(this.ruleset)}
DetachedRuleset.prototype.eval=function(context){var frames=this.frames||utils.copyArray(context.frames)
return new DetachedRuleset(this.ruleset,frames)}
DetachedRuleset.prototype.callEval=function(context){return this.ruleset.eval(this.frames?new contexts.Eval(context,this.frames.concat(context.frames)):context)}
module.exports=DetachedRuleset},{"../contexts":4,"../utils":80,"./node":66}],52:[function(require,module,exports){var Node=require("./node"),unitConversions=require("../data/unit-conversions"),Unit=require("./unit"),Color=require("./color"),Dimension=function(value,unit){this.value=parseFloat(value)
if(isNaN(this.value))throw new Error("Dimension is not a number.")
this.unit=unit&&unit instanceof Unit?unit:new Unit(unit?[unit]:void 0)
this.setParent(this.unit,this)};(Dimension.prototype=new Node).type="Dimension"
Dimension.prototype.accept=function(visitor){this.unit=visitor.visit(this.unit)}
Dimension.prototype.eval=function(context){return this}
Dimension.prototype.toColor=function(){return new Color([this.value,this.value,this.value])}
Dimension.prototype.genCSS=function(context,output){if(context&&context.strictUnits&&!this.unit.isSingular())throw new Error("Multiple units in dimension. Correct the units or use the unit function. Bad unit: "+this.unit.toString())
var value=this.fround(context,this.value),strValue=String(value)
0!==value&&value<1e-6&&value>-1e-6&&(strValue=value.toFixed(20).replace(/0+$/,""))
if(context&&context.compress){if(0===value&&this.unit.isLength()){output.add(strValue)
return}value>0&&value<1&&(strValue=strValue.substr(1))}output.add(strValue)
this.unit.genCSS(context,output)}
Dimension.prototype.operate=function(context,op,other){var value=this._operate(context,op,this.value,other.value),unit=this.unit.clone()
if("+"===op||"-"===op)if(0===unit.numerator.length&&0===unit.denominator.length){unit=other.unit.clone()
this.unit.backupUnit&&(unit.backupUnit=this.unit.backupUnit)}else if(0===other.unit.numerator.length&&0===unit.denominator.length);else{other=other.convertTo(this.unit.usedUnits())
if(context.strictUnits&&other.unit.toString()!==unit.toString())throw new Error("Incompatible units. Change the units or use the unit function. Bad units: '"+unit.toString()+"' and '"+other.unit.toString()+"'.")
value=this._operate(context,op,this.value,other.value)}else if("*"===op){unit.numerator=unit.numerator.concat(other.unit.numerator).sort()
unit.denominator=unit.denominator.concat(other.unit.denominator).sort()
unit.cancel()}else if("/"===op){unit.numerator=unit.numerator.concat(other.unit.denominator).sort()
unit.denominator=unit.denominator.concat(other.unit.numerator).sort()
unit.cancel()}return new Dimension(value,unit)}
Dimension.prototype.compare=function(other){var a,b
if(other instanceof Dimension){if(this.unit.isEmpty()||other.unit.isEmpty()){a=this
b=other}else{a=this.unify()
b=other.unify()
if(0!==a.unit.compare(b.unit))return}return Node.numericCompare(a.value,b.value)}}
Dimension.prototype.unify=function(){return this.convertTo({length:"px",duration:"s",angle:"rad"})}
Dimension.prototype.convertTo=function(conversions){var i,groupName,group,targetUnit,applyUnit,value=this.value,unit=this.unit.clone(),derivedConversions={}
if("string"==typeof conversions){for(i in unitConversions)unitConversions[i].hasOwnProperty(conversions)&&((derivedConversions={})[i]=conversions)
conversions=derivedConversions}applyUnit=function(atomicUnit,denominator){if(group.hasOwnProperty(atomicUnit)){denominator?value/=group[atomicUnit]/group[targetUnit]:value*=group[atomicUnit]/group[targetUnit]
return targetUnit}return atomicUnit}
for(groupName in conversions)if(conversions.hasOwnProperty(groupName)){targetUnit=conversions[groupName]
group=unitConversions[groupName]
unit.map(applyUnit)}unit.cancel()
return new Dimension(value,unit)}
module.exports=Dimension},{"../data/unit-conversions":7,"./color":45,"./node":66,"./unit":75}],53:[function(require,module,exports){var AtRule=require("./atrule"),Directive=function(){var args=Array.prototype.slice.call(arguments)
AtRule.apply(this,args)};(Directive.prototype=Object.create(AtRule.prototype)).constructor=Directive
module.exports=Directive},{"./atrule":42}],54:[function(require,module,exports){var Node=require("./node"),Paren=require("./paren"),Combinator=require("./combinator"),Element=function(combinator,value,index,currentFileInfo,visibilityInfo){this.combinator=combinator instanceof Combinator?combinator:new Combinator(combinator)
this.value="string"==typeof value?value.trim():value||""
this._index=index
this._fileInfo=currentFileInfo
this.copyVisibilityInfo(visibilityInfo)
this.setParent(this.combinator,this)};(Element.prototype=new Node).type="Element"
Element.prototype.accept=function(visitor){var value=this.value
this.combinator=visitor.visit(this.combinator)
"object"==typeof value&&(this.value=visitor.visit(value))}
Element.prototype.eval=function(context){return new Element(this.combinator,this.value.eval?this.value.eval(context):this.value,this.getIndex(),this.fileInfo(),this.visibilityInfo())}
Element.prototype.clone=function(){return new Element(this.combinator,this.value,this.getIndex(),this.fileInfo(),this.visibilityInfo())}
Element.prototype.genCSS=function(context,output){output.add(this.toCSS(context),this.fileInfo(),this.getIndex())}
Element.prototype.toCSS=function(context){context=context||{}
var value=this.value,firstSelector=context.firstSelector
value instanceof Paren&&(context.firstSelector=!0)
value=value.toCSS?value.toCSS(context):value
context.firstSelector=firstSelector
return""===value&&"&"===this.combinator.value.charAt(0)?"":this.combinator.toCSS(context)+value}
module.exports=Element},{"./combinator":46,"./node":66,"./paren":68}],55:[function(require,module,exports){var Node=require("./node"),Paren=require("./paren"),Comment=require("./comment"),Expression=function(value){this.value=value
if(!value)throw new Error("Expression requires an array parameter")};(Expression.prototype=new Node).type="Expression"
Expression.prototype.accept=function(visitor){this.value=visitor.visitArray(this.value)}
Expression.prototype.eval=function(context){var returnValue,inParenthesis=this.parens&&!this.parensInOp,doubleParen=!1
inParenthesis&&context.inParenthesis()
if(this.value.length>1)returnValue=new Expression(this.value.map(function(e){return e.eval(context)}))
else if(1===this.value.length){this.value[0].parens&&!this.value[0].parensInOp&&(doubleParen=!0)
returnValue=this.value[0].eval(context)}else returnValue=this
inParenthesis&&context.outOfParenthesis()
this.parens&&this.parensInOp&&!context.isMathOn()&&!doubleParen&&(returnValue=new Paren(returnValue))
return returnValue}
Expression.prototype.genCSS=function(context,output){for(var i=0;i<this.value.length;i++){this.value[i].genCSS(context,output)
i+1<this.value.length&&output.add(" ")}}
Expression.prototype.throwAwayComments=function(){this.value=this.value.filter(function(v){return!(v instanceof Comment)})}
module.exports=Expression},{"./comment":47,"./node":66,"./paren":68}],56:[function(require,module,exports){var Node=require("./node"),Selector=require("./selector"),Extend=function Extend(selector,option,index,currentFileInfo,visibilityInfo){this.selector=selector
this.option=option
this.object_id=Extend.next_id++
this.parent_ids=[this.object_id]
this._index=index
this._fileInfo=currentFileInfo
this.copyVisibilityInfo(visibilityInfo)
this.allowRoot=!0
switch(option){case"all":this.allowBefore=!0
this.allowAfter=!0
break
default:this.allowBefore=!1
this.allowAfter=!1}this.setParent(this.selector,this)}
Extend.next_id=0;(Extend.prototype=new Node).type="Extend"
Extend.prototype.accept=function(visitor){this.selector=visitor.visit(this.selector)}
Extend.prototype.eval=function(context){return new Extend(this.selector.eval(context),this.option,this.getIndex(),this.fileInfo(),this.visibilityInfo())}
Extend.prototype.clone=function(context){return new Extend(this.selector,this.option,this.getIndex(),this.fileInfo(),this.visibilityInfo())}
Extend.prototype.findSelfSelectors=function(selectors){var i,selectorElements,selfElements=[]
for(i=0;i<selectors.length;i++){selectorElements=selectors[i].elements
i>0&&selectorElements.length&&""===selectorElements[0].combinator.value&&(selectorElements[0].combinator.value=" ")
selfElements=selfElements.concat(selectors[i].elements)}this.selfSelectors=[new Selector(selfElements)]
this.selfSelectors[0].copyVisibilityInfo(this.visibilityInfo())}
module.exports=Extend},{"./node":66,"./selector":73}],57:[function(require,module,exports){var Node=require("./node"),Media=require("./media"),URL=require("./url"),Quoted=require("./quoted"),Ruleset=require("./ruleset"),Anonymous=require("./anonymous"),utils=require("../utils"),LessError=require("../less-error"),Import=function(path,features,options,index,currentFileInfo,visibilityInfo){this.options=options
this._index=index
this._fileInfo=currentFileInfo
this.path=path
this.features=features
this.allowRoot=!0
if(void 0!==this.options.less||this.options.inline)this.css=!this.options.less||this.options.inline
else{var pathValue=this.getPath()
pathValue&&/[#\.\&\?]css([\?;].*)?$/.test(pathValue)&&(this.css=!0)}this.copyVisibilityInfo(visibilityInfo)
this.setParent(this.features,this)
this.setParent(this.path,this)};(Import.prototype=new Node).type="Import"
Import.prototype.accept=function(visitor){this.features&&(this.features=visitor.visit(this.features))
this.path=visitor.visit(this.path)
this.options.isPlugin||this.options.inline||!this.root||(this.root=visitor.visit(this.root))}
Import.prototype.genCSS=function(context,output){if(this.css&&void 0===this.path._fileInfo.reference){output.add("@import ",this._fileInfo,this._index)
this.path.genCSS(context,output)
if(this.features){output.add(" ")
this.features.genCSS(context,output)}output.add(";")}}
Import.prototype.getPath=function(){return this.path instanceof URL?this.path.value.value:this.path.value}
Import.prototype.isVariableImport=function(){var path=this.path
path instanceof URL&&(path=path.value)
return!(path instanceof Quoted)||path.containsVariables()}
Import.prototype.evalForImport=function(context){var path=this.path
path instanceof URL&&(path=path.value)
return new Import(path.eval(context),this.features,this.options,this._index,this._fileInfo,this.visibilityInfo())}
Import.prototype.evalPath=function(context){var path=this.path.eval(context),rootpath=this._fileInfo&&this._fileInfo.rootpath
if(!(path instanceof URL)){if(rootpath){var pathValue=path.value
pathValue&&context.isPathRelative(pathValue)&&(path.value=rootpath+pathValue)}path.value=context.normalizePath(path.value)}return path}
Import.prototype.eval=function(context){var result=this.doEval(context);(this.options.reference||this.blocksVisibility())&&(result.length||0===result.length?result.forEach(function(node){node.addVisibilityBlock()}):result.addVisibilityBlock())
return result}
Import.prototype.doEval=function(context){var ruleset,registry,features=this.features&&this.features.eval(context)
if(this.options.isPlugin){if(this.root&&this.root.eval)try{this.root.eval(context)}catch(e){e.message="Plugin error during evaluation"
throw new LessError(e,this.root.imports,this.root.filename)}(registry=context.frames[0]&&context.frames[0].functionRegistry)&&this.root&&this.root.functions&&registry.addMultiple(this.root.functions)
return[]}if(this.skip){"function"==typeof this.skip&&(this.skip=this.skip())
if(this.skip)return[]}if(this.options.inline){var contents=new Anonymous(this.root,0,{filename:this.importedFilename,reference:this.path._fileInfo&&this.path._fileInfo.reference},!0,!0)
return this.features?new Media([contents],this.features.value):[contents]}if(this.css){var newImport=new Import(this.evalPath(context),features,this.options,this._index)
if(!newImport.css&&this.error)throw this.error
return newImport}(ruleset=new Ruleset(null,utils.copyArray(this.root.rules))).evalImports(context)
return this.features?new Media(ruleset.rules,this.features.value):ruleset.rules}
module.exports=Import},{"../less-error":28,"../utils":80,"./anonymous":40,"./media":62,"./node":66,"./quoted":70,"./ruleset":72,"./url":76}],58:[function(require,module,exports){var tree=Object.create(null)
tree.Node=require("./node")
tree.Color=require("./color")
tree.AtRule=require("./atrule")
tree.Directive=require("./directive")
tree.DetachedRuleset=require("./detached-ruleset")
tree.Operation=require("./operation")
tree.Dimension=require("./dimension")
tree.Unit=require("./unit")
tree.Keyword=require("./keyword")
tree.Variable=require("./variable")
tree.Property=require("./property")
tree.Ruleset=require("./ruleset")
tree.Element=require("./element")
tree.Attribute=require("./attribute")
tree.Combinator=require("./combinator")
tree.Selector=require("./selector")
tree.Quoted=require("./quoted")
tree.Expression=require("./expression")
tree.Declaration=require("./declaration")
tree.Rule=require("./rule")
tree.Call=require("./call")
tree.URL=require("./url")
tree.Import=require("./import")
tree.mixin={Call:require("./mixin-call"),Definition:require("./mixin-definition")}
tree.Comment=require("./comment")
tree.Anonymous=require("./anonymous")
tree.Value=require("./value")
tree.JavaScript=require("./javascript")
tree.Assignment=require("./assignment")
tree.Condition=require("./condition")
tree.Paren=require("./paren")
tree.Media=require("./media")
tree.UnicodeDescriptor=require("./unicode-descriptor")
tree.Negative=require("./negative")
tree.Extend=require("./extend")
tree.VariableCall=require("./variable-call")
module.exports=tree},{"./anonymous":40,"./assignment":41,"./atrule":42,"./attribute":43,"./call":44,"./color":45,"./combinator":46,"./comment":47,"./condition":48,"./declaration":50,"./detached-ruleset":51,"./dimension":52,"./directive":53,"./element":54,"./expression":55,"./extend":56,"./import":57,"./javascript":59,"./keyword":61,"./media":62,"./mixin-call":63,"./mixin-definition":64,"./negative":65,"./node":66,"./operation":67,"./paren":68,"./property":69,"./quoted":70,"./rule":71,"./ruleset":72,"./selector":73,"./unicode-descriptor":74,"./unit":75,"./url":76,"./value":77,"./variable":79,"./variable-call":78}],59:[function(require,module,exports){var JsEvalNode=require("./js-eval-node"),Dimension=require("./dimension"),Quoted=require("./quoted"),Anonymous=require("./anonymous"),JavaScript=function(string,escaped,index,currentFileInfo){this.escaped=escaped
this.expression=string
this._index=index
this._fileInfo=currentFileInfo};(JavaScript.prototype=new JsEvalNode).type="JavaScript"
JavaScript.prototype.eval=function(context){var result=this.evaluateJavaScript(this.expression,context)
return"number"==typeof result?new Dimension(result):"string"==typeof result?new Quoted('"'+result+'"',result,this.escaped,this._index):new Anonymous(Array.isArray(result)?result.join(", "):result)}
module.exports=JavaScript},{"./anonymous":40,"./dimension":52,"./js-eval-node":60,"./quoted":70}],60:[function(require,module,exports){var Node=require("./node"),Variable=require("./variable"),JsEvalNode=function(){};(JsEvalNode.prototype=new Node).evaluateJavaScript=function(expression,context){var result,that=this,evalContext={}
if(!context.javascriptEnabled)throw{message:"Inline JavaScript is not enabled. Is it set in your options?",filename:this.fileInfo().filename,index:this.getIndex()}
expression=expression.replace(/@\{([\w-]+)\}/g,function(_,name){return that.jsify(new Variable("@"+name,that.getIndex(),that.fileInfo()).eval(context))})
try{expression=new Function("return ("+expression+")")}catch(e){throw{message:"JavaScript evaluation error: "+e.message+" from `"+expression+"`",filename:this.fileInfo().filename,index:this.getIndex()}}var variables=context.frames[0].variables()
for(var k in variables)variables.hasOwnProperty(k)&&(evalContext[k.slice(1)]={value:variables[k].value,toJS:function(){return this.value.eval(context).toCSS()}})
try{result=expression.call(evalContext)}catch(e){throw{message:"JavaScript evaluation error: '"+e.name+": "+e.message.replace(/["]/g,"'")+"'",filename:this.fileInfo().filename,index:this.getIndex()}}return result}
JsEvalNode.prototype.jsify=function(obj){return Array.isArray(obj.value)&&obj.value.length>1?"["+obj.value.map(function(v){return v.toCSS()}).join(", ")+"]":obj.toCSS()}
module.exports=JsEvalNode},{"./node":66,"./variable":79}],61:[function(require,module,exports){var Node=require("./node"),Keyword=function(value){this.value=value};(Keyword.prototype=new Node).type="Keyword"
Keyword.prototype.genCSS=function(context,output){if("%"===this.value)throw{type:"Syntax",message:"Invalid % without number"}
output.add(this.value)}
Keyword.True=new Keyword("true")
Keyword.False=new Keyword("false")
module.exports=Keyword},{"./node":66}],62:[function(require,module,exports){var Ruleset=require("./ruleset"),Value=require("./value"),Selector=require("./selector"),Anonymous=require("./anonymous"),Expression=require("./expression"),AtRule=require("./atrule"),utils=require("../utils"),Media=function(value,features,index,currentFileInfo,visibilityInfo){this._index=index
this._fileInfo=currentFileInfo
var selectors=new Selector([],null,null,this._index,this._fileInfo).createEmptySelectors()
this.features=new Value(features)
this.rules=[new Ruleset(selectors,value)]
this.rules[0].allowImports=!0
this.copyVisibilityInfo(visibilityInfo)
this.allowRoot=!0
this.setParent(selectors,this)
this.setParent(this.features,this)
this.setParent(this.rules,this)};(Media.prototype=new AtRule).type="Media"
Media.prototype.isRulesetLike=function(){return!0}
Media.prototype.accept=function(visitor){this.features&&(this.features=visitor.visit(this.features))
this.rules&&(this.rules=visitor.visitArray(this.rules))}
Media.prototype.genCSS=function(context,output){output.add("@media ",this._fileInfo,this._index)
this.features.genCSS(context,output)
this.outputRuleset(context,output,this.rules)}
Media.prototype.eval=function(context){if(!context.mediaBlocks){context.mediaBlocks=[]
context.mediaPath=[]}var media=new Media(null,[],this._index,this._fileInfo,this.visibilityInfo())
if(this.debugInfo){this.rules[0].debugInfo=this.debugInfo
media.debugInfo=this.debugInfo}media.features=this.features.eval(context)
context.mediaPath.push(media)
context.mediaBlocks.push(media)
this.rules[0].functionRegistry=context.frames[0].functionRegistry.inherit()
context.frames.unshift(this.rules[0])
media.rules=[this.rules[0].eval(context)]
context.frames.shift()
context.mediaPath.pop()
return 0===context.mediaPath.length?media.evalTop(context):media.evalNested(context)}
Media.prototype.evalTop=function(context){var result=this
if(context.mediaBlocks.length>1){var selectors=new Selector([],null,null,this.getIndex(),this.fileInfo()).createEmptySelectors();(result=new Ruleset(selectors,context.mediaBlocks)).multiMedia=!0
result.copyVisibilityInfo(this.visibilityInfo())
this.setParent(result,this)}delete context.mediaBlocks
delete context.mediaPath
return result}
Media.prototype.evalNested=function(context){var i,value,path=context.mediaPath.concat([this])
for(i=0;i<path.length;i++){value=path[i].features instanceof Value?path[i].features.value:path[i].features
path[i]=Array.isArray(value)?value:[value]}this.features=new Value(this.permute(path).map(function(path){path=path.map(function(fragment){return fragment.toCSS?fragment:new Anonymous(fragment)})
for(i=path.length-1;i>0;i--)path.splice(i,0,new Anonymous("and"))
return new Expression(path)}))
this.setParent(this.features,this)
return new Ruleset([],[])}
Media.prototype.permute=function(arr){if(0===arr.length)return[]
if(1===arr.length)return arr[0]
for(var result=[],rest=this.permute(arr.slice(1)),i=0;i<rest.length;i++)for(var j=0;j<arr[0].length;j++)result.push([arr[0][j]].concat(rest[i]))
return result}
Media.prototype.bubbleSelectors=function(selectors){if(selectors){this.rules=[new Ruleset(utils.copyArray(selectors),[this.rules[0]])]
this.setParent(this.rules,this)}}
module.exports=Media},{"../utils":80,"./anonymous":40,"./atrule":42,"./expression":55,"./ruleset":72,"./selector":73,"./value":77}],63:[function(require,module,exports){var Node=require("./node"),Selector=require("./selector"),MixinDefinition=require("./mixin-definition"),defaultFunc=require("../functions/default"),MixinCall=function(elements,args,index,currentFileInfo,important){this.selector=new Selector(elements)
this.arguments=args||[]
this._index=index
this._fileInfo=currentFileInfo
this.important=important
this.allowRoot=!0
this.setParent(this.selector,this)};(MixinCall.prototype=new Node).type="MixinCall"
MixinCall.prototype.accept=function(visitor){this.selector&&(this.selector=visitor.visit(this.selector))
this.arguments.length&&(this.arguments=visitor.visitArray(this.arguments))}
MixinCall.prototype.eval=function(context){var mixins,mixin,mixinPath,arg,argValue,i,m,f,isRecursive,isOneFound,candidate,defaultResult,count,originalRuleset,noArgumentsFilter,args=[],rules=[],match=!1,candidates=[],conditionResult=[],defFalseEitherCase=-1,defNone=0,defTrue=1,defFalse=2
for(i=0;i<this.arguments.length;i++){argValue=(arg=this.arguments[i]).value.eval(context)
if(arg.expand&&Array.isArray(argValue.value)){argValue=argValue.value
for(m=0;m<argValue.length;m++)args.push({value:argValue[m]})}else args.push({name:arg.name,value:argValue})}noArgumentsFilter=function(rule){return rule.matchArgs(null,context)}
for(i=0;i<context.frames.length;i++)if((mixins=context.frames[i].find(this.selector,null,noArgumentsFilter)).length>0){isOneFound=!0
for(m=0;m<mixins.length;m++){mixin=mixins[m].rule
mixinPath=mixins[m].path
isRecursive=!1
for(f=0;f<context.frames.length;f++)if(!(mixin instanceof MixinDefinition)&&mixin===(context.frames[f].originalRuleset||context.frames[f])){isRecursive=!0
break}if(!isRecursive&&mixin.matchArgs(args,context)){(candidate={mixin:mixin,group:function(mixin,mixinPath){var f,p,namespace
for(f=0;f<2;f++){conditionResult[f]=!0
defaultFunc.value(f)
for(p=0;p<mixinPath.length&&conditionResult[f];p++)(namespace=mixinPath[p]).matchCondition&&(conditionResult[f]=conditionResult[f]&&namespace.matchCondition(null,context))
mixin.matchCondition&&(conditionResult[f]=conditionResult[f]&&mixin.matchCondition(args,context))}return conditionResult[0]||conditionResult[1]?conditionResult[0]!=conditionResult[1]?conditionResult[1]?defTrue:defFalse:defNone:defFalseEitherCase}(mixin,mixinPath)}).group!==defFalseEitherCase&&candidates.push(candidate)
match=!0}}defaultFunc.reset()
count=[0,0,0]
for(m=0;m<candidates.length;m++)count[candidates[m].group]++
if(count[defNone]>0)defaultResult=defFalse
else{defaultResult=defTrue
if(count[defTrue]+count[defFalse]>1)throw{type:"Runtime",message:"Ambiguous use of `default()` found when matching for `"+this.format(args)+"`",index:this.getIndex(),filename:this.fileInfo().filename}}for(m=0;m<candidates.length;m++)if((candidate=candidates[m].group)===defNone||candidate===defaultResult)try{if(!((mixin=candidates[m].mixin)instanceof MixinDefinition)){originalRuleset=mixin.originalRuleset||mixin;(mixin=new MixinDefinition("",[],mixin.rules,null,!1,null,originalRuleset.visibilityInfo())).originalRuleset=originalRuleset}var newRules=mixin.evalCall(context,args,this.important).rules
this._setVisibilityToReplacement(newRules)
Array.prototype.push.apply(rules,newRules)}catch(e){throw{message:e.message,index:this.getIndex(),filename:this.fileInfo().filename,stack:e.stack}}if(match)return rules}throw isOneFound?{type:"Runtime",message:"No matching definition was found for `"+this.format(args)+"`",index:this.getIndex(),filename:this.fileInfo().filename}:{type:"Name",message:this.selector.toCSS().trim()+" is undefined",index:this.getIndex(),filename:this.fileInfo().filename}}
MixinCall.prototype._setVisibilityToReplacement=function(replacement){var i
if(this.blocksVisibility())for(i=0;i<replacement.length;i++)replacement[i].addVisibilityBlock()}
MixinCall.prototype.format=function(args){return this.selector.toCSS().trim()+"("+(args?args.map(function(a){var argValue=""
a.name&&(argValue+=a.name+":")
a.value.toCSS?argValue+=a.value.toCSS():argValue+="???"
return argValue}).join(", "):"")+")"}
module.exports=MixinCall},{"../functions/default":16,"./mixin-definition":64,"./node":66,"./selector":73}],64:[function(require,module,exports){var Selector=require("./selector"),Element=require("./element"),Ruleset=require("./ruleset"),Declaration=require("./declaration"),Expression=require("./expression"),contexts=require("../contexts"),utils=require("../utils"),Definition=function(name,params,rules,condition,variadic,frames,visibilityInfo){this.name=name
this.selectors=[new Selector([new Element(null,name,this._index,this._fileInfo)])]
this.params=params
this.condition=condition
this.variadic=variadic
this.arity=params.length
this.rules=rules
this._lookups={}
var optionalParameters=[]
this.required=params.reduce(function(count,p){if(!p.name||p.name&&!p.value)return count+1
optionalParameters.push(p.name)
return count},0)
this.optionalParameters=optionalParameters
this.frames=frames
this.copyVisibilityInfo(visibilityInfo)
this.allowRoot=!0};(Definition.prototype=new Ruleset).type="MixinDefinition"
Definition.prototype.evalFirst=!0
Definition.prototype.accept=function(visitor){this.params&&this.params.length&&(this.params=visitor.visitArray(this.params))
this.rules=visitor.visitArray(this.rules)
this.condition&&(this.condition=visitor.visit(this.condition))}
Definition.prototype.evalParams=function(context,mixinEnv,args,evaldArguments){var varargs,arg,i,j,val,name,isNamedFound,argIndex,frame=new Ruleset(null,null),params=utils.copyArray(this.params),argsLength=0
mixinEnv.frames&&mixinEnv.frames[0]&&mixinEnv.frames[0].functionRegistry&&(frame.functionRegistry=mixinEnv.frames[0].functionRegistry.inherit())
mixinEnv=new contexts.Eval(mixinEnv,[frame].concat(mixinEnv.frames))
if(args){argsLength=(args=utils.copyArray(args)).length
for(i=0;i<argsLength;i++)if(name=(arg=args[i])&&arg.name){isNamedFound=!1
for(j=0;j<params.length;j++)if(!evaldArguments[j]&&name===params[j].name){evaldArguments[j]=arg.value.eval(context)
frame.prependRule(new Declaration(name,arg.value.eval(context)))
isNamedFound=!0
break}if(isNamedFound){args.splice(i,1)
i--
continue}throw{type:"Runtime",message:"Named argument for "+this.name+" "+args[i].name+" not found"}}}argIndex=0
for(i=0;i<params.length;i++)if(!evaldArguments[i]){arg=args&&args[argIndex]
if(name=params[i].name)if(params[i].variadic){varargs=[]
for(j=argIndex;j<argsLength;j++)varargs.push(args[j].value.eval(context))
frame.prependRule(new Declaration(name,new Expression(varargs).eval(context)))}else{if(val=arg&&arg.value)val=val.eval(context)
else{if(!params[i].value)throw{type:"Runtime",message:"wrong number of arguments for "+this.name+" ("+argsLength+" for "+this.arity+")"}
val=params[i].value.eval(mixinEnv)
frame.resetCache()}frame.prependRule(new Declaration(name,val))
evaldArguments[i]=val}if(params[i].variadic&&args)for(j=argIndex;j<argsLength;j++)evaldArguments[j]=args[j].value.eval(context)
argIndex++}return frame}
Definition.prototype.makeImportant=function(){var rules=this.rules?this.rules.map(function(r){return r.makeImportant?r.makeImportant(!0):r}):this.rules
return new Definition(this.name,this.params,rules,this.condition,this.variadic,this.frames)}
Definition.prototype.eval=function(context){return new Definition(this.name,this.params,this.rules,this.condition,this.variadic,this.frames||utils.copyArray(context.frames))}
Definition.prototype.evalCall=function(context,args,important){var rules,ruleset,_arguments=[],mixinFrames=this.frames?this.frames.concat(context.frames):context.frames,frame=this.evalParams(context,new contexts.Eval(context,mixinFrames),args,_arguments)
frame.prependRule(new Declaration("@arguments",new Expression(_arguments).eval(context)))
rules=utils.copyArray(this.rules);(ruleset=new Ruleset(null,rules)).originalRuleset=this
ruleset=ruleset.eval(new contexts.Eval(context,[this,frame].concat(mixinFrames)))
important&&(ruleset=ruleset.makeImportant())
return ruleset}
Definition.prototype.matchCondition=function(args,context){return!(this.condition&&!this.condition.eval(new contexts.Eval(context,[this.evalParams(context,new contexts.Eval(context,this.frames?this.frames.concat(context.frames):context.frames),args,[])].concat(this.frames||[]).concat(context.frames))))}
Definition.prototype.matchArgs=function(args,context){var len,allArgsCnt=args&&args.length||0,optionalParameters=this.optionalParameters,requiredArgsCnt=args?args.reduce(function(count,p){return optionalParameters.indexOf(p.name)<0?count+1:count},0):0
if(this.variadic){if(requiredArgsCnt<this.required-1)return!1}else{if(requiredArgsCnt<this.required)return!1
if(allArgsCnt>this.params.length)return!1}len=Math.min(requiredArgsCnt,this.arity)
for(var i=0;i<len;i++)if(!this.params[i].name&&!this.params[i].variadic&&args[i].value.eval(context).toCSS()!=this.params[i].value.eval(context).toCSS())return!1
return!0}
module.exports=Definition},{"../contexts":4,"../utils":80,"./declaration":50,"./element":54,"./expression":55,"./ruleset":72,"./selector":73}],65:[function(require,module,exports){var Node=require("./node"),Operation=require("./operation"),Dimension=require("./dimension"),Negative=function(node){this.value=node};(Negative.prototype=new Node).type="Negative"
Negative.prototype.genCSS=function(context,output){output.add("-")
this.value.genCSS(context,output)}
Negative.prototype.eval=function(context){return context.isMathOn()?new Operation("*",[new Dimension(-1),this.value]).eval(context):new Negative(this.value.eval(context))}
module.exports=Negative},{"./dimension":52,"./node":66,"./operation":67}],66:[function(require,module,exports){var Node=function(){this.parent=null
this.visibilityBlocks=void 0
this.nodeVisible=void 0
this.rootNode=null
this.parsed=null
var self=this
Object.defineProperty(this,"currentFileInfo",{get:function(){return self.fileInfo()}})
Object.defineProperty(this,"index",{get:function(){return self.getIndex()}})}
Node.prototype.setParent=function(nodes,parent){function set(node){node&&node instanceof Node&&(node.parent=parent)}Array.isArray(nodes)?nodes.forEach(set):set(nodes)}
Node.prototype.getIndex=function(){return this._index||this.parent&&this.parent.getIndex()||0}
Node.prototype.fileInfo=function(){return this._fileInfo||this.parent&&this.parent.fileInfo()||{}}
Node.prototype.isRulesetLike=function(){return!1}
Node.prototype.toCSS=function(context){var strs=[]
this.genCSS(context,{add:function(chunk,fileInfo,index){strs.push(chunk)},isEmpty:function(){return 0===strs.length}})
return strs.join("")}
Node.prototype.genCSS=function(context,output){output.add(this.value)}
Node.prototype.accept=function(visitor){this.value=visitor.visit(this.value)}
Node.prototype.eval=function(){return this}
Node.prototype._operate=function(context,op,a,b){switch(op){case"+":return a+b
case"-":return a-b
case"*":return a*b
case"/":return a/b}}
Node.prototype.fround=function(context,value){var precision=context&&context.numPrecision
return precision?Number((value+2e-16).toFixed(precision)):value}
Node.compare=function(a,b){if(a.compare&&"Quoted"!==b.type&&"Anonymous"!==b.type)return a.compare(b)
if(b.compare)return-b.compare(a)
if(a.type===b.type){a=a.value
b=b.value
if(!Array.isArray(a))return a===b?0:void 0
if(a.length===b.length){for(var i=0;i<a.length;i++)if(0!==Node.compare(a[i],b[i]))return
return 0}}}
Node.numericCompare=function(a,b){return a<b?-1:a===b?0:a>b?1:void 0}
Node.prototype.blocksVisibility=function(){null==this.visibilityBlocks&&(this.visibilityBlocks=0)
return 0!==this.visibilityBlocks}
Node.prototype.addVisibilityBlock=function(){null==this.visibilityBlocks&&(this.visibilityBlocks=0)
this.visibilityBlocks=this.visibilityBlocks+1}
Node.prototype.removeVisibilityBlock=function(){null==this.visibilityBlocks&&(this.visibilityBlocks=0)
this.visibilityBlocks=this.visibilityBlocks-1}
Node.prototype.ensureVisibility=function(){this.nodeVisible=!0}
Node.prototype.ensureInvisibility=function(){this.nodeVisible=!1}
Node.prototype.isVisible=function(){return this.nodeVisible}
Node.prototype.visibilityInfo=function(){return{visibilityBlocks:this.visibilityBlocks,nodeVisible:this.nodeVisible}}
Node.prototype.copyVisibilityInfo=function(info){if(info){this.visibilityBlocks=info.visibilityBlocks
this.nodeVisible=info.nodeVisible}}
module.exports=Node},{}],67:[function(require,module,exports){var Node=require("./node"),Color=require("./color"),Dimension=require("./dimension"),Operation=function(op,operands,isSpaced){this.op=op.trim()
this.operands=operands
this.isSpaced=isSpaced};(Operation.prototype=new Node).type="Operation"
Operation.prototype.accept=function(visitor){this.operands=visitor.visit(this.operands)}
Operation.prototype.eval=function(context){var a=this.operands[0].eval(context),b=this.operands[1].eval(context)
if(context.isMathOn()){a instanceof Dimension&&b instanceof Color&&(a=a.toColor())
b instanceof Dimension&&a instanceof Color&&(b=b.toColor())
if(!a.operate)throw{type:"Operation",message:"Operation on an invalid type"}
return a.operate(context,this.op,b)}return new Operation(this.op,[a,b],this.isSpaced)}
Operation.prototype.genCSS=function(context,output){this.operands[0].genCSS(context,output)
this.isSpaced&&output.add(" ")
output.add(this.op)
this.isSpaced&&output.add(" ")
this.operands[1].genCSS(context,output)}
module.exports=Operation},{"./color":45,"./dimension":52,"./node":66}],68:[function(require,module,exports){var Node=require("./node"),Paren=function(node){this.value=node};(Paren.prototype=new Node).type="Paren"
Paren.prototype.genCSS=function(context,output){output.add("(")
this.value.genCSS(context,output)
output.add(")")}
Paren.prototype.eval=function(context){return new Paren(this.value.eval(context))}
module.exports=Paren},{"./node":66}],69:[function(require,module,exports){var Node=require("./node"),Declaration=require("./declaration"),Property=function(name,index,currentFileInfo){this.name=name
this._index=index
this._fileInfo=currentFileInfo};(Property.prototype=new Node).type="Property"
Property.prototype.eval=function(context){var property,name=this.name,mergeRules=context.pluginManager.less.visitors.ToCSSVisitor.prototype._mergeRules
if(this.evaluating)throw{type:"Name",message:"Recursive property reference for "+name,filename:this.fileInfo().filename,index:this.getIndex()}
this.evaluating=!0
if(property=this.find(context.frames,function(frame){var v,vArr=frame.property(name)
if(vArr){for(var i=0;i<vArr.length;i++){v=vArr[i]
vArr[i]=new Declaration(v.name,v.value,v.important,v.merge,v.index,v.currentFileInfo,v.inline,v.variable)}mergeRules(vArr);(v=vArr[vArr.length-1]).important&&(context.importantScope[context.importantScope.length-1].important=v.important)
return v=v.value.eval(context)}})){this.evaluating=!1
return property}throw{type:"Name",message:"Property '"+name+"' is undefined",filename:this.currentFileInfo.filename,index:this.index}}
Property.prototype.find=function(obj,fun){for(var r,i=0;i<obj.length;i++)if(r=fun.call(obj,obj[i]))return r
return null}
module.exports=Property},{"./declaration":50,"./node":66}],70:[function(require,module,exports){var Node=require("./node"),Variable=(require("./js-eval-node"),require("./variable")),Property=require("./property"),Quoted=function(str,content,escaped,index,currentFileInfo){this.escaped=null==escaped||escaped
this.value=content||""
this.quote=str.charAt(0)
this._index=index
this._fileInfo=currentFileInfo};(Quoted.prototype=new Node).type="Quoted"
Quoted.prototype.genCSS=function(context,output){this.escaped||output.add(this.quote,this.fileInfo(),this.getIndex())
output.add(this.value)
this.escaped||output.add(this.quote)}
Quoted.prototype.containsVariables=function(){return this.value.match(/@\{([\w-]+)\}/)}
Quoted.prototype.eval=function(context){function iterativeReplace(value,regexp,replacementFnc){var evaluatedValue=value
do{evaluatedValue=(value=evaluatedValue).replace(regexp,replacementFnc)}while(value!==evaluatedValue)
return evaluatedValue}var that=this,value=this.value
value=iterativeReplace(value=iterativeReplace(value,/@\{([\w-]+)\}/g,function(_,name){var v=new Variable("@"+name,that.getIndex(),that.fileInfo()).eval(context,!0)
return v instanceof Quoted?v.value:v.toCSS()}),/\$\{([\w-]+)\}/g,function(_,name){var v=new Property("$"+name,that.getIndex(),that.fileInfo()).eval(context,!0)
return v instanceof Quoted?v.value:v.toCSS()})
return new Quoted(this.quote+value+this.quote,value,this.escaped,this.getIndex(),this.fileInfo())}
Quoted.prototype.compare=function(other){return"Quoted"!==other.type||this.escaped||other.escaped?other.toCSS&&this.toCSS()===other.toCSS()?0:void 0:Node.numericCompare(this.value,other.value)}
module.exports=Quoted},{"./js-eval-node":60,"./node":66,"./property":69,"./variable":79}],71:[function(require,module,exports){var Declaration=require("./declaration"),Rule=function(){var args=Array.prototype.slice.call(arguments)
Declaration.apply(this,args)};(Rule.prototype=Object.create(Declaration.prototype)).constructor=Rule
module.exports=Rule},{"./declaration":50}],72:[function(require,module,exports){var Node=require("./node"),Declaration=require("./declaration"),Keyword=require("./keyword"),Comment=require("./comment"),Paren=require("./paren"),Selector=require("./selector"),Element=require("./element"),Anonymous=require("./anonymous"),contexts=require("../contexts"),globalFunctionRegistry=require("../functions/function-registry"),defaultFunc=require("../functions/default"),getDebugInfo=require("./debug-info"),utils=require("../utils"),Ruleset=function(selectors,rules,strictImports,visibilityInfo){this.selectors=selectors
this.rules=rules
this._lookups={}
this._variables=null
this._properties=null
this.strictImports=strictImports
this.copyVisibilityInfo(visibilityInfo)
this.allowRoot=!0
this.setParent(this.selectors,this)
this.setParent(this.rules,this)};(Ruleset.prototype=new Node).type="Ruleset"
Ruleset.prototype.isRuleset=!0
Ruleset.prototype.isRulesetLike=function(){return!0}
Ruleset.prototype.accept=function(visitor){this.paths?this.paths=visitor.visitArray(this.paths,!0):this.selectors&&(this.selectors=visitor.visitArray(this.selectors))
this.rules&&this.rules.length&&(this.rules=visitor.visitArray(this.rules))}
Ruleset.prototype.eval=function(context){var selectors,selCnt,selector,i,thisSelectors=this.selectors,hasOnePassingSelector=!1
if(thisSelectors&&(selCnt=thisSelectors.length)){selectors=new Array(selCnt)
defaultFunc.error({type:"Syntax",message:"it is currently only allowed in parametric mixin guards,"})
for(i=0;i<selCnt;i++){selector=thisSelectors[i].eval(context)
selectors[i]=selector
selector.evaldCondition&&(hasOnePassingSelector=!0)}defaultFunc.reset()}else hasOnePassingSelector=!0
var rule,subRule,rules=this.rules?utils.copyArray(this.rules):null,ruleset=new Ruleset(selectors,rules,this.strictImports,this.visibilityInfo())
ruleset.originalRuleset=this
ruleset.root=this.root
ruleset.firstRoot=this.firstRoot
ruleset.allowImports=this.allowImports
this.debugInfo&&(ruleset.debugInfo=this.debugInfo)
hasOnePassingSelector||(rules.length=0)
ruleset.functionRegistry=function(frames){for(var found,i=0,n=frames.length;i!==n;++i)if(found=frames[i].functionRegistry)return found
return globalFunctionRegistry}(context.frames).inherit()
var ctxFrames=context.frames
ctxFrames.unshift(ruleset)
var ctxSelectors=context.selectors
ctxSelectors||(context.selectors=ctxSelectors=[])
ctxSelectors.unshift(this.selectors);(ruleset.root||ruleset.allowImports||!ruleset.strictImports)&&ruleset.evalImports(context)
var rsRules=ruleset.rules
for(i=0;rule=rsRules[i];i++)rule.evalFirst&&(rsRules[i]=rule.eval(context))
var mediaBlockCount=context.mediaBlocks&&context.mediaBlocks.length||0
for(i=0;rule=rsRules[i];i++)if("MixinCall"===rule.type){rules=rule.eval(context).filter(function(r){return!(r instanceof Declaration&&r.variable)||!ruleset.variable(r.name)})
rsRules.splice.apply(rsRules,[i,1].concat(rules))
i+=rules.length-1
ruleset.resetCache()}else if("VariableCall"===rule.type){rules=rule.eval(context).rules.filter(function(r){return!(r instanceof Declaration&&r.variable)})
rsRules.splice.apply(rsRules,[i,1].concat(rules))
i+=rules.length-1
ruleset.resetCache()}for(i=0;rule=rsRules[i];i++)rule.evalFirst||(rsRules[i]=rule=rule.eval?rule.eval(context):rule)
for(i=0;rule=rsRules[i];i++)if(rule instanceof Ruleset&&rule.selectors&&1===rule.selectors.length&&rule.selectors[0].isJustParentSelector()){rsRules.splice(i--,1)
for(var j=0;subRule=rule.rules[j];j++)if(subRule instanceof Node){subRule.copyVisibilityInfo(rule.visibilityInfo())
subRule instanceof Declaration&&subRule.variable||rsRules.splice(++i,0,subRule)}}ctxFrames.shift()
ctxSelectors.shift()
if(context.mediaBlocks)for(i=mediaBlockCount;i<context.mediaBlocks.length;i++)context.mediaBlocks[i].bubbleSelectors(selectors)
return ruleset}
Ruleset.prototype.evalImports=function(context){var i,importRules,rules=this.rules
if(rules)for(i=0;i<rules.length;i++)if("Import"===rules[i].type){if((importRules=rules[i].eval(context))&&(importRules.length||0===importRules.length)){rules.splice.apply(rules,[i,1].concat(importRules))
i+=importRules.length-1}else rules.splice(i,1,importRules)
this.resetCache()}}
Ruleset.prototype.makeImportant=function(){return new Ruleset(this.selectors,this.rules.map(function(r){return r.makeImportant?r.makeImportant():r}),this.strictImports,this.visibilityInfo())}
Ruleset.prototype.matchArgs=function(args){return!args||0===args.length}
Ruleset.prototype.matchCondition=function(args,context){var lastSelector=this.selectors[this.selectors.length-1]
return!!lastSelector.evaldCondition&&!(lastSelector.condition&&!lastSelector.condition.eval(new contexts.Eval(context,context.frames)))}
Ruleset.prototype.resetCache=function(){this._rulesets=null
this._variables=null
this._properties=null
this._lookups={}}
Ruleset.prototype.variables=function(){this._variables||(this._variables=this.rules?this.rules.reduce(function(hash,r){r instanceof Declaration&&!0===r.variable&&(hash[r.name]=r)
if("Import"===r.type&&r.root&&r.root.variables){var vars=r.root.variables()
for(var name in vars)vars.hasOwnProperty(name)&&(hash[name]=vars[name])}return hash},{}):{})
return this._variables}
Ruleset.prototype.properties=function(){this._properties||(this._properties=this.rules?this.rules.reduce(function(hash,r){if(r instanceof Declaration&&!0!==r.variable){var name=1===r.name.length&&r.name[0]instanceof Keyword?r.name[0].value:r.name
hash["$"+name]?hash["$"+name].push(r):hash["$"+name]=[r]}return hash},{}):{})
return this._properties}
Ruleset.prototype.variable=function(name){var decl=this.variables()[name]
if(decl)return this.parseValue(decl)}
Ruleset.prototype.property=function(name){var decl=this.properties()[name]
if(decl)return this.parseValue(decl)}
Ruleset.prototype.parseValue=function(toParse){function transformDeclaration(decl){if(decl.value instanceof Anonymous&&!decl.parsed){this.parse.parseNode(decl.value.value,["value","important"],decl.value.getIndex(),decl.fileInfo(),function(err,result){err&&(decl.parsed=!0)
if(result){decl.value=result[0]
decl.important=result[1]||""
decl.parsed=!0}})
return decl}return decl}var self=this
if(Array.isArray(toParse)){var nodes=[]
toParse.forEach(function(n){nodes.push(transformDeclaration.call(self,n))})
return nodes}return transformDeclaration.call(self,toParse)}
Ruleset.prototype.rulesets=function(){if(!this.rules)return[]
var i,rule,filtRules=[],rules=this.rules
for(i=0;rule=rules[i];i++)rule.isRuleset&&filtRules.push(rule)
return filtRules}
Ruleset.prototype.prependRule=function(rule){var rules=this.rules
rules?rules.unshift(rule):this.rules=[rule]
this.setParent(rule,this)}
Ruleset.prototype.find=function(selector,self,filter){self=self||this
var match,foundMixins,rules=[],key=selector.toCSS()
if(key in this._lookups)return this._lookups[key]
this.rulesets().forEach(function(rule){if(rule!==self)for(var j=0;j<rule.selectors.length;j++)if(match=selector.match(rule.selectors[j])){if(selector.elements.length>match){if(!filter||filter(rule)){foundMixins=rule.find(new Selector(selector.elements.slice(match)),self,filter)
for(var i=0;i<foundMixins.length;++i)foundMixins[i].path.push(rule)
Array.prototype.push.apply(rules,foundMixins)}}else rules.push({rule:rule,path:[]})
break}})
this._lookups[key]=rules
return rules}
Ruleset.prototype.genCSS=function(context,output){var i,j,debugInfo,rule,path,charsetRuleNodes=[],ruleNodes=[]
context.tabLevel=context.tabLevel||0
this.root||context.tabLevel++
var sep,tabRuleStr=context.compress?"":Array(context.tabLevel+1).join("  "),tabSetStr=context.compress?"":Array(context.tabLevel).join("  "),charsetNodeIndex=0,importNodeIndex=0
for(i=0;rule=this.rules[i];i++)if(rule instanceof Comment){importNodeIndex===i&&importNodeIndex++
ruleNodes.push(rule)}else if(rule.isCharset&&rule.isCharset()){ruleNodes.splice(charsetNodeIndex,0,rule)
charsetNodeIndex++
importNodeIndex++}else if("Import"===rule.type){ruleNodes.splice(importNodeIndex,0,rule)
importNodeIndex++}else ruleNodes.push(rule)
ruleNodes=charsetRuleNodes.concat(ruleNodes)
if(!this.root){if(debugInfo=getDebugInfo(context,this,tabSetStr)){output.add(debugInfo)
output.add(tabSetStr)}var pathSubCnt,paths=this.paths,pathCnt=paths.length
sep=context.compress?",":",\n"+tabSetStr
for(i=0;i<pathCnt;i++)if(pathSubCnt=(path=paths[i]).length){i>0&&output.add(sep)
context.firstSelector=!0
path[0].genCSS(context,output)
context.firstSelector=!1
for(j=1;j<pathSubCnt;j++)path[j].genCSS(context,output)}output.add((context.compress?"{":" {\n")+tabRuleStr)}for(i=0;rule=ruleNodes[i];i++){i+1===ruleNodes.length&&(context.lastRule=!0)
var currentLastRule=context.lastRule
rule.isRulesetLike(rule)&&(context.lastRule=!1)
rule.genCSS?rule.genCSS(context,output):rule.value&&output.add(rule.value.toString())
context.lastRule=currentLastRule
!context.lastRule&&rule.isVisible()?output.add(context.compress?"":"\n"+tabRuleStr):context.lastRule=!1}if(!this.root){output.add(context.compress?"}":"\n"+tabSetStr+"}")
context.tabLevel--}output.isEmpty()||context.compress||!this.firstRoot||output.add("\n")}
Ruleset.prototype.joinSelectors=function(paths,context,selectors){for(var s=0;s<selectors.length;s++)this.joinSelector(paths,context,selectors[s])}
Ruleset.prototype.joinSelector=function(paths,context,selector){function createParenthesis(elementsToPak,originalElement){var replacementParen,j
if(0===elementsToPak.length)replacementParen=new Paren(elementsToPak[0])
else{var insideParent=new Array(elementsToPak.length)
for(j=0;j<elementsToPak.length;j++)insideParent[j]=new Element(null,elementsToPak[j],originalElement._index,originalElement._fileInfo)
replacementParen=new Paren(new Selector(insideParent))}return replacementParen}function createSelector(containedElement,originalElement){var element
element=new Element(null,containedElement,originalElement._index,originalElement._fileInfo)
return new Selector([element])}function addReplacementIntoPath(beginningPath,addPath,replacedElement,originalSelector){var newSelectorPath,lastSelector,newJoinedSelector
newSelectorPath=[]
if(beginningPath.length>0){lastSelector=(newSelectorPath=utils.copyArray(beginningPath)).pop()
newJoinedSelector=originalSelector.createDerived(utils.copyArray(lastSelector.elements))}else newJoinedSelector=originalSelector.createDerived([])
if(addPath.length>0){var combinator=replacedElement.combinator,parentEl=addPath[0].elements[0]
combinator.emptyOrWhitespace&&!parentEl.combinator.emptyOrWhitespace&&(combinator=parentEl.combinator)
newJoinedSelector.elements.push(new Element(combinator,parentEl.value,replacedElement._index,replacedElement._fileInfo))
newJoinedSelector.elements=newJoinedSelector.elements.concat(addPath[0].elements.slice(1))}0!==newJoinedSelector.elements.length&&newSelectorPath.push(newJoinedSelector)
if(addPath.length>1){var restOfPath=addPath.slice(1)
restOfPath=restOfPath.map(function(selector){return selector.createDerived(selector.elements,[])})
newSelectorPath=newSelectorPath.concat(restOfPath)}return newSelectorPath}function addAllReplacementsIntoPath(beginningPath,addPaths,replacedElement,originalSelector,result){var j
for(j=0;j<beginningPath.length;j++){var newSelectorPath=addReplacementIntoPath(beginningPath[j],addPaths,replacedElement,originalSelector)
result.push(newSelectorPath)}return result}function mergeElementsOnToSelectors(elements,selectors){var i,sel
if(0!==elements.length)if(0!==selectors.length)for(i=0;sel=selectors[i];i++)sel.length>0?sel[sel.length-1]=sel[sel.length-1].createDerived(sel[sel.length-1].elements.concat(elements)):sel.push(new Selector(elements))
else selectors.push([new Selector(elements)])}function replaceParentSelector(paths,context,inSelector){var i,j,k,currentElements,newSelectors,selectorsMultiplied,sel,el,length,lastSelector,hadParentSelector=!1
currentElements=[]
newSelectors=[[]]
for(i=0;el=inSelector.elements[i];i++)if("&"!==el.value){var nestedSelector=function(element){var maybeSelector
return element.value instanceof Paren&&(maybeSelector=element.value.value)instanceof Selector?maybeSelector:null}(el)
if(null!=nestedSelector){mergeElementsOnToSelectors(currentElements,newSelectors)
var replaced,nestedPaths=[],replacedNewSelectors=[]
replaced=replaceParentSelector(nestedPaths,context,nestedSelector)
hadParentSelector=hadParentSelector||replaced
for(k=0;k<nestedPaths.length;k++)addAllReplacementsIntoPath(newSelectors,[createSelector(createParenthesis(nestedPaths[k],el),el)],el,inSelector,replacedNewSelectors)
newSelectors=replacedNewSelectors
currentElements=[]}else currentElements.push(el)}else{hadParentSelector=!0
selectorsMultiplied=[]
mergeElementsOnToSelectors(currentElements,newSelectors)
for(j=0;j<newSelectors.length;j++){sel=newSelectors[j]
if(0===context.length){sel.length>0&&sel[0].elements.push(new Element(el.combinator,"",el._index,el._fileInfo))
selectorsMultiplied.push(sel)}else for(k=0;k<context.length;k++){var newSelectorPath=addReplacementIntoPath(sel,context[k],el,inSelector)
selectorsMultiplied.push(newSelectorPath)}}newSelectors=selectorsMultiplied
currentElements=[]}mergeElementsOnToSelectors(currentElements,newSelectors)
for(i=0;i<newSelectors.length;i++)if((length=newSelectors[i].length)>0){paths.push(newSelectors[i])
lastSelector=newSelectors[i][length-1]
newSelectors[i][length-1]=lastSelector.createDerived(lastSelector.elements,inSelector.extendList)}return hadParentSelector}var i,newPaths
if(!replaceParentSelector(newPaths=[],context,selector))if(context.length>0){newPaths=[]
for(i=0;i<context.length;i++){var concatenated=context[i].map(function(visibilityInfo,deriveFrom){var newSelector=deriveFrom.createDerived(deriveFrom.elements,deriveFrom.extendList,deriveFrom.evaldCondition)
newSelector.copyVisibilityInfo(visibilityInfo)
return newSelector}.bind(this,selector.visibilityInfo()))
concatenated.push(selector)
newPaths.push(concatenated)}}else newPaths=[[selector]]
for(i=0;i<newPaths.length;i++)paths.push(newPaths[i])}
module.exports=Ruleset},{"../contexts":4,"../functions/default":16,"../functions/function-registry":18,"../utils":80,"./anonymous":40,"./comment":47,"./debug-info":49,"./declaration":50,"./element":54,"./keyword":61,"./node":66,"./paren":68,"./selector":73}],73:[function(require,module,exports){var Node=require("./node"),Element=require("./element"),LessError=require("../less-error"),Selector=function(elements,extendList,condition,index,currentFileInfo,visibilityInfo){this.extendList=extendList
this.condition=condition
this.evaldCondition=!condition
this._index=index
this._fileInfo=currentFileInfo
this.elements=this.getElements(elements)
this.mixinElements_=void 0
this.copyVisibilityInfo(visibilityInfo)
this.setParent(this.elements,this)};(Selector.prototype=new Node).type="Selector"
Selector.prototype.accept=function(visitor){this.elements&&(this.elements=visitor.visitArray(this.elements))
this.extendList&&(this.extendList=visitor.visitArray(this.extendList))
this.condition&&(this.condition=visitor.visit(this.condition))}
Selector.prototype.createDerived=function(elements,extendList,evaldCondition){elements=this.getElements(elements)
var newSelector=new Selector(elements,extendList||this.extendList,null,this.getIndex(),this.fileInfo(),this.visibilityInfo())
newSelector.evaldCondition=null!=evaldCondition?evaldCondition:this.evaldCondition
newSelector.mediaEmpty=this.mediaEmpty
return newSelector}
Selector.prototype.getElements=function(els){"string"==typeof els&&this.parse.parseNode(els,["selector"],this._index,this._fileInfo,function(err,result){if(err)throw new LessError({index:err.index,message:err.message},this.parse.imports,this._fileInfo.filename)
els=result[0].elements})
return els}
Selector.prototype.createEmptySelectors=function(){var el=new Element("","&",this._index,this._fileInfo),sels=[new Selector([el],null,null,this._index,this._fileInfo)]
sels[0].mediaEmpty=!0
return sels}
Selector.prototype.match=function(other){var olen,i,elements=this.elements,len=elements.length
if(0===(olen=(other=other.mixinElements()).length)||len<olen)return 0
for(i=0;i<olen;i++)if(elements[i].value!==other[i])return 0
return olen}
Selector.prototype.mixinElements=function(){if(this.mixinElements_)return this.mixinElements_
var elements=this.elements.map(function(v){return v.combinator.value+(v.value.value||v.value)}).join("").match(/[,&#\*\.\w-]([\w-]|(\\.))*/g)
elements?"&"===elements[0]&&elements.shift():elements=[]
return this.mixinElements_=elements}
Selector.prototype.isJustParentSelector=function(){return!this.mediaEmpty&&1===this.elements.length&&"&"===this.elements[0].value&&(" "===this.elements[0].combinator.value||""===this.elements[0].combinator.value)}
Selector.prototype.eval=function(context){var evaldCondition=this.condition&&this.condition.eval(context),elements=this.elements,extendList=this.extendList
elements=elements&&elements.map(function(e){return e.eval(context)})
extendList=extendList&&extendList.map(function(extend){return extend.eval(context)})
return this.createDerived(elements,extendList,evaldCondition)}
Selector.prototype.genCSS=function(context,output){var i
context&&context.firstSelector||""!==this.elements[0].combinator.value||output.add(" ",this.fileInfo(),this.getIndex())
for(i=0;i<this.elements.length;i++)this.elements[i].genCSS(context,output)}
Selector.prototype.getIsOutput=function(){return this.evaldCondition}
module.exports=Selector},{"../less-error":28,"./element":54,"./node":66}],74:[function(require,module,exports){var Node=require("./node"),UnicodeDescriptor=function(value){this.value=value};(UnicodeDescriptor.prototype=new Node).type="UnicodeDescriptor"
module.exports=UnicodeDescriptor},{"./node":66}],75:[function(require,module,exports){var Node=require("./node"),unitConversions=require("../data/unit-conversions"),utils=require("../utils"),Unit=function(numerator,denominator,backupUnit){this.numerator=numerator?utils.copyArray(numerator).sort():[]
this.denominator=denominator?utils.copyArray(denominator).sort():[]
backupUnit?this.backupUnit=backupUnit:numerator&&numerator.length&&(this.backupUnit=numerator[0])};(Unit.prototype=new Node).type="Unit"
Unit.prototype.clone=function(){return new Unit(utils.copyArray(this.numerator),utils.copyArray(this.denominator),this.backupUnit)}
Unit.prototype.genCSS=function(context,output){var strictUnits=context&&context.strictUnits
1===this.numerator.length?output.add(this.numerator[0]):!strictUnits&&this.backupUnit?output.add(this.backupUnit):!strictUnits&&this.denominator.length&&output.add(this.denominator[0])}
Unit.prototype.toString=function(){var i,returnStr=this.numerator.join("*")
for(i=0;i<this.denominator.length;i++)returnStr+="/"+this.denominator[i]
return returnStr}
Unit.prototype.compare=function(other){return this.is(other.toString())?0:void 0}
Unit.prototype.is=function(unitString){return this.toString().toUpperCase()===unitString.toUpperCase()}
Unit.prototype.isLength=function(){return Boolean(this.toCSS().match(/px|em|%|in|cm|mm|pc|pt|ex/))}
Unit.prototype.isEmpty=function(){return 0===this.numerator.length&&0===this.denominator.length}
Unit.prototype.isSingular=function(){return this.numerator.length<=1&&0===this.denominator.length}
Unit.prototype.map=function(callback){var i
for(i=0;i<this.numerator.length;i++)this.numerator[i]=callback(this.numerator[i],!1)
for(i=0;i<this.denominator.length;i++)this.denominator[i]=callback(this.denominator[i],!0)}
Unit.prototype.usedUnits=function(){var group,mapUnit,groupName,result={}
mapUnit=function(atomicUnit){group.hasOwnProperty(atomicUnit)&&!result[groupName]&&(result[groupName]=atomicUnit)
return atomicUnit}
for(groupName in unitConversions)if(unitConversions.hasOwnProperty(groupName)){group=unitConversions[groupName]
this.map(mapUnit)}return result}
Unit.prototype.cancel=function(){var atomicUnit,i,counter={}
for(i=0;i<this.numerator.length;i++)counter[atomicUnit=this.numerator[i]]=(counter[atomicUnit]||0)+1
for(i=0;i<this.denominator.length;i++)counter[atomicUnit=this.denominator[i]]=(counter[atomicUnit]||0)-1
this.numerator=[]
this.denominator=[]
for(atomicUnit in counter)if(counter.hasOwnProperty(atomicUnit)){var count=counter[atomicUnit]
if(count>0)for(i=0;i<count;i++)this.numerator.push(atomicUnit)
else if(count<0)for(i=0;i<-count;i++)this.denominator.push(atomicUnit)}this.numerator.sort()
this.denominator.sort()}
module.exports=Unit},{"../data/unit-conversions":7,"../utils":80,"./node":66}],76:[function(require,module,exports){var Node=require("./node"),URL=function(val,index,currentFileInfo,isEvald){this.value=val
this._index=index
this._fileInfo=currentFileInfo
this.isEvald=isEvald};(URL.prototype=new Node).type="Url"
URL.prototype.accept=function(visitor){this.value=visitor.visit(this.value)}
URL.prototype.genCSS=function(context,output){output.add("url(")
this.value.genCSS(context,output)
output.add(")")}
URL.prototype.eval=function(context){var rootpath,val=this.value.eval(context)
if(!this.isEvald){if((rootpath=this.fileInfo()&&this.fileInfo().rootpath)&&"string"==typeof val.value&&context.isPathRelative(val.value)){val.quote||(rootpath=rootpath.replace(/[\(\)'"\s]/g,function(match){return"\\"+match}))
val.value=rootpath+val.value}val.value=context.normalizePath(val.value)
if(context.urlArgs&&!val.value.match(/^\s*data:/)){var urlArgs=(-1===val.value.indexOf("?")?"?":"&")+context.urlArgs;-1!==val.value.indexOf("#")?val.value=val.value.replace("#",urlArgs+"#"):val.value+=urlArgs}}return new URL(val,this.getIndex(),this.fileInfo(),!0)}
module.exports=URL},{"./node":66}],77:[function(require,module,exports){var Node=require("./node"),Value=function(value){if(!value)throw new Error("Value requires an array argument")
Array.isArray(value)?this.value=value:this.value=[value]};(Value.prototype=new Node).type="Value"
Value.prototype.accept=function(visitor){this.value&&(this.value=visitor.visitArray(this.value))}
Value.prototype.eval=function(context){return 1===this.value.length?this.value[0].eval(context):new Value(this.value.map(function(v){return v.eval(context)}))}
Value.prototype.genCSS=function(context,output){var i
for(i=0;i<this.value.length;i++){this.value[i].genCSS(context,output)
i+1<this.value.length&&output.add(context&&context.compress?",":", ")}}
module.exports=Value},{"./node":66}],78:[function(require,module,exports){var Node=require("./node"),Variable=require("./variable"),VariableCall=function(variable){this.variable=variable
this.allowRoot=!0};(VariableCall.prototype=new Node).type="VariableCall"
VariableCall.prototype.eval=function(context){return new Variable(this.variable).eval(context).callEval(context)}
module.exports=VariableCall},{"./node":66,"./variable":79}],79:[function(require,module,exports){var Node=require("./node"),Variable=function(name,index,currentFileInfo){this.name=name
this._index=index
this._fileInfo=currentFileInfo};(Variable.prototype=new Node).type="Variable"
Variable.prototype.eval=function(context){var variable,name=this.name
0===name.indexOf("@@")&&(name="@"+new Variable(name.slice(1),this.getIndex(),this.fileInfo()).eval(context).value)
if(this.evaluating)throw{type:"Name",message:"Recursive variable definition for "+name,filename:this.fileInfo().filename,index:this.getIndex()}
this.evaluating=!0
if(variable=this.find(context.frames,function(frame){var v=frame.variable(name)
if(v){v.important&&(context.importantScope[context.importantScope.length-1].important=v.important)
return v.value.eval(context)}})){this.evaluating=!1
return variable}throw{type:"Name",message:"variable "+name+" is undefined",filename:this.fileInfo().filename,index:this.getIndex()}}
Variable.prototype.find=function(obj,fun){for(var r,i=0;i<obj.length;i++)if(r=fun.call(obj,obj[i]))return r
return null}
module.exports=Variable},{"./node":66}],80:[function(require,module,exports){module.exports={getLocation:function(index,inputStream){for(var n=index+1,line=null,column=-1;--n>=0&&"\n"!==inputStream.charAt(n);)column++
"number"==typeof index&&(line=(inputStream.slice(0,index).match(/\n/g)||"").length)
return{line:line,column:column}},copyArray:function(arr){var i,length=arr.length,copy=new Array(length)
for(i=0;i<length;i++)copy[i]=arr[i]
return copy},getPrototype:function(obj){return Object.getPrototypeOf?Object.getPrototypeOf(obj):"".__proto__===String.prototype?obj.__proto__:obj.constructor?obj.constructor.prototype:void 0}}},{}],81:[function(require,module,exports){var tree=require("../tree"),Visitor=require("./visitor"),logger=require("../logger"),utils=require("../utils"),ExtendFinderVisitor=function(){this._visitor=new Visitor(this)
this.contexts=[]
this.allExtendsStack=[[]]}
ExtendFinderVisitor.prototype={run:function(root){(root=this._visitor.visit(root)).allExtends=this.allExtendsStack[0]
return root},visitDeclaration:function(declNode,visitArgs){visitArgs.visitDeeper=!1},visitMixinDefinition:function(mixinDefinitionNode,visitArgs){visitArgs.visitDeeper=!1},visitRuleset:function(rulesetNode,visitArgs){if(!rulesetNode.root){var i,j,extend,extendList,allSelectorsExtendList=[],rules=rulesetNode.rules,ruleCnt=rules?rules.length:0
for(i=0;i<ruleCnt;i++)if(rulesetNode.rules[i]instanceof tree.Extend){allSelectorsExtendList.push(rules[i])
rulesetNode.extendOnEveryPath=!0}var paths=rulesetNode.paths
for(i=0;i<paths.length;i++){var selectorPath=paths[i],selExtendList=selectorPath[selectorPath.length-1].extendList;(extendList=selExtendList?utils.copyArray(selExtendList).concat(allSelectorsExtendList):allSelectorsExtendList)&&(extendList=extendList.map(function(allSelectorsExtend){return allSelectorsExtend.clone()}))
for(j=0;j<extendList.length;j++){this.foundExtends=!0;(extend=extendList[j]).findSelfSelectors(selectorPath)
extend.ruleset=rulesetNode
0===j&&(extend.firstExtendOnThisSelectorPath=!0)
this.allExtendsStack[this.allExtendsStack.length-1].push(extend)}}this.contexts.push(rulesetNode.selectors)}},visitRulesetOut:function(rulesetNode){rulesetNode.root||(this.contexts.length=this.contexts.length-1)},visitMedia:function(mediaNode,visitArgs){mediaNode.allExtends=[]
this.allExtendsStack.push(mediaNode.allExtends)},visitMediaOut:function(mediaNode){this.allExtendsStack.length=this.allExtendsStack.length-1},visitAtRule:function(atRuleNode,visitArgs){atRuleNode.allExtends=[]
this.allExtendsStack.push(atRuleNode.allExtends)},visitAtRuleOut:function(atRuleNode){this.allExtendsStack.length=this.allExtendsStack.length-1}}
var ProcessExtendsVisitor=function(){this._visitor=new Visitor(this)}
ProcessExtendsVisitor.prototype={run:function(root){var extendFinder=new ExtendFinderVisitor
this.extendIndices={}
extendFinder.run(root)
if(!extendFinder.foundExtends)return root
root.allExtends=root.allExtends.concat(this.doExtendChaining(root.allExtends,root.allExtends))
this.allExtendsStack=[root.allExtends]
var newRoot=this._visitor.visit(root)
this.checkExtendsForNonMatched(root.allExtends)
return newRoot},checkExtendsForNonMatched:function(extendList){var indices=this.extendIndices
extendList.filter(function(extend){return!extend.hasFoundMatches&&1==extend.parent_ids.length}).forEach(function(extend){var selector="_unknown_"
try{selector=extend.selector.toCSS({})}catch(_){}if(!indices[extend.index+" "+selector]){indices[extend.index+" "+selector]=!0
logger.warn("extend '"+selector+"' has no matches")}})},doExtendChaining:function(extendsList,extendsListTarget,iterationCount){var extendIndex,targetExtendIndex,matches,newSelector,selectorPath,extend,targetExtend,newExtend,extendsToAdd=[],extendVisitor=this
iterationCount=iterationCount||0
for(extendIndex=0;extendIndex<extendsList.length;extendIndex++)for(targetExtendIndex=0;targetExtendIndex<extendsListTarget.length;targetExtendIndex++){extend=extendsList[extendIndex]
targetExtend=extendsListTarget[targetExtendIndex]
if(!(extend.parent_ids.indexOf(targetExtend.object_id)>=0)){selectorPath=[targetExtend.selfSelectors[0]]
if((matches=extendVisitor.findMatch(extend,selectorPath)).length){extend.hasFoundMatches=!0
extend.selfSelectors.forEach(function(selfSelector){var info=targetExtend.visibilityInfo()
newSelector=extendVisitor.extendSelector(matches,selectorPath,selfSelector,extend.isVisible());(newExtend=new tree.Extend(targetExtend.selector,targetExtend.option,0,targetExtend.fileInfo(),info)).selfSelectors=newSelector
newSelector[newSelector.length-1].extendList=[newExtend]
extendsToAdd.push(newExtend)
newExtend.ruleset=targetExtend.ruleset
newExtend.parent_ids=newExtend.parent_ids.concat(targetExtend.parent_ids,extend.parent_ids)
if(targetExtend.firstExtendOnThisSelectorPath){newExtend.firstExtendOnThisSelectorPath=!0
targetExtend.ruleset.paths.push(newSelector)}})}}}if(extendsToAdd.length){this.extendChainCount++
if(iterationCount>100){var selectorOne="{unable to calculate}",selectorTwo="{unable to calculate}"
try{selectorOne=extendsToAdd[0].selfSelectors[0].toCSS()
selectorTwo=extendsToAdd[0].selector.toCSS()}catch(e){}throw{message:"extend circular reference detected. One of the circular extends is currently:"+selectorOne+":extend("+selectorTwo+")"}}return extendsToAdd.concat(extendVisitor.doExtendChaining(extendsToAdd,extendsListTarget,iterationCount+1))}return extendsToAdd},visitDeclaration:function(ruleNode,visitArgs){visitArgs.visitDeeper=!1},visitMixinDefinition:function(mixinDefinitionNode,visitArgs){visitArgs.visitDeeper=!1},visitSelector:function(selectorNode,visitArgs){visitArgs.visitDeeper=!1},visitRuleset:function(rulesetNode,visitArgs){if(!rulesetNode.root){var matches,pathIndex,extendIndex,selectorPath,allExtends=this.allExtendsStack[this.allExtendsStack.length-1],selectorsToAdd=[],extendVisitor=this
for(extendIndex=0;extendIndex<allExtends.length;extendIndex++)for(pathIndex=0;pathIndex<rulesetNode.paths.length;pathIndex++){selectorPath=rulesetNode.paths[pathIndex]
if(!rulesetNode.extendOnEveryPath){var extendList=selectorPath[selectorPath.length-1].extendList
if((!extendList||!extendList.length)&&(matches=this.findMatch(allExtends[extendIndex],selectorPath)).length){allExtends[extendIndex].hasFoundMatches=!0
allExtends[extendIndex].selfSelectors.forEach(function(selfSelector){var extendedSelectors
extendedSelectors=extendVisitor.extendSelector(matches,selectorPath,selfSelector,allExtends[extendIndex].isVisible())
selectorsToAdd.push(extendedSelectors)})}}}rulesetNode.paths=rulesetNode.paths.concat(selectorsToAdd)}},findMatch:function(extend,haystackSelectorPath){var haystackSelectorIndex,hackstackSelector,hackstackElementIndex,haystackElement,targetCombinator,i,potentialMatch,extendVisitor=this,needleElements=extend.selector.elements,potentialMatches=[],matches=[]
for(haystackSelectorIndex=0;haystackSelectorIndex<haystackSelectorPath.length;haystackSelectorIndex++){hackstackSelector=haystackSelectorPath[haystackSelectorIndex]
for(hackstackElementIndex=0;hackstackElementIndex<hackstackSelector.elements.length;hackstackElementIndex++){haystackElement=hackstackSelector.elements[hackstackElementIndex];(extend.allowBefore||0===haystackSelectorIndex&&0===hackstackElementIndex)&&potentialMatches.push({pathIndex:haystackSelectorIndex,index:hackstackElementIndex,matched:0,initialCombinator:haystackElement.combinator})
for(i=0;i<potentialMatches.length;i++){potentialMatch=potentialMatches[i]
""===(targetCombinator=haystackElement.combinator.value)&&0===hackstackElementIndex&&(targetCombinator=" ")
!extendVisitor.isElementValuesEqual(needleElements[potentialMatch.matched].value,haystackElement.value)||potentialMatch.matched>0&&needleElements[potentialMatch.matched].combinator.value!==targetCombinator?potentialMatch=null:potentialMatch.matched++
if(potentialMatch){potentialMatch.finished=potentialMatch.matched===needleElements.length
potentialMatch.finished&&!extend.allowAfter&&(hackstackElementIndex+1<hackstackSelector.elements.length||haystackSelectorIndex+1<haystackSelectorPath.length)&&(potentialMatch=null)}if(potentialMatch){if(potentialMatch.finished){potentialMatch.length=needleElements.length
potentialMatch.endPathIndex=haystackSelectorIndex
potentialMatch.endPathElementIndex=hackstackElementIndex+1
potentialMatches.length=0
matches.push(potentialMatch)}}else{potentialMatches.splice(i,1)
i--}}}}return matches},isElementValuesEqual:function(elementValue1,elementValue2){if("string"==typeof elementValue1||"string"==typeof elementValue2)return elementValue1===elementValue2
if(elementValue1 instanceof tree.Attribute)return elementValue1.op===elementValue2.op&&elementValue1.key===elementValue2.key&&(elementValue1.value&&elementValue2.value?(elementValue1=elementValue1.value.value||elementValue1.value)===(elementValue2=elementValue2.value.value||elementValue2.value):!elementValue1.value&&!elementValue2.value)
elementValue1=elementValue1.value
elementValue2=elementValue2.value
if(elementValue1 instanceof tree.Selector){if(!(elementValue2 instanceof tree.Selector)||elementValue1.elements.length!==elementValue2.elements.length)return!1
for(var i=0;i<elementValue1.elements.length;i++){if(elementValue1.elements[i].combinator.value!==elementValue2.elements[i].combinator.value&&(0!==i||(elementValue1.elements[i].combinator.value||" ")!==(elementValue2.elements[i].combinator.value||" ")))return!1
if(!this.isElementValuesEqual(elementValue1.elements[i].value,elementValue2.elements[i].value))return!1}return!0}return!1},extendSelector:function(matches,selectorPath,replacementSelector,isVisible){var matchIndex,selector,firstElement,match,newElements,currentSelectorPathIndex=0,currentSelectorPathElementIndex=0,path=[]
for(matchIndex=0;matchIndex<matches.length;matchIndex++){selector=selectorPath[(match=matches[matchIndex]).pathIndex]
firstElement=new tree.Element(match.initialCombinator,replacementSelector.elements[0].value,replacementSelector.elements[0].getIndex(),replacementSelector.elements[0].fileInfo())
if(match.pathIndex>currentSelectorPathIndex&&currentSelectorPathElementIndex>0){path[path.length-1].elements=path[path.length-1].elements.concat(selectorPath[currentSelectorPathIndex].elements.slice(currentSelectorPathElementIndex))
currentSelectorPathElementIndex=0
currentSelectorPathIndex++}newElements=selector.elements.slice(currentSelectorPathElementIndex,match.index).concat([firstElement]).concat(replacementSelector.elements.slice(1))
currentSelectorPathIndex===match.pathIndex&&matchIndex>0?path[path.length-1].elements=path[path.length-1].elements.concat(newElements):(path=path.concat(selectorPath.slice(currentSelectorPathIndex,match.pathIndex))).push(new tree.Selector(newElements))
currentSelectorPathIndex=match.endPathIndex
if((currentSelectorPathElementIndex=match.endPathElementIndex)>=selectorPath[currentSelectorPathIndex].elements.length){currentSelectorPathElementIndex=0
currentSelectorPathIndex++}}if(currentSelectorPathIndex<selectorPath.length&&currentSelectorPathElementIndex>0){path[path.length-1].elements=path[path.length-1].elements.concat(selectorPath[currentSelectorPathIndex].elements.slice(currentSelectorPathElementIndex))
currentSelectorPathIndex++}return path=(path=path.concat(selectorPath.slice(currentSelectorPathIndex,selectorPath.length))).map(function(currentValue){var derived=currentValue.createDerived(currentValue.elements)
isVisible?derived.ensureVisibility():derived.ensureInvisibility()
return derived})},visitMedia:function(mediaNode,visitArgs){var newAllExtends=mediaNode.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length-1])
newAllExtends=newAllExtends.concat(this.doExtendChaining(newAllExtends,mediaNode.allExtends))
this.allExtendsStack.push(newAllExtends)},visitMediaOut:function(mediaNode){var lastIndex=this.allExtendsStack.length-1
this.allExtendsStack.length=lastIndex},visitAtRule:function(atRuleNode,visitArgs){var newAllExtends=atRuleNode.allExtends.concat(this.allExtendsStack[this.allExtendsStack.length-1])
newAllExtends=newAllExtends.concat(this.doExtendChaining(newAllExtends,atRuleNode.allExtends))
this.allExtendsStack.push(newAllExtends)},visitAtRuleOut:function(atRuleNode){var lastIndex=this.allExtendsStack.length-1
this.allExtendsStack.length=lastIndex}}
module.exports=ProcessExtendsVisitor},{"../logger":29,"../tree":58,"../utils":80,"./visitor":88}],82:[function(require,module,exports){function ImportSequencer(onSequencerEmpty){this.imports=[]
this.variableImports=[]
this._onSequencerEmpty=onSequencerEmpty
this._currentDepth=0}ImportSequencer.prototype.addImport=function(callback){var importSequencer=this,importItem={callback:callback,args:null,isReady:!1}
this.imports.push(importItem)
return function(){importItem.args=Array.prototype.slice.call(arguments,0)
importItem.isReady=!0
importSequencer.tryRun()}}
ImportSequencer.prototype.addVariableImport=function(callback){this.variableImports.push(callback)}
ImportSequencer.prototype.tryRun=function(){this._currentDepth++
try{for(;;){for(;this.imports.length>0;){var importItem=this.imports[0]
if(!importItem.isReady)return
this.imports=this.imports.slice(1)
importItem.callback.apply(null,importItem.args)}if(0===this.variableImports.length)break
var variableImport=this.variableImports[0]
this.variableImports=this.variableImports.slice(1)
variableImport()}}finally{this._currentDepth--}0===this._currentDepth&&this._onSequencerEmpty&&this._onSequencerEmpty()}
module.exports=ImportSequencer},{}],83:[function(require,module,exports){var contexts=require("../contexts"),Visitor=require("./visitor"),ImportSequencer=require("./import-sequencer"),utils=require("../utils"),ImportVisitor=function(importer,finish){this._visitor=new Visitor(this)
this._importer=importer
this._finish=finish
this.context=new contexts.Eval
this.importCount=0
this.onceFileDetectionMap={}
this.recursionDetector={}
this._sequencer=new ImportSequencer(this._onSequencerEmpty.bind(this))}
ImportVisitor.prototype={isReplacing:!1,run:function(root){try{this._visitor.visit(root)}catch(e){this.error=e}this.isFinished=!0
this._sequencer.tryRun()},_onSequencerEmpty:function(){this.isFinished&&this._finish(this.error)},visitImport:function(importNode,visitArgs){var inlineCSS=importNode.options.inline
if(!importNode.css||inlineCSS){var context=new contexts.Eval(this.context,utils.copyArray(this.context.frames)),importParent=context.frames[0]
this.importCount++
importNode.isVariableImport()?this._sequencer.addVariableImport(this.processImportNode.bind(this,importNode,context,importParent)):this.processImportNode(importNode,context,importParent)}visitArgs.visitDeeper=!1},processImportNode:function(importNode,context,importParent){var evaldImportNode,inlineCSS=importNode.options.inline
try{evaldImportNode=importNode.evalForImport(context)}catch(e){if(!e.filename){e.index=importNode.getIndex()
e.filename=importNode.fileInfo().filename}importNode.css=!0
importNode.error=e}if(!evaldImportNode||evaldImportNode.css&&!inlineCSS){this.importCount--
this.isFinished&&this._sequencer.tryRun()}else{evaldImportNode.options.multiple&&(context.importMultiple=!0)
for(var tryAppendLessExtension=void 0===evaldImportNode.css,i=0;i<importParent.rules.length;i++)if(importParent.rules[i]===importNode){importParent.rules[i]=evaldImportNode
break}var onImported=this.onImported.bind(this,evaldImportNode,context),sequencedOnImported=this._sequencer.addImport(onImported)
this._importer.push(evaldImportNode.getPath(),tryAppendLessExtension,evaldImportNode.fileInfo(),evaldImportNode.options,sequencedOnImported)}},onImported:function(importNode,context,e,root,importedAtRoot,fullPath){if(e){if(!e.filename){e.index=importNode.getIndex()
e.filename=importNode.fileInfo().filename}this.error=e}var importVisitor=this,inlineCSS=importNode.options.inline,isPlugin=importNode.options.isPlugin,isOptional=importNode.options.optional,duplicateImport=importedAtRoot||fullPath in importVisitor.recursionDetector
context.importMultiple||(importNode.skip=!!duplicateImport||function(){if(fullPath in importVisitor.onceFileDetectionMap)return!0
importVisitor.onceFileDetectionMap[fullPath]=!0
return!1})
!fullPath&&isOptional&&(importNode.skip=!0)
if(root){importNode.root=root
importNode.importedFilename=fullPath
if(!inlineCSS&&!isPlugin&&(context.importMultiple||!duplicateImport)){importVisitor.recursionDetector[fullPath]=!0
var oldContext=this.context
this.context=context
try{this._visitor.visit(root)}catch(e){this.error=e}this.context=oldContext}}importVisitor.importCount--
importVisitor.isFinished&&importVisitor._sequencer.tryRun()},visitDeclaration:function(declNode,visitArgs){"DetachedRuleset"===declNode.value.type?this.context.frames.unshift(declNode):visitArgs.visitDeeper=!1},visitDeclarationOut:function(declNode){"DetachedRuleset"===declNode.value.type&&this.context.frames.shift()},visitAtRule:function(atRuleNode,visitArgs){this.context.frames.unshift(atRuleNode)},visitAtRuleOut:function(atRuleNode){this.context.frames.shift()},visitMixinDefinition:function(mixinDefinitionNode,visitArgs){this.context.frames.unshift(mixinDefinitionNode)},visitMixinDefinitionOut:function(mixinDefinitionNode){this.context.frames.shift()},visitRuleset:function(rulesetNode,visitArgs){this.context.frames.unshift(rulesetNode)},visitRulesetOut:function(rulesetNode){this.context.frames.shift()},visitMedia:function(mediaNode,visitArgs){this.context.frames.unshift(mediaNode.rules[0])},visitMediaOut:function(mediaNode){this.context.frames.shift()}}
module.exports=ImportVisitor},{"../contexts":4,"../utils":80,"./import-sequencer":82,"./visitor":88}],84:[function(require,module,exports){var visitors={Visitor:require("./visitor"),ImportVisitor:require("./import-visitor"),MarkVisibleSelectorsVisitor:require("./set-tree-visibility-visitor"),ExtendVisitor:require("./extend-visitor"),JoinSelectorVisitor:require("./join-selector-visitor"),ToCSSVisitor:require("./to-css-visitor")}
module.exports=visitors},{"./extend-visitor":81,"./import-visitor":83,"./join-selector-visitor":85,"./set-tree-visibility-visitor":86,"./to-css-visitor":87,"./visitor":88}],85:[function(require,module,exports){var Visitor=require("./visitor"),JoinSelectorVisitor=function(){this.contexts=[[]]
this._visitor=new Visitor(this)}
JoinSelectorVisitor.prototype={run:function(root){return this._visitor.visit(root)},visitDeclaration:function(declNode,visitArgs){visitArgs.visitDeeper=!1},visitMixinDefinition:function(mixinDefinitionNode,visitArgs){visitArgs.visitDeeper=!1},visitRuleset:function(rulesetNode,visitArgs){var selectors,context=this.contexts[this.contexts.length-1],paths=[]
this.contexts.push(paths)
if(!rulesetNode.root){if(selectors=rulesetNode.selectors){selectors=selectors.filter(function(selector){return selector.getIsOutput()})
rulesetNode.selectors=selectors.length?selectors:selectors=null
selectors&&rulesetNode.joinSelectors(paths,context,selectors)}selectors||(rulesetNode.rules=null)
rulesetNode.paths=paths}},visitRulesetOut:function(rulesetNode){this.contexts.length=this.contexts.length-1},visitMedia:function(mediaNode,visitArgs){var context=this.contexts[this.contexts.length-1]
mediaNode.rules[0].root=0===context.length||context[0].multiMedia},visitAtRule:function(atRuleNode,visitArgs){var context=this.contexts[this.contexts.length-1]
atRuleNode.rules&&atRuleNode.rules.length&&(atRuleNode.rules[0].root=atRuleNode.isRooted||0===context.length||null)}}
module.exports=JoinSelectorVisitor},{"./visitor":88}],86:[function(require,module,exports){var SetTreeVisibilityVisitor=function(visible){this.visible=visible}
SetTreeVisibilityVisitor.prototype.run=function(root){this.visit(root)}
SetTreeVisibilityVisitor.prototype.visitArray=function(nodes){if(!nodes)return nodes
var i,cnt=nodes.length
for(i=0;i<cnt;i++)this.visit(nodes[i])
return nodes}
SetTreeVisibilityVisitor.prototype.visit=function(node){if(!node)return node
if(node.constructor===Array)return this.visitArray(node)
if(!node.blocksVisibility||node.blocksVisibility())return node
this.visible?node.ensureVisibility():node.ensureInvisibility()
node.accept(this)
return node}
module.exports=SetTreeVisibilityVisitor},{}],87:[function(require,module,exports){var tree=require("../tree"),Visitor=require("./visitor"),CSSVisitorUtils=function(context){this._visitor=new Visitor(this)
this._context=context}
CSSVisitorUtils.prototype={containsSilentNonBlockedChild:function(bodyRules){var rule
if(!bodyRules)return!1
for(var r=0;r<bodyRules.length;r++)if((rule=bodyRules[r]).isSilent&&rule.isSilent(this._context)&&!rule.blocksVisibility())return!0
return!1},keepOnlyVisibleChilds:function(owner){owner&&owner.rules&&(owner.rules=owner.rules.filter(function(thing){return thing.isVisible()}))},isEmpty:function(owner){return!owner||!owner.rules||0===owner.rules.length},hasVisibleSelector:function(rulesetNode){return!(!rulesetNode||!rulesetNode.paths)&&rulesetNode.paths.length>0},resolveVisibility:function(node,originalRules){if(!node.blocksVisibility()){if(this.isEmpty(node)&&!this.containsSilentNonBlockedChild(originalRules))return
return node}var compiledRulesBody=node.rules[0]
this.keepOnlyVisibleChilds(compiledRulesBody)
if(!this.isEmpty(compiledRulesBody)){node.ensureVisibility()
node.removeVisibilityBlock()
return node}},isVisibleRuleset:function(rulesetNode){return!!rulesetNode.firstRoot||!this.isEmpty(rulesetNode)&&!(!rulesetNode.root&&!this.hasVisibleSelector(rulesetNode))}}
var ToCSSVisitor=function(context){this._visitor=new Visitor(this)
this._context=context
this.utils=new CSSVisitorUtils(context)}
ToCSSVisitor.prototype={isReplacing:!0,run:function(root){return this._visitor.visit(root)},visitDeclaration:function(declNode,visitArgs){if(!declNode.blocksVisibility()&&!declNode.variable)return declNode},visitMixinDefinition:function(mixinNode,visitArgs){mixinNode.frames=[]},visitExtend:function(extendNode,visitArgs){},visitComment:function(commentNode,visitArgs){if(!commentNode.blocksVisibility()&&!commentNode.isSilent(this._context))return commentNode},visitMedia:function(mediaNode,visitArgs){var originalRules=mediaNode.rules[0].rules
mediaNode.accept(this._visitor)
visitArgs.visitDeeper=!1
return this.utils.resolveVisibility(mediaNode,originalRules)},visitImport:function(importNode,visitArgs){if(!importNode.blocksVisibility())return importNode},visitAtRule:function(atRuleNode,visitArgs){return atRuleNode.rules&&atRuleNode.rules.length?this.visitAtRuleWithBody(atRuleNode,visitArgs):this.visitAtRuleWithoutBody(atRuleNode,visitArgs)},visitAnonymous:function(anonymousNode,visitArgs){if(!anonymousNode.blocksVisibility()){anonymousNode.accept(this._visitor)
return anonymousNode}},visitAtRuleWithBody:function(atRuleNode,visitArgs){function hasFakeRuleset(atRuleNode){var bodyRules=atRuleNode.rules
return 1===bodyRules.length&&(!bodyRules[0].paths||0===bodyRules[0].paths.length)}var originalRules=function(atRuleNode){var nodeRules=atRuleNode.rules
return hasFakeRuleset(atRuleNode)?nodeRules[0].rules:nodeRules}(atRuleNode)
atRuleNode.accept(this._visitor)
visitArgs.visitDeeper=!1
this.utils.isEmpty(atRuleNode)||this._mergeRules(atRuleNode.rules[0].rules)
return this.utils.resolveVisibility(atRuleNode,originalRules)},visitAtRuleWithoutBody:function(atRuleNode,visitArgs){if(!atRuleNode.blocksVisibility()){if("@charset"===atRuleNode.name){if(this.charset){if(atRuleNode.debugInfo){var comment=new tree.Comment("/* "+atRuleNode.toCSS(this._context).replace(/\n/g,"")+" */\n")
comment.debugInfo=atRuleNode.debugInfo
return this._visitor.visit(comment)}return}this.charset=!0}return atRuleNode}},checkValidNodes:function(rules,isRoot){if(rules)for(var i=0;i<rules.length;i++){var ruleNode=rules[i]
if(isRoot&&ruleNode instanceof tree.Declaration&&!ruleNode.variable)throw{message:"Properties must be inside selector blocks. They cannot be in the root",index:ruleNode.getIndex(),filename:ruleNode.fileInfo()&&ruleNode.fileInfo().filename}
if(ruleNode instanceof tree.Call)throw{message:"Function '"+ruleNode.name+"' is undefined",index:ruleNode.getIndex(),filename:ruleNode.fileInfo()&&ruleNode.fileInfo().filename}
if(ruleNode.type&&!ruleNode.allowRoot)throw{message:ruleNode.type+" node returned by a function is not valid here",index:ruleNode.getIndex(),filename:ruleNode.fileInfo()&&ruleNode.fileInfo().filename}}},visitRuleset:function(rulesetNode,visitArgs){var rule,rulesets=[]
this.checkValidNodes(rulesetNode.rules,rulesetNode.firstRoot)
if(rulesetNode.root){rulesetNode.accept(this._visitor)
visitArgs.visitDeeper=!1}else{this._compileRulesetPaths(rulesetNode)
for(var nodeRules=rulesetNode.rules,nodeRuleCnt=nodeRules?nodeRules.length:0,i=0;i<nodeRuleCnt;)if((rule=nodeRules[i])&&rule.rules){rulesets.push(this._visitor.visit(rule))
nodeRules.splice(i,1)
nodeRuleCnt--}else i++
nodeRuleCnt>0?rulesetNode.accept(this._visitor):rulesetNode.rules=null
visitArgs.visitDeeper=!1}if(rulesetNode.rules){this._mergeRules(rulesetNode.rules)
this._removeDuplicateRules(rulesetNode.rules)}if(this.utils.isVisibleRuleset(rulesetNode)){rulesetNode.ensureVisibility()
rulesets.splice(0,0,rulesetNode)}return 1===rulesets.length?rulesets[0]:rulesets},_compileRulesetPaths:function(rulesetNode){rulesetNode.paths&&(rulesetNode.paths=rulesetNode.paths.filter(function(p){var i
" "===p[0].elements[0].combinator.value&&(p[0].elements[0].combinator=new tree.Combinator(""))
for(i=0;i<p.length;i++)if(p[i].isVisible()&&p[i].getIsOutput())return!0
return!1}))},_removeDuplicateRules:function(rules){if(rules){var ruleList,rule,i,ruleCache={}
for(i=rules.length-1;i>=0;i--)if((rule=rules[i])instanceof tree.Declaration)if(ruleCache[rule.name]){(ruleList=ruleCache[rule.name])instanceof tree.Declaration&&(ruleList=ruleCache[rule.name]=[ruleCache[rule.name].toCSS(this._context)])
var ruleCSS=rule.toCSS(this._context);-1!==ruleList.indexOf(ruleCSS)?rules.splice(i,1):ruleList.push(ruleCSS)}else ruleCache[rule.name]=rule}},_mergeRules:function(rules){if(rules){for(var groups={},groupsArr=[],i=0;i<rules.length;i++){var rule=rules[i]
if(rule.merge){var key=rule.name
groups[key]?rules.splice(i--,1):groupsArr.push(groups[key]=[])
groups[key].push(rule)}}groupsArr.forEach(function(group){if(group.length>0){var result=group[0],space=[],comma=[new tree.Expression(space)]
group.forEach(function(rule){"+"===rule.merge&&space.length>0&&comma.push(new tree.Expression(space=[]))
space.push(rule.value)
result.important=result.important||rule.important})
result.value=new tree.Value(comma)}})}}}
module.exports=ToCSSVisitor},{"../tree":58,"./visitor":88}],88:[function(require,module,exports){function _noop(node){return node}function indexNodeTypes(parent,ticker){var key,child
for(key in parent)switch(typeof(child=parent[key])){case"function":child.prototype&&child.prototype.type&&(child.prototype.typeIndex=ticker++)
break
case"object":ticker=indexNodeTypes(child,ticker)}return ticker}var tree=require("../tree"),_visitArgs={visitDeeper:!0},_hasIndexed=!1,Visitor=function(implementation){this._implementation=implementation
this._visitFnCache=[]
if(!_hasIndexed){indexNodeTypes(tree,1)
_hasIndexed=!0}}
Visitor.prototype={visit:function(node){if(!node)return node
var nodeTypeIndex=node.typeIndex
if(!nodeTypeIndex)return node
var fnName,visitFnCache=this._visitFnCache,impl=this._implementation,aryIndx=nodeTypeIndex<<1,outAryIndex=1|aryIndx,func=visitFnCache[aryIndx],funcOut=visitFnCache[outAryIndex],visitArgs=_visitArgs
visitArgs.visitDeeper=!0
if(!func){func=impl[fnName="visit"+node.type]||_noop
funcOut=impl[fnName+"Out"]||_noop
visitFnCache[aryIndx]=func
visitFnCache[outAryIndex]=funcOut}if(func!==_noop){var newNode=func.call(impl,node,visitArgs)
impl.isReplacing&&(node=newNode)}visitArgs.visitDeeper&&node&&node.accept&&node.accept(this)
funcOut!=_noop&&funcOut.call(impl,node)
return node},visitArray:function(nodes,nonReplacing){if(!nodes)return nodes
var i,cnt=nodes.length
if(nonReplacing||!this._implementation.isReplacing){for(i=0;i<cnt;i++)this.visit(nodes[i])
return nodes}var out=[]
for(i=0;i<cnt;i++){var evald=this.visit(nodes[i])
void 0!==evald&&(evald.splice?evald.length&&this.flatten(evald,out):out.push(evald))}return out},flatten:function(arr,out){out||(out=[])
var cnt,i,item,nestedCnt,j,nestedItem
for(i=0,cnt=arr.length;i<cnt;i++)if(void 0!==(item=arr[i]))if(item.splice)for(j=0,nestedCnt=item.length;j<nestedCnt;j++)void 0!==(nestedItem=item[j])&&(nestedItem.splice?nestedItem.length&&this.flatten(nestedItem,out):out.push(nestedItem))
else out.push(item)
return out}}
module.exports=Visitor},{"../tree":58}],89:[function(require,module,exports){"use strict"
function asap(task){var rawTask;(rawTask=freeTasks.length?freeTasks.pop():new RawTask).task=task
rawAsap(rawTask)}function RawTask(){this.task=null}var rawAsap=require("./raw"),freeTasks=[],pendingErrors=[],requestErrorThrow=rawAsap.makeRequestCallFromTimer(function(){if(pendingErrors.length)throw pendingErrors.shift()})
module.exports=asap
RawTask.prototype.call=function(){try{this.task.call()}catch(error){if(asap.onerror)asap.onerror(error)
else{pendingErrors.push(error)
requestErrorThrow()}}finally{this.task=null
freeTasks[freeTasks.length]=this}}},{"./raw":90}],90:[function(require,module,exports){(function(global){"use strict"
function rawAsap(task){if(!queue.length){requestFlush()
flushing=!0}queue[queue.length]=task}function flush(){for(;index<queue.length;){var currentIndex=index
index+=1
queue[currentIndex].call()
if(index>capacity){for(var scan=0,newLength=queue.length-index;scan<newLength;scan++)queue[scan]=queue[scan+index]
queue.length-=index
index=0}}queue.length=0
index=0
flushing=!1}function makeRequestCallFromTimer(callback){return function(){function handleTimer(){clearTimeout(timeoutHandle)
clearInterval(intervalHandle)
callback()}var timeoutHandle=setTimeout(handleTimer,0),intervalHandle=setInterval(handleTimer,50)}}module.exports=rawAsap
var requestFlush,queue=[],flushing=!1,index=0,capacity=1024,scope=void 0!==global?global:self,BrowserMutationObserver=scope.MutationObserver||scope.WebKitMutationObserver
requestFlush="function"==typeof BrowserMutationObserver?function(callback){var toggle=1,observer=new BrowserMutationObserver(callback),node=document.createTextNode("")
observer.observe(node,{characterData:!0})
return function(){toggle=-toggle
node.data=toggle}}(flush):makeRequestCallFromTimer(flush)
rawAsap.requestFlush=requestFlush
rawAsap.makeRequestCallFromTimer=makeRequestCallFromTimer}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],91:[function(require,module,exports){(function(process){function normalizeArray(parts,allowAboveRoot){for(var up=0,i=parts.length-1;i>=0;i--){var last=parts[i]
if("."===last)parts.splice(i,1)
else if(".."===last){parts.splice(i,1)
up++}else if(up){parts.splice(i,1)
up--}}if(allowAboveRoot)for(;up--;up)parts.unshift("..")
return parts}function filter(xs,f){if(xs.filter)return xs.filter(f)
for(var res=[],i=0;i<xs.length;i++)f(xs[i],i,xs)&&res.push(xs[i])
return res}var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,splitPath=function(filename){return splitPathRe.exec(filename).slice(1)}
exports.resolve=function(){for(var resolvedPath="",resolvedAbsolute=!1,i=arguments.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?arguments[i]:process.cwd()
if("string"!=typeof path)throw new TypeError("Arguments to path.resolve must be strings")
if(path){resolvedPath=path+"/"+resolvedPath
resolvedAbsolute="/"===path.charAt(0)}}resolvedPath=normalizeArray(filter(resolvedPath.split("/"),function(p){return!!p}),!resolvedAbsolute).join("/")
return(resolvedAbsolute?"/":"")+resolvedPath||"."}
exports.normalize=function(path){var isAbsolute=exports.isAbsolute(path),trailingSlash="/"===substr(path,-1);(path=normalizeArray(filter(path.split("/"),function(p){return!!p}),!isAbsolute).join("/"))||isAbsolute||(path=".")
path&&trailingSlash&&(path+="/")
return(isAbsolute?"/":"")+path}
exports.isAbsolute=function(path){return"/"===path.charAt(0)}
exports.join=function(){var paths=Array.prototype.slice.call(arguments,0)
return exports.normalize(filter(paths,function(p,index){if("string"!=typeof p)throw new TypeError("Arguments to path.join must be strings")
return p}).join("/"))}
exports.relative=function(from,to){function trim(arr){for(var start=0;start<arr.length&&""===arr[start];start++);for(var end=arr.length-1;end>=0&&""===arr[end];end--);return start>end?[]:arr.slice(start,end-start+1)}from=exports.resolve(from).substr(1)
to=exports.resolve(to).substr(1)
for(var fromParts=trim(from.split("/")),toParts=trim(to.split("/")),length=Math.min(fromParts.length,toParts.length),samePartsLength=length,i=0;i<length;i++)if(fromParts[i]!==toParts[i]){samePartsLength=i
break}for(var outputParts=[],i=samePartsLength;i<fromParts.length;i++)outputParts.push("..")
return(outputParts=outputParts.concat(toParts.slice(samePartsLength))).join("/")}
exports.sep="/"
exports.delimiter=":"
exports.dirname=function(path){var result=splitPath(path),root=result[0],dir=result[1]
if(!root&&!dir)return"."
dir&&(dir=dir.substr(0,dir.length-1))
return root+dir}
exports.basename=function(path,ext){var f=splitPath(path)[2]
ext&&f.substr(-1*ext.length)===ext&&(f=f.substr(0,f.length-ext.length))
return f}
exports.extname=function(path){return splitPath(path)[3]}
var substr="b"==="ab".substr(-1)?function(str,start,len){return str.substr(start,len)}:function(str,start,len){start<0&&(start=str.length+start)
return str.substr(start,len)}}).call(this,require("_process"))},{_process:92}],92:[function(require,module,exports){function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}function runTimeout(fun){if(cachedSetTimeout===setTimeout)return setTimeout(fun,0)
if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout){cachedSetTimeout=setTimeout
return setTimeout(fun,0)}try{return cachedSetTimeout(fun,0)}catch(e){try{return cachedSetTimeout.call(null,fun,0)}catch(e){return cachedSetTimeout.call(this,fun,0)}}}function runClearTimeout(marker){if(cachedClearTimeout===clearTimeout)return clearTimeout(marker)
if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout){cachedClearTimeout=clearTimeout
return clearTimeout(marker)}try{return cachedClearTimeout(marker)}catch(e){try{return cachedClearTimeout.call(null,marker)}catch(e){return cachedClearTimeout.call(this,marker)}}}function cleanUpNextTick(){if(draining&&currentQueue){draining=!1
currentQueue.length?queue=currentQueue.concat(queue):queueIndex=-1
queue.length&&drainQueue()}}function drainQueue(){if(!draining){var timeout=runTimeout(cleanUpNextTick)
draining=!0
for(var len=queue.length;len;){currentQueue=queue
queue=[]
for(;++queueIndex<len;)currentQueue&&currentQueue[queueIndex].run()
queueIndex=-1
len=queue.length}currentQueue=null
draining=!1
runClearTimeout(timeout)}}function Item(fun,array){this.fun=fun
this.array=array}function noop(){}var cachedSetTimeout,cachedClearTimeout,process=module.exports={}
!function(){try{cachedSetTimeout="function"==typeof setTimeout?setTimeout:defaultSetTimout}catch(e){cachedSetTimeout=defaultSetTimout}try{cachedClearTimeout="function"==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(e){cachedClearTimeout=defaultClearTimeout}}()
var currentQueue,queue=[],draining=!1,queueIndex=-1
process.nextTick=function(fun){var args=new Array(arguments.length-1)
if(arguments.length>1)for(var i=1;i<arguments.length;i++)args[i-1]=arguments[i]
queue.push(new Item(fun,args))
1!==queue.length||draining||runTimeout(drainQueue)}
Item.prototype.run=function(){this.fun.apply(null,this.array)}
process.title="browser"
process.browser=!0
process.env={}
process.argv=[]
process.version=""
process.versions={}
process.on=noop
process.addListener=noop
process.once=noop
process.off=noop
process.removeListener=noop
process.removeAllListeners=noop
process.emit=noop
process.prependListener=noop
process.prependOnceListener=noop
process.listeners=function(name){return[]}
process.binding=function(name){throw new Error("process.binding is not supported")}
process.cwd=function(){return"/"}
process.chdir=function(dir){throw new Error("process.chdir is not supported")}
process.umask=function(){return 0}},{}],93:[function(require,module,exports){"use strict"
module.exports=require("./lib")},{"./lib":98}],94:[function(require,module,exports){"use strict"
function noop(){}function getThen(obj){try{return obj.then}catch(ex){LAST_ERROR=ex
return IS_ERROR}}function tryCallOne(fn,a){try{return fn(a)}catch(ex){LAST_ERROR=ex
return IS_ERROR}}function tryCallTwo(fn,a,b){try{fn(a,b)}catch(ex){LAST_ERROR=ex
return IS_ERROR}}function Promise(fn){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new")
if("function"!=typeof fn)throw new TypeError("Promise constructor's argument is not a function")
this._40=0
this._65=0
this._55=null
this._72=null
fn!==noop&&doResolve(fn,this)}function safeThen(self,onFulfilled,onRejected){return new self.constructor(function(resolve,reject){var res=new Promise(noop)
res.then(resolve,reject)
handle(self,new Handler(onFulfilled,onRejected,res))})}function handle(self,deferred){for(;3===self._65;)self=self._55
Promise._37&&Promise._37(self)
if(0!==self._65)handleResolved(self,deferred)
else{if(0===self._40){self._40=1
self._72=deferred
return}if(1===self._40){self._40=2
self._72=[self._72,deferred]
return}self._72.push(deferred)}}function handleResolved(self,deferred){asap(function(){var cb=1===self._65?deferred.onFulfilled:deferred.onRejected
if(null!==cb){var ret=tryCallOne(cb,self._55)
ret===IS_ERROR?reject(deferred.promise,LAST_ERROR):resolve(deferred.promise,ret)}else 1===self._65?resolve(deferred.promise,self._55):reject(deferred.promise,self._55)})}function resolve(self,newValue){if(newValue===self)return reject(self,new TypeError("A promise cannot be resolved with itself."))
if(newValue&&("object"==typeof newValue||"function"==typeof newValue)){var then=getThen(newValue)
if(then===IS_ERROR)return reject(self,LAST_ERROR)
if(then===self.then&&newValue instanceof Promise){self._65=3
self._55=newValue
finale(self)
return}if("function"==typeof then){doResolve(then.bind(newValue),self)
return}}self._65=1
self._55=newValue
finale(self)}function reject(self,newValue){self._65=2
self._55=newValue
Promise._87&&Promise._87(self,newValue)
finale(self)}function finale(self){if(1===self._40){handle(self,self._72)
self._72=null}if(2===self._40){for(var i=0;i<self._72.length;i++)handle(self,self._72[i])
self._72=null}}function Handler(onFulfilled,onRejected,promise){this.onFulfilled="function"==typeof onFulfilled?onFulfilled:null
this.onRejected="function"==typeof onRejected?onRejected:null
this.promise=promise}function doResolve(fn,promise){var done=!1,res=tryCallTwo(fn,function(value){if(!done){done=!0
resolve(promise,value)}},function(reason){if(!done){done=!0
reject(promise,reason)}})
if(!done&&res===IS_ERROR){done=!0
reject(promise,LAST_ERROR)}}var asap=require("asap/raw"),LAST_ERROR=null,IS_ERROR={}
module.exports=Promise
Promise._37=null
Promise._87=null
Promise._61=noop
Promise.prototype.then=function(onFulfilled,onRejected){if(this.constructor!==Promise)return safeThen(this,onFulfilled,onRejected)
var res=new Promise(noop)
handle(this,new Handler(onFulfilled,onRejected,res))
return res}},{"asap/raw":90}],95:[function(require,module,exports){"use strict"
var Promise=require("./core.js")
module.exports=Promise
Promise.prototype.done=function(onFulfilled,onRejected){(arguments.length?this.then.apply(this,arguments):this).then(null,function(err){setTimeout(function(){throw err},0)})}},{"./core.js":94}],96:[function(require,module,exports){"use strict"
function valuePromise(value){var p=new Promise(Promise._61)
p._65=1
p._55=value
return p}var Promise=require("./core.js")
module.exports=Promise
var TRUE=valuePromise(!0),FALSE=valuePromise(!1),NULL=valuePromise(null),UNDEFINED=valuePromise(void 0),ZERO=valuePromise(0),EMPTYSTRING=valuePromise("")
Promise.resolve=function(value){if(value instanceof Promise)return value
if(null===value)return NULL
if(void 0===value)return UNDEFINED
if(!0===value)return TRUE
if(!1===value)return FALSE
if(0===value)return ZERO
if(""===value)return EMPTYSTRING
if("object"==typeof value||"function"==typeof value)try{var then=value.then
if("function"==typeof then)return new Promise(then.bind(value))}catch(ex){return new Promise(function(resolve,reject){reject(ex)})}return valuePromise(value)}
Promise.all=function(arr){var args=Array.prototype.slice.call(arr)
return new Promise(function(resolve,reject){function res(i,val){if(val&&("object"==typeof val||"function"==typeof val)){if(val instanceof Promise&&val.then===Promise.prototype.then){for(;3===val._65;)val=val._55
if(1===val._65)return res(i,val._55)
2===val._65&&reject(val._55)
val.then(function(val){res(i,val)},reject)
return}var then=val.then
if("function"==typeof then){new Promise(then.bind(val)).then(function(val){res(i,val)},reject)
return}}args[i]=val
0==--remaining&&resolve(args)}if(0===args.length)return resolve([])
for(var remaining=args.length,i=0;i<args.length;i++)res(i,args[i])})}
Promise.reject=function(value){return new Promise(function(resolve,reject){reject(value)})}
Promise.race=function(values){return new Promise(function(resolve,reject){values.forEach(function(value){Promise.resolve(value).then(resolve,reject)})})}
Promise.prototype.catch=function(onRejected){return this.then(null,onRejected)}},{"./core.js":94}],97:[function(require,module,exports){"use strict"
var Promise=require("./core.js")
module.exports=Promise
Promise.prototype.finally=function(f){return this.then(function(value){return Promise.resolve(f()).then(function(){return value})},function(err){return Promise.resolve(f()).then(function(){throw err})})}},{"./core.js":94}],98:[function(require,module,exports){"use strict"
module.exports=require("./core.js")
require("./done.js")
require("./finally.js")
require("./es6-extensions.js")
require("./node-extensions.js")
require("./synchronous.js")},{"./core.js":94,"./done.js":95,"./es6-extensions.js":96,"./finally.js":97,"./node-extensions.js":99,"./synchronous.js":100}],99:[function(require,module,exports){"use strict"
function denodeifyWithCount(fn,argumentCount){for(var args=[],i=0;i<argumentCount;i++)args.push("a"+i)
var body=["return function ("+args.join(",")+") {","var self = this;","return new Promise(function (rs, rj) {","var res = fn.call(",["self"].concat(args).concat([callbackFn]).join(","),");","if (res &&",'(typeof res === "object" || typeof res === "function") &&','typeof res.then === "function"',") {rs(res);}","});","};"].join("")
return Function(["Promise","fn"],body)(Promise,fn)}function denodeifyWithoutCount(fn){for(var fnLength=Math.max(fn.length-1,3),args=[],i=0;i<fnLength;i++)args.push("a"+i)
var body=["return function ("+args.join(",")+") {","var self = this;","var args;","var argLength = arguments.length;","if (arguments.length > "+fnLength+") {","args = new Array(arguments.length + 1);","for (var i = 0; i < arguments.length; i++) {","args[i] = arguments[i];","}","}","return new Promise(function (rs, rj) {","var cb = "+callbackFn+";","var res;","switch (argLength) {",args.concat(["extra"]).map(function(_,index){return"case "+index+":res = fn.call("+["self"].concat(args.slice(0,index)).concat("cb").join(",")+");break;"}).join(""),"default:","args[argLength] = cb;","res = fn.apply(self, args);","}","if (res &&",'(typeof res === "object" || typeof res === "function") &&','typeof res.then === "function"',") {rs(res);}","});","};"].join("")
return Function(["Promise","fn"],body)(Promise,fn)}var Promise=require("./core.js"),asap=require("asap")
module.exports=Promise
Promise.denodeify=function(fn,argumentCount){return"number"==typeof argumentCount&&argumentCount!==1/0?denodeifyWithCount(fn,argumentCount):denodeifyWithoutCount(fn)}
var callbackFn="function (err, res) {if (err) { rj(err); } else { rs(res); }}"
Promise.nodeify=function(fn){return function(){var args=Array.prototype.slice.call(arguments),callback="function"==typeof args[args.length-1]?args.pop():null,ctx=this
try{return fn.apply(this,arguments).nodeify(callback,ctx)}catch(ex){if(null===callback||void 0===callback)return new Promise(function(resolve,reject){reject(ex)})
asap(function(){callback.call(ctx,ex)})}}}
Promise.prototype.nodeify=function(callback,ctx){if("function"!=typeof callback)return this
this.then(function(value){asap(function(){callback.call(ctx,null,value)})},function(err){asap(function(){callback.call(ctx,err)})})}},{"./core.js":94,asap:89}],100:[function(require,module,exports){"use strict"
var Promise=require("./core.js")
module.exports=Promise
Promise.enableSynchronous=function(){Promise.prototype.isPending=function(){return 0==this.getState()}
Promise.prototype.isFulfilled=function(){return 1==this.getState()}
Promise.prototype.isRejected=function(){return 2==this.getState()}
Promise.prototype.getValue=function(){if(3===this._65)return this._55.getValue()
if(!this.isFulfilled())throw new Error("Cannot get a value of an unfulfilled promise.")
return this._55}
Promise.prototype.getReason=function(){if(3===this._65)return this._55.getReason()
if(!this.isRejected())throw new Error("Cannot get a rejection reason of a non-rejected promise.")
return this._55}
Promise.prototype.getState=function(){return 3===this._65?this._55.getState():-1===this._65||-2===this._65?0:this._65}}
Promise.disableSynchronous=function(){Promise.prototype.isPending=void 0
Promise.prototype.isFulfilled=void 0
Promise.prototype.isRejected=void 0
Promise.prototype.getValue=void 0
Promise.prototype.getReason=void 0
Promise.prototype.getState=void 0}},{"./core.js":94}],101:[function(require,module,exports){function ArraySet(){this._array=[]
this._set=Object.create(null)}var util=require("./util"),has=Object.prototype.hasOwnProperty
ArraySet.fromArray=function(aArray,aAllowDuplicates){for(var set=new ArraySet,i=0,len=aArray.length;i<len;i++)set.add(aArray[i],aAllowDuplicates)
return set}
ArraySet.prototype.size=function(){return Object.getOwnPropertyNames(this._set).length}
ArraySet.prototype.add=function(aStr,aAllowDuplicates){var sStr=util.toSetString(aStr),isDuplicate=has.call(this._set,sStr),idx=this._array.length
isDuplicate&&!aAllowDuplicates||this._array.push(aStr)
isDuplicate||(this._set[sStr]=idx)}
ArraySet.prototype.has=function(aStr){var sStr=util.toSetString(aStr)
return has.call(this._set,sStr)}
ArraySet.prototype.indexOf=function(aStr){var sStr=util.toSetString(aStr)
if(has.call(this._set,sStr))return this._set[sStr]
throw new Error('"'+aStr+'" is not in the set.')}
ArraySet.prototype.at=function(aIdx){if(aIdx>=0&&aIdx<this._array.length)return this._array[aIdx]
throw new Error("No element indexed by "+aIdx)}
ArraySet.prototype.toArray=function(){return this._array.slice()}
exports.ArraySet=ArraySet},{"./util":110}],102:[function(require,module,exports){function toVLQSigned(aValue){return aValue<0?1+(-aValue<<1):0+(aValue<<1)}function fromVLQSigned(aValue){var shifted=aValue>>1
return 1==(1&aValue)?-shifted:shifted}var base64=require("./base64")
exports.encode=function(aValue){var digit,encoded="",vlq=toVLQSigned(aValue)
do{digit=31&vlq;(vlq>>>=5)>0&&(digit|=32)
encoded+=base64.encode(digit)}while(vlq>0)
return encoded}
exports.decode=function(aStr,aIndex,aOutParam){var continuation,digit,strLen=aStr.length,result=0,shift=0
do{if(aIndex>=strLen)throw new Error("Expected more digits in base 64 VLQ value.")
if(-1===(digit=base64.decode(aStr.charCodeAt(aIndex++))))throw new Error("Invalid base64 digit: "+aStr.charAt(aIndex-1))
continuation=!!(32&digit)
result+=(digit&=31)<<shift
shift+=5}while(continuation)
aOutParam.value=fromVLQSigned(result)
aOutParam.rest=aIndex}},{"./base64":103}],103:[function(require,module,exports){var intToCharMap="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("")
exports.encode=function(number){if(0<=number&&number<intToCharMap.length)return intToCharMap[number]
throw new TypeError("Must be between 0 and 63: "+number)}
exports.decode=function(charCode){return 65<=charCode&&charCode<=90?charCode-65:97<=charCode&&charCode<=122?charCode-97+26:48<=charCode&&charCode<=57?charCode-48+52:43==charCode?62:47==charCode?63:-1}},{}],104:[function(require,module,exports){function recursiveSearch(aLow,aHigh,aNeedle,aHaystack,aCompare,aBias){var mid=Math.floor((aHigh-aLow)/2)+aLow,cmp=aCompare(aNeedle,aHaystack[mid],!0)
return 0===cmp?mid:cmp>0?aHigh-mid>1?recursiveSearch(mid,aHigh,aNeedle,aHaystack,aCompare,aBias):aBias==exports.LEAST_UPPER_BOUND?aHigh<aHaystack.length?aHigh:-1:mid:mid-aLow>1?recursiveSearch(aLow,mid,aNeedle,aHaystack,aCompare,aBias):aBias==exports.LEAST_UPPER_BOUND?mid:aLow<0?-1:aLow}exports.GREATEST_LOWER_BOUND=1
exports.LEAST_UPPER_BOUND=2
exports.search=function(aNeedle,aHaystack,aCompare,aBias){if(0===aHaystack.length)return-1
var index=recursiveSearch(-1,aHaystack.length,aNeedle,aHaystack,aCompare,aBias||exports.GREATEST_LOWER_BOUND)
if(index<0)return-1
for(;index-1>=0&&0===aCompare(aHaystack[index],aHaystack[index-1],!0);)--index
return index}},{}],105:[function(require,module,exports){function generatedPositionAfter(mappingA,mappingB){var lineA=mappingA.generatedLine,lineB=mappingB.generatedLine,columnA=mappingA.generatedColumn,columnB=mappingB.generatedColumn
return lineB>lineA||lineB==lineA&&columnB>=columnA||util.compareByGeneratedPositionsInflated(mappingA,mappingB)<=0}function MappingList(){this._array=[]
this._sorted=!0
this._last={generatedLine:-1,generatedColumn:0}}var util=require("./util")
MappingList.prototype.unsortedForEach=function(aCallback,aThisArg){this._array.forEach(aCallback,aThisArg)}
MappingList.prototype.add=function(aMapping){if(generatedPositionAfter(this._last,aMapping)){this._last=aMapping
this._array.push(aMapping)}else{this._sorted=!1
this._array.push(aMapping)}}
MappingList.prototype.toArray=function(){if(!this._sorted){this._array.sort(util.compareByGeneratedPositionsInflated)
this._sorted=!0}return this._array}
exports.MappingList=MappingList},{"./util":110}],106:[function(require,module,exports){function swap(ary,x,y){var temp=ary[x]
ary[x]=ary[y]
ary[y]=temp}function randomIntInRange(low,high){return Math.round(low+Math.random()*(high-low))}function doQuickSort(ary,comparator,p,r){if(p<r){var i=p-1
swap(ary,randomIntInRange(p,r),r)
for(var pivot=ary[r],j=p;j<r;j++)comparator(ary[j],pivot)<=0&&swap(ary,i+=1,j)
swap(ary,i+1,j)
var q=i+1
doQuickSort(ary,comparator,p,q-1)
doQuickSort(ary,comparator,q+1,r)}}exports.quickSort=function(ary,comparator){doQuickSort(ary,comparator,0,ary.length-1)}},{}],107:[function(require,module,exports){function SourceMapConsumer(aSourceMap){var sourceMap=aSourceMap
"string"==typeof aSourceMap&&(sourceMap=JSON.parse(aSourceMap.replace(/^\)\]\}'/,"")))
return null!=sourceMap.sections?new IndexedSourceMapConsumer(sourceMap):new BasicSourceMapConsumer(sourceMap)}function BasicSourceMapConsumer(aSourceMap){var sourceMap=aSourceMap
"string"==typeof aSourceMap&&(sourceMap=JSON.parse(aSourceMap.replace(/^\)\]\}'/,"")))
var version=util.getArg(sourceMap,"version"),sources=util.getArg(sourceMap,"sources"),names=util.getArg(sourceMap,"names",[]),sourceRoot=util.getArg(sourceMap,"sourceRoot",null),sourcesContent=util.getArg(sourceMap,"sourcesContent",null),mappings=util.getArg(sourceMap,"mappings"),file=util.getArg(sourceMap,"file",null)
if(version!=this._version)throw new Error("Unsupported version: "+version)
sources=sources.map(String).map(util.normalize).map(function(source){return sourceRoot&&util.isAbsolute(sourceRoot)&&util.isAbsolute(source)?util.relative(sourceRoot,source):source})
this._names=ArraySet.fromArray(names.map(String),!0)
this._sources=ArraySet.fromArray(sources,!0)
this.sourceRoot=sourceRoot
this.sourcesContent=sourcesContent
this._mappings=mappings
this.file=file}function Mapping(){this.generatedLine=0
this.generatedColumn=0
this.source=null
this.originalLine=null
this.originalColumn=null
this.name=null}function IndexedSourceMapConsumer(aSourceMap){var sourceMap=aSourceMap
"string"==typeof aSourceMap&&(sourceMap=JSON.parse(aSourceMap.replace(/^\)\]\}'/,"")))
var version=util.getArg(sourceMap,"version"),sections=util.getArg(sourceMap,"sections")
if(version!=this._version)throw new Error("Unsupported version: "+version)
this._sources=new ArraySet
this._names=new ArraySet
var lastOffset={line:-1,column:0}
this._sections=sections.map(function(s){if(s.url)throw new Error("Support for url field in sections not implemented.")
var offset=util.getArg(s,"offset"),offsetLine=util.getArg(offset,"line"),offsetColumn=util.getArg(offset,"column")
if(offsetLine<lastOffset.line||offsetLine===lastOffset.line&&offsetColumn<lastOffset.column)throw new Error("Section offsets must be ordered and non-overlapping.")
lastOffset=offset
return{generatedOffset:{generatedLine:offsetLine+1,generatedColumn:offsetColumn+1},consumer:new SourceMapConsumer(util.getArg(s,"map"))}})}var util=require("./util"),binarySearch=require("./binary-search"),ArraySet=require("./array-set").ArraySet,base64VLQ=require("./base64-vlq"),quickSort=require("./quick-sort").quickSort
SourceMapConsumer.fromSourceMap=function(aSourceMap){return BasicSourceMapConsumer.fromSourceMap(aSourceMap)}
SourceMapConsumer.prototype._version=3
SourceMapConsumer.prototype.__generatedMappings=null
Object.defineProperty(SourceMapConsumer.prototype,"_generatedMappings",{get:function(){this.__generatedMappings||this._parseMappings(this._mappings,this.sourceRoot)
return this.__generatedMappings}})
SourceMapConsumer.prototype.__originalMappings=null
Object.defineProperty(SourceMapConsumer.prototype,"_originalMappings",{get:function(){this.__originalMappings||this._parseMappings(this._mappings,this.sourceRoot)
return this.__originalMappings}})
SourceMapConsumer.prototype._charIsMappingSeparator=function(aStr,index){var c=aStr.charAt(index)
return";"===c||","===c}
SourceMapConsumer.prototype._parseMappings=function(aStr,aSourceRoot){throw new Error("Subclasses must implement _parseMappings")}
SourceMapConsumer.GENERATED_ORDER=1
SourceMapConsumer.ORIGINAL_ORDER=2
SourceMapConsumer.GREATEST_LOWER_BOUND=1
SourceMapConsumer.LEAST_UPPER_BOUND=2
SourceMapConsumer.prototype.eachMapping=function(aCallback,aContext,aOrder){var mappings,context=aContext||null
switch(aOrder||SourceMapConsumer.GENERATED_ORDER){case SourceMapConsumer.GENERATED_ORDER:mappings=this._generatedMappings
break
case SourceMapConsumer.ORIGINAL_ORDER:mappings=this._originalMappings
break
default:throw new Error("Unknown order of iteration.")}var sourceRoot=this.sourceRoot
mappings.map(function(mapping){var source=null===mapping.source?null:this._sources.at(mapping.source)
null!=source&&null!=sourceRoot&&(source=util.join(sourceRoot,source))
return{source:source,generatedLine:mapping.generatedLine,generatedColumn:mapping.generatedColumn,originalLine:mapping.originalLine,originalColumn:mapping.originalColumn,name:null===mapping.name?null:this._names.at(mapping.name)}},this).forEach(aCallback,context)}
SourceMapConsumer.prototype.allGeneratedPositionsFor=function(aArgs){var line=util.getArg(aArgs,"line"),needle={source:util.getArg(aArgs,"source"),originalLine:line,originalColumn:util.getArg(aArgs,"column",0)}
null!=this.sourceRoot&&(needle.source=util.relative(this.sourceRoot,needle.source))
if(!this._sources.has(needle.source))return[]
needle.source=this._sources.indexOf(needle.source)
var mappings=[],index=this._findMapping(needle,this._originalMappings,"originalLine","originalColumn",util.compareByOriginalPositions,binarySearch.LEAST_UPPER_BOUND)
if(index>=0){var mapping=this._originalMappings[index]
if(void 0===aArgs.column)for(var originalLine=mapping.originalLine;mapping&&mapping.originalLine===originalLine;){mappings.push({line:util.getArg(mapping,"generatedLine",null),column:util.getArg(mapping,"generatedColumn",null),lastColumn:util.getArg(mapping,"lastGeneratedColumn",null)})
mapping=this._originalMappings[++index]}else for(var originalColumn=mapping.originalColumn;mapping&&mapping.originalLine===line&&mapping.originalColumn==originalColumn;){mappings.push({line:util.getArg(mapping,"generatedLine",null),column:util.getArg(mapping,"generatedColumn",null),lastColumn:util.getArg(mapping,"lastGeneratedColumn",null)})
mapping=this._originalMappings[++index]}}return mappings}
exports.SourceMapConsumer=SourceMapConsumer;(BasicSourceMapConsumer.prototype=Object.create(SourceMapConsumer.prototype)).consumer=SourceMapConsumer
BasicSourceMapConsumer.fromSourceMap=function(aSourceMap){var smc=Object.create(BasicSourceMapConsumer.prototype),names=smc._names=ArraySet.fromArray(aSourceMap._names.toArray(),!0),sources=smc._sources=ArraySet.fromArray(aSourceMap._sources.toArray(),!0)
smc.sourceRoot=aSourceMap._sourceRoot
smc.sourcesContent=aSourceMap._generateSourcesContent(smc._sources.toArray(),smc.sourceRoot)
smc.file=aSourceMap._file
for(var generatedMappings=aSourceMap._mappings.toArray().slice(),destGeneratedMappings=smc.__generatedMappings=[],destOriginalMappings=smc.__originalMappings=[],i=0,length=generatedMappings.length;i<length;i++){var srcMapping=generatedMappings[i],destMapping=new Mapping
destMapping.generatedLine=srcMapping.generatedLine
destMapping.generatedColumn=srcMapping.generatedColumn
if(srcMapping.source){destMapping.source=sources.indexOf(srcMapping.source)
destMapping.originalLine=srcMapping.originalLine
destMapping.originalColumn=srcMapping.originalColumn
srcMapping.name&&(destMapping.name=names.indexOf(srcMapping.name))
destOriginalMappings.push(destMapping)}destGeneratedMappings.push(destMapping)}quickSort(smc.__originalMappings,util.compareByOriginalPositions)
return smc}
BasicSourceMapConsumer.prototype._version=3
Object.defineProperty(BasicSourceMapConsumer.prototype,"sources",{get:function(){return this._sources.toArray().map(function(s){return null!=this.sourceRoot?util.join(this.sourceRoot,s):s},this)}})
BasicSourceMapConsumer.prototype._parseMappings=function(aStr,aSourceRoot){for(var mapping,str,segment,end,value,generatedLine=1,previousGeneratedColumn=0,previousOriginalLine=0,previousOriginalColumn=0,previousSource=0,previousName=0,length=aStr.length,index=0,cachedSegments={},temp={},originalMappings=[],generatedMappings=[];index<length;)if(";"===aStr.charAt(index)){generatedLine++
index++
previousGeneratedColumn=0}else if(","===aStr.charAt(index))index++
else{(mapping=new Mapping).generatedLine=generatedLine
for(end=index;end<length&&!this._charIsMappingSeparator(aStr,end);end++);if(segment=cachedSegments[str=aStr.slice(index,end)])index+=str.length
else{segment=[]
for(;index<end;){base64VLQ.decode(aStr,index,temp)
value=temp.value
index=temp.rest
segment.push(value)}if(2===segment.length)throw new Error("Found a source, but no line and column")
if(3===segment.length)throw new Error("Found a source and line, but no column")
cachedSegments[str]=segment}mapping.generatedColumn=previousGeneratedColumn+segment[0]
previousGeneratedColumn=mapping.generatedColumn
if(segment.length>1){mapping.source=previousSource+segment[1]
previousSource+=segment[1]
mapping.originalLine=previousOriginalLine+segment[2]
previousOriginalLine=mapping.originalLine
mapping.originalLine+=1
mapping.originalColumn=previousOriginalColumn+segment[3]
previousOriginalColumn=mapping.originalColumn
if(segment.length>4){mapping.name=previousName+segment[4]
previousName+=segment[4]}}generatedMappings.push(mapping)
"number"==typeof mapping.originalLine&&originalMappings.push(mapping)}quickSort(generatedMappings,util.compareByGeneratedPositionsDeflated)
this.__generatedMappings=generatedMappings
quickSort(originalMappings,util.compareByOriginalPositions)
this.__originalMappings=originalMappings}
BasicSourceMapConsumer.prototype._findMapping=function(aNeedle,aMappings,aLineName,aColumnName,aComparator,aBias){if(aNeedle[aLineName]<=0)throw new TypeError("Line must be greater than or equal to 1, got "+aNeedle[aLineName])
if(aNeedle[aColumnName]<0)throw new TypeError("Column must be greater than or equal to 0, got "+aNeedle[aColumnName])
return binarySearch.search(aNeedle,aMappings,aComparator,aBias)}
BasicSourceMapConsumer.prototype.computeColumnSpans=function(){for(var index=0;index<this._generatedMappings.length;++index){var mapping=this._generatedMappings[index]
if(index+1<this._generatedMappings.length){var nextMapping=this._generatedMappings[index+1]
if(mapping.generatedLine===nextMapping.generatedLine){mapping.lastGeneratedColumn=nextMapping.generatedColumn-1
continue}}mapping.lastGeneratedColumn=1/0}}
BasicSourceMapConsumer.prototype.originalPositionFor=function(aArgs){var needle={generatedLine:util.getArg(aArgs,"line"),generatedColumn:util.getArg(aArgs,"column")},index=this._findMapping(needle,this._generatedMappings,"generatedLine","generatedColumn",util.compareByGeneratedPositionsDeflated,util.getArg(aArgs,"bias",SourceMapConsumer.GREATEST_LOWER_BOUND))
if(index>=0){var mapping=this._generatedMappings[index]
if(mapping.generatedLine===needle.generatedLine){var source=util.getArg(mapping,"source",null)
if(null!==source){source=this._sources.at(source)
null!=this.sourceRoot&&(source=util.join(this.sourceRoot,source))}var name=util.getArg(mapping,"name",null)
null!==name&&(name=this._names.at(name))
return{source:source,line:util.getArg(mapping,"originalLine",null),column:util.getArg(mapping,"originalColumn",null),name:name}}}return{source:null,line:null,column:null,name:null}}
BasicSourceMapConsumer.prototype.hasContentsOfAllSources=function(){return!!this.sourcesContent&&(this.sourcesContent.length>=this._sources.size()&&!this.sourcesContent.some(function(sc){return null==sc}))}
BasicSourceMapConsumer.prototype.sourceContentFor=function(aSource,nullOnMissing){if(!this.sourcesContent)return null
null!=this.sourceRoot&&(aSource=util.relative(this.sourceRoot,aSource))
if(this._sources.has(aSource))return this.sourcesContent[this._sources.indexOf(aSource)]
var url
if(null!=this.sourceRoot&&(url=util.urlParse(this.sourceRoot))){var fileUriAbsPath=aSource.replace(/^file:\/\//,"")
if("file"==url.scheme&&this._sources.has(fileUriAbsPath))return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
if((!url.path||"/"==url.path)&&this._sources.has("/"+aSource))return this.sourcesContent[this._sources.indexOf("/"+aSource)]}if(nullOnMissing)return null
throw new Error('"'+aSource+'" is not in the SourceMap.')}
BasicSourceMapConsumer.prototype.generatedPositionFor=function(aArgs){var source=util.getArg(aArgs,"source")
null!=this.sourceRoot&&(source=util.relative(this.sourceRoot,source))
if(!this._sources.has(source))return{line:null,column:null,lastColumn:null}
var needle={source:source=this._sources.indexOf(source),originalLine:util.getArg(aArgs,"line"),originalColumn:util.getArg(aArgs,"column")},index=this._findMapping(needle,this._originalMappings,"originalLine","originalColumn",util.compareByOriginalPositions,util.getArg(aArgs,"bias",SourceMapConsumer.GREATEST_LOWER_BOUND))
if(index>=0){var mapping=this._originalMappings[index]
if(mapping.source===needle.source)return{line:util.getArg(mapping,"generatedLine",null),column:util.getArg(mapping,"generatedColumn",null),lastColumn:util.getArg(mapping,"lastGeneratedColumn",null)}}return{line:null,column:null,lastColumn:null}}
exports.BasicSourceMapConsumer=BasicSourceMapConsumer;(IndexedSourceMapConsumer.prototype=Object.create(SourceMapConsumer.prototype)).constructor=SourceMapConsumer
IndexedSourceMapConsumer.prototype._version=3
Object.defineProperty(IndexedSourceMapConsumer.prototype,"sources",{get:function(){for(var sources=[],i=0;i<this._sections.length;i++)for(var j=0;j<this._sections[i].consumer.sources.length;j++)sources.push(this._sections[i].consumer.sources[j])
return sources}})
IndexedSourceMapConsumer.prototype.originalPositionFor=function(aArgs){var needle={generatedLine:util.getArg(aArgs,"line"),generatedColumn:util.getArg(aArgs,"column")},sectionIndex=binarySearch.search(needle,this._sections,function(needle,section){var cmp=needle.generatedLine-section.generatedOffset.generatedLine
return cmp||needle.generatedColumn-section.generatedOffset.generatedColumn}),section=this._sections[sectionIndex]
return section?section.consumer.originalPositionFor({line:needle.generatedLine-(section.generatedOffset.generatedLine-1),column:needle.generatedColumn-(section.generatedOffset.generatedLine===needle.generatedLine?section.generatedOffset.generatedColumn-1:0),bias:aArgs.bias}):{source:null,line:null,column:null,name:null}}
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources=function(){return this._sections.every(function(s){return s.consumer.hasContentsOfAllSources()})}
IndexedSourceMapConsumer.prototype.sourceContentFor=function(aSource,nullOnMissing){for(var i=0;i<this._sections.length;i++){var content=this._sections[i].consumer.sourceContentFor(aSource,!0)
if(content)return content}if(nullOnMissing)return null
throw new Error('"'+aSource+'" is not in the SourceMap.')}
IndexedSourceMapConsumer.prototype.generatedPositionFor=function(aArgs){for(var i=0;i<this._sections.length;i++){var section=this._sections[i]
if(-1!==section.consumer.sources.indexOf(util.getArg(aArgs,"source"))){var generatedPosition=section.consumer.generatedPositionFor(aArgs)
if(generatedPosition)return{line:generatedPosition.line+(section.generatedOffset.generatedLine-1),column:generatedPosition.column+(section.generatedOffset.generatedLine===generatedPosition.line?section.generatedOffset.generatedColumn-1:0)}}}return{line:null,column:null}}
IndexedSourceMapConsumer.prototype._parseMappings=function(aStr,aSourceRoot){this.__generatedMappings=[]
this.__originalMappings=[]
for(var i=0;i<this._sections.length;i++)for(var section=this._sections[i],sectionMappings=section.consumer._generatedMappings,j=0;j<sectionMappings.length;j++){var mapping=sectionMappings[j],source=section.consumer._sources.at(mapping.source)
null!==section.consumer.sourceRoot&&(source=util.join(section.consumer.sourceRoot,source))
this._sources.add(source)
source=this._sources.indexOf(source)
var name=section.consumer._names.at(mapping.name)
this._names.add(name)
name=this._names.indexOf(name)
var adjustedMapping={source:source,generatedLine:mapping.generatedLine+(section.generatedOffset.generatedLine-1),generatedColumn:mapping.generatedColumn+(section.generatedOffset.generatedLine===mapping.generatedLine?section.generatedOffset.generatedColumn-1:0),originalLine:mapping.originalLine,originalColumn:mapping.originalColumn,name:name}
this.__generatedMappings.push(adjustedMapping)
"number"==typeof adjustedMapping.originalLine&&this.__originalMappings.push(adjustedMapping)}quickSort(this.__generatedMappings,util.compareByGeneratedPositionsDeflated)
quickSort(this.__originalMappings,util.compareByOriginalPositions)}
exports.IndexedSourceMapConsumer=IndexedSourceMapConsumer},{"./array-set":101,"./base64-vlq":102,"./binary-search":104,"./quick-sort":106,"./util":110}],108:[function(require,module,exports){function SourceMapGenerator(aArgs){aArgs||(aArgs={})
this._file=util.getArg(aArgs,"file",null)
this._sourceRoot=util.getArg(aArgs,"sourceRoot",null)
this._skipValidation=util.getArg(aArgs,"skipValidation",!1)
this._sources=new ArraySet
this._names=new ArraySet
this._mappings=new MappingList
this._sourcesContents=null}var base64VLQ=require("./base64-vlq"),util=require("./util"),ArraySet=require("./array-set").ArraySet,MappingList=require("./mapping-list").MappingList
SourceMapGenerator.prototype._version=3
SourceMapGenerator.fromSourceMap=function(aSourceMapConsumer){var sourceRoot=aSourceMapConsumer.sourceRoot,generator=new SourceMapGenerator({file:aSourceMapConsumer.file,sourceRoot:sourceRoot})
aSourceMapConsumer.eachMapping(function(mapping){var newMapping={generated:{line:mapping.generatedLine,column:mapping.generatedColumn}}
if(null!=mapping.source){newMapping.source=mapping.source
null!=sourceRoot&&(newMapping.source=util.relative(sourceRoot,newMapping.source))
newMapping.original={line:mapping.originalLine,column:mapping.originalColumn}
null!=mapping.name&&(newMapping.name=mapping.name)}generator.addMapping(newMapping)})
aSourceMapConsumer.sources.forEach(function(sourceFile){var content=aSourceMapConsumer.sourceContentFor(sourceFile)
null!=content&&generator.setSourceContent(sourceFile,content)})
return generator}
SourceMapGenerator.prototype.addMapping=function(aArgs){var generated=util.getArg(aArgs,"generated"),original=util.getArg(aArgs,"original",null),source=util.getArg(aArgs,"source",null),name=util.getArg(aArgs,"name",null)
this._skipValidation||this._validateMapping(generated,original,source,name)
if(null!=source){source=String(source)
this._sources.has(source)||this._sources.add(source)}if(null!=name){name=String(name)
this._names.has(name)||this._names.add(name)}this._mappings.add({generatedLine:generated.line,generatedColumn:generated.column,originalLine:null!=original&&original.line,originalColumn:null!=original&&original.column,source:source,name:name})}
SourceMapGenerator.prototype.setSourceContent=function(aSourceFile,aSourceContent){var source=aSourceFile
null!=this._sourceRoot&&(source=util.relative(this._sourceRoot,source))
if(null!=aSourceContent){this._sourcesContents||(this._sourcesContents=Object.create(null))
this._sourcesContents[util.toSetString(source)]=aSourceContent}else if(this._sourcesContents){delete this._sourcesContents[util.toSetString(source)]
0===Object.keys(this._sourcesContents).length&&(this._sourcesContents=null)}}
SourceMapGenerator.prototype.applySourceMap=function(aSourceMapConsumer,aSourceFile,aSourceMapPath){var sourceFile=aSourceFile
if(null==aSourceFile){if(null==aSourceMapConsumer.file)throw new Error('SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map\'s "file" property. Both were omitted.')
sourceFile=aSourceMapConsumer.file}var sourceRoot=this._sourceRoot
null!=sourceRoot&&(sourceFile=util.relative(sourceRoot,sourceFile))
var newSources=new ArraySet,newNames=new ArraySet
this._mappings.unsortedForEach(function(mapping){if(mapping.source===sourceFile&&null!=mapping.originalLine){var original=aSourceMapConsumer.originalPositionFor({line:mapping.originalLine,column:mapping.originalColumn})
if(null!=original.source){mapping.source=original.source
null!=aSourceMapPath&&(mapping.source=util.join(aSourceMapPath,mapping.source))
null!=sourceRoot&&(mapping.source=util.relative(sourceRoot,mapping.source))
mapping.originalLine=original.line
mapping.originalColumn=original.column
null!=original.name&&(mapping.name=original.name)}}var source=mapping.source
null==source||newSources.has(source)||newSources.add(source)
var name=mapping.name
null==name||newNames.has(name)||newNames.add(name)},this)
this._sources=newSources
this._names=newNames
aSourceMapConsumer.sources.forEach(function(sourceFile){var content=aSourceMapConsumer.sourceContentFor(sourceFile)
if(null!=content){null!=aSourceMapPath&&(sourceFile=util.join(aSourceMapPath,sourceFile))
null!=sourceRoot&&(sourceFile=util.relative(sourceRoot,sourceFile))
this.setSourceContent(sourceFile,content)}},this)}
SourceMapGenerator.prototype._validateMapping=function(aGenerated,aOriginal,aSource,aName){if((!(aGenerated&&"line"in aGenerated&&"column"in aGenerated&&aGenerated.line>0&&aGenerated.column>=0)||aOriginal||aSource||aName)&&!(aGenerated&&"line"in aGenerated&&"column"in aGenerated&&aOriginal&&"line"in aOriginal&&"column"in aOriginal&&aGenerated.line>0&&aGenerated.column>=0&&aOriginal.line>0&&aOriginal.column>=0&&aSource))throw new Error("Invalid mapping: "+JSON.stringify({generated:aGenerated,source:aSource,original:aOriginal,name:aName}))}
SourceMapGenerator.prototype._serializeMappings=function(){for(var next,mapping,nameIdx,sourceIdx,previousGeneratedColumn=0,previousGeneratedLine=1,previousOriginalColumn=0,previousOriginalLine=0,previousName=0,previousSource=0,result="",mappings=this._mappings.toArray(),i=0,len=mappings.length;i<len;i++){next=""
if((mapping=mappings[i]).generatedLine!==previousGeneratedLine){previousGeneratedColumn=0
for(;mapping.generatedLine!==previousGeneratedLine;){next+=";"
previousGeneratedLine++}}else if(i>0){if(!util.compareByGeneratedPositionsInflated(mapping,mappings[i-1]))continue
next+=","}next+=base64VLQ.encode(mapping.generatedColumn-previousGeneratedColumn)
previousGeneratedColumn=mapping.generatedColumn
if(null!=mapping.source){sourceIdx=this._sources.indexOf(mapping.source)
next+=base64VLQ.encode(sourceIdx-previousSource)
previousSource=sourceIdx
next+=base64VLQ.encode(mapping.originalLine-1-previousOriginalLine)
previousOriginalLine=mapping.originalLine-1
next+=base64VLQ.encode(mapping.originalColumn-previousOriginalColumn)
previousOriginalColumn=mapping.originalColumn
if(null!=mapping.name){nameIdx=this._names.indexOf(mapping.name)
next+=base64VLQ.encode(nameIdx-previousName)
previousName=nameIdx}}result+=next}return result}
SourceMapGenerator.prototype._generateSourcesContent=function(aSources,aSourceRoot){return aSources.map(function(source){if(!this._sourcesContents)return null
null!=aSourceRoot&&(source=util.relative(aSourceRoot,source))
var key=util.toSetString(source)
return Object.prototype.hasOwnProperty.call(this._sourcesContents,key)?this._sourcesContents[key]:null},this)}
SourceMapGenerator.prototype.toJSON=function(){var map={version:this._version,sources:this._sources.toArray(),names:this._names.toArray(),mappings:this._serializeMappings()}
null!=this._file&&(map.file=this._file)
null!=this._sourceRoot&&(map.sourceRoot=this._sourceRoot)
this._sourcesContents&&(map.sourcesContent=this._generateSourcesContent(map.sources,map.sourceRoot))
return map}
SourceMapGenerator.prototype.toString=function(){return JSON.stringify(this.toJSON())}
exports.SourceMapGenerator=SourceMapGenerator},{"./array-set":101,"./base64-vlq":102,"./mapping-list":105,"./util":110}],109:[function(require,module,exports){function SourceNode(aLine,aColumn,aSource,aChunks,aName){this.children=[]
this.sourceContents={}
this.line=null==aLine?null:aLine
this.column=null==aColumn?null:aColumn
this.source=null==aSource?null:aSource
this.name=null==aName?null:aName
this[isSourceNode]=!0
null!=aChunks&&this.add(aChunks)}var SourceMapGenerator=require("./source-map-generator").SourceMapGenerator,util=require("./util"),REGEX_NEWLINE=/(\r?\n)/,isSourceNode="$$$isSourceNode$$$"
SourceNode.fromStringWithSourceMap=function(aGeneratedCode,aSourceMapConsumer,aRelativePath){function addMappingWithCode(mapping,code){if(null===mapping||void 0===mapping.source)node.add(code)
else{var source=aRelativePath?util.join(aRelativePath,mapping.source):mapping.source
node.add(new SourceNode(mapping.originalLine,mapping.originalColumn,source,code,mapping.name))}}var node=new SourceNode,remainingLines=aGeneratedCode.split(REGEX_NEWLINE),shiftNextLine=function(){return remainingLines.shift()+(remainingLines.shift()||"")},lastGeneratedLine=1,lastGeneratedColumn=0,lastMapping=null
aSourceMapConsumer.eachMapping(function(mapping){if(null!==lastMapping){if(!(lastGeneratedLine<mapping.generatedLine)){var code=(nextLine=remainingLines[0]).substr(0,mapping.generatedColumn-lastGeneratedColumn)
remainingLines[0]=nextLine.substr(mapping.generatedColumn-lastGeneratedColumn)
lastGeneratedColumn=mapping.generatedColumn
addMappingWithCode(lastMapping,code)
lastMapping=mapping
return}addMappingWithCode(lastMapping,shiftNextLine())
lastGeneratedLine++
lastGeneratedColumn=0}for(;lastGeneratedLine<mapping.generatedLine;){node.add(shiftNextLine())
lastGeneratedLine++}if(lastGeneratedColumn<mapping.generatedColumn){var nextLine=remainingLines[0]
node.add(nextLine.substr(0,mapping.generatedColumn))
remainingLines[0]=nextLine.substr(mapping.generatedColumn)
lastGeneratedColumn=mapping.generatedColumn}lastMapping=mapping},this)
if(remainingLines.length>0){lastMapping&&addMappingWithCode(lastMapping,shiftNextLine())
node.add(remainingLines.join(""))}aSourceMapConsumer.sources.forEach(function(sourceFile){var content=aSourceMapConsumer.sourceContentFor(sourceFile)
if(null!=content){null!=aRelativePath&&(sourceFile=util.join(aRelativePath,sourceFile))
node.setSourceContent(sourceFile,content)}})
return node}
SourceNode.prototype.add=function(aChunk){if(Array.isArray(aChunk))aChunk.forEach(function(chunk){this.add(chunk)},this)
else{if(!aChunk[isSourceNode]&&"string"!=typeof aChunk)throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got "+aChunk)
aChunk&&this.children.push(aChunk)}return this}
SourceNode.prototype.prepend=function(aChunk){if(Array.isArray(aChunk))for(var i=aChunk.length-1;i>=0;i--)this.prepend(aChunk[i])
else{if(!aChunk[isSourceNode]&&"string"!=typeof aChunk)throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got "+aChunk)
this.children.unshift(aChunk)}return this}
SourceNode.prototype.walk=function(aFn){for(var chunk,i=0,len=this.children.length;i<len;i++)(chunk=this.children[i])[isSourceNode]?chunk.walk(aFn):""!==chunk&&aFn(chunk,{source:this.source,line:this.line,column:this.column,name:this.name})}
SourceNode.prototype.join=function(aSep){var newChildren,i,len=this.children.length
if(len>0){newChildren=[]
for(i=0;i<len-1;i++){newChildren.push(this.children[i])
newChildren.push(aSep)}newChildren.push(this.children[i])
this.children=newChildren}return this}
SourceNode.prototype.replaceRight=function(aPattern,aReplacement){var lastChild=this.children[this.children.length-1]
lastChild[isSourceNode]?lastChild.replaceRight(aPattern,aReplacement):"string"==typeof lastChild?this.children[this.children.length-1]=lastChild.replace(aPattern,aReplacement):this.children.push("".replace(aPattern,aReplacement))
return this}
SourceNode.prototype.setSourceContent=function(aSourceFile,aSourceContent){this.sourceContents[util.toSetString(aSourceFile)]=aSourceContent}
SourceNode.prototype.walkSourceContents=function(aFn){for(var i=0,len=this.children.length;i<len;i++)this.children[i][isSourceNode]&&this.children[i].walkSourceContents(aFn)
for(var sources=Object.keys(this.sourceContents),i=0,len=sources.length;i<len;i++)aFn(util.fromSetString(sources[i]),this.sourceContents[sources[i]])}
SourceNode.prototype.toString=function(){var str=""
this.walk(function(chunk){str+=chunk})
return str}
SourceNode.prototype.toStringWithSourceMap=function(aArgs){var generated={code:"",line:1,column:0},map=new SourceMapGenerator(aArgs),sourceMappingActive=!1,lastOriginalSource=null,lastOriginalLine=null,lastOriginalColumn=null,lastOriginalName=null
this.walk(function(chunk,original){generated.code+=chunk
if(null!==original.source&&null!==original.line&&null!==original.column){lastOriginalSource===original.source&&lastOriginalLine===original.line&&lastOriginalColumn===original.column&&lastOriginalName===original.name||map.addMapping({source:original.source,original:{line:original.line,column:original.column},generated:{line:generated.line,column:generated.column},name:original.name})
lastOriginalSource=original.source
lastOriginalLine=original.line
lastOriginalColumn=original.column
lastOriginalName=original.name
sourceMappingActive=!0}else if(sourceMappingActive){map.addMapping({generated:{line:generated.line,column:generated.column}})
lastOriginalSource=null
sourceMappingActive=!1}for(var idx=0,length=chunk.length;idx<length;idx++)if(10===chunk.charCodeAt(idx)){generated.line++
generated.column=0
if(idx+1===length){lastOriginalSource=null
sourceMappingActive=!1}else sourceMappingActive&&map.addMapping({source:original.source,original:{line:original.line,column:original.column},generated:{line:generated.line,column:generated.column},name:original.name})}else generated.column++})
this.walkSourceContents(function(sourceFile,sourceContent){map.setSourceContent(sourceFile,sourceContent)})
return{code:generated.code,map:map}}
exports.SourceNode=SourceNode},{"./source-map-generator":108,"./util":110}],110:[function(require,module,exports){function urlParse(aUrl){var match=aUrl.match(urlRegexp)
return match?{scheme:match[1],auth:match[2],host:match[3],port:match[4],path:match[5]}:null}function urlGenerate(aParsedUrl){var url=""
aParsedUrl.scheme&&(url+=aParsedUrl.scheme+":")
url+="//"
aParsedUrl.auth&&(url+=aParsedUrl.auth+"@")
aParsedUrl.host&&(url+=aParsedUrl.host)
aParsedUrl.port&&(url+=":"+aParsedUrl.port)
aParsedUrl.path&&(url+=aParsedUrl.path)
return url}function normalize(aPath){var path=aPath,url=urlParse(aPath)
if(url){if(!url.path)return aPath
path=url.path}for(var part,isAbsolute=exports.isAbsolute(path),parts=path.split(/\/+/),up=0,i=parts.length-1;i>=0;i--)if("."===(part=parts[i]))parts.splice(i,1)
else if(".."===part)up++
else if(up>0)if(""===part){parts.splice(i+1,up)
up=0}else{parts.splice(i,2)
up--}""===(path=parts.join("/"))&&(path=isAbsolute?"/":".")
if(url){url.path=path
return urlGenerate(url)}return path}function identity(s){return s}function isProtoString(s){if(!s)return!1
var length=s.length
if(length<9)return!1
if(95!==s.charCodeAt(length-1)||95!==s.charCodeAt(length-2)||111!==s.charCodeAt(length-3)||116!==s.charCodeAt(length-4)||111!==s.charCodeAt(length-5)||114!==s.charCodeAt(length-6)||112!==s.charCodeAt(length-7)||95!==s.charCodeAt(length-8)||95!==s.charCodeAt(length-9))return!1
for(var i=length-10;i>=0;i--)if(36!==s.charCodeAt(i))return!1
return!0}function strcmp(aStr1,aStr2){return aStr1===aStr2?0:aStr1>aStr2?1:-1}exports.getArg=function(aArgs,aName,aDefaultValue){if(aName in aArgs)return aArgs[aName]
if(3===arguments.length)return aDefaultValue
throw new Error('"'+aName+'" is a required argument.')}
var urlRegexp=/^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/,dataUrlRegexp=/^data:.+\,.+$/
exports.urlParse=urlParse
exports.urlGenerate=urlGenerate
exports.normalize=normalize
exports.join=function(aRoot,aPath){""===aRoot&&(aRoot=".")
""===aPath&&(aPath=".")
var aPathUrl=urlParse(aPath),aRootUrl=urlParse(aRoot)
aRootUrl&&(aRoot=aRootUrl.path||"/")
if(aPathUrl&&!aPathUrl.scheme){aRootUrl&&(aPathUrl.scheme=aRootUrl.scheme)
return urlGenerate(aPathUrl)}if(aPathUrl||aPath.match(dataUrlRegexp))return aPath
if(aRootUrl&&!aRootUrl.host&&!aRootUrl.path){aRootUrl.host=aPath
return urlGenerate(aRootUrl)}var joined="/"===aPath.charAt(0)?aPath:normalize(aRoot.replace(/\/+$/,"")+"/"+aPath)
if(aRootUrl){aRootUrl.path=joined
return urlGenerate(aRootUrl)}return joined}
exports.isAbsolute=function(aPath){return"/"===aPath.charAt(0)||!!aPath.match(urlRegexp)}
exports.relative=function(aRoot,aPath){""===aRoot&&(aRoot=".")
aRoot=aRoot.replace(/\/$/,"")
for(var level=0;0!==aPath.indexOf(aRoot+"/");){var index=aRoot.lastIndexOf("/")
if(index<0)return aPath
if((aRoot=aRoot.slice(0,index)).match(/^([^\/]+:\/)?\/*$/))return aPath;++level}return Array(level+1).join("../")+aPath.substr(aRoot.length+1)}
var supportsNullProto=!("__proto__"in Object.create(null))
exports.toSetString=supportsNullProto?identity:function(aStr){return isProtoString(aStr)?"$"+aStr:aStr}
exports.fromSetString=supportsNullProto?identity:function(aStr){return isProtoString(aStr)?aStr.slice(1):aStr}
exports.compareByOriginalPositions=function(mappingA,mappingB,onlyCompareOriginal){var cmp=mappingA.source-mappingB.source
return 0!==cmp?cmp:0!=(cmp=mappingA.originalLine-mappingB.originalLine)?cmp:0!=(cmp=mappingA.originalColumn-mappingB.originalColumn)||onlyCompareOriginal?cmp:0!=(cmp=mappingA.generatedColumn-mappingB.generatedColumn)?cmp:0!=(cmp=mappingA.generatedLine-mappingB.generatedLine)?cmp:mappingA.name-mappingB.name}
exports.compareByGeneratedPositionsDeflated=function(mappingA,mappingB,onlyCompareGenerated){var cmp=mappingA.generatedLine-mappingB.generatedLine
return 0!==cmp?cmp:0!=(cmp=mappingA.generatedColumn-mappingB.generatedColumn)||onlyCompareGenerated?cmp:0!=(cmp=mappingA.source-mappingB.source)?cmp:0!=(cmp=mappingA.originalLine-mappingB.originalLine)?cmp:0!=(cmp=mappingA.originalColumn-mappingB.originalColumn)?cmp:mappingA.name-mappingB.name}
exports.compareByGeneratedPositionsInflated=function(mappingA,mappingB){var cmp=mappingA.generatedLine-mappingB.generatedLine
return 0!==cmp?cmp:0!=(cmp=mappingA.generatedColumn-mappingB.generatedColumn)?cmp:0!==(cmp=strcmp(mappingA.source,mappingB.source))?cmp:0!=(cmp=mappingA.originalLine-mappingB.originalLine)?cmp:0!=(cmp=mappingA.originalColumn-mappingB.originalColumn)?cmp:strcmp(mappingA.name,mappingB.name)}},{}],111:[function(require,module,exports){exports.SourceMapGenerator=require("./lib/source-map-generator").SourceMapGenerator
exports.SourceMapConsumer=require("./lib/source-map-consumer").SourceMapConsumer
exports.SourceNode=require("./lib/source-node").SourceNode},{"./lib/source-map-consumer":107,"./lib/source-map-generator":108,"./lib/source-node":109}]},{},[2])(2)})
