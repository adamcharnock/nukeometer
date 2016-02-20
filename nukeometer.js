var geocoder = new GClientGeocoder();

var nukeometer = function(spec, my) {
	spec = spec || {};
	my = my || {};
	var that = {};
	
	my.apiKey = 'ABQIAAAAYPwsmZPDrUr-1ju1JhXTyRTC5wsckx2lAh0b_iBjhiuhm8eGxhSsIQXBuqbC13QLOLbDVowzuJthrA';
	
	//The max bomber range in miles (the vulcan bomber (B.2A) could do 4600 miles)
	my.bomberRange = 4600;
	
	//http://en.wikipedia.org/wiki/Cruise_missile
	my.shortRangleMissleRange = 1000;
	
	my.typeLookup = {
		icbm: {
			singular: 'long range ICBM',
			plural: 'long range ICBMs'
		},
		shortrange: {
			singular: 'short range missile',
			plural: 'short range missiles'
		},
		bomber: {
			singular: 'bomber aircraft',
			plural: 'bomber aircraft'
		},
		submarines: {
			singular: 'nuclear submarine',
			plural: 'nuclear submarines'
		}
	};
	
	my.data = {
		USA: {
			icbm: {range: 8100, count: 764},
			shortrange: 1783,
			bomber: 1083,
			submarines: 500,
			lat: 41,
			long: -101
		}, 
		Russia: {
			icbm: {range: 6900, count: 1605},
			shortrange: 624,
			bomber: 884,
			submarines: 2079,
			lat: 63,
			long: 98
		}, 
		UK: {
			submarines: 192,
			lat: 53,
			long: -1
		}, 
		China: {
			icbm: {range: 8100, count: 121},
			bomber: 55,
			lat: 34,
			long: 103
		}, 
		France: {
			shortrange: 240,
			bomber: 60,
			lat: 46,
			long: 3
		}, 
		India: {
			icbm: {range: 3700, count: 75},
			lat: 22,
			long: 80
		},
		Pakistan: {
			icbm: {range: 2800, count: 15},
			lat: 28,
			long: 67
		},
		Israel: {
			icbm: {range: 4300, count: 200},
			lat: 35,
			long: 31
		},
		North_Korea: {
			icbm: {range: 1500, count: 2},
			lat: 40,
			long: 127
		}
	};
	
	that.get = function(city, country, callback) {
		my.geocode(city, country, function(lat, long){
			
			for(country in my.data) {
				if(typeof my.data[country] != 'function') {
					var distance = my.getLatLongDistance(my.data[country].lat, my.data[country].long, lat, long);
					my.data[country].distance = distance;
					my.data[country].total = my.getCountryTotal(my.data[country]);
				}
			}
			
			my.data.totals = my.getFullTotals(my.data);
			
			callback(my.data);
		});
	};
	
	my.getCountryTotal = function(countryData) {
		var total = 0;
		if(countryData.icbm && countryData.distance < countryData.icbm.range) {
			total += countryData.icbm.count;
		}
		if(countryData.bomber && countryData.distance < my.bomberRange) {
			total += countryData.bomber;
		}
		if(countryData.shortrange && countryData.distance < my.shortRangleMissleRange) {
			total += countryData.shortrange;
		}
		if(countryData.submarines) {
			total += countryData.submarines;
		}
		return total;
	};
	
	my.getFullTotals = function(data) {
		var totals = {
			icbm: 0,
			shortrange: 0,
			bomber: 0,
			submarines: 0,
			grand: 0
		};
		for(country in data) {
			if(typeof data[country] != 'function') {
				if(data[country].icbm && data[country].distance < data[country].icbm.range) {
					totals.icbm += data[country].icbm.count;
					totals.grand += data[country].icbm.count;
				}
				if(data[country].shortrange && data[country].distance < my.shortRangleMissleRange) {
					totals.shortrange += data[country].shortrange;
					totals.grand += data[country].shortrange;
				}
				if(data[country].bomber && data[country].distance < my.bomberRange) {
					totals.bomber += data[country].bomber;
					totals.grand += data[country].bomber;
				}
				if(data[country].submarines) {
					totals.submarines += data[country].submarines;
					totals.grand += data[country].submarines;
				}
			}
		}
		return totals;
	};
	
	my.getLatLongDistance = function(lat1, long1, lat2, long2) {
		//Full credit to: http://jan.ucc.nau.edu/~cvm/latlon_formula.html
		
		lat1 = my.toRadians(lat1);
		long1 = my.toRadians(long1);
		lat2 = my.toRadians(lat2);
		long2 = my.toRadians(long2);
		
		var radius = 3963; //Earth radius in miles
		var miles = Math.acos(Math.cos(lat1)*Math.cos(long1)*Math.cos(lat2)*Math.cos(long2) + Math.cos(lat1)*Math.sin(long1)*Math.cos(lat2)*Math.sin(long2) + Math.sin(lat1)*Math.sin(lat2)) * radius;
		
		return miles;
	};
	
	my.toRadians = function(degrees) {
		return degrees * (Math.PI / 180);
	};
	
	my.geocode = function(city, country, callback) {
		var address = city + ', ' + country;
		geocoder.getLatLng(address, function(point) {
			if (!point) {
				alert('Could not find that city/country');
			} else {
				callback(point.lat(), point.lng());
			}
		});
	};
	
	that.getTypeName = function(type, plural) {
		if(plural) {
			return my.typeLookup[type].plural;
		} else {
			return my.typeLookup[type].singular;
		}
	};
	
	return that;
};

$(document).ready(function(){
	$('#stats').hide();
	var hiddenStats = true;
	
	var myNukeometer;
	var inputcity;
	var inputcountry;
	
	var submitCallback = function(){
		myNukeometer = nukeometer();
		inputcity = $('#inputcity').attr('value');
		inputcountry = $('#inputcountry').attr('value');
		
		myNukeometer.get(inputcity, inputcountry, function(data){
			$('#grandtotalnumber').html(data.totals.grand);
			$('#locationcity').html(inputcity);
			$('#locationcountry').html(inputcountry);
			
			$('#breakdownbycountry .content').empty();
			for(country in data) {
				if(typeof data[country] != 'function' && country != 'totals' && data[country].total){
					var niceCountryName = country.replace('_', ' ');
					$('#breakdownbycountry .content').append('<div class="' + country.toLowerCase() + ' breakdownrow">' + data[country].total + ' from ' + niceCountryName + '</div>');
				}
			}
			
			$('#breakdownbytype .content').empty();
			for(type in data.totals) {
				if(typeof data.totals[type] != 'function' && type != 'grand'){
					$('#breakdownbytype .content').append('<div class="' + type.toLowerCase() + ' breakdownrow">' + data.totals[type] + ' from ' + myNukeometer.getTypeName(type, true) + '</div>');
				}
			}
			
			if(hiddenStats) {
				$('#stats').slideDown(300);
				hiddenStats = false;
			}
		});
		
		return false;
	};
	
	$('#locationform').submit(submitCallback);
});









