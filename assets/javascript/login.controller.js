var loginController = ( function()
{
	//inputs
	var locationButton = document.getElementById( 'login-button' );
	var zipCodeButton = document.getElementById( 'zip-code-button' );
	var zipCodeInput = document.getElementById( 'zip-code-input' );

	//events
	locationButton.addEventListener( 'click', loginService.getLocation );

	//using an anonymous function so that we can pass a parameter
	zipCodeButton.addEventListener( 'click', function(){ loginService.getLocationByZip( zipCodeInput.value.trim() ) } );
	
})();