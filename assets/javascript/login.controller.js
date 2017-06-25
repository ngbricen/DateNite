var loginController = ( function()
{
	var controller = this;

	//=======================
	//	Input
	//=======================
	var locationButton = document.getElementById( 'login-button' );
	var zipCodeButton = document.getElementById( 'zip-code-button' );
	var zipCodeInput = document.getElementById( 'zip-code-input' );

	//=======================
	//	Events
	//=======================
	//for "location button" - fire get location service
	locationButton.addEventListener( 'click', loginService.getLocation );

	//when the input field changes, check if it's valid input( using an anonymous function so that we can pass parameters )
	zipCodeInput.addEventListener( 'input', function(){ validateZipCode( zipCodeInput.value.trim() ) } );

	//subscribe to the custom onUserCreated event
	eventSystem.addEventListener( 'onUserCreated', function(){ userCreated( user ) } );

	//VIA BUTTON
	//using an anonymous function so that we can pass a parameter
	//zipCodeButton.addEventListener( 'click', function(){ loginService.getLocationByZip( zipCodeInput.value.trim() ) } );

	//=======================
	//	Methods
	//=======================
	//for making sure the zipcode entered is valid before we pass to our API
	function validateZipCode( tZipCode )
	{
		//check if the user is entering characters other than values
		if( isNaN( tZipCode ) )
		{
			console.log( "only numbers are valid" );
			//TODO: show warning below or above the zip field

			//end the function here
			return;
		}

		//check if the zipcode is the required length
		if( tZipCode.toString().length != 5 )
		{
			console.log( "not the right length" );

			//return the function here
			return;
		}

		//assuming we've made it this far - the zipcode should be a valid zipcode
		//soget the zipcode from our service
		loginService.getLocationByZip( tZipCode );
	}

	function userCreated( tUser )
	{
		console.log( tUser );
	}
})();