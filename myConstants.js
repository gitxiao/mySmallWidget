var myConstants = {};

//var opertionUrl = "http://wy.chunfengyun.com/scnt/services/"
//var opertionUrl = "http://192.168.33.56:8080/scnt/services/"
var backUrl = "services/";
var voteUrl = "../services/";
//var contractUrl = "http://localhost:8080/YXCRMservice/services/"
	
var CO_USERNAME = 'co_yxcrm_username';
var CO_USERTYPE = 'co_yxcrm_usertype';

var DUTY_CHANGZHANG = 0;
var DUTY_YUANGONG = 1;

var STATE_DEAD = 0;
var STATE_LIVE = 1;
var STATE_UNPASS = 2;
var STATE_PASS = 3;

var SEX_NAMES = ['男','女'];
var DUTY_NAMES = ['','护士','医生'];
var STATE_NAMES = ['已删除','未审核','不通过','通过'];
var EDUCATION_NAMES = ['','学士','硕士','博士','博士后'];
myConstants.SEX_NAMES = ['男','女'];
myConstants.DUTY_NAMES = ['','护士','医生'];
myConstants.STATE_NAMES = ['已删除','未审核','不通过','通过'];
myConstants.EDUCATION_NAMES = ['','学士','硕士','博士','博士后'];

myConstants.VOTE_STATE = ['已删除','未发布','已发布','已关闭'];

var SELECTOR = ['input:not(.donotsave)','select:not(.donotsave)'];

//datatable中文
var datatable_lan_cn = {  
    'emptyTable': '没有数据',  
    'loadingRecords': '加载中...',  
    'processing': '查询中...',  
    'search': '检索:',  
    'lengthMenu': '每页 _MENU_ 条',  
    'zeroRecords': '没有数据',  
    'paginate': {  
        'first':      '第一页',  
        'last':       '最后一页',  
        'next':       '下一页',  
        'previous':   '上一页'  
    },  
    'info': '第 _PAGE_ 页 / 总 _PAGES_ 页',  
    'infoEmpty': '没有数据',  
    'infoFiltered': '(过滤总件数 _MAX_ 条)'  
}

