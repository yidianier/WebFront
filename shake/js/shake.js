
/* global param */
var allowShake = true;

var isShake = false;
var isShakeChoiceWeb = false;
var isShakeChoiceKxd = false;
var isShakeMap = false;

var data = dataSource;
    
//缓存配置  //最小选择的条数 最大选择的条数
var caches = {"minChoose" : 1, "maxChoose" : 1};

/*-----------function declare-------------*/
var bind = function( obj, evname, fn ){
    if( obj.addEventListener ){
        obj.addEventListener( evname, fn, false );
    } else {
        obj.attachEvent( "on" + evname, function(){
            fn.call( obj );
        });
    };
};

function subString( str, len ) {
	return str.length > len ? str.substring(0, len) + '...' : str;
};
		
//保留1位小数（强制）
var changeOneDecimal = function( floatvar ) {
	var f_x = parseFloat(floatvar);
	if ( isNaN(f_x) ) {
		alert('该对象不是数字，无法保留一位小数！');
		return false;
	};
	var f_x = Math.round(f_x*10)/10;
	var s_x = f_x.toString();
	var pos_decimal = s_x.indexOf('.');
	if (pos_decimal < 0) {
		pos_decimal = s_x.length;
		s_x += '.';
	};
	while ( s_x.length <= pos_decimal + 1 ) {
		s_x += '0';
	};
	return s_x;
};
		
function getKM( distance ) {
	//alert("changeOneDecimal = "+changeOneDecimal(1.213131321));
	return changeOneDecimal( distance/1000 );
};

var initTypeData = function ( opts ) {
    //alert("initTypeData : "+opts);
    opts.ShopType = [];
    opts.ShopName = [];
    opts.Address = [];
    opts.Phone = [];
    opts.Url = [];
    opts.Position = [];
};

var getAllInformation = function ( data ) {

    //alert("line 86 getAllInformation : data　＝　"+data[0].province);
    //韦博国际英语
    var aGuojiyingyu = caches.guojiyingyu = {};
    //alert(caches.guojiyingyu[0]);
    initTypeData(aGuojiyingyu);

    //韦博开心豆少儿英语
    var aKaixindou = caches.kaixindou = {};
    initTypeData(aKaixindou);

    //韦博好外教 	网络学校 无实体店，网线的距离
    var aHaowaijiao = caches.haowaijiao = {};
    initTypeData(aHaowaijiao);
    for (var i = 0, iLen = data.length; i < iLen; i++) {
        var dataCity = data[i].city;

        for (var j = 0, jLen = dataCity.length; j < jLen; j++) {
            var dataCount = dataCity[j].count;

            for (var k = 0, kLen = dataCount.length; k < kLen; k++) {
                //alert("line 97 dataCity[j].count =  "+kLen);	//测试解析数据
                //分类缓存内容
                switch (dataCount[k].shopType) {
                    case '韦博国际英语':
                        aGuojiyingyu.ShopType.push(dataCount[k].shopType);
                        //alert("line 106 aGuojiyingyu.ShopType.push( dataCount[k].shopType ) =  "+aGuojiyingyu.ShopType);	//测试解析数据
                        //alert("line 107 caches.guojiyingyu =   "+caches.guojiyingyu[0]);	//测试解析数据
                        aGuojiyingyu.ShopName.push(dataCount[k].shopName);
                        aGuojiyingyu.Address.push(dataCount[k].address);
                        aGuojiyingyu.Phone.push(dataCount[k].phone);
                        aGuojiyingyu.Url.push(dataCount[k].url);
                        aGuojiyingyu.Position.push([dataCount[k].x, dataCount[k].y]);
                        caches.guojiyingyu = aGuojiyingyu;
                        //							alert("100"+caches.guojiyingyu.ShopName);
                        break;
                    case '韦博开心豆少儿英语':
                        aKaixindou.ShopType.push(dataCount[k].shopType);
                        aKaixindou.ShopName.push(dataCount[k].shopName);
                        aKaixindou.Address.push(dataCount[k].address);
                        aKaixindou.Phone.push(dataCount[k].phone);
                        aKaixindou.Url.push(dataCount[k].url);
                        aKaixindou.Position.push([dataCount[k].x, dataCount[k].y]);
                        caches.kaixindou = aGuojiyingyu;
                        break;
                    case '韦博好外教':
                        aHaowaijiao.ShopType.push(dataCount[k].shopType);
                        aHaowaijiao.ShopName.push(dataCount[k].shopName);
                        aHaowaijiao.Address.push(dataCount[k].address);
                        aHaowaijiao.Phone.push(dataCount[k].phone);
                        aHaowaijiao.Url.push(dataCount[k].url);
                        aHaowaijiao.Position.push([dataCount[k].x, dataCount[k].y]);
                        caches.haowaijiao = aHaowaijiao;
                        break;
                    default: break;
                };
            };
        };
    };
};

