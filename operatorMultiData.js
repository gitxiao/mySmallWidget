function OperatorMultiData(param){
	var self = this;
	self.tabledata = null;			//表格数据
	self.editIndex = null;			//选中进行编辑的表格索引
	self.maxId = null;				//添加数据时的id,每添加一行,自动加一
	self.oriMaxId = null;
	
	self.tableId = param.tableId;
	self.modalId = param.modalId;
	self.columns = param.columns;
	self.objName = param.objName;
	self.deleteUrl = param.deleteUrl;
	self.addOpen = param.addOpen;	//是否开启添加数据功能
	self.editable = param.editable == false ? false : true;
	self.search = param.search;
	
	self.operationFomatter = function(value, row, index){
		var formatter;
		var data = $('#' + self.tableId).bootstrapTable('getData');
		//if(self.tabledata && self.tabledata.length > index){
		if(data && data.length > index){
			formatter = '<a id="' + index + '" onclick="' + self.objName + '.deleteData(' + value + "," + JSON.stringify(row).replace(/"/g, '&quot;') + "," + index + ');">删除</a>';
		}else{
			formatter = '<a id="' + index + '" onclick="' + self.objName + '.editData(' + value + "," + JSON.stringify(row).replace(/"/g, '&quot;') + "," + index + ');">添加</a>';
		}
		return formatter;
	}
	
	self.tooltipFomatter = function(value, row, index){
		var formatter = '<span data-toggle="tooltip" title="' + value + '">' + value + '</span>';
		if(value || value == 0){
			return formatter;
		}else{
			return null;
		}
	}
	
	//根据formatter名称设置对应名称的匹配函数
	for(var key in self.columns){
		if(self.columns[key].formatter && typeof self.columns[key].formatter == 'string'){
			self.columns[key].formatter = self[self.columns[key].formatter];
			continue;
		}
	}
	
	self.initTableData = function(data){
		//var data = [{lineType:1,deviceFactory:1,lineConsumption:1,deviceState:1,mainSpec:1,hardness:1,glueType:1,changeCycle:1}];
		self.tabledata = data;
		$('#' + self.tableId).bootstrapTable({
			uniqueId: "id",
			striped: true,
			search:self.search,
			clickToSelect: true,
			columns: self.columns,
			onDblClickRow:self.onDblClickRow,
			//onClickRow:onClickRow,
			//data:data
		});
		if(self.tabledata && self.tabledata.length > 0){
			$('#' + self.tableId).bootstrapTable('load',self.tabledata);
			self.maxId = self.tabledata[self.tabledata.length - 1].id;		//记录当前数据表中最大的id值,新添加的数据要在此值基础上加一
		}else{
			$('#' + self.tableId).bootstrapTable('removeAll');
			self.maxId = 0;
		}
		self.oriMaxId = self.maxId;		//最大id初始值
		if(self.addOpen){
			self.appendEmpty();
		}
	}
	
	self.appendEmpty = function(){
		var empty = [{}];
		for(var key in self.columns){
			if(self.columns[key].field){
				empty[0][self.columns[key].field] = null;
			}
		}
		//console.log('self.appendEmpty 添加空而不是-')
		//$('#' + self.tableId).bootstrapTable('append',[{lineType:'-',deviceFactory:'-',lineConsumption:'-',deviceState:'-',mainSpec:'-',hardness:'-',glueType:'-',changeCycle:'-'}]);
		$('#' + self.tableId).bootstrapTable('append',empty);
		self.tabledata = $('#' + self.tableId).bootstrapTable('getData');
	}
	
	self.onDblClickRow = function(row,element,field){
		//myUtils.printObject(row,'row');
		//myUtils.printObject(element,'element');
		//myUtils.printObject(field,'field');
		//console.log(element.attr('data-index'));
		if(self.editable){
			self.editData(null,row,element.attr('data-index'));
		}
	}
	
	//编辑和添加数据
	self.editData = function(value, row, index){
		self.editingData = row;
		self.editIndex = index;
		console.log('self.editData self.editIndex,self.tabledata.length,self.maxId = ' + self.editIndex + ',' + self.tabledata.length + ',' + self.maxId);
		$('#' + self.modalId).modal('toggle');
		$('#' + self.modalId + ' input').each(function(){
			$(this).val((row && (row[this.id] || row[this.id] == 0) && row[this.id] != '-') ? row[this.id] : null);
		});
		$('#' + self.modalId + ' select').each(function(){
			$(this).selectpicker('val',(row && row[this.id] && row[this.id] != '-') ? row[this.id] : -1);
		})
	}
	self.deleteData = function(value, row, index){
		console.log('删除 index,row.id = ' + index + ',' + row.id);
		myShowLoading(true);
		$.post(self.deleteUrl,{para:row.id},function(errorInfo){
			myShowLoading(false);
			if(errorInfo.errorNum == 200){
				$('#' + self.tableId).bootstrapTable('removeByUniqueId',row.id);
				self.tabledata = $('#' + self.tableId).bootstrapTable('getData');
			}else{
				myDialog.alert(errorInfo.info ? errorInfo.info : '删除失败,请稍后重试');
			}
		},"json");
	}
	
	//完成模态框中的编辑
	self.commitModalData = function(newid){
		if(!self.tabledata){
			self.tabledata = [];								//如果表格数据为空,说明一条数据都没有,则初始化一个空数据数组
		}
		if(self.editIndex >= self.tabledata.length - 1){			//编辑的索引超出了表格数据条数,说明是添加数据
			self.tabledata[self.editIndex] = {};				//加一条新数据
			self.tabledata[self.editIndex].id = newid ? newid : (self.maxId + 1);
			self.maxId ++;
			console.log('添加数据 新id = ' + self.tabledata[self.editIndex].id);
			self.appendEmpty();
		}else{
			console.log('修改数据');
		}
		console.log('self.commitModalData self.editIndex,self.tabledata.length,self.maxId = ' + self.editIndex + ',' + self.tabledata.length + ',' + self.maxId);
		$('#' + self.modalId + ' input,#' + self.modalId + ' select:not(.donotsave)').each(function(){
			//console.log('self.editIndex = ' + self.editIndex);
			//console.log('this.id = ' + this.id);
			//console.log('$(this).val() = ' + $(this).val());
			self.tabledata[self.editIndex][this.id] = $(this).val();//新数据key值与dom元素id值相同
		});
		
		$('#' + self.tableId).bootstrapTable('load',self.tabledata);
		$('#' + self.modalId).modal('toggle');
	}
	
	return self;
}
