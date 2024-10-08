var timerDisplay=document.getElementById("timerDisplay");

//hour and minute of when each class ends in army time
var normalClassEndTimes=[[9,15],[10,4],[10,53],[11,42],[12,31],[13,3],[13,52],[14,41],[15,30]];
var advisoryClassEndTimes=[[9,12],[9,58],[10,22],[11,8],[11,54],[12,40],[13,12],[13,58],[14,44],[15,30]];
var earlyOutClassEndTimes=[[9,0],[9,34],[10,8],[10,42],[11,16],[11,50],[12,23],[12,56],[13,30]];
var lateStartClassEndTimes=[[11,0],[11,34],[12,8],[12,40],[13,14],[13,48],[14,22],[14,56],[15,30]];

var redTextMode=false;
var bellOffset=Math.floor(getSchoolBellOffset());
var dayType="normal";
var alarmAudio=new Audio("Jupiter.mp3");
var alarmHasRung=false;

//change what schedule is used when the button is pressed
function changeDay(){
	alarmHasRung=false;
	if(dayType=="normal"){
		dayButton.innerHTML="Advisory Day";
		dayType="advisory";
	}
	else if(dayType=="advisory"){
		dayButton.innerHTML="Early Out";
		dayType="early out";
	}
	else if(dayType=="early out"){
		dayButton.innerHTML="Late Start";
		dayType="late start";
	}
	else if(dayType=="late start"){
		dayButton.innerHTML="Normal Day";
		dayType="normal";
	}
}

function updateTimer(){
	var time=new Date();
	time=new Date(time.getTime()+bellOffset*1000);
	
	var classEndTimes=normalClassEndTimes;
	if(dayType=="advisory"){
		classEndTimes=advisoryClassEndTimes;
	}
	else if(dayType=="early out"){
		classEndTimes=earlyOutClassEndTimes;
	}
	else if(dayType=="late start"){
		classEndTimes=lateStartClassEndTimes;
	}
	
	var currentHour=time.getHours();
	var currentMinute=time.getMinutes();
	var classIndex=0;
	for(var i=0;i<classEndTimes.length;i++){
		//finds greatest time that hasn't been passed yet
		if(currentHour==classEndTimes[i][0]){
			if(currentMinute>=classEndTimes[i][1]){
				classIndex=i+1;
				if(classIndex>classEndTimes.length-1){
					classIndex=0;
				}
			}
		}
		else if(currentHour>classEndTimes[i][0]){
			classIndex=i+1;
			if(classIndex>classEndTimes.length-1){
				classIndex=0;
			}
		}
		else{
			break;
		}
	}
	var classEndTime=classEndTimes[classIndex]
	var seconds=-time.getSeconds();
	var carriedSecond=false;
	if(seconds<0){
		//if current seconds are greater than end seconds, add sixty seconds and subtract one minute
		seconds+=60
		carriedSecond=true;
	}
	var minutes=classEndTime[1]-time.getMinutes();
	if(carriedSecond){
		minutes-=1;
	}
	var carriedMinute=false;
	if(minutes<0){
		//if current minutes are greater than end minutes, add sixty and subtract one hour
		minutes+=60
		carriedMinute=true;
	}
	var hours=classEndTime[0]-time.getHours();
	if(carriedMinute){
		hours-=1;
	}
	if(hours<0){
		hours+=24
	}
	
	if(minutes<10 && hours==0){
		redTextMode=true;
		if(!alarmHasRung){
			alarmHasRung=true;
			alarmAudio.play();
		}
	}
	else{
		redTextMode=false;
		alarmHasRung=false;
	}
	
	if(seconds<10){
		seconds="0"+seconds
	}
	if(minutes<10){
		minutes="0"+minutes
	}
	if(hours<10){
		hours="0"+hours
	}
	if(hours!="00"){
		timerDisplay.innerHTML=hours+":"+minutes+":"+seconds
	}
	else{
		timerDisplay.innerHTML=minutes+":"+seconds
	}
}

//text turns red when time is less than 10 min
function updateTextColor(){
	if(redTextMode){
		timerDisplay.style.color="red";
	}
	else{
		timerDisplay.style.color="black";
	}
	requestAnimationFrame(updateTextColor);
}

function startTimer(){
	timerDisplay.style.display="block";
	document.getElementById("startButton").style.display="none";
	updateTimer();
	setInterval(updateTimer,1000);
	requestAnimationFrame(updateTextColor);
}
