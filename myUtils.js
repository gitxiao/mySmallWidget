var myUtils = {};
var level_ = 1;
function _getSpace(level){
	var ret = "";
	for (var i = 0;i < level;i ++){
		ret = ret + "    ";
	}
	if (level > 1) {
		ret = ret + "|-  ";
	}
	return ret;
}
//t: 打印object,会循环遍历打印每一层,
//maxLevel: 为最大层数,默认为1
//type_name：打印指定类型的子对象
//当type_name!='object'时，不打印值为null的类型为object的数据
//自动插入空格使object层次分明
function myPrint(t,sign,maxLevel,type_name){
	maxLevel = maxLevel ? maxLevel : 1;
	if(typeof(t) != 'object'){
		console.log(typeof(t) + ": " + sign + " = " + t);
		return;
	}
	var v;
	
	for (var k in t){
		try{
			v = t[k];
			if (typeof(k) == "number") {
				k = "[" + k + "]";
			}
			if (maxLevel < level_){
				return;
			}
			if((type_name && typeof(v) == type_name) || !type_name) {
				if(!(!v && typeof(v) == 'object') || type_name == 'object'){
					if(typeof(v) == 'function'){
						console.log(_getSpace(level_) + typeof(v) + ":	" + k);
					}else{
						console.log(_getSpace(level_) + typeof(v) + ":	" + k + " = " + v);
					}
				}
			}
			if (typeof(v) == "object"){
				level_ = level_ + 1;
				myPrint(v, k, maxLevel,type_name);
				level_ = level_ - 1;
			}
		}catch(e){
			console.log(_getSpace(level_) + "异常 k = " + k + ", e = " + e);
		}
	}
}

/**打印对象里面的内容*/
myUtils.printObject = function(t,sign,maxLevel,typename){
	//return;
	console.log(typeof(t) + ": " + sign + " >>>");
	myPrint(t,sign,maxLevel,typename);
	console.log(typeof(t) + ": " + sign + " <<<");
}
		
//往有规律的一组name相同的控件中填充内容data, 这组控件的id要以name开头
myUtils.fillContents = function(name,data){
	var nameLength = name.length
	var txts = document.getElementsByName(name); 	//获取所有name=ddxq 的标签
    for (var i = 0; i < txts.length; i++) { 			//循环遍历标签
    	var id = txts[i].id;
    	$("#" + id).html(data[id.substr(nameLength,id.length)]);
    }
}

// 对Date的扩展，将 Date 转化为指定格式的String 
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) 
{ //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
}

