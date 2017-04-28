var pomodoro = {
	sessionLength: 25,
	breakLength: 5,
	currentMode: "session",
	clockStop: true,
	timer: undefined,
    clockAngle: 1.5*Math.PI,
    clockSpeed: 0,
    sessionColor: "#471111",
    sessionWkColor: "#FF8D6E",
    breakColor: "#262626",
    breakWkColor: "#b2b2b2",
    color: "#471111",
    wkColor: "#FF8D6E",

	showSessionLength: function(){
       $(".sessionLength .show").html(this.sessionLength);
	},

	showBreakLength: function(){
		$(".breakLength .show").html(this.breakLength);
	},

	showClockMinutes: function(minutes){
		if(minutes < 10){
			$(".clock .minutes").html("0"+ minutes);
		}else{
			$(".clock .minutes").html(minutes);
		}
	},

	showClockSeconds: function(seconds){
		if(seconds < 10){
			$(".clock .seconds").html("0"+ seconds);
		}else{
			$(".clock .seconds").html(seconds);
		}
	},

	setSessionLength: function(){
		var pomoObj = this;
		$(".sessionLength").click(function(event){
			//event.preventDefault();
			if($(event.target).hasClass("minus")){
				if(pomoObj.sessionLength >1){
					pomoObj.sessionLength--; 
			    };
			} 
			else if($(event.target).hasClass("plus")){
				pomoObj.sessionLength++;
			};
			pomoObj.showSessionLength();
			if(pomoObj.currentMode === "session"){
                pomoObj.resetClock(pomoObj.sessionLength);
			};
		});
	},

	setBreakLength: function(){
		var pomoObj = this;
		$(".breakLength").click(function(event){
			if($(event.target).hasClass("minus")){
				if(pomoObj.breakLength >1){
					pomoObj.breakLength--; 
			    };
			} 
			else if($(event.target).hasClass("plus")){
				pomoObj.breakLength++;
			};
			pomoObj.showBreakLength();
			if(pomoObj.currentMode === "break"){
				pomoObj.resetClock(pomoObj.breakLength);
			};
		});
	},
   
	runClockCountDown: function(){
		var minutes = parseInt($(".clock .minutes").html());
		var seconds = parseInt($(".clock .seconds").html());
		this.timer = setTimeout(this.runClockCountDown.bind(this), 1000);
		this.clockStop = false;	
			
		if(minutes===0 && seconds === 0){
			this.stopClockCountDown();
			minutes = this.modeSwitch();
			this.resetClock(minutes);
		}else {
			if(seconds === 0){
			    seconds = 59;
			    minutes--;
		    }else {
			    seconds--;
		    };
		    this.showClockMinutes(minutes);
		    this.showClockSeconds(seconds); 
		    this.drawClockUpdate();	
		}
		 
		     
	},

	stopClockCountDown: function(){
       clearTimeout(this.timer);
       this.clockStop = true;
    },

    settingPanelOffClick: function(){
    	$(".sessionLength").off("click");
    	$(".breakLength").off("click");
    },

    modeSwitch: function(){
    	var minutes;
        if(this.currentMode === "session"){
        	this.currentMode = "break";
        	$(".currentMode").html("Break");
            this.color = this.breakColor;
            this.wkColor = this.breakWkColor;
        	minutes = this.breakLength;
        }
        else {
        	this.currentMode === "session";
        	$(".currentMode").html("Session");
        	this.color = this.sessionColor;
        	this.wkColor = this.sessionWkColor;
        	minutes = this.sessionLength;
        };
        return minutes;
    },

    clockToggle: function(){
    	if(this.clockStop){
    		this.settingPanelOffClick();
    		this.runClockCountDown();        			
    	}else{
    		this.stopClockCountDown();
            this.setSessionLength();
            this.setBreakLength();
    	};
    },

    drawClockRing: function(){
    	var CANVAS = document.getElementById("clockPanel");
    	var WIDTH = $(CANVAS).width();
    	var HEIGHT = $(CANVAS).height();
    	var ctx = CANVAS.getContext("2d");
    	ctx.clearRect(0,0,WIDTH,HEIGHT);

    	//draw outer circle of clock panel
    	ctx.beginPath();
    	ctx.arc(125,125,125,0,2*Math.PI);
    	ctx.fillStyle=this.color;
    	ctx.fill();

    	//draw inner circle of clock panel
        ctx.beginPath();
        ctx.arc(125,125,100,0,2*Math.PI);
        ctx.fillStyle="#333333";
        ctx.fill();
    },

    resetClock: function(minutes){
    	this.drawClockRing();
    	this.clockAngle = 1.5*Math.PI;
    	this.clockSpeed = 2*Math.PI/(minutes*60);
    	this.showClockMinutes(minutes);
    	this.showClockSeconds(0);
    },
    
    drawClockUpdate: function(){
    	var CANVAS = document.getElementById("clockPanel");
    	var ctx = CANVAS.getContext("2d");
        this.clockAngle = this.clockAngle + this.clockSpeed;
        //update
        ctx.beginPath();
        ctx.moveTo(125,125);
        ctx.lineTo(125,0);
        ctx.arc(125,125,125,1.5*Math.PI, this.clockAngle);
        ctx.closePath();
        ctx.fillStyle= this.wkColor;
        ctx.fill();  
        
        //draw inner circle of clock panel
        ctx.beginPath();
        ctx.arc(125,125,100,0,2*Math.PI);
        ctx.fillStyle="#333333";
        ctx.fill();
    },


    init: function(){
       this.color = this.sessionColor;
       this.wkColor = this.sessionWkColor;
       this.drawClockRing();
       this.setSessionLength();
	   this.setBreakLength();	   
       this.clockSpeed = 2*Math.PI/(this.sessionLength*60);
    },
    
    run: function(){
    	this.init();    	
	    var pomoObj = this;
	    $(".clockPanel").click(function(){
		    pomoObj.clockToggle();
	    });
    }
   
};


$(document).ready(function(){
	pomodoro.run();
});