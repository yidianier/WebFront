var allowShake = true;
var data = dataSource;
//缓存配置	//最小选择的条数 最大选择的条数
var caches = {"minChoose" : 1, "maxChoose" : 1};
//var oList;
//自定义markerBox
//var oMap = document.getElementById('allmap');
//var oMarkerBox = document.createElement('div');
//var oMap.appendChild( oMarkerBox );
//缓存 解析的所有公司信息
getAllInformation(data);	//解析当前所有的学校位置到caches

var map = new BMap.Map("webmap");
//百度地图API功能
/* var map = new BMap.Map("allmap");
var xP = 121.445438;
var yP = 31.201789;
map.centerAndZoom(new BMap.Point(xP,yP), 17); //中心窗口 */

function init(){
	//alert("init() 开始初始化！");
	if (window.DeviceMotionEvent) {
		//alert(window.DeviceMotionEvent);
		var speed = 20;
		var x = y = z = lastX = lastY = lastZ = 0;
		var shakePhone = document.getElementById("shake-phone");
		//移动端的位移感应配置监听devicemotion
		window.addEventListener('devicemotion', function(){
			var acceleration = event.accelerationIncludingGravity;
			x = acceleration.x;
			y = acceleration.y;
			if (Math.abs(x-lastX) > speed || Math.abs(y-lastY) > speed) {
				//摇一摇结束后
				if ( allowShake ) {
	//				audio.play();
					//ceshi_dataSource();
					//alert(data);
					//ceshi_listener();
					//alert(data[0].province);
					//alert("ul:"+document.getElementById("list"));
					//alert("li"+document.getElementsByTagName("li"));
					//getCurrentLocation();		//测试当前的坐标位置
					window.location.href="myshake2_choice.html";
					//listenShake();
//					if (shakePhone) {
//						var css3animation = "animation" || "-webkit-animation";
//						shakePhone.style[css3animation] = "shake-hands .4s ease";
//					}
				};
			};
			lastX = x;
			lastY = y;
		}, false);
	} else {
	//	if ( !window.bBindShake ) {
	//		tools.bind( document, 'click', function(){
	//			//摇一摇结束后
	//			if ( allowShake ) {
	//				audio.play();
	//				listenShake();
	//			};
	//		} );
	//		window.bBindShake = true;
	//	};
		alert('您的手机暂不支持摇一摇功能！');
	}; 
}

/* onload function */
window.onload = init();
//window.onload = function() {
	var shakePhone = document.getElementById("shake-phone");
//	if (shakePhone) {
//		//var css3animation = "animation-play-state" || "-webkit-animation-play-state";
//		shakePhone.style[css3animation] = "running";
//	}
/*	shakePhone.addEventListener("webkitAnimationStart", function() {
		var css3animation = "animation" || "-webkit-animation";
		shakePhone.style[css3animation] = "shake-hands .4s ease";
	}, false);*/
//}

/* -- myshake map */

function getUrlParam(paras){
	var reg = new RegExp("(^|&)" + paras + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
var webParam=getUrlParam("webParam");//这里获取fileData的值
var kxdParam=getUrlParam("kxdParam");//这里获取fileData的值
alert(caches.currentPosition);

webParam = "web";

$(document).ready(function() {
	if (webParam){
		var point = ['121', '31'];
		updateMap(point);
	}
	if (kxdParam){
		updateMap(caches.currentPosition);
	}
});

var updateMap = function( aPosition ) {
	var map = new BMap.Map("webmap");
	//清除之前所有标注 
	var allOverlay = map.getOverlays();
	for (var i = 0; i < allOverlay.length; i++){
		map.removeOverlay(allOverlay[i]);
	};
	
	//创建标注
	var mapPoint = new BMap.Point(aPosition[0], aPosition[1]);
	var marker = new BMap.Marker( mapPoint );
		
	map.addOverlay( marker );
	//地图显示
	map.centerAndZoom(mapPoint, 15); 
	map.panTo( mapPoint );
};

/* myshake map -- */