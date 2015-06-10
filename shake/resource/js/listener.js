	//测试该js文件是否加载的方法
	var ceshi_listener = function(){
		alert("ceshi:ceshi_listener加载成功！");
	}

	var listenShake = function(){
//		alert("listenShake监听开始！allowShake:"+ allowShake);
//		alert("shakeStart时间开始！");
		shakeStart();
		//要做的事情
		setTimeout(function(){
			//alert("line 13 : setTimeout");
//			alert(data);
//			tools.getAllInformation( data );
//			if(tools.getAllInformation(data)){
//				alert("data");
//			}
			
//			if ( tools.caches.nearPosition ) {
//				alert("line 75: tools.caches.nearPosition");
//			//更新文字列表
//				tools.updataList( document, oMarkerBox, listEvent, shakeCallback );
//			} else {
//				tools.getCurrentPosition(function(){
//					alert("line 25: getCurrentPosition");
//					this.getNearInformation( this.caches.currentPosition, function(){
//						this.updataList( document, oMarkerBox, listEvent, shakeCallback );
//					} );
//				});//缓存用户当前坐标
//			};
			
			//alert("line 33"+getAllInformation(data));
			//getAllInformation(data);	//解析当前所有的学校位置，分别为
			getCurrentLocation();		//当前的坐标位置，保存到缓冲集合 caches.currentPosition中
			//alert("line36");
//			alert("line37 caches"+caches);
//			var arr_pos = caches.currentPosition;
//			alert("line42 currentPosition"+caches.currentPosition);
//			alert("line43 caches.currentPosition( "+caches.currentPosition[0] +", " +caches.currentPosition[1]+")");
			
		}, 800);//800ms后出现摇一摇的结果
		
	};
	
	var updateMap = function( aPosition ) {
		alert("----mapupdate");
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
		map.panTo( mapPoint );
	};

	//HTML5获取当前地址位置
	function getCurrentLocation(){
		var geolocation = new BMap.Geolocation();
		//alert("--------------------------------------------")
		//alert("测试document子对象"+ document.getElementById("list"));
		//alert("geolocation : "+geolocation);
		//异步 调用获取位置信息
		geolocation.getCurrentPosition( function(r){
			//alert("line 41: x = "+r.point.lng);
	//				if(geolocation.getStatus() == BMAP_STATUS_SUCCESS){
			//map.panTo(r.point); 
			//alert("00000");
			//this.tools.caches.currentPosition = [r.point.lng, r.point.lat];//缓存用户当前坐标
			caches.currentPosition = [r.point.lng, r.point.lat];
			//alert("line58 caches.currentPosition "+caches.currentPosition);
			//alert("line59 caches.currentPosition[0] "+caches.currentPosition[0]);
			//alert("line60 caches.currentPosition[1] "+caches.currentPosition[1]);
			
			//alert("line64 getNearInformation 开始");
			getNearInformation(caches.currentPosition, function(){
				//updateList( document, document/*在地图上创建的标注标签 oMarkerBox*/, listEvent, shakeCallback );
				shakeEnd();
			});

			//callBack && callBack.call( this );
	//				}
	//				else {
	//					alert("无法获取地理位置信息！");
	//				}       
		}.bind(this), {enableHighAccuracy: true} );		
	};
	
	function shakeEnd(){
		
		var subString = function( str, len ) {
			return str.length > len ? str.substring(0, len) + '...' : str;
		};
		
		//保留1位小数（强制）
		var changeOneDecimal = function( floatvar ) {
			var f_x = parseFloat(floatvar);
			if ( isNaN(f_x) ) {
				alert('不是数字，无法保留一位小数！');
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
		
		var getKM = function( distance ) {
			//alert("changeOneDecimal = "+changeOneDecimal(1.213131321));
			return changeOneDecimal( distance/1000 );
		};
		//web
		var guoji = caches.guojiyingyu;
		
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
	}
	
	var bind = function( obj, evname, fn ){
		if( obj.addEventListener ){
			obj.addEventListener( evname, fn, false );
		} else {
			obj.attachEvent( "on" + evname, function(){
				fn.call( obj );
			});
		};
	};
	
	var updateList = function( list, markerBox, listEvent, callBack ) {
		
		var guoji = caches.guojiyingyu[0];
		var web_eng = document.getElementById("web-eng");
		var web_eng_address = document.getElementById("web-eng-address");
		var web_eng_distance = document.getElementById("web-eng-distance");
		
		web_eng.innerHTML = guoji.nearShopName[0];
		web_eng_address.innerHTML = nearAddress[0];
		web_eng_distance.innerHTML = nearDistance[0];
		
		
		
		
		var str = "";
		var aLi = document.getElementsByTagName('li');
		
		list = document.createElement("list");
		markerBox = document.createElement('div');
		var oMap = document.getElementById('webmap');
		oMap.appendChild( oMarkerBox );
		
		var aLiPosition = []; //需要 展示位置信息
		var aLiShopType = [];	//展示的产品类型
		var aLiShopName = [];	//展示的名称
		var aLiAddress = [];	//展示的地址
		var aLiDistance = [];	//展示的距离
		var aLiPhone = [];	//电话
		var aLiUrl = [];	//URL
			
		//截取字符串
		var subString = function( str, len ) {
			return str.length > len ? str.substring(0, len) + '...' : str;
		};
		
		//保留1位小数（强制）
		var changeOneDecimal = function( floatvar ) {
			var f_x = parseFloat(floatvar);
			if ( isNaN(f_x) ) {
				alert('不是数字，无法保留一位小数！');
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
		
		//转换为KM单位
		var getKM = function( distance ) {
			//alert("changeOneDecimal = "+changeOneDecimal(1.213131321));
			return changeOneDecimal( distance/1000 );
		};
		
		//添加展示的内容
		var setGuojiyingyuAndKaixindouContent = function( nearPosition, nearShopType, nearShopName, nearAddress, nearDistance, nearPhone, nearUrl, nearIcon ) {
			str += '<li>\
						<strong>'+ nearShopType +' - '+ subString(nearShopName, 18) +'</strong>\
						<p>'+ subString(nearAddress, 12) +'</p>\
						<p><u>'+ getKM( nearDistance ) +'</u>千米</p>\
						<em class="'+ nearIcon +'"></em>\
						<span></span>\
					</li>';
			aLiPosition.push( nearPosition );
			aLiShopType.push( nearShopType );
			aLiShopName.push( nearShopName );
			aLiAddress.push( nearAddress );
			aLiDistance.push( nearDistance );
			aLiPhone.push( nearPhone );
			aLiUrl.push( nearUrl );
		};
		
		var setHaowaijiao = function(){
			str += "<li>一条网线的距离</li>";
		};
		//分别展示guojiyingyu  &	kaixindou
		var aType = ['guojiyingyu', 'kaixindou'/*, 'haowaijiao'*/];
		//因为微博好外教是网上学校，所以特殊处理
		for ( var i = 0, iLen = aType.length; i < iLen; i ++ ) {
			var aTypeData = caches.guojiyingyu[i];
			setGuojiyingyuAndKaixindouContent(
				aTypeData.nearPosition[0],
				aTypeData.nearShopType[0],
				aTypeData.nearShopName[0],
				aTypeData.nearAddress[0],
				aTypeData.nearDistance[0],
				aTypeData.nearPhone[0],
				aTypeData.nearUrl[0],
				aTypeData.nearIcon[0]
			);
		};
		//展示好外教
		setHaowaijiao();
		list.innerHTML = str;
		
		//添加事件监听（点击，跑到地图页面）
		for ( var i = 0, iLen = aLi.length; i < iLen; i ++ ) {
			;(function( i ){//此处获取aRan用于确保 地图显示的信息 与 当前被点击的列表信息 一致
				bind( aLi[i], 'click', function(){
					markerBox.innerHTML = '<span>\
											  <strong>'+ aLiShopType[i] +'-'+(function(){
												  return aLiShopType[i] == 'weibo' ? '<br />' + aLiShopName[i] : aLiShopName[i];
											})()+'</strong>\
											  <p>'+ aLiAddress[i] +'</p>\
											  <p><em><u>'+ this.getKM( aLiDistance[i] ) +'</u>公里</em></p>\
										  </span>\
										  '+(function(){
											  	var sPhone = aLiPhone[i], sUrl = aLiUrl[i];
												if ( sPhone && sUrl ) {
													return '<bdo><em class="url"><img src="*">'+ sPhone +'<a href="'+ sUrl +'">了解更多&nbsp;>></a></em></bdo>';
												} else if ( sPhone && !sUrl ) {
													return '<bdo><em><img src="*"/>'+ sPhone +'</em></bdo>';
												} else {
													return '';
												};
											})();
					updateMap( aLiPosition[i] );
					listEvent && listEvent();
					
				}.bind(this) );
			}.bind(this))( i );
		};
		callBack && callBack( iLen );
	};
	
	var updateMap = function( aPosition ) {
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
		map.panTo( mapPoint );
	};
	
	var initTypeData = function( opts ) {
		//alert("initTypeData : "+opts);
		opts.ShopType = [];
		opts.ShopName = [];
		opts.Address = [];
		opts.Phone = [];
		opts.Url = [];
		opts.Position = [];
	};
	
	var getAllInformation = function( data ) {
		//alert("line 86 getAllInformation : data　＝　"+data[0].province);
		//韦博国际英语
		var aGuojiyingyu = caches.guojiyingyu = {}; 
		//alert(caches.guojiyingyu[0]);
		initTypeData( aGuojiyingyu );
			
		//韦博开心豆少儿英语
		var aKaixindou = caches.kaixindou = {};
		initTypeData( aKaixindou );
		
		//韦博好外教 	网络学校 无实体店，网线的距离
		var aHaowaijiao = caches.haowaijiao = {};
		initTypeData( aHaowaijiao );
		
		for ( var i = 0, iLen = data.length; i < iLen; i ++ ) {
			var dataCity = data[i].city;
			
			for ( var j = 0, jLen = dataCity.length; j < jLen; j ++ ) {
				var dataCount = dataCity[j].count;
				
				for ( var k = 0, kLen = dataCount.length; k < kLen; k ++ ) {
					//alert("line 97 dataCity[j].count =  "+kLen);	//测试解析数据
					//分类缓存内容
					switch( dataCount[k].shopType ) {
						case '韦博国际英语':
							aGuojiyingyu.ShopType.push( dataCount[k].shopType );
							//alert("line 106 aGuojiyingyu.ShopType.push( dataCount[k].shopType ) =  "+aGuojiyingyu.ShopType);	//测试解析数据
							//alert("line 107 caches.guojiyingyu =   "+caches.guojiyingyu[0]);	//测试解析数据
							aGuojiyingyu.ShopName.push( dataCount[k].shopName );
							aGuojiyingyu.Address.push( dataCount[k].address );
							aGuojiyingyu.Phone.push( dataCount[k].phone );
							aGuojiyingyu.Url.push( dataCount[k].url );
							aGuojiyingyu.Position.push( [dataCount[k].x, dataCount[k].y] );
							caches.guojiyingyu = aGuojiyingyu;
//							alert(caches.guojiyingyu.ShopName);
							break;
						case '韦博开心豆少儿英语' :
							aKaixindou.ShopType.push( dataCount[k].shopType );
							aKaixindou.ShopName.push( dataCount[k].shopName );
							aKaixindou.Address.push( dataCount[k].address );
							aKaixindou.Phone.push( dataCount[k].phone );
							aKaixindou.Url.push( dataCount[k].url );
							aKaixindou.Position.push( [dataCount[k].x, dataCount[k].y] );
							caches.kaixindou = aGuojiyingyu;
							break;
						case '韦博好外教':
							aHaowaijiao.ShopType.push( dataCount[k].shopType );
							aHaowaijiao.ShopName.push( dataCount[k].shopName );
							aHaowaijiao.Address.push( dataCount[k].address );
							aHaowaijiao.Phone.push( dataCount[k].phone );
							aHaowaijiao.Url.push( dataCount[k].url );
							aHaowaijiao.Position.push( [dataCount[k].x, dataCount[k].y] );
							caches.haowaijiao = aHaowaijiao;
							break;
						default: break;
					};
				};
			};
		};
	};
	
	var getNearInformation = function( currentPosition, callBack ) {
		//alert("line142 getNearInformation 开始");
		//alert("line143 caches.currentPosition( "+currentPosition[0] +", " +currentPosition[1]+")");
		var minPointLen = caches.minChoose;
		var	maxPointLen = caches.maxChoose;
		
		//alert("显示条数：minPointLen = "+ minPointLen + ", maxPointLen = " + maxPointLen);
		
		//遍历 -- 国际英语的位置，计算附近距离 --
		var aGuojiyingyu = caches.guojiyingyu;
		var	guojiyingyu_position = aGuojiyingyu.Position;	//获取所有好外教的经纬度信息集合
		//alert("国际英语的位置集合 ： guojiyingyu_position[0]" + guojiyingyu_position[0]);
		var	guojiyingyu_distance = [];	//两点间的距离集合
		var	guojiyingyu_oldDistance = [];	//缓存上一次保存的 两点间距离，用于比较大小
		
		aGuojiyingyu.nearShopType = [];		//最近的公司类型
		aGuojiyingyu.nearShopName = [];		//最近公司的名称
		aGuojiyingyu.nearAddress = [];	//最近公司的地址
		aGuojiyingyu.nearPhone = [];	//最近公司的电话
		aGuojiyingyu.nearUrl = [];		//最近公司的链接
		aGuojiyingyu.nearPosition = [];	//最近公司经纬度信息
		aGuojiyingyu.nearDistance = [];	//最近公司的距离
		aGuojiyingyu.nearIcon = [];	//最近公司的log图标
		
		//计算距离
		var getDistance = function( aPointA, aPointB ) {
			var pointA = new BMap.Point(aPointA[0], aPointA[1]);
			var pointB = new BMap.Point(aPointB[0], aPointB[1]);
			//返回的单位是 米，此处的 Math.random()/10000 用来生成距离唯一标识符。作用：避免距离完全相等而导致获取的数据是同一条！
			return Number((map.getDistance(pointA,pointB)).toFixed(4)) + Math.random()/10000;
		};
		//计算 距离
		//alert("line 178 开始计算距离 guojiyingyu_position");
		for(var i=0, iLen = guojiyingyu_position.length; i < iLen; i++){
//			var point = new BMap.Point(guojiyingyu_position[i][0], guojiyingyu_position[i][1]);
			var	iTmpDistance =  getDistance( guojiyingyu_position[i], currentPosition );
			
			//alert("当前位置和"+ aGuojiyingyu.ShopName[i]+"的距离  = "+iTmpDistance);
			guojiyingyu_distance.push( iTmpDistance );
			guojiyingyu_oldDistance.push( iTmpDistance );
		};
		//alert("guojiyingyu_distance.sort(function(a, b){return a-b}); //排序");
		guojiyingyu_distance.sort(function(a, b){return a-b}); //排序
		
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
			
		for(var i=0, iLen = kaixindou_position.length; i < iLen; i++){
			var iTmpDistance = getDistance( kaixindou_position[i], currentPosition );
			//alert("当前位置和"+ aKaixindou.ShopName[i]+"的距离  = "+iTmpDistance);
			kaixindou_distance.push( iTmpDistance );
			kaixindou_oldDistance.push( iTmpDistance );
		};
		kaixindou_distance.sort(function(a, b){return a-b});
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
			
		for(var i=0, iLen = haowaijiao_position.length; i < iLen; i++){
			var iTmpDistance = getDistance( haowaijiao_position[i], currentPosition );
			//alert("当前位置和"+ aHaowaijiao.ShopName[i]+"的距离  = "+iTmpDistance);
			haowaijiao_distance.push( iTmpDistance );
			haowaijiao_oldDistance.push( iTmpDistance );
		};
		haowaijiao_distance.sort(function(a, b){return a-b});
		//alert("----------haowaijiao_distance.sort---------------");
		
		//只寻找一个最近的公司
		for ( var i = 0; i < maxPointLen; i ++ ) {
			//附近国际英语
			for ( var j = 0, jLen = guojiyingyu_oldDistance.length; j < jLen; j ++ ) {
				if ( guojiyingyu_distance[i] == guojiyingyu_oldDistance[j] ) {
					aGuojiyingyu.nearShopType.push( aGuojiyingyu.ShopType[j] );
					aGuojiyingyu.nearShopName.push( aGuojiyingyu.ShopName[j] );
					aGuojiyingyu.nearAddress.push( aGuojiyingyu.Address[j] );
					aGuojiyingyu.nearPhone.push( aGuojiyingyu.Phone[j] );
					aGuojiyingyu.nearUrl.push( aGuojiyingyu.Url[j] );
					aGuojiyingyu.nearPosition.push( guojiyingyu_position[j] );
					aGuojiyingyu.nearDistance.push( guojiyingyu_oldDistance[j] );
					aGuojiyingyu.nearIcon.push('guojiyingyu');
					break;
				};
			};
			//附近韦博开心豆少儿英语
			for ( var j = 0, jLen = kaixindou_oldDistance.length; j < jLen; j ++ ) {
				if ( kaixindou_distance[i] == kaixindou_oldDistance[j] ) {
					aKaixindou.nearShopType.push( aKaixindou.ShopType[j] );
					aKaixindou.nearShopName.push( aKaixindou.ShopName[j] );
					aKaixindou.nearAddress.push( aKaixindou.Address[j] );
					aKaixindou.nearPhone.push( aKaixindou.Phone[j] );
					aKaixindou.nearUrl.push( aKaixindou.Url[j] );
					aKaixindou.nearPosition.push( kaixindou_position[j] );
					aKaixindou.nearDistance.push( kaixindou_oldDistance[j] );
					aKaixindou.nearIcon.push('kaixindou');
					break;
				};
			};
			
			//附近韦博好外教
			for ( var j = 0, jLen = haowaijiao_oldDistance.length; j < jLen; j ++ ) {
				if ( haowaijiao_distance[i] == haowaijiao_oldDistance[j] ) {
					aHaowaijiao.nearShopType.push( aHaowaijiao.ShopType[j] );
					aHaowaijiao.nearShopName.push( aHaowaijiao.ShopName[j] );
					aHaowaijiao.nearAddress.push( aHaowaijiao.Address[j] );
					aHaowaijiao.nearPhone.push( aHaowaijiao.Phone[j] );
					aHaowaijiao.nearUrl.push( aHaowaijiao.Url[j] );
					aHaowaijiao.nearPosition.push( haowaijiao_position[j] );
					aHaowaijiao.nearDistance.push( haowaijiao_oldDistance[j] );
					aHaowaijiao.nearIcon.push('haowaijiao');
					break;
				};
			};
		};
		callBack && callBack.call( this );
	};
	
	//点击文字列表的接口
	var listEvent = function(){
			allowShake = false;
		};
	
	//摇一摇的接口
	var shakeStart = function(){//摇一摇一开始立即执行该函数
			allowShake = false;
	};
	var shakeCallback = function( iCount ){//摇一摇更新数据之后执行该函数
		//动画部分 结束后要做的事情
	};
	
