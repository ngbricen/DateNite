//DUNCAN IARIA

//this might handle user log in and geolocation gathering
//so that the user does not have to use zip code unless they are uptight about their geolocation

//=======================
//	Login
//=======================
var loginController = ( function()
{
	//current user
	var currentUser;

	//only the stuff that outside scripts can access
	var publicAPI = 
	{
		getUser: getUser,
		getLocation: getLocation
	}

	//return this api to the global scope
	return publicAPI;

	//=======================
	//	User Object
	//=======================
	function User( tName, tLatitude, tLongitude ) 
	{
	    this.name = tName;
	    this.latitude = tLatitude;
	    this.longitude = tLongitude;
	}

	//return the current user ( for allowing global access ) 
	function getUser()
	{
		return currentUser;
	}

	//=======================
	//	User Position
	//=======================
	//prompt the user for location data
	function getLocation() 
	{
	    if (navigator.geolocation) 
	    {
	        //first arg is success callback, second arg is failure callback
	        navigator.geolocation.getCurrentPosition( createUser, showError );
	    }
	    else
	    {
	    	console.log( "could not get geo location" );
	    }
	}

	//prove that we got a location
	function createUser( tPos )
	{  	
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

//prompt the user as soon as this thing fires and save their input
user = loginController.getLocation();
