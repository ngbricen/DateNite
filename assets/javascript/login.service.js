//DUNCAN IARIA

//this might handle user log in and geolocation gathering
//so that the user does not have to use zip code unless they are uptight about their geolocation

//TODO
//add error handling for api ajax request
//url for testing = https://www.zipcodeapi.com/rest/sQ8TmdgmloK621rldEfKmRs6UEf6vc5Y3eSpr8MMwwTzxlUL09wn1YtVCI28V76Y/info.json/30312/radians
//ngbricen.github.io

//=======================
//	Login
//=======================
var loginService = ( function()
{
	//current user
	var currentUser;
	var apiKeyZipCode = 'js-okLIlW7Iff1cWtt5AXRrTCDDv5LO0gspAe8VafEpvGBr94xK2pbV1PzwUklVBOkb';
	
	//register the "onUserCreated" event
	eventSystem.registerEvent( 'onUserCreated' );

	//only the stuff that outside scripts can access
	var publicAPI = 
	{
		getUser: getUser,
		getLocation: getLocation,
		getLocationByZip: getLocationByZip
	}

	//return this api to the global scope
	return publicAPI;

	//=======================
	//	User Object
	//=======================
	function User( tName, tLatitude, tLongitude, tZipCode = null ) 
	{
	    this.name = tName;
	    this.latitude = tLatitude;
	    this.longitude = tLongitude;
	    this.zipCode = tZipCode;
	}

	//return the current user ( for allowing global access ) 
	function getUser()
	{
		if( currentUser != null )
		{
			return currentUser;
		}
		else
		{
			console.log( "no user to return - current user is not defined" );
		}
	}

	//=======================
	//	User Position
	//=======================
	//prompt the user for location data
	function getLocation() 
	{
	    if( navigator.geolocation ) 
	    {
	        //first arg is success callback, second arg is failure callback
	        navigator.geolocation.getCurrentPosition( createUser, showLocationError );
	    }
	    else
	    {
	    	console.log( "could not get geo location" );
	    }
	}

	//getting the location using the users zip code
	function getLocationByZip( tZipCode )
	{
		//contact the zip code api, then create user 
		console.log( "your zip is " + tZipCode );

		//build the request URL
		var url = "https://www.zipcodeapi.com/rest/" + apiKeyZipCode + "/info.json/" + tZipCode + "/degrees";
		
		//build request parameters
		var requestParams = { 'url' : url, 'dataType' : 'json' };

		//make the api call to zipcodeapi.com
		$.ajax( requestParams ).done( function( tData )
		{
			//create a new user with the returned data
			createUser( tData );
		});
	}

	//=======================
	//	User Creation
	//=======================
	//prove that we got a location
	function createUser( tPosition )
	{  	
		console.log( tPosition );
		//check if the postition object has the 'coords' object
		if( 'coords' in tPosition )
		{
	   		//create a new user with the provided location
	    	user = new User( null, tPosition.coords.latitude, tPosition.coords.longitude );
		}
	    else
    	{
			user = new User( null, tPosition.lat, tPosition.lng, tPosition.zip_code );
    	}

    	eventSystem.dispatchEvent( 'onUserCreated', user );

    	//returns the user at the global scope
	    return user;
	}

	//=======================
	//	Error Reporting
	//=======================
	//log possible errors
	function showLocationError( error ) 
	{
	    switch( error.code ) 
	    {
	        case error.PERMISSION_DENIED:
	            console.log( "User denied the request for Geolocation." );
	            break;
	        case error.POSITION_UNAVAILABLE:
	           	console.log( "Location information is unavailable." );
	            break;
	        case error.TIMEOUT:
	            console.log( "The request to get user location timed out." );
	            break;
	        case error.UNKNOWN_ERROR:
	            console.log( "An unknown error occurred." );
	            break;
	    }
	}
})();