//缓存 解析的所有公司信息
getAllInformation(data);   //解析当前所有的学校位置到caches

function getNearInformation( cPosition, callBack ) {
    //alert("line142 getNearInformation 开始");
    //alert("line143 caches.currentPosition( "+cPosition[0] +", " +cPosition[1]+")");
    var minPointLen = caches.minChoose;
    var maxPointLen = caches.maxChoose;

    //alert("显示条数：minPointLen = "+ minPointLen + ", maxPointLen = " + maxPointLen);

    //遍历 -- 国际英语的位置，计算附近距离 --
    var aGuojiyingyu = caches.guojiyingyu;
    var guojiyingyu_position = aGuojiyingyu.Position;	//获取所有好外教的经纬度信息集合
    //alert("国际英语的位置集合 ： guojiyingyu_position[0]" + guojiyingyu_position[0]);
    var guojiyingyu_distance = [];	//两点间的距离集合
    var guojiyingyu_oldDistance = [];	//缓存上一次保存的 两点间距离，用于比较大小

    aGuojiyingyu.nearShopType = [];		//最近的公司类型
    aGuojiyingyu.nearShopName = [];		//最近公司的名称
    aGuojiyingyu.nearAddress = [];	//最近公司的地址
    aGuojiyingyu.nearPhone = [];	//最近公司的电话
    aGuojiyingyu.nearUrl = [];		//最近公司的链接
    aGuojiyingyu.nearPosition = [];	//最近公司经纬度信息
    aGuojiyingyu.nearDistance = [];	//最近公司的距离
    aGuojiyingyu.nearIcon = [];	//最近公司的log图标

    //计算距离
    var getDistance = function ( aPointA, aPointB ) {
        var pointA = new BMap.Point(aPointA[0], aPointA[1]);
        var pointB = new BMap.Point(aPointB[0], aPointB[1]);
        //返回的单位是 米，此处的 Math.random()/10000 用来生成距离唯一标识符。作用：避免距离完全相等而导致获取的数据是同一条！
        return Number((hidden_map.getDistance(pointA,pointB)).toFixed(4)) + Math.random()/10000;
    };
    //计算 距离
    //alert("line 178 开始计算距离 guojiyingyu_position");
    for (var i = 0, iLen = guojiyingyu_position.length; i < iLen; i++) {
        //			var point = new BMap.Point(guojiyingyu_position[i][0], guojiyingyu_position[i][1]);
        var iTmpDistance = getDistance(guojiyingyu_position[i], cPosition);
        //alert("当前位置和"+ aGuojiyingyu.ShopName[i]+"的距离  = "+iTmpDistance);
        guojiyingyu_distance.push(iTmpDistance);
        guojiyingyu_oldDistance.push(iTmpDistance);
    };
    //alert("guojiyingyu_distance.sort(function(a, b){return a-b}); //排序");
    guojiyingyu_distance.sort(function (a, b) { return a - b }); //排序

    //alert("----------guojiyingyu_distence.sort---------------");

    //遍历 -- 开心豆少儿英语 位置，计算附近距离 --
    var aKaixindou = this.caches.kaixindou;
    var kaixindou_position = aKaixindou.Position;
    var kaixindou_distance = [];
    var kaixindou_oldDistance = [];

    aKaixindou.nearShopType = [];
    aKaixindou.nearShopName = [];
    aKaixindou.nearAddress = [];
    aKaixindou.nearPhone = [];
    aKaixindou.nearUrl = [];
    aKaixindou.nearPosition = [];
    aKaixindou.nearDistance = [];
    aKaixindou.nearIcon = [];

    for (var i = 0, iLen = kaixindou_position.length; i < iLen; i++) {
        var iTmpDistance = getDistance(kaixindou_position[i], cPosition);
        //alert("当前位置和"+ aKaixindou.ShopName[i]+"的距离  = "+iTmpDistance);
        kaixindou_distance.push(iTmpDistance);
        kaixindou_oldDistance.push(iTmpDistance);
    };
    kaixindou_distance.sort(function (a, b) { return a - b });
    //alert("----------kaixindou_distance.sort---------------");

    //遍历 -- 韦博好外教 位置，计算附近距离 --
    var aHaowaijiao = this.caches.haowaijiao;
    var haowaijiao_position = aHaowaijiao.Position;
    var haowaijiao_distance = [];
    var haowaijiao_oldDistance = [];

    aHaowaijiao.nearShopType = [];
    aHaowaijiao.nearShopName = [];
    aHaowaijiao.nearAddress = [];
    aHaowaijiao.nearPhone = [];
    aHaowaijiao.nearUrl = [];
    aHaowaijiao.nearPosition = [];
    aHaowaijiao.nearDistance = [];
    aHaowaijiao.nearIcon = [];

    for (var i = 0, iLen = haowaijiao_position.length; i < iLen; i++) {
        var iTmpDistance = getDistance(haowaijiao_position[i], cPosition);
        //alert("当前位置和"+ aHaowaijiao.ShopName[i]+"的距离  = "+iTmpDistance);
        haowaijiao_distance.push(iTmpDistance);
        haowaijiao_oldDistance.push(iTmpDistance);
    };
    haowaijiao_distance.sort(function (a, b) { return a - b });
    //alert("----------haowaijiao_distance.sort---------------");

    //只寻找一个最近的公司
    for (var i = 0; i < maxPointLen; i++) {
        //附近国际英语
        for (var j = 0, jLen = guojiyingyu_oldDistance.length; j < jLen; j++) {
            if (guojiyingyu_distance[i] == guojiyingyu_oldDistance[j]) {
                aGuojiyingyu.nearShopType.push(aGuojiyingyu.ShopType[jLen-1]);
                aGuojiyingyu.nearShopName.push(aGuojiyingyu.ShopName[jLen-1]);
                aGuojiyingyu.nearAddress.push(aGuojiyingyu.Address[jLen-1]);
                aGuojiyingyu.nearPhone.push(aGuojiyingyu.Phone[jLen-1]);
                aGuojiyingyu.nearUrl.push(aGuojiyingyu.Url[jLen-1]);
                aGuojiyingyu.nearPosition.push(guojiyingyu_position[jLen-1]);
                aGuojiyingyu.nearDistance.push(guojiyingyu_oldDistance[jLen-1]);
                aGuojiyingyu.nearIcon.push('guojiyingyu');
                break;
            };
        };
        //附近韦博开心豆少儿英语
        for (var j = 0, jLen = kaixindou_oldDistance.length; j < jLen; j++) {
            if (kaixindou_distance[i] == kaixindou_oldDistance[j]) {
                aKaixindou.nearShopType.push(aKaixindou.ShopType[j]);
                aKaixindou.nearShopName.push(aKaixindou.ShopName[j]);
                aKaixindou.nearAddress.push(aKaixindou.Address[j]);
                aKaixindou.nearPhone.push(aKaixindou.Phone[j]);
                aKaixindou.nearUrl.push(aKaixindou.Url[j]);
                aKaixindou.nearPosition.push(kaixindou_position[j]);
                aKaixindou.nearDistance.push(kaixindou_oldDistance[j]);
                aKaixindou.nearIcon.push('kaixindou');
                break;
            };
        };

        //附近韦博好外教
        for (var j = 0, jLen = haowaijiao_oldDistance.length; j < jLen; j++) {
            if (haowaijiao_distance[i] == haowaijiao_oldDistance[j]) {
                aHaowaijiao.nearShopType.push(aHaowaijiao.ShopType[j]);
                aHaowaijiao.nearShopName.push(aHaowaijiao.ShopName[j]);
                aHaowaijiao.nearAddress.push(aHaowaijiao.Address[j]);
                aHaowaijiao.nearPhone.push(aHaowaijiao.Phone[j]);
                aHaowaijiao.nearUrl.push(aHaowaijiao.Url[j]);
                aHaowaijiao.nearPosition.push(haowaijiao_position[j]);
                aHaowaijiao.nearDistance.push(haowaijiao_oldDistance[j]);
                aHaowaijiao.nearIcon.push('haowaijiao');
                break;
            };
        };
    };
    callBack && callBack.call(this);
};

