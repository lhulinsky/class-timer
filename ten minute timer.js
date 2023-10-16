var timerDisplay=document.getElementById("timerDisplay");
var normalClassEndTimes=[[9,15],[10,4],[10,53],[11,42],[12,31],[13,3],[13,52],[14,41],[16,48]];
var advisoryClassEndTimes=[[9,12],[9,58],[10,22],[11,8],[11,54],[12,40],[13,12],[13,58],[14,44],[15,30]];
var earlyOutClassEndTimes=[[9,0],[9,34],[10,8],[10,42],[11,16],[11,50],[12,23],[12,56],[13,30]];
var lateStartClassEndTimes=[[11,0],[11,34],[12,8],[12,40],[13,14],[13,48],[14,22],[14,56],[15,30]];
var alertMode=false;
var bellOffset=Math.floor(getSchoolBellOffset());
var dayType="normal";
var alarmAudio=new Audio("alarm_clock.mp3");
var alarmHasRung=false;
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
	updateTimer();
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
	
	if(minutes<10 && hours==0 && !alarmHasRung){
		alertMode=true;
		alarmHasRung=true;
		alarmAudio.play();
	}
	else{
		alertMode=false;
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

function updateAlertDisplay(){
	if(alertMode){
		timerDisplay.style.color="red";
	}
	else{
		timerDisplay.style.color="black";
	}
	requestAnimationFrame(updateAlertDisplay);
}

function startTimer(){
	timerDisplay.style.display="block";
	document.getElementById("startButton").style.display="none";
	updateTimer();
	setInterval(updateTimer,1000);
	requestAnimationFrame(updateAlertDisplay);
}