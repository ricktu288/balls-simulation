renderer = {
	init: function()
	{
        
		this.a=1;
		this.r=39;
		
		this.vd=0.95 ;
		
		this.g=3;
		
		this.deviceTilt={x:0,y:0.1};
		
		this.air_res=0;
		
		this.adding_mode=0;
		
		this.touch_mode=0;
		
		this.touched_ball=[];
		this.touch_x=[];
		this.touch_y=[];
		this.touch_x_1=[];
		this.touch_y_1=[];
		
		this.x=[];
		this.y=[];
		this.Vx=[];
		this.Vy=[];
		this.ball_mode=[];
		
		for(var i=0;i<10;i++)
			this.touched_ball[i]=-1;
		
		this.num=10;
		
		for (var i=0; i<this.num; i++) {
			this.x[i]=Math.random()*canvas.width;
			this.y[i]=Math.random()*canvas.height;
			this.Vx[i]=-10+10*Math.random();
			this.Vy[i]=-10+10*Math.random();
			this.ball_mode[i]=0;
		}
		this.DeltaT=0.1;

	},

	accelerometer: function(acceleration)
	{
		this.deviceTilt.x = -0.1*acceleration.x;
		this.deviceTilt.y = 0.1*acceleration.y;
	},
	
	
	render: function()
	{
		ctx.clearRect(0,0,canvas.width,canvas.height);
		this.Picture();
	},

	Picture: function()
	{
		for (var i=0; i<10; i++) {
			if (this.touched_ball[i]>=0) {
				this.touch_x_1[i]=this.touch_x[i];
				this.touch_y_1[i]=this.touch_y[i];
				if (this.ball_mode[this.touched_ball[i]]!=1) {
					this.Vx[this.touched_ball[i]]=-0.5*(this.x[this.touched_ball[i]]-this.touch_x_1[i])/this.DeltaT/10.0;
					this.Vy[this.touched_ball[i]]=-0.5*(this.y[this.touched_ball[i]]-this.touch_y_1[i])/this.DeltaT/10.0;
				}
				else
				{
					this.x[this.touched_ball[i]]=this.touch_x[i];
					this.y[this.touched_ball[i]]=this.touch_y[i];
				}
				
			}
		}
		for (var t=0; t<10; t++) {
			for (var i=0; i<this.num; i++) {
				if (this.ball_mode[i]!=1)
				{
					this.x[i]+=this.Vx[i]*this.DeltaT;
					this.y[i]+=this.Vy[i]*this.DeltaT;
				}
				else
				{
					this.Vx[i]=0;
					this.Vy[i]=0;
				}
				var deltaX,deltaY;
				if (this.ball_mode[i]==3 && i!=0) {
					deltaX=this.x[i]-this.x[i-1];
					deltaY=this.y[i]-this.y[i-1];
					this.Vx[i]-=0.3/this.r*(deltaX-2*this.r*deltaX/Math.sqrt(deltaX*deltaX+deltaY*deltaY));
					this.Vy[i]-=0.3/this.r*(deltaY-2*this.r*deltaY/Math.sqrt(deltaX*deltaX+deltaY*deltaY));
				}
				if (this.ball_mode[i]!=1 && i!=this.num-1 && this.ball_mode[i+1]==3) {
					deltaX=this.x[i]-this.x[i+1];
					deltaY=this.y[i]-this.y[i+1];
					this.Vx[i]-=0.3/this.r*(deltaX-2*this.r*deltaX/Math.sqrt(deltaX*deltaX+deltaY*deltaY));
					this.Vy[i]-=0.3/this.r*(deltaY-2*this.r*deltaY/Math.sqrt(deltaX*deltaX+deltaY*deltaY));
				}
				
				this.Vx[i]-=this.Vx[i]*this.air_res;
				this.Vy[i]-=this.Vy[i]*this.air_res;
				
				
				if (this.x[i]>canvas.width-this.r) {
					this.Vx[i]=-this.Vx[i]*this.vd;
					this.x[i]=canvas.width-this.r;
				}
				else if(this.x[i]<this.r)
				{
					this.Vx[i]=-this.Vx[i]*this.vd;
					this.x[i]=this.r;
				}
				if (this.y[i]>canvas.height-this.r) {
					this.Vy[i]=-this.Vy[i]*this.vd;
					this.y[i]=canvas.height-this.r;
				}
				else if(this.y[i]<this.r)
				{
					this.Vy[i]=-this.Vy[i]*this.vd;
					this.y[i]=this.r;
				}
			}
			this.CheckDistance();

		}
		for(var i=0;i<this.num;i++)
		{
			if (this.ball_mode[i]!=1) {
				this.Vx[i]+=this.deviceTilt.x*this.g;
				this.Vy[i]+=this.deviceTilt.y*this.g;
			}
			switch (this.ball_mode[i]) {
				case 0:
					this.drawBall(this.x[i],this.y[i]);
					break;
				case 1:
					this.drawBall1(this.x[i],this.y[i]);
					break;
				case 2:
					this.drawBall(this.x[i],this.y[i]);
					if (i!=0) {
						ctx.strokeStyle="black";
						this.drawLine(this.x[i-1],this.y[i-1],this.x[i],this.y[i]);
					}
					break;
				case 3:
					this.drawBall(this.x[i],this.y[i]);
					if (i!=0) {
						ctx.strokeStyle="gray";
						this.drawLine(this.x[i-1],this.y[i-1],this.x[i],this.y[i]);
					}
					break;
			}
		}
	},

	CalVelocity: function(i,j)
	{
		var dx=this.x[i]-this.x[j],dy=this.y[i]-this.y[j];
		var dr=dx*dx+dy*dy;
		var V1x,V1y,V2x,V2y;
		if (dr!=0) {
			V1x=((this.Vx[j]*dx+this.Vy[j]*dy)*dx+(this.Vx[i]*dy-this.Vy[i]*dx)*dy)/dr;
			V1y=((this.Vx[j]*dx+this.Vy[j]*dy)*dy-(this.Vx[i]*dy-this.Vy[i]*dx)*dx)/dr;
			V2x=((this.Vx[i]*dx+this.Vy[i]*dy)*dx+(this.Vx[j]*dy-this.Vy[j]*dx)*dy)/dr;
			V2y=((this.Vx[i]*dx+this.Vy[i]*dy)*dy-(this.Vx[j]*dy-this.Vy[j]*dx)*dx)/dr;
			this.Vx[i]=V1x;
			this.Vy[i]=V1y;
			this.Vx[j]=V2x;
			this.Vy[j]=V2y;
			var dr_=Math.sqrt(dr);
			if(this.ball_mode[i]!=1)
			{
				this.x[i]+=(2*this.r-dr_)*(dx/dr_)*0.5;
				this.y[i]+=(2*this.r-dr_)*(dy/dr_)*0.5;
			}
			if(this.ball_mode[j]!=1)
			{
				this.x[j]-=(2*this.r-dr_)*(dx/dr_)*0.5;
				this.y[j]-=(2*this.r-dr_)*(dy/dr_)*0.5;
			}
		}
	},

	CheckDistance: function()
	{
		for(var i=0;i<this.num-1;i++)
			for(var j=i+1;j<this.num;j++)
				if((Math.sqrt((this.x[i]-this.x[j])*(this.x[i]-this.x[j])+(this.y[i]-this.y[j])*(this.y[i]-this.y[j]))<this.r*2 || (this.ball_mode[j]==2 && j==i+1)))
					this.CalVelocity(i,j);
	},
	check: function(i)
	{
		var IsTooClose=false;
		for(var j=0;j<i;j++)
			if(Math.sqrt((this.x[i]-this.x[j])*(this.x[i]-this.x[j])+(this.y[i]-this.y[j])*(this.y[i]-this.y[j]))<this.r*2)
				IsTooClose=true;
		return IsTooClose;
	},

	drawBall: function(x,y)
	{
		ctx.drawImage(ballImage,x-this.r,y-this.r,this.r*2,this.r*2);
	},

	drawBall1: function(x,y)
	{
		ctx.drawImage(ballImage1,x-this.r,y-this.r,this.r*2,this.r*2);
	},
	
	drawLine: function(x1,y1,x2,y2)
	{
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
	},
	Slider1Changed: function(value)
	{
		this.r=value;
	},
	Slider2Changed: function(value)
	{
		this.vd=value;
	},
	Slider3Changed: function(value)
	{
		this.g=value;
	},
	Slider4Changed: function(value)
	{
		this.air_res=value;
	},
	btnRestartClicked: function()
	{
		this.num=0;
	},
	btnAddClicked: function()
	{
		this.x[this.num]=Math.random()*canvas.width;
		this.y[this.num]=Math.random()*canvas.height;
		this.Vx[this.num]=-5+10*Math.random();
		this.Vy[this.num]=-5+10*Math.random();
		this.ball_mode[this.num]=this.adding_mode;
		this.num++;
	},
	btnRemoveClicked: function()
	{
		this.num--;
		if(this.num<0)this.num=0;
	},
	segmentedChanged: function(value)
	{
		this.adding_mode=value;
	},

	touchModeChanged: function(value)
	{
		this.touch_mode=value;
	},

	touchesBegan: function(n,x_,y_)
	{
		this.touch_x[n]=this.touch_x_1[n]=x_;
		this.touch_y[n]=this.touch_y_1[n]=y_;
		
		if (this.touch_mode!=1) {
			for (var i=0; i<this.num; i++)
				if(Math.sqrt((this.x[i]-this.touch_x[n])*(this.x[i]-this.touch_x[n])+(this.y[i]-this.touch_y[n])*(this.y[i]-this.touch_y[n]))<Math.max(this.r, 40))
					this.touched_ball[n]=i;
		}
		
			if (this.touched_ball[n]==-1 && this.touch_mode==1) {
			for (var i=0; i<this.num; i++)
				if(Math.sqrt((this.x[i]-this.touch_x[n])*(this.x[i]-this.touch_x[n])+(this.y[i]-this.touch_y[n])*(this.y[i]-this.touch_y[n]))<this.r)
					return;
			this.x[this.num]=this.touch_x[n];
			this.y[this.num]=this.touch_y[n];
			this.Vx[this.num]=0;
			this.Vy[this.num]=0;
			this.ball_mode[this.num]=this.adding_mode;
			this.num++;
		}
	},
	touchesMoved: function(n,x_,y_)
	{
		this.touch_x[n]=x_;
		this.touch_y[n]=y_;
		
		if (this.touched_ball[n]==-1 && this.touch_mode==1) {
			for (var i=0; i<this.num; i++)
				if(Math.sqrt((this.x[i]-this.touch_x[n])*(this.x[i]-this.touch_x[n])+(this.y[i]-this.touch_y[n])*(this.y[i]-this.touch_y[n]))<this.r)
					return;
			this.x[this.num]=this.touch_x[n];
			this.y[this.num]=this.touch_y[n];
			this.Vx[this.num]=0;
			this.Vy[this.num]=0;
			this.ball_mode[this.num]=this.adding_mode;
			this.num++;
		}
		 
		
	},
	touchesEnded: function(n,x_,y_)
	{
		this.touch_x[n]=x_;
		this.touch_y[n]=y_;
		this.touched_ball[n]=-1;
	}


}