//点击文字列表的接口
var listEvent = function () {
    allowShake = false;
};

//摇一摇的接口
var shakeStart = function () {//摇一摇一开始立即执行该函数
    allowShake = false;
};

var shakeCallback = function ( iCount ) {//摇一摇更新数据之后执行该函数
    //动画部分 结束后要做的事情
};

var getLocation = function () {
    //Get geo location  
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getCurrentLocation, handleError, { enableHighAccuracy: true });  
    } else {  
        alert("Your browser cannot support the geo-location service by HTML5!");
    }
};

function handleError(value) {  
    switch (value.code) {  
        case 1:  
            alert("位置服务被拒绝"); 
            break;  
        case 2:  
            alert("暂时获取不到位置信息");  
            break;  
        case 3:  
            alert("获取信息超时");  
            break;  
        case 4:  
            alert("未知错误");  
            break;
        default:
            break;
    }  
};

var getUrlParam = function( param ) {
    var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
};

var updateMap = function( aPosition ) {
    var web_map = new BMap.Map("webmap");
alert(aPosition[0]);
    //清除之前所有标注 
    var allOverlay = web_map.getOverlays();
    for (var i = 0; i < allOverlay.length; i++){
        web_map.removeOverlay(allOverlay[i]);
    };
    
    //创建标注
    var mapPoint = new BMap.Point(aPosition[0], aPosition[1]);
    var marker = new BMap.Marker( mapPoint );
        
    web_map.addOverlay( marker );
    //地图显示
    web_map.centerAndZoom(mapPoint, 15); 
    web_map.panTo( mapPoint );
};