//json返回的日期通常都是/Date(1354648740000)/这样的格式，下面的函数可以转换成常用的格式 如：2012-12-05 15:26:22.810
myUtils.jsonDateFormat = function(jsonDate) {
    try {
        var date = new Date(parseInt(jsonDate.replace("/Date(", "").replace(")/", ""), 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var milliseconds = date.getMilliseconds();
        return date.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    } catch (ex) {
        return "";
    }
}

//table加载数据时的过滤器, 可以避免出现反复刷新数据时第二页无法显示的问题
myUtils.pagerFilter = function(data){
	if (typeof data.length == 'number' && typeof data.splice == 'function'){	// is array
		data = {
			total: data.length,
			rows: data
		}
	}
	var dg = $(this);
	var opts = dg.datagrid('options');
	var pager = dg.datagrid('getPager');
	pager.pagination({
		onSelectPage:function(pageNum, pageSize){
			opts.pageNumber = pageNum;
			opts.pageSize = pageSize;
			pager.pagination('refresh',{
				pageNumber:pageNum,
				pageSize:pageSize
			});
			dg.datagrid('loadData',data);
		}
	});
	if (!data.originalRows){
		data.originalRows = (data.rows);
	}
	var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
	var end = start + parseInt(opts.pageSize);
	data.rows = (data.originalRows.slice(start, end));
	return data;
}

//刷新一个表的选中行的数据
myUtils.refreshTableSelectedRow = function(tab){
//	var row = $("#uidg").datagrid("getSelected");
//  var index = $("#uidg").datagrid('getRowIndex', row);
//  $("#uidg").datagrid('refreshRow', index);
	
//	var row = $("#" + tableId).datagrid("getSelected");
//  var index = $("#" + tableId).datagrid('getRowIndex', row);
//  $("#" + tableId).datagrid('refreshRow', index);

	var row = tab.datagrid("getSelected");
    var index = tab.datagrid('getRowIndex', row);
    tab.datagrid('refreshRow', index);
}


/**判断是否为不包含小数点的数字*/
myUtils.checknumber = function(str) { 
var letters = "1234567890"; 
var i; 
var c; 
for( i = 0; i < str.length(); i ++ )   {   //Letters.length() ->>>>取字符长度
c = str.charAt(i); 
if (letters.indexOf(c) == -1)   { //在"Letters"中找不到"c"   见下面的此函数的返回值
return false; 
}
}
	return true; 
} 

/**
 * 判断字符串是否为空
 * @param {Object} str
 * @return {TypeName} 
 */
myUtils.myStringIsEmpty = function(str){
	return str === '' || str === null || str === undefined || str == null;
}

myUtils.myalert = function(spara){
	alert(spara);
}

/**
 *添加一个cookie
 *该函数接收3个参数：cookie名称，cookie值，以及在多少小时后过期。这里约定expiresHours为0时不设定过期时间，即当浏览器关闭时cookie自动消失
 * @param {Object} name
 * @param {Object} value
 * @param {Object} expiresHours
 */
myUtils.addCookie = function(name,value,expiresHours){ 
	var cookieString = name + "=" + escape(value);
	//判断是否设置过期时间 
	if(expiresHours != null && expiresHours > 0){ 
		var date = new Date(); 
		date.setTime(date.getTime + expiresHours * 3600 * 1000); 
		cookieString = cookieString + "; expires=" + date.toGMTString(); 
	} 
	document.cookie = cookieString;
	console.log('addCookie document.cookie = ' + document.cookie);
} 

/**
 * 获取指定名称的cookie值
 * 该函数返回名称为name的cookie值，如果不存在则返回空，
 */
myUtils.getCookie = function(name){ 
	var strCookie = document.cookie; 
	var arrCookie = strCookie.split("; "); 
	for(var i = 0;i < arrCookie.length;i++){ 
		var arr = arrCookie[i].split("="); 
		if(arr[0] == name) {
			return arr[1]; 
		}
	} 
	return ""; 
} 

/**
 * 删除指定名称的cookie
 * @param {Object} name
 */
myUtils.deleteCookie = function(name){ 
	var date = new Date(); 
	date.setTime(date.getTime() - 10000); 
	document.cookie = name + "=v; expires=" + date.toGMTString(); 
}

/**
 * data:从数据库获取的键值对数据列表, 转化为只包含value值2维数组并返回. 用于jquery table中的数据展示
 */
myUtils.getValueArray = function(data){
	var array = [];
	var index = 0;
	var x,y,xx,yy;
	for(x in data){
		y = data[x];
		array[index] = [];
		for (xx in y){
			array[index].push(y[xx]);
			//array[index].push('<a href="http://baidu.com">' + y[xx] + '</a>');
			//console.log('y[xx],xx = ' + y[xx] + "," + xx);
		}
		index ++;
	}
	return array;
}

//对象转化成数组(一维)
myUtils.transform = function(obj){
    var arr = [];
    for(var item in obj){
        arr.push(obj[item]);
    }
    return arr;
}

//删除组件中指定标签名的元素
myUtils.removeChilds = function(node,tagName,beginIdx){
	var childs = node.find(tagName);
	for(var i = beginIdx; i < childs.length; i++){ 
		var childNode = childs[i]; //总是删除第i个, 因为每删除一次, node的长度都会发生变化
		node[0].removeChild(childNode); 
	} 
}

myUtils.showLoading = function(show,callback,nodelay){
	if($('.page-loader')[0]) {
		if(show){
			$('.page-loader').fadeIn();
		}else{
			if(nodelay){
		        $('.page-loader').fadeOut();
		        if(callback != null){
		        	callback();
		        }
			}else{
			    setTimeout (function () {
			        $('.page-loader').fadeOut();
			        if(callback != null){
			        	callback();
			        }
			    }, 500);
			}
		}
	}
}

myUtils.copyObject = function(from,to){
	for(var key in from){
		to[key] = from[key];
	}
}

myUtils.getArgFromHref = function(sHref,sArgname){
 	var args = sHref.split('?');
 	var retval = '';
 	if(args[0] == sHref){
 		return retval;
 	}
 	var str = args[1];
 	
 	args = str.split('&');
 	for(var i = 0;i < args.length;i ++){
 		str = args[i];
 		var arg = str.split('=');
 		if(arg.length <= 1) {
 			//console.log('arg.length <= 1');
	 			continue;
	 		}
	 		if(arg[0] == sArgname){
	 			retval = arg[1];
	 		}
	 	}
 		return retval;
 }