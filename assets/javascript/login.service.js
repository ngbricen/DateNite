//DUNCAN IARIA

//this might handle user log in and geolocation gathering
//so that the user does not have to use zip code unless they are uptight about their geolocation

//TODO 
//integrate the zip code API

//=======================
//	Login
//=======================
var loginService = ( function()
{
	//current user
	var currentUser;

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
	        navigator.geolocation.getCurrentPosition( createUser, showError );
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
	}

	//prove that we got a location
	function createUser( tPos )
	{  	
		console.log( tPos );
	   	//create a new user with the provided location
	    user = new User( null, tPos.coords.latitude, tPos.coords.longitude );
	    
	    return user;
	   	//console.log( tPos.coords );
	    //console.log( tPos.coords.latitude );
	    //console.log( tPos.coords.longitude );
	    //console.log( user );
	}

	//log possible errors
	function showError( error ) 
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