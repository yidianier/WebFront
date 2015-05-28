var SHAKE_THRESHOLD = xxx;    
var last_update = 0;    
var x, y, z, last_x, last_y, last_z;
        
function deviceMotionHandler(eventData) {    
	var acceleration =eventData.accelerationIncludingGravity;    
	var curTime = newDate().getTime();    
	if ((curTime - lastUpdate)> 100) {      
		var diffTime = curTime -last_update;    
		last_update = curTime;        
		x = acceleration.x;    
		y = acceleration.y;    
		z = acceleration.z;    
		var speed = Math.abs(x +y + z - last_x - last_y - last_z) / diffTime * 10000;        
		if (speed > SHAKE_THRESHOLD) {    
			alert("shaked!");    
		}    
		last_x = x;    
		last_y = y;    
		last_z = z;    
	}
}

window.onload = function() {
	if (window.DeviceMotionEvent) {  
		window.addEventListener('devicemotion',deviceMotionHandler, false);  
	} 
};
