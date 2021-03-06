var param={};
$(document).ready(function(){
	initParams();
	queryBusInfoList();
});

function initParams(){
	//初始化省市
	initArea($("#province"), $("#city"));
	//初始化分页条
	initPagingToolbar(queryBusInfoList);
	//初始化查询按钮
	$("#queryBtn").on("click",function(){
		setPagingToolbarParams(0, 0, 1);
		queryBusInfoList();
	});
	//初始化导出按钮
	initExportBtn($("#exportBtn"),$("#conditionFrom"),$("#fileName").val());
}

function queryBusInfoList(){
	param={};
	param.keyword = $.trim($("#keyword").val());
	param.province = $("#province option:selected").val();
    param.city = $("#city option:selected").val();
	param.pageindex = $.trim($("#currentPage").val());
	param.pagelimit = PAGE_LIMIT;
	param.tm = new Date().getTime();
	
	var tbody = $("#busInfoTable").find("tbody");
	var html = '';
	$.ajax({
		type:"POST",
		url:'business/busInfo_queryList.action',
		data:param,
		dataType:'json',
        cache: false,
        success: function(data,options){
        	 if(data.page){
        		 tbody.empty();
        		 var dataList = data.page.root;
        		 var province;
        		 var city;
        		 $(dataList).each(function(index,item){
        			 province = getNotNullData(item.provinceDesc);
        			 city = getNotNullData(item.cityDesc);
        			 html += '<tr>';
        			 html += '<td>'+item.id+'</td>';
        			 html += getTdHtml(item.busName, 15);
        			 html += '<td>'+province+(province!="" && city!= ""?",":"")+city+'</td>';
        			 html += getTdHtml(item.address, 15);
        			 html += getTdHtml(item.busDomain, 15);
        			 html += '<td>'+getNotNullData(item.tel)+'</td>';
        			 html += '<td>'+getNotNullData(item.addTimeStr)+'</td>';
        			 html += '<td>';
//            			 html += '<a href="person/userInfoDetail.action?infoid='+item.id+'" data-toggle="tooltip" title="详细"><span class="glyphicon glyphicon-list-alt"></span></a>';
        			 html += '<a href="business/busInfoDetail.action?infoid='+item.id+'">详细</a>';
        			 html += '</td>';
        			 html += '</tr>';
        		 });
        		 tbody.html(html);
        		 
        		 var currentPage = data.page.startRow/(data.page.endRow-data.page.startRow)+1;
        		 var totalPage = Math.ceil(data.page.totalProperty/(data.page.endRow-data.page.startRow));
        		 setPagingToolbarParams(data.page.totalProperty, totalPage,currentPage);
        	 }else{
             	showMsg(data.message, data.errormsg);
             }
         }
     });
}

















