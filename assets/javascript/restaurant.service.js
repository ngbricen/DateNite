//=======================
//	Restaurant Service
//=======================
var restaurantService = ( function()
{
	//create new service with a blank div (since we're not using a real map at this point)
	var service = new google.maps.places.PlacesService( document.createElement('div') );

	//register the "onRestaurantsLoaded" which can be used by any other file
	eventSystem.registerEvent( 'onRestaurantsLoaded' );

	//list of restuarants that meet the date criteria
	var dateRestaurants = [];

	//only the stuff that outside scripts can access
	var publicAPI = 
	{
		googleSearchNearby: googleSearchNearby,
		dateRestaurants: dateRestaurants,
	}

	//return this api to the global scope
	return publicAPI;

	//search based on current user
	function googleSearchNearby( tUser, tCallback )
	{
		console.log("google search started for restaurant");
		if( tUser != null )
		{
			//create new google lat/long object using user data (required by google search api)
			var googleLatLong = new google.maps.LatLng( tUser.latitude, tUser.longitude );
			
			//create object expected by the google search api
			var googleRequest = 
			{
				location: googleLatLong,
				radius: '10000', //max range is 50000 (in meters)
				types: ['restaurant']				
			}
		}
		else
		{
			console.log( "could not execute search as there is no user!" );
			return;
		}

		//first param is the request, second is the results callback (executed on fail/success)
		service.nearbySearch( googleRequest, googleSearchResults );
	}

	function googleSearchResults( tData, tStatus )
	{
		//console.log( 'tData = ' + tData );
		//console.log( 'tStatus = ' + tStatus );

		if( tStatus == google.maps.places.PlacesServiceStatus.OK )
		{
			//console.log("Get Google place Results");
			//console.log(tData);

			for( var i = 0; i < tData.length; i++ ) 
			{
				//Only Reated 3 or Higher
				if( tData[i].rating > 3 && tData[i].price_level > 1 )
				{
					service.getDetails( { placeId: tData[i].place_id }, function( place, status ) 
					{
			          	if( status === google.maps.places.PlacesServiceStatus.OK ) 
			          	{
							dateRestaurants.push( place );
							//console.log( place );
		          		}
			        });
			    }
			}

			//TODO - this is getting fired bfore the details are loaded
			eventSystem.dispatchEvent( 'onRestaurantsLoaded', dateRestaurants );
			//return dateRestaurants;
		}
	}

	//TODO finish this
	function googleDetailResults( tData, tStatus )
	{
		if ( tStatus == google.maps.places.PlacesServiceStatus.OK )
		{
		}
	}

})();

//ZOMATO REQUEST OBJECT

// $.ajax({
//     url: "http://www.example.com/api",
//     beforeSend: function(xhr) { 
//       xhr.setRequestHeader("Authorization", "Basic " + btoa("username:password")); 
//     },
//     type: 'GET',
//     dataType: 'json',
//     contentType: 'application/json',
//     data: '{"foo":"bar"}',
//     success: function (data) {
//       alert(JSON.stringify(data));
//     },
//     error: function(){
//       alert("Cannot get data");
//     }
// });

//ZOMATO API
//0a382fade4b2a84645f407a1aba798fd
//https://developers.zomato.com/api/v2.1/geocode?lat=33.744751&lon=-84.375485
//curl -X GET --header "Accept: application/json" --header "user-key: 0a382fade4b2a84645f407a1aba798fd" "https://developers.zomato.com/api/v2.1/geocode?lat=33.744751&lon=-84.375485"

//YELP API INFO
//var yelpToken = "Bearer MFCkuq78C-cEfVRr6FNy3rn6fbzV98ThKWw2kz7QVGzakaN6vQWNyhKtBT0vD9edDTmu_W_zjeRggudF-LltV7vwfxppBVdrzvk9uBskssdh3eS8Avr6VI2odX1FWXYx"
//var yelpQueryURL = "https://api.yelp.com/v3/businesses/search?location=" ;

