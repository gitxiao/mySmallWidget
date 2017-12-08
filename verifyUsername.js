
function verifyUsername(successCb,errorCb){
	myUtils.showLoading(true);
	username = getCookies(CO_USERNAME);
	console.log('username = ' + username);
	if(username && username != 'null'){
		myUtils.showLoading(true);
		console.log('调用服务器验证');
		$.post(backUrl + "user/findByUsername",{userName:username},function(data){
			myUtils.showLoading(false);
			checkUsername(data,successCb,errorCb);
		},"json");
	}else{
		console.log('调用验证失败');
		errorCb();
	}
}
function checkUsername(data,successCb,errorCb){
	if(data.errorNum == 100){
		//setWyqgCookies(CO_USER_DEPARTID,data.para);		//记录登录用户的部门id
		successCb();
	}else{
		errorCb();
	}
}