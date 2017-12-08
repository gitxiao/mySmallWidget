var idTmr; 

function ieMethod(tableid)  
{  
	var curTbl = document.getElementById(tableid);  
    var oXL = new ActiveXObject("Excel.Application");  
    var oWB = oXL.Workbooks.Add();  
    var oSheet = oWB.ActiveSheet;  
    var Lenr = curTbl.rows.length;  
    for (i = 0; i < Lenr; i++)  
    {	var Lenc = curTbl.rows(i).cells.length;  
        for (j = 0; j < Lenc; j++)  
        {  
            oSheet.Cells(i + 1, j + 1).value = curTbl.rows(i).cells(j).innerText;  
  
        }  
  
    }  
    oXL.Visible = true;  
}  
       

function  getExplorer() {  
    var explorer = window.navigator.userAgent.toLowerCase();  
    console.log('explorer = ' + explorer);
    //ie  
    if (explorer.indexOf("msie") >= 0 || explorer.indexOf("rv:11") >= 0) {  
        return 'ie';  
    }  
    //firefox  
    else if (explorer.indexOf("firefox") >= 0) {  
        return 'Firefox';  
    }  
    //Chrome  
    else if(explorer.indexOf("chrome") >= 0){  
        return 'Chrome';  
    }  
    //Opera  
    else if(explorer.indexOf("opera") >= 0){  
        return 'Opera';  
    }  
    //Safari  
    else if(explorer.indexOf("safari") >= 0){  
        return 'Safari';  
    }  
}  
function outExcel(tableid) {  
    if(getExplorer()=='ie')  
    {  
        ieMethod(tableid);
    }else{  
        tableToExcel(tableid)  
    }  
}  
function Cleanup() {  
    window.clearInterval(idTmr);  
    CollectGarbage();  
}  
var tableToExcel = (function() {  
    var uri = 'data:application/vnd.ms-excel;base64,',  
    template = '<html><head><meta charset="UTF-8"></head><body><table>{table}</table></body></html>',  
    base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) },  
    format = function(s, c) {  
        return s.replace(/{(\w+)}/g,  
                function(m, p) { return c[p]; }) }  
    return function(table, name) {  
        if (!table.nodeType) table = document.getElementById(table)  
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}  
        window.location.href = uri + base64(format(template, ctx))  
    }  
})() 