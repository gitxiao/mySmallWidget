var myDialog = {}

myDialog.closeCB = function(){
	if(self.cb){
		self.cb();
	}
}

myDialog.alert = function(info,domId,cb){
	self.cb = cb;
	var domId = domId ? domId : 'myAlert';
	var alr = $("#" + domId);
	var ahtml = "<div class='alert alert-success fade in' id='myAlert' style='position: absolute;left:25%;top:40%;width:50%;text-align:center;'>" +
	  			"<strong>警告内容</strong>" +
	  			"<a onclick='myDialog.closeCB()' class='close' data-dismiss='modal'>&times;</a>" +
	  			"</div>";

	alr.html(ahtml);    // 复原
	//alr.find('.ok').removeClass('btn-success').addClass('btn-primary');
	//alr.find('.cancel').hide();
	alr.find('strong').html(info);
	alr.modal();
}

alert = function(info,domId,cb){
	myDialog.alert(info,domId,cb);
}