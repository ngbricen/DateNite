//TEST DATA
var lat = 33.744751;
var long = -84.375485;
var googleLatLong = new google.maps.LatLng( lat, long );

var request = 
{
	location: googleLatLong,
	radius: '5000',
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
			//console.log( results[i].name );
		}
	}
}

//YELP API INFO
//var yelpToken = "Bearer MFCkuq78C-cEfVRr6FNy3rn6fbzV98ThKWw2kz7QVGzakaN6vQWNyhKtBT0vD9edDTmu_W_zjeRggudF-LltV7vwfxppBVdrzvk9uBskssdh3eS8Avr6VI2odX1FWXYx"
//var yelpQueryURL = "https://api.yelp.com/v3/businesses/search?location=" ;

