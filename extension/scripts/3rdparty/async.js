!function(global,factory){"object"==typeof exports&&"undefined"!=typeof module?factory(exports):"function"==typeof define&&define.amd?define(["exports"],factory):factory(global.async={})}(this,function(exports){"use strict"
function isObject(value){var type=typeof value
return value&&("object"==type||"function"==type)}var funcTag="[object Function]",genTag="[object GeneratorFunction]",objectToString$2=Object.prototype.toString
function isFunction(value){var tag=isObject(value)?objectToString$2.call(value):""
return tag==funcTag||tag==genTag}var NAN=NaN,reTrim=/^\s+|\s+$/g,reIsBadHex=/^[-+]0x[0-9a-f]+$/i,reIsBinary=/^0b[01]+$/i,reIsOctal=/^0o[0-7]+$/i,freeParseInt=parseInt
var INFINITY=1/0,MAX_INTEGER=17976931348623157e292
function toInteger(value){if(!value)return 0===value?value:0
if((value=function(value){if(isObject(value)){var other=isFunction(value.valueOf)?value.valueOf():value
value=isObject(other)?other+"":other}if("string"!=typeof value)return 0===value?value:+value
value=value.replace(reTrim,"")
var isBinary=reIsBinary.test(value)
return isBinary||reIsOctal.test(value)?freeParseInt(value.slice(2),isBinary?2:8):reIsBadHex.test(value)?NAN:+value}(value))===INFINITY||value===-INFINITY){return(value<0?-1:1)*MAX_INTEGER}var remainder=value%1
return value==value?remainder?value-remainder:value:0}var FUNC_ERROR_TEXT="Expected a function",nativeMax=Math.max
function rest(func,start){if("function"!=typeof func)throw new TypeError(FUNC_ERROR_TEXT)
start=nativeMax(void 0===start?func.length-1:toInteger(start),0)
return function(){for(var args=arguments,index=-1,length=nativeMax(args.length-start,0),array=Array(length);++index<length;)array[index]=args[start+index]
switch(start){case 0:return func.call(this,array)
case 1:return func.call(this,args[0],array)
case 2:return func.call(this,args[0],args[1],array)}var otherArgs=Array(start+1)
index=-1
for(;++index<start;)otherArgs[index]=args[index]
otherArgs[start]=array
return function(func,thisArg,args){switch(args.length){case 0:return func.call(thisArg)
case 1:return func.call(thisArg,args[0])
case 2:return func.call(thisArg,args[0],args[1])
case 3:return func.call(thisArg,args[0],args[1],args[2])}return func.apply(thisArg,args)}(func,this,otherArgs)}}function applyEach$1(eachfn){return rest(function(fns,args){var go=rest(function(args){var that=this,callback=args.pop()
return eachfn(fns,function(fn,_,cb){fn.apply(that,args.concat([cb]))},callback)})
return args.length?go.apply(this,args):go})}var FUNC_ERROR_TEXT$1="Expected a function"
function once(func){return function(n,func){var result
if("function"!=typeof func)throw new TypeError(FUNC_ERROR_TEXT$1)
n=toInteger(n)
return function(){0<--n&&(result=func.apply(this,arguments))
n<=1&&(func=void 0)
return result}}(2,func)}function noop(){}function baseProperty(key){return function(object){return null==object?void 0:object[key]}}var getLength=baseProperty("length"),MAX_SAFE_INTEGER$1=9007199254740991
function isLength(value){return"number"==typeof value&&-1<value&&value%1==0&&value<=MAX_SAFE_INTEGER$1}function isArrayLike(value){return null!=value&&!("function"==typeof value&&isFunction(value))&&isLength(getLength(value))}var hasOwnProperty=Object.prototype.hasOwnProperty,getPrototypeOf=Object.getPrototypeOf
function baseHas(object,key){return hasOwnProperty.call(object,key)||"object"==typeof object&&key in object&&null===getPrototypeOf(object)}var nativeKeys=Object.keys
function isObjectLike(value){return!!value&&"object"==typeof value}var argsTag="[object Arguments]",objectProto$2=Object.prototype,hasOwnProperty$1=objectProto$2.hasOwnProperty,objectToString=objectProto$2.toString,propertyIsEnumerable=objectProto$2.propertyIsEnumerable
function isArguments(value){return function(value){return isObjectLike(value)&&isArrayLike(value)}(value)&&hasOwnProperty$1.call(value,"callee")&&(!propertyIsEnumerable.call(value,"callee")||objectToString.call(value)==argsTag)}var isArray=Array.isArray,stringTag="[object String]",objectToString$1=Object.prototype.toString
function isString(value){return"string"==typeof value||!isArray(value)&&isObjectLike(value)&&objectToString$1.call(value)==stringTag}function indexKeys(object){var length=object?object.length:void 0
return isLength(length)&&(isArray(object)||isString(object)||isArguments(object))?function(n,iteratee){for(var index=-1,result=Array(n);++index<n;)result[index]=iteratee(index)
return result}(length,String):null}var MAX_SAFE_INTEGER=9007199254740991,reIsUint=/^(?:0|[1-9]\d*)$/
function isIndex(value,length){value="number"==typeof value||reIsUint.test(value)?+value:-1
length=null==length?MAX_SAFE_INTEGER:length
return-1<value&&value%1==0&&value<length}var objectProto$1=Object.prototype
function keys(object){var value,Ctor,isProto=(Ctor=(value=object)&&value.constructor,value===("function"==typeof Ctor&&Ctor.prototype||objectProto$1))
if(!isProto&&!isArrayLike(object))return function(object){return nativeKeys(Object(object))}(object)
var indexes=indexKeys(object),skipIndexes=!!indexes,result=indexes||[],length=result.length
for(var key in object)!baseHas(object,key)||skipIndexes&&("length"==key||isIndex(key,length))||isProto&&"constructor"==key||result.push(key)
return result}function keyIterator(coll){var len,i=-1
if(isArrayLike(coll)){len=coll.length
return function(){return++i<len?i:null}}var okeys=keys(coll)
len=okeys.length
return function(){return++i<len?okeys[i]:null}}function onlyOnce(fn){return function(){if(null===fn)throw new Error("Callback was already called.")
fn.apply(this,arguments)
fn=null}}function eachOf(object,iterator,callback){callback=once(callback||noop)
for(var key,iter=keyIterator(object=object||[]),completed=0;null!=(key=iter());){completed+=1
iterator(object[key],key,onlyOnce(done))}0===completed&&callback(null)
function done(err){completed--
err?callback(err):null===key&&completed<=0&&callback(null)}}var applyEach=applyEach$1(eachOf),_setImmediate="function"==typeof setImmediate&&setImmediate,setImmediate$1=_setImmediate?function(fn){_setImmediate(fn)}:"object"==typeof process&&"function"==typeof process.nextTick?process.nextTick:function(fn){setTimeout(fn,0)}
function eachOfSeries(obj,iterator,callback){callback=once(callback||noop)
var nextKey=keyIterator(obj=obj||[]),key=nextKey()
!function iterate(){var sync=!0
if(null===key)return callback(null)
iterator(obj[key],key,onlyOnce(function(err){if(err)callback(err)
else{if(null===(key=nextKey()))return callback(null)
sync?setImmediate$1(iterate):iterate()}}))
sync=!1}()}var applyEachSeries=applyEach$1(eachOfSeries),apply=rest(function(fn,args){return rest(function(callArgs){return fn.apply(null,args.concat(callArgs))})})
function asyncify(func){return rest(function(args){var result,callback=args.pop()
try{result=func.apply(this,args)}catch(e){return callback(e)}isObject(result)&&"function"==typeof result.then?result.then(function(value){callback(null,value)}).catch(function(err){callback(err.message?err:new Error(err))}):callback(null,result)})}function arrayEach(array,iteratee){for(var index=-1,length=array.length;++index<length&&!1!==iteratee(array[index],index,array););return array}var fromRight,baseFor=function(object,iteratee,keysFunc){for(var index=-1,iterable=Object(object),props=keysFunc(object),length=props.length;length--;){var key=props[fromRight?length:++index]
if(!1===iteratee(iterable[key],key,iterable))break}return object}
function identity(value){return value}function forOwn(object,iteratee){return object&&function(object,iteratee){return object&&baseFor(object,iteratee,keys)}(object,"function"==typeof(value=iteratee)?value:identity)
var value}function baseIndexOf(array,value,fromIndex){if(value!=value)return function(array,fromIndex,fromRight){for(var length=array.length,index=fromIndex+(fromRight?0:-1);fromRight?index--:++index<length;){var other=array[index]
if(other!=other)return index}return-1}(array,fromIndex)
for(var index=fromIndex-1,length=array.length;++index<length;)if(array[index]===value)return index
return-1}var nativeMax$1=Math.max
function indexOf(array,value,fromIndex){var length=array?array.length:0
if(!length)return-1;(fromIndex=toInteger(fromIndex))<0&&(fromIndex=nativeMax$1(length+fromIndex,0))
return baseIndexOf(array,value,fromIndex)}function auto(tasks,concurrency,callback){if("function"==typeof arguments[1]){callback=concurrency
concurrency=null}callback=once(callback||noop)
var keys$$=keys(tasks),remainingTasks=keys$$.length
if(!remainingTasks)return callback(null)
concurrency=concurrency||remainingTasks
var results={},runningTasks=0,hasError=!1,listeners=[]
function addListener(fn){listeners.unshift(fn)}function taskComplete(){remainingTasks--
arrayEach(listeners.slice(),function(fn){fn()})}addListener(function(){remainingTasks||callback(null,results)})
arrayEach(keys$$,function(k){if(!hasError){for(var dep,task=isArray(tasks[k])?tasks[k]:[tasks[k]],taskCallback=rest(function(err,args){runningTasks--
args.length<=1&&(args=args[0])
if(err){var safeResults={}
forOwn(results,function(val,rkey){safeResults[rkey]=val})
safeResults[k]=args
hasError=!0
callback(err,safeResults)}else{results[k]=args
setImmediate$1(taskComplete)}}),requires=task.slice(0,task.length-1),len=requires.length;len--;){if(!(dep=tasks[requires[len]]))throw new Error("Has non-existent dependency in "+requires.join(", "))
if(isArray(dep)&&0<=indexOf(dep,k))throw new Error("Has cyclic dependencies")}if(ready()){runningTasks++
task[task.length-1](taskCallback,results)}else addListener(function listener(){if(ready()){runningTasks++
0<=(idx=indexOf(listeners,listener))&&listeners.splice(idx,1)
task[task.length-1](taskCallback,results)}var idx})}function ready(){return runningTasks<concurrency&&!baseHas(results,k)&&function(array,predicate){for(var index=-1,length=array.length;++index<length;)if(!predicate(array[index],index,array))return!1
return!0}(requires,function(x){return baseHas(results,x)})}})}function arrayMap(array,iteratee){for(var index=-1,length=array.length,result=Array(length);++index<length;)result[index]=iteratee(array[index],index,array)
return result}function queue$1(worker,concurrency,payload){if(null==concurrency)concurrency=1
else if(0===concurrency)throw new Error("Concurrency must not be zero")
function _insert(q,data,pos,callback){if(null!=callback&&"function"!=typeof callback)throw new Error("task callback must be a function")
q.started=!0
isArray(data)||(data=[data])
if(0===data.length&&q.idle())return setImmediate$1(function(){q.drain()})
arrayEach(data,function(task){var item={data:task,callback:callback||noop}
pos?q.tasks.unshift(item):q.tasks.push(item)
q.tasks.length===q.concurrency&&q.saturated()})
setImmediate$1(q.process)}function _next(q,tasks){return function(){--workers
var removed=!1,args=arguments
arrayEach(tasks,function(task){arrayEach(workersList,function(worker,index){if(worker===task&&!removed){workersList.splice(index,1)
removed=!0}})
task.callback.apply(task,args)})
q.tasks.length+workers===0&&q.drain()
q.process()}}var workers=0,workersList=[],q={tasks:[],concurrency:concurrency,payload:payload,saturated:noop,empty:noop,drain:noop,started:!1,paused:!1,push:function(data,callback){_insert(q,data,!1,callback)},kill:function(){q.drain=noop
q.tasks=[]},unshift:function(data,callback){_insert(q,data,!0,callback)},process:function(){for(;!q.paused&&workers<q.concurrency&&q.tasks.length;){var tasks=q.payload?q.tasks.splice(0,q.payload):q.tasks.splice(0,q.tasks.length),data=arrayMap(tasks,baseProperty("data"))
0===q.tasks.length&&q.empty()
workers+=1
workersList.push(tasks[0])
var cb=onlyOnce(_next(q,tasks))
worker(data,cb)}},length:function(){return q.tasks.length},running:function(){return workers},workersList:function(){return workersList},idle:function(){return q.tasks.length+workers===0},pause:function(){q.paused=!0},resume:function(){if(!1!==q.paused){q.paused=!1
for(var resumeCount=Math.min(q.concurrency,q.tasks.length),w=1;w<=resumeCount;w++)setImmediate$1(q.process)}}}
return q}function cargo(worker,payload){return queue$1(worker,1,payload)}function reduce(arr,memo,iterator,cb){eachOfSeries(arr,function(x,i,cb){iterator(memo,x,function(err,v){memo=v
cb(err)})},function(err){cb(err,memo)})}function seq(){var fns=arguments
return rest(function(args){var that=this,cb=args[args.length-1]
"function"==typeof cb?args.pop():cb=noop
reduce(fns,args,function(newargs,fn,cb){fn.apply(that,newargs.concat([rest(function(err,nextargs){cb(err,nextargs)})]))},function(err,results){cb.apply(that,[err].concat(results))})})}var reverse=Array.prototype.reverse
function compose(){return seq.apply(null,reverse.call(arguments))}function concat$1(eachfn,arr,fn,callback){var result=[]
eachfn(arr,function(x,index,cb){fn(x,function(err,y){result=result.concat(y||[])
cb(err)})},function(err){callback(err,result)})}function doParallel(fn){return function(obj,iterator,callback){return fn(eachOf,obj,iterator,callback)}}var concat=doParallel(concat$1)
function doSeries(fn){return function(obj,iterator,callback){return fn(eachOfSeries,obj,iterator,callback)}}var concatSeries=doSeries(concat$1),constant=rest(function(values){var args=[null].concat(values)
return function(cb){return cb.apply(this,args)}})
function _createTester(eachfn,check,getResult){return function(arr,limit,iterator,cb){function done(err){cb&&(err?cb(err):cb(null,getResult(!1,void 0)))}function iteratee(x,_,callback){if(!cb)return callback()
iterator(x,function(err,v){if(cb)if(err){cb(err)
cb=iterator=!1}else if(check(v)){cb(null,getResult(!0,x))
cb=iterator=!1}callback()})}if(3<arguments.length)eachfn(arr,limit,iteratee,done)
else{cb=iterator
iterator=limit
eachfn(arr,iteratee,done)}}}function _findGetResult(v,x){return x}var detect=_createTester(eachOf,identity,_findGetResult)
function _eachOfLimit(limit){return function(obj,iterator,callback){callback=once(callback||noop)
var nextKey=keyIterator(obj=obj||[])
if(limit<=0)return callback(null)
var done=!1,running=0,errored=!1
!function replenish(){if(done&&running<=0)return callback(null)
for(;running<limit&&!errored;){var key=nextKey()
if(null===key){done=!0
running<=0&&callback(null)
return}running+=1
iterator(obj[key],key,onlyOnce(function(err){--running
if(err){callback(err)
errored=!0}else replenish()}))}}()}}function eachOfLimit(obj,limit,iterator,cb){_eachOfLimit(limit)(obj,iterator,cb)}var detectLimit=_createTester(eachOfLimit,identity,_findGetResult),detectSeries=_createTester(eachOfSeries,identity,_findGetResult)
function consoleFunc(name){return rest(function(fn,args){fn.apply(null,args.concat([rest(function(err,args){"object"==typeof console&&(err?console.error&&console.error(err):console[name]&&arrayEach(args,function(x){console[name](x)}))})]))})}var dir=consoleFunc("dir")
function during(test,iterator,cb){cb=cb||noop
var next=rest(function(err,args){if(err)cb(err)
else{args.push(check)
test.apply(this,args)}}),check=function(err,truth){if(err)return cb(err)
if(!truth)return cb(null)
iterator(next)}
test(check)}function doDuring(iterator,test,cb){var calls=0
during(function(next){if(calls++<1)return next(null,!0)
test.apply(this,arguments)},iterator,cb)}function whilst(test,iterator,cb){cb=cb||noop
if(!test())return cb(null)
var next=rest(function(err,args){if(err)return cb(err)
if(test.apply(this,args))return iterator(next)
cb.apply(null,[null].concat(args))})
iterator(next)}function doWhilst(iterator,test,cb){var calls=0
return whilst(function(){return++calls<=1||test.apply(this,arguments)},iterator,cb)}function doUntil(iterator,test,cb){return doWhilst(iterator,function(){return!test.apply(this,arguments)},cb)}function _withoutIndex(iterator){return function(value,index,callback){return iterator(value,callback)}}function each(arr,iterator,cb){return eachOf(arr,_withoutIndex(iterator),cb)}function eachLimit(arr,limit,iterator,cb){return _eachOfLimit(limit)(arr,_withoutIndex(iterator),cb)}function eachSeries(arr,iterator,cb){return eachOfSeries(arr,_withoutIndex(iterator),cb)}function ensureAsync(fn){return rest(function(args){var callback=args.pop(),sync=!0
args.push(function(){var innerArgs=arguments
sync?setImmediate$1(function(){callback.apply(null,innerArgs)}):callback.apply(null,innerArgs)})
fn.apply(this,args)
sync=!1})}function notId(v){return!v}var every=_createTester(eachOf,notId,notId),everyLimit=_createTester(eachOfLimit,notId,notId)
function _filter(eachfn,arr,iterator,callback){var results=[]
eachfn(arr,function(x,index,callback){iterator(x,function(err,v){if(err)callback(err)
else{v&&results.push({index:index,value:x})
callback()}})},function(err){err?callback(err):callback(null,arrayMap(results.sort(function(a,b){return a.index-b.index}),baseProperty("value")))})}var filter=doParallel(_filter)
function doParallelLimit(fn){return function(obj,limit,iterator,callback){return fn(_eachOfLimit(limit),obj,iterator,callback)}}var filterLimit=doParallelLimit(_filter),filterSeries=doSeries(_filter)
function forever(fn,cb){var done=onlyOnce(cb||noop),task=ensureAsync(fn)
!function next(err){if(err)return done(err)
task(next)}()}function iterator(tasks){return function makeCallback(index){function fn(){tasks.length&&tasks[index].apply(null,arguments)
return fn.next()}fn.next=function(){return index<tasks.length-1?makeCallback(index+1):null}
return fn}(0)}var log=consoleFunc("log")
function _asyncMap(eachfn,arr,iterator,callback){callback=once(callback||noop)
var results=isArrayLike(arr=arr||[])?[]:{}
eachfn(arr,function(value,index,callback){iterator(value,function(err,v){results[index]=v
callback(err)})},function(err){callback(err,results)})}var map=doParallel(_asyncMap),mapLimit=doParallelLimit(_asyncMap),mapSeries=doSeries(_asyncMap)
function checkGlobal(value){return value&&value.Object===Object?value:null}var objectTypes={function:!0,object:!0},freeExports=objectTypes[typeof exports]&&exports&&!exports.nodeType?exports:null,freeModule=objectTypes[typeof module]&&module&&!module.nodeType?module:null,freeGlobal=checkGlobal(freeExports&&freeModule&&"object"==typeof global&&global),freeSelf=checkGlobal(objectTypes[typeof self]&&self),freeWindow=checkGlobal(objectTypes[typeof window]&&window),thisGlobal=checkGlobal(objectTypes[typeof this]&&this),Symbol=(freeGlobal||freeWindow!==(thisGlobal&&thisGlobal.window)&&freeWindow||freeSelf||thisGlobal||Function("return this")()).Symbol,symbolTag="[object Symbol]",objectToString$3=Object.prototype.toString
var INFINITY$1=1/0,symbolProto=Symbol?Symbol.prototype:void 0,symbolToString=Symbol?symbolProto.toString:void 0
function toString(value){if("string"==typeof value)return value
if(null==value)return""
if(function(value){return"symbol"==typeof value||isObjectLike(value)&&objectToString$3.call(value)==symbolTag}(value))return Symbol?symbolToString.call(value):""
var result=value+""
return"0"==result&&1/value==-INFINITY$1?"-0":result}var rePropName=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g,reEscapeChar=/\\(\\)?/g
function baseToPath(value){return isArray(value)?value:function(string){var result=[]
toString(string).replace(rePropName,function(match,number,quote,string){result.push(quote?string.replace(reEscapeChar,"$1"):number||match)})
return result}(value)}var reIsDeepProp=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,reIsPlainProp=/^\w*$/
function isKey(value,object){return"number"==typeof value||!isArray(value)&&(reIsPlainProp.test(value)||!reIsDeepProp.test(value)||null!=object&&value in Object(object))}function get(object,path,defaultValue){var result=null==object?void 0:function(object,path){for(var index=0,length=(path=isKey(path,object)?[path+""]:baseToPath(path)).length;null!=object&&index<length;)object=object[path[index++]]
return index&&index==length?object:void 0}(object,path)
return void 0===result?defaultValue:result}function parent(object,path){return 1==path.length?object:get(object,function(array,start,end){var index=-1,length=array.length
start<0&&(start=length<-start?0:length+start);(end=length<end?length:end)<0&&(end+=length)
length=end<start?0:end-start>>>0
start>>>=0
for(var result=Array(length);++index<length;)result[index]=array[index+start]
return result}(path,0,-1))}function hasPath(object,path,hasFunc){if(null==object)return!1
var result=hasFunc(object,path)
result||isKey(path)||null!=(object=parent(object,path=baseToPath(path)))&&(result=hasFunc(object,path=function(array){var length=array?array.length:0
return length?array[length-1]:void 0}(path)))
var length=object?object.length:void 0
return result||!!length&&isLength(length)&&isIndex(path,length)&&(isArray(object)||isString(object)||isArguments(object))}function has(object,path){return hasPath(object,path,baseHas)}function memoize(fn,hasher){var memo=Object.create(null),queues=Object.create(null)
hasher=hasher||identity
var memoized=rest(function(args){var callback=args.pop(),key=hasher.apply(null,args)
if(has(memo,key))setImmediate$1(function(){callback.apply(null,memo[key])})
else if(has(queues,key))queues[key].push(callback)
else{queues[key]=[callback]
fn.apply(null,args.concat([rest(function(args){memo[key]=args
var q=queues[key]
delete queues[key]
for(var i=0,l=q.length;i<l;i++)q[i].apply(null,args)})]))}})
memoized.memo=memo
memoized.unmemoized=fn
return memoized}var nexTick="object"==typeof process&&"function"==typeof process.nextTick?process.nextTick:setImmediate$1
function _parallel(eachfn,tasks,callback){callback=callback||noop
var results=isArrayLike(tasks)?[]:{}
eachfn(tasks,function(task,key,callback){task(rest(function(err,args){args.length<=1&&(args=args[0])
results[key]=args
callback(err)}))},function(err){callback(err,results)})}function parallel(tasks,cb){return _parallel(eachOf,tasks,cb)}function parallelLimit(tasks,limit,cb){return _parallel(_eachOfLimit(limit),tasks,cb)}function queue(worker,concurrency){return queue$1(function(items,cb){worker(items[0],cb)},concurrency,1)}function priorityQueue(worker,concurrency){function _compareTasks(a,b){return a.priority-b.priority}function _insert(q,data,priority,callback){if(null!=callback&&"function"!=typeof callback)throw new Error("task callback must be a function")
q.started=!0
isArray(data)||(data=[data])
if(0===data.length)return setImmediate$1(function(){q.drain()})
arrayEach(data,function(task){var item={data:task,priority:priority,callback:"function"==typeof callback?callback:noop}
q.tasks.splice(function(sequence,item,compare){for(var beg=-1,end=sequence.length-1;beg<end;){var mid=beg+(end-beg+1>>>1)
0<=compare(item,sequence[mid])?beg=mid:end=mid-1}return beg}(q.tasks,item,_compareTasks)+1,0,item)
q.tasks.length===q.concurrency&&q.saturated()
setImmediate$1(q.process)})}var q=queue(worker,concurrency)
q.push=function(data,priority,callback){_insert(q,data,priority,callback)}
delete q.unshift
return q}var slice=Array.prototype.slice
function reduceRight(arr,memo,iterator,cb){reduce(slice.call(arr).reverse(),memo,iterator,cb)}function reject$1(eachfn,arr,iterator,callback){_filter(eachfn,arr,function(value,cb){iterator(value,function(err,v){err?cb(err):cb(null,!v)})},callback)}var reject=doParallel(reject$1),rejectLimit=doParallelLimit(reject$1),rejectSeries=doSeries(reject$1)
function series(tasks,cb){return _parallel(eachOfSeries,tasks,cb)}function retry(times,task,callback){var attempts=[],opts={times:5,interval:0}
var length=arguments.length
if(length<1||3<length)throw new Error("Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)")
if(length<=2&&"function"==typeof times){callback=task
task=times}"function"!=typeof times&&function(acc,t){if("number"==typeof t)acc.times=parseInt(t,10)||5
else{if("object"!=typeof t)throw new Error("Unsupported argument type for 'times': "+typeof t)
acc.times=parseInt(t.times,10)||5
acc.interval=parseInt(t.interval,10)||0}}(opts,times)
opts.callback=callback
opts.task=task
function wrappedTask(wrappedCallback,wrappedResults){function retryAttempt(task,finalAttempt){return function(seriesCallback){task(function(err,result){seriesCallback(!err||finalAttempt,{err:err,result:result})},wrappedResults)}}function retryInterval(interval){return function(seriesCallback){setTimeout(function(){seriesCallback(null)},interval)}}for(;opts.times;){var finalAttempt=!--opts.times
attempts.push(retryAttempt(opts.task,finalAttempt))
!finalAttempt&&0<opts.interval&&attempts.push(retryInterval(opts.interval))}series(attempts,function(done,data){data=data[data.length-1];(wrappedCallback||opts.callback)(data.err,data.result)})}return opts.callback?wrappedTask():wrappedTask}var some=_createTester(eachOf,Boolean,identity),someLimit=_createTester(eachOfLimit,Boolean,identity)
function sortBy(arr,iterator,cb){map(arr,function(x,cb){iterator(x,function(err,criteria){if(err)return cb(err)
cb(null,{value:x,criteria:criteria})})},function(err,results){if(err)return cb(err)
cb(null,arrayMap(results.sort(comparator),baseProperty("value")))})
function comparator(left,right){var a=left.criteria,b=right.criteria
return a<b?-1:b<a?1:0}}var nativeCeil=Math.ceil,nativeMax$2=Math.max
function baseRange(start,end,step,fromRight){for(var index=-1,length=nativeMax$2(nativeCeil((end-start)/(step||1)),0),result=Array(length);length--;){result[fromRight?length:++index]=start
start+=step}return result}function times(count,iterator,callback){map(baseRange(0,count,1),iterator,callback)}function timeLimit(count,limit,iterator,cb){return mapLimit(baseRange(0,count,1),limit,iterator,cb)}function timesSeries(count,iterator,callback){mapSeries(baseRange(0,count,1),iterator,callback)}function transform(arr,memo,iterator,callback){if(3===arguments.length){callback=iterator
iterator=memo
memo=isArray(arr)?[]:{}}eachOf(arr,function(v,k,cb){iterator(memo,v,k,cb)},function(err){callback(err,memo)})}function unmemoize(fn){return function(){return(fn.unmemoized||fn).apply(null,arguments)}}function until(test,iterator,cb){return whilst(function(){return!test.apply(this,arguments)},iterator,cb)}function waterfall(tasks,cb){cb=once(cb||noop)
if(!isArray(tasks))return cb(new Error("First argument to waterfall must be an array of functions"))
if(!tasks.length)return cb()
!function wrapIterator(iterator){return rest(function(err,args){if(err)cb.apply(null,[err].concat(args))
else{var next=iterator.next()
next?args.push(wrapIterator(next)):args.push(cb)
ensureAsync(iterator).apply(null,args)}})}(iterator(tasks))()}var index={applyEach:applyEach,applyEachSeries:applyEachSeries,apply:apply,asyncify:asyncify,auto:auto,cargo:cargo,compose:compose,concat:concat,concatSeries:concatSeries,constant:constant,detect:detect,detectLimit:detectLimit,detectSeries:detectSeries,dir:dir,doDuring:doDuring,doUntil:doUntil,doWhilst:doWhilst,during:during,each:each,eachLimit:eachLimit,eachOf:eachOf,eachOfLimit:eachOfLimit,eachOfSeries:eachOfSeries,eachSeries:eachSeries,ensureAsync:ensureAsync,every:every,everyLimit:everyLimit,filter:filter,filterLimit:filterLimit,filterSeries:filterSeries,forever:forever,iterator:iterator,log:log,map:map,mapLimit:mapLimit,mapSeries:mapSeries,memoize:memoize,nextTick:nexTick,parallel:parallel,parallelLimit:parallelLimit,priorityQueue:priorityQueue,queue:queue,reduce:reduce,reduceRight:reduceRight,reject:reject,rejectLimit:rejectLimit,rejectSeries:rejectSeries,retry:retry,seq:seq,series:series,setImmediate:setImmediate$1,some:some,someLimit:someLimit,sortBy:sortBy,times:times,timesLimit:timeLimit,timesSeries:timesSeries,transform:transform,unmemoize:unmemoize,until:until,waterfall:waterfall,whilst:whilst,all:every,any:some,forEach:each,forEachSeries:eachSeries,forEachLimit:eachLimit,forEachOf:eachOf,forEachOfSeries:eachOfSeries,forEachOfLimit:eachOfLimit,inject:reduce,foldl:reduce,foldr:reduceRight,select:filter,selectLimit:filterLimit,selectSeries:filterSeries,wrapSync:asyncify}
exports.default=index
exports.applyEach=applyEach
exports.applyEachSeries=applyEachSeries
exports.apply=apply
exports.asyncify=asyncify
exports.auto=auto
exports.cargo=cargo
exports.compose=compose
exports.concat=concat
exports.concatSeries=concatSeries
exports.constant=constant
exports.detect=detect
exports.detectLimit=detectLimit
exports.detectSeries=detectSeries
exports.dir=dir
exports.doDuring=doDuring
exports.doUntil=doUntil
exports.doWhilst=doWhilst
exports.during=during
exports.each=each
exports.eachLimit=eachLimit
exports.eachOf=eachOf
exports.eachOfLimit=eachOfLimit
exports.eachOfSeries=eachOfSeries
exports.eachSeries=eachSeries
exports.ensureAsync=ensureAsync
exports.every=every
exports.everyLimit=everyLimit
exports.filter=filter
exports.filterLimit=filterLimit
exports.filterSeries=filterSeries
exports.forever=forever
exports.iterator=iterator
exports.log=log
exports.map=map
exports.mapLimit=mapLimit
exports.mapSeries=mapSeries
exports.memoize=memoize
exports.nextTick=nexTick
exports.parallel=parallel
exports.parallelLimit=parallelLimit
exports.priorityQueue=priorityQueue
exports.queue=queue
exports.reduce=reduce
exports.reduceRight=reduceRight
exports.reject=reject
exports.rejectLimit=rejectLimit
exports.rejectSeries=rejectSeries
exports.retry=retry
exports.seq=seq
exports.series=series
exports.setImmediate=setImmediate$1
exports.some=some
exports.someLimit=someLimit
exports.sortBy=sortBy
exports.times=times
exports.timesLimit=timeLimit
exports.timesSeries=timesSeries
exports.transform=transform
exports.unmemoize=unmemoize
exports.until=until
exports.waterfall=waterfall
exports.whilst=whilst
exports.all=every
exports.any=some
exports.forEach=each
exports.forEachSeries=eachSeries
exports.forEachLimit=eachLimit
exports.forEachOf=eachOf
exports.forEachOfSeries=eachOfSeries
exports.forEachOfLimit=eachOfLimit
exports.inject=reduce
exports.foldl=reduce
exports.foldr=reduceRight
exports.select=filter
exports.selectLimit=filterLimit
exports.selectSeries=filterSeries
exports.wrapSync=asyncify})
