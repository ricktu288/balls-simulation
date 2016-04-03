window.addEventListener('DOMContentLoaded', function()
{
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	ballImage = document.getElementById('ballImage');
	ballImage1 = document.getElementById('ballImage1');
	
	window.addEventListener('resize',resizeCanvas);
	resizeCanvas();
	
	document.getElementById('Slider1').addEventListener('input',function(e){
		var mSlider=e.target;
		renderer.Slider1Changed(mSlider.value*1);
	});
	
	document.getElementById('Slider2').addEventListener('input',function(e){
		var mSlider=e.target;
		renderer.Slider2Changed(mSlider.value*1);
	});
	
	document.getElementById('Slider3').addEventListener('input',function(e){
		var mSlider=e.target;
		renderer.Slider3Changed(mSlider.value*1);
	});
	
	document.getElementById('Slider4').addEventListener('input',function(e){
		var mSlider=e.target;
		renderer.Slider4Changed(mSlider.value*1);
	});
	
	document.getElementById('btnRestart').addEventListener('click',function(e){
		renderer.btnRestartClicked();
	});
	
	document.getElementById('stepperUp').addEventListener('click',function(e){
		renderer.btnAddClicked();
	});
	
	document.getElementById('stepperDown').addEventListener('click',function(e){
		renderer.btnRemoveClicked();
	});
	
	document.getElementById('segment1').addEventListener('click',function(e){
		renderer.segmentedChanged(0);
	});
	
	document.getElementById('segment2').addEventListener('click',function(e){
		renderer.segmentedChanged(1);
	});
	
	document.getElementById('segment3').addEventListener('click',function(e){
		renderer.segmentedChanged(2);
	});
	
	document.getElementById('segment4').addEventListener('click',function(e){
		renderer.segmentedChanged(3);
	});
	
	document.getElementById('switch1').addEventListener('click',function(e){
		var mSwitch=e.target;
		if (mSwitch.checked) {
			renderer.touchModeChanged(1);
		}
		else
		{
			renderer.touchModeChanged(0);
		}
	});
	
	window.addEventListener('devicemotion', function(e) {
		if(e.accelerationIncludingGravity.x && e.accelerationIncludingGravity.y)renderer.accelerometer(e.accelerationIncludingGravity);
	});	
	
	dragging=false;
	
	canvas.addEventListener('mousedown', function(e) {
		e.preventDefault();
		renderer.touchesBegan(0,e.pageX,e.pageY);
		dragging=true;
	});	
	
	canvas.addEventListener('mousemove', function(e) {
		e.preventDefault();
		if(dragging)renderer.touchesMoved(0,e.pageX,e.pageY);
	});	
	
	canvas.addEventListener('mouseup', function(e) {
		e.preventDefault();
		renderer.touchesEnded(0,e.pageX,e.pageY);
		dragging=false;
	});	
	
	touch_id=[];
	for(var i=0; i<10; i++)
	{
		touch_id[i]=-1;
	}
	
	
	canvas.addEventListener('touchstart', function(e) {
		e.preventDefault();
		var touches = e.changedTouches;
		var touch;
		var i;
		for (var n=0;n<touches.length;n++)
		{
			touch=touches[n];
			i=touch_id.indexOf(-1);
			if(i==-1)return;
			touch_id[i]=touch.identifier;
			renderer.touchesBegan(i,touch.pageX,touch.pageY);
		}
	});	
	
	canvas.addEventListener('touchmove', function(e) {
		e.preventDefault();
		var touches = e.changedTouches;
		var touch;
		for (var n=0;n<touches.length;n++)
		{
			touch=touches[n];
			renderer.touchesMoved(touch_id.indexOf(touch.identifier),touch.pageX,touch.pageY);
		}
	});	
	
	canvas.addEventListener('touchend', function(e) {
		e.preventDefault();
		var touches = e.changedTouches;
		var touch;
		var i;
		for (var n=0;n<touches.length;n++)
		{
			touch=touches[n];
			i=touch_id.indexOf(touch.identifier);
			touch_id[i]=-1;
			renderer.touchesEnded(i,touch.pageX,touch.pageY);
		}
	});	
	
	canvas.addEventListener('touchcancel', function(e) {
		e.preventDefault();
		var touches = e.changedTouches;
		var touch;
		var i;
		for (var n=0;n<touches.length;n++)
		{
			touch=touches[n];
			i=touch_id.indexOf(touch.identifier);
			touch_id[i]=-1;
			renderer.touchesEnded(i,touch.pageX,touch.pageY);
		}
	});	
	
	
	
	
	renderer.init();
	window.requestAnimationFrame(drawView);
});

function resizeCanvas()
{
	canvas.width = document.getElementById('panel').offsetWidth;
	canvas.height = document.getElementById('panel').offsetTop;
}

function drawView()
{
	renderer.render();
	window.requestAnimationFrame(drawView);
}


