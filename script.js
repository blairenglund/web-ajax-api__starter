window.addEventListener('load', function() {

	//array to use a reference for the day of the week
	var weekday = new Array(7);
	weekday[0] = "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";

	//open the api file
	var apirequest = new XMLHttpRequest();
	apirequest.open('GET', 'api');
	apirequest.send();

	//get response and parse out data
	apirequest.addEventListener('load', function(e) {

		//the parsed response
		var response = JSON.parse(e.target.response);

		//current data variables
		var currentTemp = response.currently.temperature;
		var currentSummary = response.currently.summary;
		var currentApparentTemp = response.currently.apparentTemperature;

		//daily variables
		var todaydata = response.daily.data[0];
		var todaytime = new Date(todaydata.time)
		var dayofweek = weekday[todaytime.getDay()];
		var todayHigh = todaydata.temperatureMax;
		var todayLow = todaydata.temperatureMin;
		var todaySunrise = new Date(todaydata.sunriseTime * 1000);
		var todaySunset = new Date(todaydata.sunsetTime * 1000);
		var todaySummary = todaydata.summary;


		//need to put the sunrise and sunset times in standard format:
		var todaySunriseTime = todaySunrise.getHours() + ":" + addLeadingZero(todaySunrise.getMinutes()) + todaySunrise.getMinutes();
		var todaySunsetTime = todaySunset.getHours() + ":" + addLeadingZero(todaySunset.getMinutes()) + todaySunset.getMinutes();
		//this function will add a leading zero to the minutes if they are < 10
		//
		//x is the minute portion of the time
		function addLeadingZero(x) {
			if (todaySunrise.getMinutes() <= 9) {
				return "0";
			}
			else{
				return "";
			}
		}

		//this function will determine whether the time is A.M. or P.M.
		//
		//x is the hour portion of the time
		//function

		debugger;

		//change the innerHTML of the DOM elements to reflect the api data
		//CURRENT WEATHER DATA (top part):
		document.getElementById('conditionsdisplay').innerHTML = currentSummary;
		document.getElementById('currenttempdisplay').innerHTML = Math.round(currentTemp) + "&deg;";
		document.getElementById('daydisplay').innerHTML = dayofweek;
		document.getElementById('hightempdisplay').innerHTML = Math.round(todayHigh) + "&deg;";
		document.getElementById('lowtempdisplay').innerHTML = Math.round(todayLow) + "&deg;";
		//WEEKLY WEATHER DATA (middle part):

		//TODAYS WEATHER DATA (bottom part):
		document.getElementById('todaysummary').innerHTML = "Today: " + todaySummary;
		document.getElementById('sunrisedisplay').innerHTML = todaySunriseTime;
		document.getElementById('sunsetdisplay').innerHTML = todaySunsetTime;

	})

	

})