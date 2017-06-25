//this will handle the yelp API
var yelpToken = "Bearer MFCkuq78C-cEfVRr6FNy3rn6fbzV98ThKWw2kz7QVGzakaN6vQWNyhKtBT0vD9edDTmu_W_zjeRggudF-LltV7vwfxppBVdrzvk9uBskssdh3eS8Avr6VI2odX1FWXYx"
var yelpQueryURL = "https://api.yelp.com/v3/businesses/search?location=" ;
var googlePlacesURL = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=AIzaSyAdmUNFEGU6RNQ-4TavaviCMlyWKX9q09k";
var zipAPI = "https://www.zipcodeapi.com/rest/" + "js-okLIlW7Iff1cWtt5AXRrTCDDv5LO0gspAe8VafEpvGBr94xK2pbV1PzwUklVBOkb" + "/info.json/" + 30312 + "/degrees";
var googlePath = "https://maps.googleapis.com/maps/api/place/textsearch/json";
var googleAPIKey = 'AIzaSyAdmUNFEGU6RNQ-4TavaviCMlyWKX9q09k';
//var url = googlePlacesURL + "30312";
var requestParams = 
{ 

	"method" : "GET",
	"url": googlePlacesURL,
	"crossDomain" : true,
	"method": "GET",
	"dataType": "json",
	"cache" : false,
  // success : function(){ alert( 'yas' ); }
  // "headers": {
  //   "authorization": "Bearer MFCkuq78C-cEfVRr6FNy3rn6fbzV98ThKWw2kz7QVGzakaN6vQWNyhKtBT0vD9edDTmu_W_zjeRggudF-LltV7vwfxppBVdrzvk9uBskssdh3eS8Avr6VI2odX1FWXYx",
  //   "cache-control": "no-cache",
  // },
  // beforeSend: function( xhr, settings ) { xhr.setRequestHeader('Authorization', 'Bearer MFCkuq78C-cEfVRr6FNy3rn6fbzV98ThKWw2kz7QVGzakaN6vQWNyhKtBT0vD9edDTmu_W_zjeRggudF-LltV7vwfxppBVdrzvk9uBskssdh3eS8Avr6VI2odX1FWXYx'); }
};

gapi.load('client', start);

var googleRequestParams =
{
	'path' : googlePath,
	'params' : {
		'query' : 'restaurants+in+Sydney',
	}
}

function start() {
  // 2. Initialize the JavaScript client library.
  gapi.client.init({
    'apiKey': googleAPIKey,
    // Your API key will be automatically added to the Discovery Document URLs.
    'discoveryDocs': ['https://people.googleapis.com/$discovery/rest'],
  }).then(function() {
    // 3. Initialize and make the API request.
    return gapi.client.request( googleRequestParams );
  }).then(function(response) {
    console.log(response.result);
  }, function(reason) {
    console.log('Error: ' + reason.result.error.message);
  });
};

var restRequest = gapi.client.request( googleRequestParams );

// GOOGLE API
// https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Sydney&key=AIzaSyAdmUNFEGU6RNQ-4TavaviCMlyWKX9q09k

//Standard ajax
// $.ajax( requestParams ).done( function( tData )
// {
// 	console.log( tData );
// });
