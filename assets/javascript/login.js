//DUNCAN IARIA

//this might handle user log in
//and geolocation gathering
//so that the user does not have to use zip code
//unless they are uptight about their geolocation

//prompt the user for location data
function getLocation() 
{
    if (navigator.geolocation) 
    {
        navigator.geolocation.getCurrentPosition( logPosition, showError );
    }
    else
    {
    	console.log( "could not get geo location" );
    }
}

getLocation();

//prove that we got a location
function logPosition( tPos )
{
	console.log( tPos.coords );
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