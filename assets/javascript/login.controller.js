var loginController = ( function()
{
	//inputs
	var loginButton = document.getElementById( 'login-button' );

	//events
	loginButton.addEventListener( 'click', loginService.getLocation );
	
})();