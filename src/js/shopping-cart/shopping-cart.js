/*
*作者：岳奔
*时间：2018年10月1号
*
*/
//获得表格数据
var purchNum = [{id:-1,num:-1}] ;   //记录所有商品的采购数量

$(function(){
    $('#table-shopping-tableShow').bootstrapTable({
        url: AJAX_URL.shoppingCart,
        method: requestJson ? 'get' : 'post',                      //请求方式（*）
        dataType: "json",
        //toolbar: '#toolbar',              //工具按钮用哪个容器
        striped: false,                      //是否显示行间隔色
        paginationShowPageGo: false,         //是否开启跳转翻页功能
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: false,                   //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        sidePagination: "client",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                      //初始化加载第一页，默认第一页,并记录
        pageSize: 10,                     //每页的记录行数（*）
        pageList: [10, 25, 50, 100],        //可供选择的每页的行数（*）
        search: false,                      //是否显示表格搜索
        strictSearch: true,
        //showColumns: true,                  //是否显示所有的列（选择显示的列）
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        //height: 500,                      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "id",                     //每一行的唯一标识，一般为主键列
        showToggle: false,                   //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        //得到查询的参数
        queryParams : function (params) {
            //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            var temp = {
                rows: params.limit,                         //页面大小
                page: (params.offset / params.limit) + 1,   //页码
                sort: params.sort,      //排序列名
                sortOrder: params.order //排位命令（desc，asc）
            };
            return temp;
        },
        columns: [{
            checkbox: true,
            visible: true,                 //是否显示复选框
            //防止修改采购数量时选中了该行
            formatter: function (value,row,index) {
                return '<span id="span-click-'+row.id+'"></span>';
            }
        },{
            field: 'equipName',
            title: '设备名称',
            align: 'center',
            valign: 'middle'
        },{
            field: 'equipNum',
            title: '设备编号',
            align: 'center',
            valign: 'middle'
        },{
            field:'id',
            title:'采购数量',
            align: 'center',
            valign: 'middle',
            clickToSelect: false,
            //采购数量控制
            formatter:function(value,row,index){
                let a = '<div class="equip-num-cz"><div class="button-equip-down"><button onclick="'+'selectNumById('+row.id+",'down')"+'">-</button></div>';
                let b = '<div class="button-equip-up"><button onclick="'+'selectNumById('+row.id+",'up')"+'">+</button></div></div>';
                let c = '<div class="equip-num"><button disabled><span id="span-equip-num-'+row.id+'">1</span></button></div>';
                return a + c + b;
            }
        },{
            field:'id',
            title: '操作',
            align: 'center',
            valign: 'middle',
            formatter:function(value,row,index){
                //通过formatter可以自定义列显示的内容
                //value：当前field的值，即id
                //row：当前行的数据
                let c = '<a class="shopping-delete" href="#" >删除</a>';
                return c;
            }
        } ],
        onLoadSuccess: function (e) {
            console.log(e)
        },
        onLoadError: function () {
            console.log("数据加载失败！");
        },
        onDblClickRow: function (row, $element) {
        },
        //客户端分页，需要指定到rows
        responseHandler: function(data){
            return data.rows;
        },
        //选择商品时计数
        onCheck: function () {
            shoppingNum ();
        },
        //取消选择时计数
        onUncheck:function () {
            shoppingNum ();
        },
        //全选时
        onCheckAll:function () {
            shoppingNum ();
            $('input.input-shopping-all').prop('checked',$('table#table-shopping-tableShow>thead>tr>th>div.th-inner>input[name="btSelectAll"]').prop('checked'));
        },
        //取消全选
        onUncheckAll:function () {
            shoppingNum ();
            $('input.input-shopping-all').prop('checked',$('table#table-shopping-tableShow>thead>tr>th>div.th-inner>input[name="btSelectAll"]').prop('checked'));
        }
    });
})

//获取所有商品个数
$(window).on("load",function () {
    $('span.span-shopping-allNum').text(eachShopping());
})

var allNum = 0;     //记录全部商品数
//遍历商品
function eachShopping(){
    $('table#table-shopping-tableShow>tbody>tr').each(function(){
        allNum +=1;
    });
    console.log("全部商品数:"+allNum);
    return allNum;
}


//选择的商品数
function shoppingNum () {
    let num = 0;  //记录总商品数
    $('table#table-shopping-tableShow>tbody>tr>td.bs-checkbox>input[type="checkbox"]:checked').each(function () {
        num += 1;
    });
    $('span.span-shopping-payNum').text(num);
}

//全选商品
$('input.input-shopping-all').click(function () {
    $('table#table-shopping-tableShow>thead>tr>th>div.th-inner>input[name="btSelectAll"]').trigger('click');
})


//操作商品的采购数量
function selectNumById(shopId,operCz) {
    $('table#table-shopping-tableShow>tbody>tr>td.bs-checkbox >span#span-click-'+shopId).trigger('click');
    let n = 0;
    let onePurch = {id:null,num:null};      //保存一个商品的采购数量
    $.each(purchNum,function () {
        n++;
        if(this.id==shopId){
            if(operCz=='up'){
                this.num += 1;
                $('#span-equip-num-'+shopId).text(this.num);
                return ;
            }else if(operCz=='down'){
                if(this.num<=1){
                    console.log("采购数量不能为零！！！");
                    return ;
                }
                this.num -= 1;
                $('#span-equip-num-'+shopId).text(this.num);
                return ;
            }
        }
        if(n==purchNum.length){
            if(operCz=='up'){
                onePurch.id = shopId;
                onePurch.num = 2;
                let x = purchNum.push(onePurch);
                $('#span-equip-num-'+shopId).text(2);
            }else if(operCz=='down'){
                console.log("采购数量不能为零！！！");
                return ;
            }
        }
    })
}