var shakeEnd = function() {

    var longitude=getUrlParam("longitude");//这里获取fileData的值
    var latitude=getUrlParam("latitude");

    var cPosition = [];

    cPosition.push(longitude);
    cPosition.push(latitude);

    //web
    var guoji = caches.guojiyingyu;

    getNearInformation(cPosition, function(){
    });

    alert(guoji.nearShopName[0]);

    var web_eng = document.getElementById("web-eng");
    var web_eng_address = document.getElementById("web-eng-address");
    var web_eng_distance = document.getElementById("web-eng-distance");

    web_eng.innerHTML = subString(guoji.nearShopName[0], 18);
    web_eng_address.innerHTML = subString(guoji.nearAddress[0], 12);
    web_eng_distance.innerHTML = getKM(guoji.nearDistance[0]);

    //kxd
    var kxd = caches.kaixindou;

    var kxd_eng = document.getElementById("kxd-eng");
    var kxd_eng_address = document.getElementById("kxd-eng-address");
    var kxd_eng_distance = document.getElementById("kxd-eng-distance");

    kxd_eng.innerHTML = subString(kxd.nearShopName[0], 18);
    kxd_eng_address.innerHTML = subString(kxd.nearAddress[0], 12);
    kxd_eng_distance.innerHTML = getKM(kxd.nearDistance[0]);
};

