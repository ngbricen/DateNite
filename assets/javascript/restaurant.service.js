//TEST DATA
var lat = 33.744751;
var long = -84.375485;
var googleLatLong = new google.maps.LatLng( lat, long );

var dateRestaurants = [];

var request = 
{
	location: googleLatLong,
	radius: '50000', //max range is 50000 (in meters)
	types: ['restaurant']
};

service = new google.maps.places.PlacesService( document.createElement('div') );
//service.nearbySearch( request, callback );
service.nearbySearch( request, callback );

function callback( results, status ) 
{
	//console.log( results );

	if ( status == google.maps.places.PlacesServiceStatus.OK )
	{
		for (var i = 0; i < results.length; i++) 
		{
			if( results[i].rating > 2.5 && results[i].price_level > 2 )
			{
				dateRestaurants.push( results[i] );
			}
			//console.log( results[i].name );
		}

		//console.log( dateRestaurants );
	}
}

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

