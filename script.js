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
		var currentHumidity = response.currently.humidity * 100;
		var currentWindSpeed = response.currently.windSpeed;
		var currentWindBearing = response.currently.windBearing;
		var currentPressure = (29.92 * response.currently.pressure) / 1013.25; //this variable is the pressure with mb converted to in.
		var currentVisibility = response.currently.visibility;

		//daily variables
		var todaydata = response.daily.data[0];
		var todaytime = new Date(todaydata.time)
		var dayofweek = weekday[todaytime.getDay()];
		var todayHigh = todaydata.temperatureMax;
		var todayLow = todaydata.temperatureMin;
		var todaySunrise = new Date(todaydata.sunriseTime * 1000);
		var todaySunset = new Date(todaydata.sunsetTime * 1000);
		var todaySummary = todaydata.summary;
		var todayRainChance = todaydata.precipProbability;
		var todayPrecip = todaydata.precipIntensity;

		//full array of hourly data
		var hourlydata = response.hourly.data;

		//the time and temps that we're actually concerned with (next 24 hour period)
		var hourlytimes = [];
		var hourlytemps = [];

		for (var i = 0; i < 24; i++) {
			hourlytemps.push( Math.round(hourlydata[i].temperature) );
			hourlytimes.push( new Date (hourlydata[i].time * 1000) );
			hourlytimes[i] = hourlytimes[i].getHours();
		};

		//array of daily forecast objects
		var dailydata = response.daily.data;

		//days, highs, lows
		var dailyDays = [];
		var dailyHighs = [];
		var dailyLows = [];

		for (var i = 0; i < dailydata.length; i++) {
			dailyDays.push( new Date (dailydata[i].time * 1000) );
			dailyDays[i] = weekday[dailyDays[i].getDay()];
			dailyHighs.push( Math.round(dailydata[i].temperatureMax) );
			dailyLows.push( Math.round(dailydata[i].temperatureMin) );
		}

		debugger;

		//need to put the sunrise and sunset times in standard format:
		var todaySunriseTime = todaySunrise.getHours() + ":" + addLeadingZero(todaySunrise.getMinutes()) + todaySunrise.getMinutes();
		var todaySunsetTime = todaySunset.getHours() + ":" + addLeadingZero(todaySunset.getMinutes()) + todaySunset.getMinutes();
		
		//this function will add a leading zero to the minutes if they are < 10
		//
		//x is the minute portion of the time
		function addLeadingZero(x) {
			if (x <= 9) {
				return "0";
			}
			else{
				return "";
			}
		}

		//this function will return the direction of the wind in standard cardinal abbreves
		//there will be only 8 possibilities for now: W, NW, N, NE, E, SE, S, SW.
		//E is 337.6 to 22.5 (+- 22.5 degrees on either side of 0)
		//NE is 22.6 to 67.5 (+- 22.5 degrees on either side of 45)
		//N is 67.6 to 112.5 (+- 22.5 degrees on either side of 90)
		//NW is 112.6 to 157.5 (+- 22.5 degrees on either side of 135)
		//W is 157.6 to 202.5 (+- 22.5 degrees on either side of 180)
		//SW is 202.6 to 247.5 (+- 22.5 degrees on either side of 225)
		//S is 247.5 to 292.5 (+- 22.5 degrees on either side of 270)
		//SE is 292.5 to 337.5 (+- 22.5 degrees on either side of 315)
		//
		//x is the wind bearing
		function currentWindDirection(x) {
			if ((x >= 337.6 && x < 360) || (x >= 0 && x <= 22.5)) {"E";}
			else if (x >= 22.6 && x <= 67.5) {return "NE";}
			else if (x >= 67.6 && x <= 112.5) {return "N";}
			else if (x >= 112.6 && x <= 157.5) {return "NW";}
			else if (x >= 157.6 && x <= 202.5) {return "W";}
			else if (x >= 202.6 && x <= 247.5) {return "SW";}
			else if (x >= 247.6 && x <= 292.5) {return "S";}
			else if (x >= 292.6 && x <= 337.5) {return "SE";}
			else {return "--";}
		};

		//change the innerHTML of the DOM elements to reflect the api data
		//CURRENT WEATHER DATA (top part):
		document.getElementById('conditionsdisplay').innerHTML = currentSummary;
		document.getElementById('currenttempdisplay').innerHTML = Math.round(currentTemp) + "&deg;";
		document.getElementById('daydisplay').innerHTML = dayofweek;
		document.getElementById('hightempdisplay').innerHTML = Math.round(todayHigh) + "&deg;";
		document.getElementById('lowtempdisplay').innerHTML = Math.round(todayLow) + "&deg;";

		//HOURLY WEATHER DATA (just temperatures):		
		var hourlyTimeFields = document.getElementsByClassName('hourlytime');
		for (var i = 0; i < hourlyTimeFields.length; i++) {
			hourlyTimeFields[i].innerHTML = hourlytimes[i] + ":00";
		}
		hourlyTimeFields[0].innerHTML = "Now";

		var hourlyTempFields = document.getElementsByClassName('hourlytemp')
		for (var i = 0; i < hourlyTempFields.length; i++) {
			hourlyTempFields[i].innerHTML = hourlytemps[i] + "&deg;";
		}

		//DAILY WEATHER DATA (highs and lows):
		var dailyDayFields = document.getElementsByClassName('dailydisplay');
		for (var i = 0; i < dailyDayFields.length; i++) {
			dailyDayFields[i].innerHTML = dailyDays[i];
		}
		var dailyHighFields = document.getElementsByClassName('dailyhighdisplay');
		for (var i = 0; i < dailyHighFields.length; i++) {
			dailyHighFields[i].innerHTML = dailyHighs[i] + "&deg;";
		}
		var dailyLowFields = document.getElementsByClassName('dailylowdisplay');
		for (var i = 0; i < dailyLowFields.length; i++) {
			dailyLowFields[i].innerHTML = dailyLows[i] + "&deg;";
		}


		//TODAYS WEATHER DATA (bottom part):
		document.getElementById('todaysummary').innerHTML = "Today: " + todaySummary;
		document.getElementById('sunrisedisplay').innerHTML = todaySunriseTime;
		document.getElementById('sunsetdisplay').innerHTML = todaySunsetTime;
		document.getElementById('rainchancedisplay').innerHTML = todayRainChance + "%";
		document.getElementById('humiditydisplay').innerHTML = currentHumidity + "%";
		document.getElementById('winddisplay').innerHTML = currentWindSpeed + " mph " + currentWindDirection(currentWindBearing);
		document.getElementById('apparenttempdisplay').innerHTML = Math.round(currentApparentTemp) + "%";
		document.getElementById('precipdisplay').innerHTML = todayPrecip;
		document.getElementById('pressuredisplay').innerHTML = Math.round(currentPressure) + " in";
		document.getElementById('visibilitydisplay').innerHTML = currentVisibility + "mi";
		debugger;

	})

	

})