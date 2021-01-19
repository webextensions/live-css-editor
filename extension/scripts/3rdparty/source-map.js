!function(root,factory){"object"==typeof exports&&"object"==typeof module?module.exports=factory():"function"==typeof define&&define.amd?define([],factory):"object"==typeof exports?exports.sourceMap=factory():root.sourceMap=factory()}(this,function(){return function(modules){var installedModules={}
function __webpack_require__(moduleId){if(installedModules[moduleId])return installedModules[moduleId].exports
var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:!1}
modules[moduleId].call(module.exports,module,module.exports,__webpack_require__)
module.loaded=!0
return module.exports}__webpack_require__.m=modules
__webpack_require__.c=installedModules
__webpack_require__.p=""
return __webpack_require__(0)}([function(module,exports,__webpack_require__){exports.SourceMapGenerator=__webpack_require__(1).SourceMapGenerator
exports.SourceMapConsumer=__webpack_require__(7).SourceMapConsumer
exports.SourceNode=__webpack_require__(10).SourceNode},function(module,exports,__webpack_require__){var base64VLQ=__webpack_require__(2),util=__webpack_require__(4),ArraySet=__webpack_require__(5).ArraySet,MappingList=__webpack_require__(6).MappingList
function SourceMapGenerator(aArgs){aArgs=aArgs||{}
this._file=util.getArg(aArgs,"file",null)
this._sourceRoot=util.getArg(aArgs,"sourceRoot",null)
this._skipValidation=util.getArg(aArgs,"skipValidation",!1)
this._sources=new ArraySet
this._names=new ArraySet
this._mappings=new MappingList
this._sourcesContents=null}SourceMapGenerator.prototype._version=3
SourceMapGenerator.fromSourceMap=function(aSourceMapConsumer){var sourceRoot=aSourceMapConsumer.sourceRoot,generator=new SourceMapGenerator({file:aSourceMapConsumer.file,sourceRoot:sourceRoot})
aSourceMapConsumer.eachMapping(function(mapping){var newMapping={generated:{line:mapping.generatedLine,column:mapping.generatedColumn}}
if(null!=mapping.source){newMapping.source=mapping.source
null!=sourceRoot&&(newMapping.source=util.relative(sourceRoot,newMapping.source))
newMapping.original={line:mapping.originalLine,column:mapping.originalColumn}
null!=mapping.name&&(newMapping.name=mapping.name)}generator.addMapping(newMapping)})
aSourceMapConsumer.sources.forEach(function(sourceFile){var content=sourceFile
null!==sourceRoot&&(content=util.relative(sourceRoot,sourceFile))
generator._sources.has(content)||generator._sources.add(content)
content=aSourceMapConsumer.sourceContentFor(sourceFile)
null!=content&&generator.setSourceContent(sourceFile,content)})
return generator}
SourceMapGenerator.prototype.addMapping=function(name){var generated=util.getArg(name,"generated"),original=util.getArg(name,"original",null),source=util.getArg(name,"source",null),name=util.getArg(name,"name",null)
this._skipValidation||this._validateMapping(generated,original,source,name)
if(null!=source){source=String(source)
this._sources.has(source)||this._sources.add(source)}if(null!=name){name=String(name)
this._names.has(name)||this._names.add(name)}this._mappings.add({generatedLine:generated.line,generatedColumn:generated.column,originalLine:null!=original&&original.line,originalColumn:null!=original&&original.column,source:source,name:name})}
SourceMapGenerator.prototype.setSourceContent=function(source,aSourceContent){null!=this._sourceRoot&&(source=util.relative(this._sourceRoot,source))
if(null!=aSourceContent){this._sourcesContents||(this._sourcesContents=Object.create(null))
this._sourcesContents[util.toSetString(source)]=aSourceContent}else if(this._sourcesContents){delete this._sourcesContents[util.toSetString(source)]
0===Object.keys(this._sourcesContents).length&&(this._sourcesContents=null)}}
SourceMapGenerator.prototype.applySourceMap=function(aSourceMapConsumer,aSourceFile,aSourceMapPath){var sourceFile=aSourceFile
if(null==aSourceFile){if(null==aSourceMapConsumer.file)throw new Error('SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, or the source map\'s "file" property. Both were omitted.')
sourceFile=aSourceMapConsumer.file}var sourceRoot=this._sourceRoot
null!=sourceRoot&&(sourceFile=util.relative(sourceRoot,sourceFile))
var newSources=new ArraySet,newNames=new ArraySet
this._mappings.unsortedForEach(function(name){if(name.source===sourceFile&&null!=name.originalLine){var source=aSourceMapConsumer.originalPositionFor({line:name.originalLine,column:name.originalColumn})
if(null!=source.source){name.source=source.source
null!=aSourceMapPath&&(name.source=util.join(aSourceMapPath,name.source))
null!=sourceRoot&&(name.source=util.relative(sourceRoot,name.source))
name.originalLine=source.line
name.originalColumn=source.column
null!=source.name&&(name.name=source.name)}}source=name.source
null==source||newSources.has(source)||newSources.add(source)
name=name.name
null==name||newNames.has(name)||newNames.add(name)},this)
this._sources=newSources
this._names=newNames
aSourceMapConsumer.sources.forEach(function(sourceFile){var content=aSourceMapConsumer.sourceContentFor(sourceFile)
if(null!=content){null!=aSourceMapPath&&(sourceFile=util.join(aSourceMapPath,sourceFile))
null!=sourceRoot&&(sourceFile=util.relative(sourceRoot,sourceFile))
this.setSourceContent(sourceFile,content)}},this)}
SourceMapGenerator.prototype._validateMapping=function(aGenerated,aOriginal,aSource,aName){if(aOriginal&&"number"!=typeof aOriginal.line&&"number"!=typeof aOriginal.column)throw new Error("original.line and original.column are not numbers -- you probably meant to omit the original mapping entirely and only map the generated position. If so, pass null for the original mapping instead of an object with empty or null values.")
if((!(aGenerated&&"line"in aGenerated&&"column"in aGenerated&&0<aGenerated.line&&0<=aGenerated.column)||aOriginal||aSource||aName)&&!(aGenerated&&"line"in aGenerated&&"column"in aGenerated&&aOriginal&&"line"in aOriginal&&"column"in aOriginal&&0<aGenerated.line&&0<=aGenerated.column&&0<aOriginal.line&&0<=aOriginal.column&&aSource))throw new Error("Invalid mapping: "+JSON.stringify({generated:aGenerated,source:aSource,original:aOriginal,name:aName}))}
SourceMapGenerator.prototype._serializeMappings=function(){for(var next,mapping,nameIdx,previousGeneratedColumn=0,previousGeneratedLine=1,previousOriginalColumn=0,previousOriginalLine=0,previousName=0,previousSource=0,result="",mappings=this._mappings.toArray(),i=0,len=mappings.length;i<len;i++){next=""
if((mapping=mappings[i]).generatedLine!==previousGeneratedLine){previousGeneratedColumn=0
for(;mapping.generatedLine!==previousGeneratedLine;){next+=";"
previousGeneratedLine++}}else if(0<i){if(!util.compareByGeneratedPositionsInflated(mapping,mappings[i-1]))continue
next+=","}next+=base64VLQ.encode(mapping.generatedColumn-previousGeneratedColumn)
previousGeneratedColumn=mapping.generatedColumn
if(null!=mapping.source){nameIdx=this._sources.indexOf(mapping.source)
next+=base64VLQ.encode(nameIdx-previousSource)
previousSource=nameIdx
next+=base64VLQ.encode(mapping.originalLine-1-previousOriginalLine)
previousOriginalLine=mapping.originalLine-1
next+=base64VLQ.encode(mapping.originalColumn-previousOriginalColumn)
previousOriginalColumn=mapping.originalColumn
if(null!=mapping.name){nameIdx=this._names.indexOf(mapping.name)
next+=base64VLQ.encode(nameIdx-previousName)
previousName=nameIdx}}result+=next}return result}
SourceMapGenerator.prototype._generateSourcesContent=function(aSources,aSourceRoot){return aSources.map(function(key){if(!this._sourcesContents)return null
null!=aSourceRoot&&(key=util.relative(aSourceRoot,key))
key=util.toSetString(key)
return Object.prototype.hasOwnProperty.call(this._sourcesContents,key)?this._sourcesContents[key]:null},this)}
SourceMapGenerator.prototype.toJSON=function(){var map={version:this._version,sources:this._sources.toArray(),names:this._names.toArray(),mappings:this._serializeMappings()}
null!=this._file&&(map.file=this._file)
null!=this._sourceRoot&&(map.sourceRoot=this._sourceRoot)
this._sourcesContents&&(map.sourcesContent=this._generateSourcesContent(map.sources,map.sourceRoot))
return map}
SourceMapGenerator.prototype.toString=function(){return JSON.stringify(this.toJSON())}
exports.SourceMapGenerator=SourceMapGenerator},function(module,exports,__webpack_require__){var base64=__webpack_require__(3)
exports.encode=function(aValue){for(var digit,encoded="",vlq=function(aValue){return aValue<0?1+(-aValue<<1):aValue<<1}(aValue);digit=31&vlq,0<(vlq>>>=5)&&(digit|=32),encoded+=base64.encode(digit),0<vlq;);return encoded}
exports.decode=function(aStr,aIndex,aOutParam){var continuation,digit,aValue,shifted,strLen=aStr.length,result=0,shift=0
do{if(strLen<=aIndex)throw new Error("Expected more digits in base 64 VLQ value.")
if(-1===(digit=base64.decode(aStr.charCodeAt(aIndex++))))throw new Error("Invalid base64 digit: "+aStr.charAt(aIndex-1))}while(continuation=!!(32&digit),result+=(digit&=31)<<shift,shift+=5,continuation)
aOutParam.value=(shifted=(aValue=result)>>1,1==(1&aValue)?-shifted:shifted)
aOutParam.rest=aIndex}},function(module,exports){var intToCharMap="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("")
exports.encode=function(number){if(0<=number&&number<intToCharMap.length)return intToCharMap[number]
throw new TypeError("Must be between 0 and 63: "+number)}
exports.decode=function(charCode){return 65<=charCode&&charCode<=90?charCode-65:97<=charCode&&charCode<=122?charCode-97+26:48<=charCode&&charCode<=57?charCode-48+52:43==charCode?62:47==charCode?63:-1}},function(module,exports){exports.getArg=function(aArgs,aName,aDefaultValue){if(aName in aArgs)return aArgs[aName]
if(3===arguments.length)return aDefaultValue
throw new Error('"'+aName+'" is a required argument.')}
var urlRegexp=/^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/,dataUrlRegexp=/^data:.+\,.+$/
function urlParse(match){match=match.match(urlRegexp)
return match?{scheme:match[1],auth:match[2],host:match[3],port:match[4],path:match[5]}:null}exports.urlParse=urlParse
function urlGenerate(aParsedUrl){var url=""
aParsedUrl.scheme&&(url+=aParsedUrl.scheme+":")
url+="//"
aParsedUrl.auth&&(url+=aParsedUrl.auth+"@")
aParsedUrl.host&&(url+=aParsedUrl.host)
aParsedUrl.port&&(url+=":"+aParsedUrl.port)
aParsedUrl.path&&(url+=aParsedUrl.path)
return url}exports.urlGenerate=urlGenerate
function normalize(isAbsolute){var path=isAbsolute,url=urlParse(isAbsolute)
if(url){if(!url.path)return isAbsolute
path=url.path}for(var part,isAbsolute=exports.isAbsolute(path),parts=path.split(/\/+/),up=0,i=parts.length-1;0<=i;i--)if("."===(part=parts[i]))parts.splice(i,1)
else if(".."===part)up++
else if(0<up)if(""===part){parts.splice(i+1,up)
up=0}else{parts.splice(i,2)
up--}""===(path=parts.join("/"))&&(path=isAbsolute?"/":".")
if(url){url.path=path
return urlGenerate(url)}return path}exports.normalize=normalize
function join(aRoot,joined){""===aRoot&&(aRoot=".")
""===joined&&(joined=".")
var aPathUrl=urlParse(joined),aRootUrl=urlParse(aRoot)
aRootUrl&&(aRoot=aRootUrl.path||"/")
if(aPathUrl&&!aPathUrl.scheme){aRootUrl&&(aPathUrl.scheme=aRootUrl.scheme)
return urlGenerate(aPathUrl)}if(aPathUrl||joined.match(dataUrlRegexp))return joined
if(aRootUrl&&!aRootUrl.host&&!aRootUrl.path){aRootUrl.host=joined
return urlGenerate(aRootUrl)}joined="/"===joined.charAt(0)?joined:normalize(aRoot.replace(/\/+$/,"")+"/"+joined)
if(aRootUrl){aRootUrl.path=joined
return urlGenerate(aRootUrl)}return joined}exports.join=join
exports.isAbsolute=function(aPath){return"/"===aPath.charAt(0)||urlRegexp.test(aPath)}
exports.relative=function(aRoot,aPath){""===aRoot&&(aRoot=".")
aRoot=aRoot.replace(/\/$/,"")
for(var level=0;0!==aPath.indexOf(aRoot+"/");){var index=aRoot.lastIndexOf("/")
if(index<0)return aPath
if((aRoot=aRoot.slice(0,index)).match(/^([^\/]+:\/)?\/*$/))return aPath;++level}return Array(level+1).join("../")+aPath.substr(aRoot.length+1)}
var supportsNullProto=!("__proto__"in Object.create(null))
function identity(s){return s}exports.toSetString=supportsNullProto?identity:function(aStr){return isProtoString(aStr)?"$"+aStr:aStr}
exports.fromSetString=supportsNullProto?identity:function(aStr){return isProtoString(aStr)?aStr.slice(1):aStr}
function isProtoString(s){if(s){var length=s.length
if(!(length<9)&&95===s.charCodeAt(length-1)&&95===s.charCodeAt(length-2)&&111===s.charCodeAt(length-3)&&116===s.charCodeAt(length-4)&&111===s.charCodeAt(length-5)&&114===s.charCodeAt(length-6)&&112===s.charCodeAt(length-7)&&95===s.charCodeAt(length-8)&&95===s.charCodeAt(length-9)){for(var i=length-10;0<=i;i--)if(36!==s.charCodeAt(i))return
return 1}}}exports.compareByOriginalPositions=function(mappingA,mappingB,onlyCompareOriginal){var cmp=strcmp(mappingA.source,mappingB.source)
return 0!==cmp||0!==(cmp=mappingA.originalLine-mappingB.originalLine)||0!==(cmp=mappingA.originalColumn-mappingB.originalColumn)||onlyCompareOriginal||0!==(cmp=mappingA.generatedColumn-mappingB.generatedColumn)||0!==(cmp=mappingA.generatedLine-mappingB.generatedLine)?cmp:strcmp(mappingA.name,mappingB.name)}
exports.compareByGeneratedPositionsDeflated=function(mappingA,mappingB,onlyCompareGenerated){var cmp=mappingA.generatedLine-mappingB.generatedLine
return 0!==cmp||0!==(cmp=mappingA.generatedColumn-mappingB.generatedColumn)||onlyCompareGenerated||0!==(cmp=strcmp(mappingA.source,mappingB.source))||0!==(cmp=mappingA.originalLine-mappingB.originalLine)||0!==(cmp=mappingA.originalColumn-mappingB.originalColumn)?cmp:strcmp(mappingA.name,mappingB.name)}
function strcmp(aStr1,aStr2){return aStr1===aStr2?0:null===aStr1||null!==aStr2&&aStr2<aStr1?1:-1}exports.compareByGeneratedPositionsInflated=function(mappingA,mappingB){var cmp=mappingA.generatedLine-mappingB.generatedLine
return 0!==cmp||0!==(cmp=mappingA.generatedColumn-mappingB.generatedColumn)||0!==(cmp=strcmp(mappingA.source,mappingB.source))||0!==(cmp=mappingA.originalLine-mappingB.originalLine)||0!==(cmp=mappingA.originalColumn-mappingB.originalColumn)?cmp:strcmp(mappingA.name,mappingB.name)}
exports.parseSourceMapInput=function(str){return JSON.parse(str.replace(/^\)]}'[^\n]*\n/,""))}
exports.computeSourceURL=function(parsed,sourceURL,index){sourceURL=sourceURL||""
if(parsed){"/"!==parsed[parsed.length-1]&&"/"!==sourceURL[0]&&(parsed+="/")
sourceURL=parsed+sourceURL}if(index){parsed=urlParse(index)
if(!parsed)throw new Error("sourceMapURL could not be parsed")
if(parsed.path){index=parsed.path.lastIndexOf("/")
0<=index&&(parsed.path=parsed.path.substring(0,index+1))}sourceURL=join(urlGenerate(parsed),sourceURL)}return normalize(sourceURL)}},function(module,exports,__webpack_require__){var util=__webpack_require__(4),has=Object.prototype.hasOwnProperty,hasNativeMap="undefined"!=typeof Map
function ArraySet(){this._array=[]
this._set=hasNativeMap?new Map:Object.create(null)}ArraySet.fromArray=function(aArray,aAllowDuplicates){for(var set=new ArraySet,i=0,len=aArray.length;i<len;i++)set.add(aArray[i],aAllowDuplicates)
return set}
ArraySet.prototype.size=function(){return hasNativeMap?this._set.size:Object.getOwnPropertyNames(this._set).length}
ArraySet.prototype.add=function(aStr,aAllowDuplicates){var sStr=hasNativeMap?aStr:util.toSetString(aStr),isDuplicate=hasNativeMap?this.has(aStr):has.call(this._set,sStr),idx=this._array.length
isDuplicate&&!aAllowDuplicates||this._array.push(aStr)
isDuplicate||(hasNativeMap?this._set.set(aStr,idx):this._set[sStr]=idx)}
ArraySet.prototype.has=function(sStr){if(hasNativeMap)return this._set.has(sStr)
sStr=util.toSetString(sStr)
return has.call(this._set,sStr)}
ArraySet.prototype.indexOf=function(aStr){if(hasNativeMap){var sStr=this._set.get(aStr)
if(0<=sStr)return sStr}else{sStr=util.toSetString(aStr)
if(has.call(this._set,sStr))return this._set[sStr]}throw new Error('"'+aStr+'" is not in the set.')}
ArraySet.prototype.at=function(aIdx){if(0<=aIdx&&aIdx<this._array.length)return this._array[aIdx]
throw new Error("No element indexed by "+aIdx)}
ArraySet.prototype.toArray=function(){return this._array.slice()}
exports.ArraySet=ArraySet},function(module,exports,__webpack_require__){var util=__webpack_require__(4)
function MappingList(){this._array=[]
this._sorted=!0
this._last={generatedLine:-1,generatedColumn:0}}MappingList.prototype.unsortedForEach=function(aCallback,aThisArg){this._array.forEach(aCallback,aThisArg)}
MappingList.prototype.add=function(aMapping){if(mappingA=this._last,mappingB=aMapping,lineA=mappingA.generatedLine,lineB=mappingB.generatedLine,columnA=mappingA.generatedColumn,columnB=mappingB.generatedColumn,lineA<lineB||lineB==lineA&&columnA<=columnB||util.compareByGeneratedPositionsInflated(mappingA,mappingB)<=0){this._last=aMapping
this._array.push(aMapping)}else{this._sorted=!1
this._array.push(aMapping)}var mappingA,mappingB,lineA,lineB,columnA,columnB}
MappingList.prototype.toArray=function(){if(!this._sorted){this._array.sort(util.compareByGeneratedPositionsInflated)
this._sorted=!0}return this._array}
exports.MappingList=MappingList},function(module,exports,__webpack_require__){var util=__webpack_require__(4),binarySearch=__webpack_require__(8),ArraySet=__webpack_require__(5).ArraySet,base64VLQ=__webpack_require__(2),quickSort=__webpack_require__(9).quickSort
function SourceMapConsumer(aSourceMap,aSourceMapURL){var sourceMap=aSourceMap
"string"==typeof aSourceMap&&(sourceMap=util.parseSourceMapInput(aSourceMap))
return new(null!=sourceMap.sections?IndexedSourceMapConsumer:BasicSourceMapConsumer)(sourceMap,aSourceMapURL)}SourceMapConsumer.fromSourceMap=function(aSourceMap,aSourceMapURL){return BasicSourceMapConsumer.fromSourceMap(aSourceMap,aSourceMapURL)}
SourceMapConsumer.prototype._version=3
SourceMapConsumer.prototype.__generatedMappings=null
Object.defineProperty(SourceMapConsumer.prototype,"_generatedMappings",{configurable:!0,enumerable:!0,get:function(){this.__generatedMappings||this._parseMappings(this._mappings,this.sourceRoot)
return this.__generatedMappings}})
SourceMapConsumer.prototype.__originalMappings=null
Object.defineProperty(SourceMapConsumer.prototype,"_originalMappings",{configurable:!0,enumerable:!0,get:function(){this.__originalMappings||this._parseMappings(this._mappings,this.sourceRoot)
return this.__originalMappings}})
SourceMapConsumer.prototype._charIsMappingSeparator=function(aStr,c){c=aStr.charAt(c)
return";"===c||","===c}
SourceMapConsumer.prototype._parseMappings=function(aStr,aSourceRoot){throw new Error("Subclasses must implement _parseMappings")}
SourceMapConsumer.GENERATED_ORDER=1
SourceMapConsumer.ORIGINAL_ORDER=2
SourceMapConsumer.GREATEST_LOWER_BOUND=1
SourceMapConsumer.LEAST_UPPER_BOUND=2
SourceMapConsumer.prototype.eachMapping=function(aCallback,context,aOrder){var mappings,context=context||null
switch(aOrder||SourceMapConsumer.GENERATED_ORDER){case SourceMapConsumer.GENERATED_ORDER:mappings=this._generatedMappings
break
case SourceMapConsumer.ORIGINAL_ORDER:mappings=this._originalMappings
break
default:throw new Error("Unknown order of iteration.")}var sourceRoot=this.sourceRoot
mappings.map(function(mapping){var source=null===mapping.source?null:this._sources.at(mapping.source)
return{source:source=util.computeSourceURL(sourceRoot,source,this._sourceMapURL),generatedLine:mapping.generatedLine,generatedColumn:mapping.generatedColumn,originalLine:mapping.originalLine,originalColumn:mapping.originalColumn,name:null===mapping.name?null:this._names.at(mapping.name)}},this).forEach(aCallback,context)}
SourceMapConsumer.prototype.allGeneratedPositionsFor=function(aArgs){var line=util.getArg(aArgs,"line"),needle={source:util.getArg(aArgs,"source"),originalLine:line,originalColumn:util.getArg(aArgs,"column",0)}
needle.source=this._findSourceIndex(needle.source)
if(needle.source<0)return[]
var mappings=[],index=this._findMapping(needle,this._originalMappings,"originalLine","originalColumn",util.compareByOriginalPositions,binarySearch.LEAST_UPPER_BOUND)
if(0<=index){var mapping=this._originalMappings[index]
if(void 0===aArgs.column)for(var originalLine=mapping.originalLine;mapping&&mapping.originalLine===originalLine;){mappings.push({line:util.getArg(mapping,"generatedLine",null),column:util.getArg(mapping,"generatedColumn",null),lastColumn:util.getArg(mapping,"lastGeneratedColumn",null)})
mapping=this._originalMappings[++index]}else for(var originalColumn=mapping.originalColumn;mapping&&mapping.originalLine===line&&mapping.originalColumn==originalColumn;){mappings.push({line:util.getArg(mapping,"generatedLine",null),column:util.getArg(mapping,"generatedColumn",null),lastColumn:util.getArg(mapping,"lastGeneratedColumn",null)})
mapping=this._originalMappings[++index]}}return mappings}
exports.SourceMapConsumer=SourceMapConsumer
function BasicSourceMapConsumer(mappings,aSourceMapURL){var file=mappings
"string"==typeof mappings&&(file=util.parseSourceMapInput(mappings))
var version=util.getArg(file,"version"),sources=util.getArg(file,"sources"),names=util.getArg(file,"names",[]),sourceRoot=util.getArg(file,"sourceRoot",null),sourcesContent=util.getArg(file,"sourcesContent",null),mappings=util.getArg(file,"mappings"),file=util.getArg(file,"file",null)
if(version!=this._version)throw new Error("Unsupported version: "+version)
sourceRoot=sourceRoot&&util.normalize(sourceRoot)
sources=sources.map(String).map(util.normalize).map(function(source){return sourceRoot&&util.isAbsolute(sourceRoot)&&util.isAbsolute(source)?util.relative(sourceRoot,source):source})
this._names=ArraySet.fromArray(names.map(String),!0)
this._sources=ArraySet.fromArray(sources,!0)
this._absoluteSources=this._sources.toArray().map(function(s){return util.computeSourceURL(sourceRoot,s,aSourceMapURL)})
this.sourceRoot=sourceRoot
this.sourcesContent=sourcesContent
this._mappings=mappings
this._sourceMapURL=aSourceMapURL
this.file=file}(BasicSourceMapConsumer.prototype=Object.create(SourceMapConsumer.prototype)).consumer=SourceMapConsumer
BasicSourceMapConsumer.prototype._findSourceIndex=function(aSource){var i,relativeSource=aSource
null!=this.sourceRoot&&(relativeSource=util.relative(this.sourceRoot,relativeSource))
if(this._sources.has(relativeSource))return this._sources.indexOf(relativeSource)
for(i=0;i<this._absoluteSources.length;++i)if(this._absoluteSources[i]==aSource)return i
return-1}
BasicSourceMapConsumer.fromSourceMap=function(aSourceMap,aSourceMapURL){var smc=Object.create(BasicSourceMapConsumer.prototype),names=smc._names=ArraySet.fromArray(aSourceMap._names.toArray(),!0),sources=smc._sources=ArraySet.fromArray(aSourceMap._sources.toArray(),!0)
smc.sourceRoot=aSourceMap._sourceRoot
smc.sourcesContent=aSourceMap._generateSourcesContent(smc._sources.toArray(),smc.sourceRoot)
smc.file=aSourceMap._file
smc._sourceMapURL=aSourceMapURL
smc._absoluteSources=smc._sources.toArray().map(function(s){return util.computeSourceURL(smc.sourceRoot,s,aSourceMapURL)})
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
Object.defineProperty(BasicSourceMapConsumer.prototype,"sources",{get:function(){return this._absoluteSources.slice()}})
function Mapping(){this.generatedLine=0
this.generatedColumn=0
this.source=null
this.originalLine=null
this.originalColumn=null
this.name=null}BasicSourceMapConsumer.prototype._parseMappings=function(aStr,aSourceRoot){for(var mapping,str,segment,end,value,generatedLine=1,previousGeneratedColumn=0,previousOriginalLine=0,previousOriginalColumn=0,previousSource=0,previousName=0,length=aStr.length,index=0,cachedSegments={},temp={},originalMappings=[],generatedMappings=[];index<length;)if(";"===aStr.charAt(index)){generatedLine++
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
if(1<segment.length){mapping.source=previousSource+segment[1]
previousSource+=segment[1]
mapping.originalLine=previousOriginalLine+segment[2]
previousOriginalLine=mapping.originalLine
mapping.originalLine+=1
mapping.originalColumn=previousOriginalColumn+segment[3]
previousOriginalColumn=mapping.originalColumn
if(4<segment.length){mapping.name=previousName+segment[4]
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
BasicSourceMapConsumer.prototype.originalPositionFor=function(mapping){var name={generatedLine:util.getArg(mapping,"line"),generatedColumn:util.getArg(mapping,"column")},source=this._findMapping(name,this._generatedMappings,"generatedLine","generatedColumn",util.compareByGeneratedPositionsDeflated,util.getArg(mapping,"bias",SourceMapConsumer.GREATEST_LOWER_BOUND))
if(0<=source){mapping=this._generatedMappings[source]
if(mapping.generatedLine===name.generatedLine){source=util.getArg(mapping,"source",null)
if(null!==source){source=this._sources.at(source)
source=util.computeSourceURL(this.sourceRoot,source,this._sourceMapURL)}name=util.getArg(mapping,"name",null)
null!==name&&(name=this._names.at(name))
return{source:source,line:util.getArg(mapping,"originalLine",null),column:util.getArg(mapping,"originalColumn",null),name:name}}}return{source:null,line:null,column:null,name:null}}
BasicSourceMapConsumer.prototype.hasContentsOfAllSources=function(){return!!this.sourcesContent&&(this.sourcesContent.length>=this._sources.size()&&!this.sourcesContent.some(function(sc){return null==sc}))}
BasicSourceMapConsumer.prototype.sourceContentFor=function(fileUriAbsPath,nullOnMissing){if(!this.sourcesContent)return null
var relativeSource=this._findSourceIndex(fileUriAbsPath)
if(0<=relativeSource)return this.sourcesContent[relativeSource]
var url,relativeSource=fileUriAbsPath
null!=this.sourceRoot&&(relativeSource=util.relative(this.sourceRoot,relativeSource))
if(null!=this.sourceRoot&&(url=util.urlParse(this.sourceRoot))){fileUriAbsPath=relativeSource.replace(/^file:\/\//,"")
if("file"==url.scheme&&this._sources.has(fileUriAbsPath))return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
if((!url.path||"/"==url.path)&&this._sources.has("/"+relativeSource))return this.sourcesContent[this._sources.indexOf("/"+relativeSource)]}if(nullOnMissing)return null
throw new Error('"'+relativeSource+'" is not in the SourceMap.')}
BasicSourceMapConsumer.prototype.generatedPositionFor=function(mapping){var needle=util.getArg(mapping,"source")
if((needle=this._findSourceIndex(needle))<0)return{line:null,column:null,lastColumn:null}
needle={source:needle,originalLine:util.getArg(mapping,"line"),originalColumn:util.getArg(mapping,"column")},mapping=this._findMapping(needle,this._originalMappings,"originalLine","originalColumn",util.compareByOriginalPositions,util.getArg(mapping,"bias",SourceMapConsumer.GREATEST_LOWER_BOUND))
if(0<=mapping){mapping=this._originalMappings[mapping]
if(mapping.source===needle.source)return{line:util.getArg(mapping,"generatedLine",null),column:util.getArg(mapping,"generatedColumn",null),lastColumn:util.getArg(mapping,"lastGeneratedColumn",null)}}return{line:null,column:null,lastColumn:null}}
exports.BasicSourceMapConsumer=BasicSourceMapConsumer
function IndexedSourceMapConsumer(version,aSourceMapURL){var sections=version
"string"==typeof version&&(sections=util.parseSourceMapInput(version))
version=util.getArg(sections,"version"),sections=util.getArg(sections,"sections")
if(version!=this._version)throw new Error("Unsupported version: "+version)
this._sources=new ArraySet
this._names=new ArraySet
var lastOffset={line:-1,column:0}
this._sections=sections.map(function(s){if(s.url)throw new Error("Support for url field in sections not implemented.")
var offset=util.getArg(s,"offset"),offsetLine=util.getArg(offset,"line"),offsetColumn=util.getArg(offset,"column")
if(offsetLine<lastOffset.line||offsetLine===lastOffset.line&&offsetColumn<lastOffset.column)throw new Error("Section offsets must be ordered and non-overlapping.")
lastOffset=offset
return{generatedOffset:{generatedLine:offsetLine+1,generatedColumn:offsetColumn+1},consumer:new SourceMapConsumer(util.getArg(s,"map"),aSourceMapURL)}})}(IndexedSourceMapConsumer.prototype=Object.create(SourceMapConsumer.prototype)).constructor=SourceMapConsumer
IndexedSourceMapConsumer.prototype._version=3
Object.defineProperty(IndexedSourceMapConsumer.prototype,"sources",{get:function(){for(var sources=[],i=0;i<this._sections.length;i++)for(var j=0;j<this._sections[i].consumer.sources.length;j++)sources.push(this._sections[i].consumer.sources[j])
return sources}})
IndexedSourceMapConsumer.prototype.originalPositionFor=function(aArgs){var needle={generatedLine:util.getArg(aArgs,"line"),generatedColumn:util.getArg(aArgs,"column")},section=binarySearch.search(needle,this._sections,function(needle,section){var cmp=needle.generatedLine-section.generatedOffset.generatedLine
return cmp||needle.generatedColumn-section.generatedOffset.generatedColumn}),section=this._sections[section]
return section?section.consumer.originalPositionFor({line:needle.generatedLine-(section.generatedOffset.generatedLine-1),column:needle.generatedColumn-(section.generatedOffset.generatedLine===needle.generatedLine?section.generatedOffset.generatedColumn-1:0),bias:aArgs.bias}):{source:null,line:null,column:null,name:null}}
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources=function(){return this._sections.every(function(s){return s.consumer.hasContentsOfAllSources()})}
IndexedSourceMapConsumer.prototype.sourceContentFor=function(aSource,nullOnMissing){for(var i=0;i<this._sections.length;i++){var content=this._sections[i].consumer.sourceContentFor(aSource,!0)
if(content)return content}if(nullOnMissing)return null
throw new Error('"'+aSource+'" is not in the SourceMap.')}
IndexedSourceMapConsumer.prototype.generatedPositionFor=function(aArgs){for(var i=0;i<this._sections.length;i++){var section=this._sections[i]
if(-1!==section.consumer._findSourceIndex(util.getArg(aArgs,"source"))){var generatedPosition=section.consumer.generatedPositionFor(aArgs)
if(generatedPosition)return{line:generatedPosition.line+(section.generatedOffset.generatedLine-1),column:generatedPosition.column+(section.generatedOffset.generatedLine===generatedPosition.line?section.generatedOffset.generatedColumn-1:0)}}}return{line:null,column:null}}
IndexedSourceMapConsumer.prototype._parseMappings=function(aStr,aSourceRoot){this.__generatedMappings=[]
this.__originalMappings=[]
for(var i=0;i<this._sections.length;i++)for(var section=this._sections[i],sectionMappings=section.consumer._generatedMappings,j=0;j<sectionMappings.length;j++){var mapping=sectionMappings[j],source=section.consumer._sources.at(mapping.source),source=util.computeSourceURL(section.consumer.sourceRoot,source,this._sourceMapURL)
this._sources.add(source)
source=this._sources.indexOf(source)
var adjustedMapping=null
if(mapping.name){adjustedMapping=section.consumer._names.at(mapping.name)
this._names.add(adjustedMapping)
adjustedMapping=this._names.indexOf(adjustedMapping)}adjustedMapping={source:source,generatedLine:mapping.generatedLine+(section.generatedOffset.generatedLine-1),generatedColumn:mapping.generatedColumn+(section.generatedOffset.generatedLine===mapping.generatedLine?section.generatedOffset.generatedColumn-1:0),originalLine:mapping.originalLine,originalColumn:mapping.originalColumn,name:adjustedMapping}
this.__generatedMappings.push(adjustedMapping)
"number"==typeof adjustedMapping.originalLine&&this.__originalMappings.push(adjustedMapping)}quickSort(this.__generatedMappings,util.compareByGeneratedPositionsDeflated)
quickSort(this.__originalMappings,util.compareByOriginalPositions)}
exports.IndexedSourceMapConsumer=IndexedSourceMapConsumer},function(module,exports){exports.GREATEST_LOWER_BOUND=1
exports.LEAST_UPPER_BOUND=2
exports.search=function(aNeedle,aHaystack,aCompare,aBias){if(0===aHaystack.length)return-1
var index=function recursiveSearch(aLow,aHigh,aNeedle,aHaystack,aCompare,aBias){var mid=Math.floor((aHigh-aLow)/2)+aLow,cmp=aCompare(aNeedle,aHaystack[mid],!0)
return 0===cmp?mid:0<cmp?1<aHigh-mid?recursiveSearch(mid,aHigh,aNeedle,aHaystack,aCompare,aBias):aBias==exports.LEAST_UPPER_BOUND?aHigh<aHaystack.length?aHigh:-1:mid:1<mid-aLow?recursiveSearch(aLow,mid,aNeedle,aHaystack,aCompare,aBias):aBias==exports.LEAST_UPPER_BOUND?mid:aLow<0?-1:aLow}(-1,aHaystack.length,aNeedle,aHaystack,aCompare,aBias||exports.GREATEST_LOWER_BOUND)
if(index<0)return-1
for(;0<=index-1&&0===aCompare(aHaystack[index],aHaystack[index-1],!0);)--index
return index}},function(module,exports){function swap(ary,x,y){var temp=ary[x]
ary[x]=ary[y]
ary[y]=temp}function doQuickSort(ary,comparator,p,r){if(p<r){var i=p-1
swap(ary,(q=p,high=r,Math.round(q+Math.random()*(high-q))),r)
for(var pivot=ary[r],j=p;j<r;j++)comparator(ary[j],pivot)<=0&&swap(ary,i+=1,j)
swap(ary,i+1,j)
q=i+1
doQuickSort(ary,comparator,p,q-1)
doQuickSort(ary,comparator,q+1,r)}var q,high}exports.quickSort=function(ary,comparator){doQuickSort(ary,comparator,0,ary.length-1)}},function(module,exports,__webpack_require__){var SourceMapGenerator=__webpack_require__(1).SourceMapGenerator,util=__webpack_require__(4),REGEX_NEWLINE=/(\r?\n)/,isSourceNode="$$$isSourceNode$$$"
function SourceNode(aLine,aColumn,aSource,aChunks,aName){this.children=[]
this.sourceContents={}
this.line=null==aLine?null:aLine
this.column=null==aColumn?null:aColumn
this.source=null==aSource?null:aSource
this.name=null==aName?null:aName
this[isSourceNode]=!0
null!=aChunks&&this.add(aChunks)}SourceNode.fromStringWithSourceMap=function(aGeneratedCode,aSourceMapConsumer,aRelativePath){function shiftNextLine(){return getNextLine()+(getNextLine()||"")
function getNextLine(){return remainingLinesIndex<remainingLines.length?remainingLines[remainingLinesIndex++]:void 0}}var node=new SourceNode,remainingLines=aGeneratedCode.split(REGEX_NEWLINE),remainingLinesIndex=0,lastGeneratedLine=1,lastGeneratedColumn=0,lastMapping=null
aSourceMapConsumer.eachMapping(function(mapping){if(null!==lastMapping){if(!(lastGeneratedLine<mapping.generatedLine)){var code=(nextLine=remainingLines[remainingLinesIndex]||"").substr(0,mapping.generatedColumn-lastGeneratedColumn)
remainingLines[remainingLinesIndex]=nextLine.substr(mapping.generatedColumn-lastGeneratedColumn)
lastGeneratedColumn=mapping.generatedColumn
addMappingWithCode(lastMapping,code)
lastMapping=mapping
return}addMappingWithCode(lastMapping,shiftNextLine())
lastGeneratedLine++
lastGeneratedColumn=0}for(;lastGeneratedLine<mapping.generatedLine;){node.add(shiftNextLine())
lastGeneratedLine++}if(lastGeneratedColumn<mapping.generatedColumn){var nextLine=remainingLines[remainingLinesIndex]||""
node.add(nextLine.substr(0,mapping.generatedColumn))
remainingLines[remainingLinesIndex]=nextLine.substr(mapping.generatedColumn)
lastGeneratedColumn=mapping.generatedColumn}lastMapping=mapping},this)
if(remainingLinesIndex<remainingLines.length){lastMapping&&addMappingWithCode(lastMapping,shiftNextLine())
node.add(remainingLines.splice(remainingLinesIndex).join(""))}aSourceMapConsumer.sources.forEach(function(sourceFile){var content=aSourceMapConsumer.sourceContentFor(sourceFile)
if(null!=content){null!=aRelativePath&&(sourceFile=util.join(aRelativePath,sourceFile))
node.setSourceContent(sourceFile,content)}})
return node
function addMappingWithCode(mapping,code){if(null===mapping||void 0===mapping.source)node.add(code)
else{var source=aRelativePath?util.join(aRelativePath,mapping.source):mapping.source
node.add(new SourceNode(mapping.originalLine,mapping.originalColumn,source,code,mapping.name))}}}
SourceNode.prototype.add=function(aChunk){if(Array.isArray(aChunk))aChunk.forEach(function(chunk){this.add(chunk)},this)
else{if(!aChunk[isSourceNode]&&"string"!=typeof aChunk)throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got "+aChunk)
aChunk&&this.children.push(aChunk)}return this}
SourceNode.prototype.prepend=function(aChunk){if(Array.isArray(aChunk))for(var i=aChunk.length-1;0<=i;i--)this.prepend(aChunk[i])
else{if(!aChunk[isSourceNode]&&"string"!=typeof aChunk)throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got "+aChunk)
this.children.unshift(aChunk)}return this}
SourceNode.prototype.walk=function(aFn){for(var chunk,i=0,len=this.children.length;i<len;i++)(chunk=this.children[i])[isSourceNode]?chunk.walk(aFn):""!==chunk&&aFn(chunk,{source:this.source,line:this.line,column:this.column,name:this.name})}
SourceNode.prototype.join=function(aSep){var newChildren,i,len=this.children.length
if(0<len){newChildren=[]
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
exports.SourceNode=SourceNode}])})