function getCurrentLocation(p) {
    var longitude = p.coords.longitude+0.01085;
    var latitude = p.coords.latitude+0.00368;

    var cPosition = [];
    cPosition.push(longitude);
    cPosition.push(latitude);

    if (isShake) {
        //alert(1);
        isShake = false;
        getNearInformation(cPosition, function(){
            window.location = "shake_choice.html?longitude="+longitude+"&latitude="+latitude;
        });
    }
    if (isShakeChoiceWeb) {
        //alert(21);
        isShakeChoiceWeb = false;
        getNearInformation(cPosition, function(){
            window.location.href = "shake_map.html?webParam=web&longitude="+longitude+"&latitude="+latitude;
        });
    }
    if (isShakeChoiceKxd) {
        //alert(22);
        isShakeChoiceKxd = false;
        getNearInformation(cPosition, function(){
            window.location.href = "shake_map.html?kxdParam=kx&longitude="+longitude+"&latitude="+latitude;
        });
    }
    if (isShakeMap) {
        // Empty;
    }
    
};

/*-----------shake-------------*/
/* shake entrance */

/*-----------shake choice-------------*/
/* shake_choice entrance */
$(function() {
    $("#web-link").click(function() {
        //window.location.href = "shake_map.html?webParam=web";
        isShakeChoiceWeb = true;
        getLocation();
    });
    $("#kxd-link").click(function() {
        //window.location.href = "shake_map.html?kxdParam=kxd";
        isShakeChoiceKxd = true;
        getLocation();
    });
    $("#hwj-link").click(function() {
        window.location.href = "#";
    });
});

/*-----------shake map-------------*/
/* shake_map entrance */
$(function() {
    var longitude=getUrlParam("longitude");//这里获取fileData的值
    var latitude=getUrlParam("latitude");

    var cPosition = [];
    cPosition.push(longitude);
    cPosition.push(latitude);

    var webParam=getUrlParam("webParam");//这里获取fileData的值
    var kxdParam=getUrlParam("kxdParam");//这里获取fileData的值

    if (webParam){
        //web     
        var guoji = caches.guojiyingyu;

        getNearInformation(cPosition, function(){
        });

        var map_info_name = document.getElementById("map-info-name");
        var map_info_address = document.getElementById("map-info-address");
        var dis_number = document.getElementById("dis-number");

        map_info_name.innerHTML = subString(guoji.nearShopName[0], 18);
        map_info_address.innerHTML = subString(guoji.nearAddress[0], 12);
        dis_number.innerHTML = getKM(guoji.nearDistance[0]);

        //updateMap(cPosition);
        updateMap(guoji.Position);
    }
    if (kxdParam){
        //kxd
        var kxd = caches.kaixindou;

        getNearInformation(cPosition, function(){
        });

        var map_info_name = document.getElementById("map-info-name");
        var map_info_address = document.getElementById("map-info-address");
        var dis_number = document.getElementById("dis-number");

        map_info_name.innerHTML = subString(kxd.nearShopName[0], 18);
        map_info_address.innerHTML = subString(kxd.nearAddress[0], 12);
        dis_number.innerHTML = getKM(kxd.nearDistance[0]);

        //updateMap(cPosition);
        updateMap(kxd.Position);
    }
});
/*-----------nav return-------------*/
$(function() {
    $(".shake-nav").click(function() {
        
    });
    $(".shake-return-choice").click(function() {
        alert(1);
        isShake = true;
        getLocation();
        window.location.href = "shake.html";
    });
    $(".shake-return-map").click(function() {
        alert(2);
        allowShake = true;
        window.location.href = "shake_choice.html";
    });
});