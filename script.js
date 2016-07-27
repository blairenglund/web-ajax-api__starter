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
		var todayhigh = todaydata.temperatureMax;
		var todaylow = todaydata.temperatureMin;
		var todaysunrise = new Date(todaydata.sunriseTime * 1000);
		var todaysunset = new Date(todaydata.sunsetTime * 1000);

		//change the innerHTML of the DOM elements to reflect the api data
		//CURRENT WEATHER DATA:
		document.getElementById('conditionsdisplay').innerHTML = currentSummary;
		document.getElementById('currenttempdisplay').innerHTML = Math.round(currentTemp) + "&deg;";
		document.getElementById('daydisplay').innerHTML = dayofweek;
		document.getElementById('hightempdisplay').innerHTML = Math.round(todayhigh) + "&deg;";
		document.getElementById('lowtempdisplay').innerHTML = Math.round(todaylow) + "&deg;";
		//WEEKLY WEATHER DATA:

		//TODAYS WEATHER DATA:


	})

	

})