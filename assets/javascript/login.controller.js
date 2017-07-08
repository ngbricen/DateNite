var loginController = ( function()
{
	var controller = this;
	var isEventsLoaded = false;
	var isRestaurantsLoaded = false;

	var eatsView = $( '#eats-content' );
	var landingPage =  document.getElementById( 'landing-page' );
	var loadingPage = document.getElementById( 'loading-page' );

	//=======================
	//	Input
	//=======================
	var locationButton = document.getElementById( 'login-button' );
	var locationLandingButton = document.getElementById( 'location-landing-button' );
	var zipCodeLandingButton = document.getElementById( 'zip-landing-button' );
	var zipCodeButton = document.getElementById( 'zip-code-button' );
	var zipCodeInput = document.getElementById( 'zip-code-input' );
	var zipCodeSplashInput = document.getElementById( 'zip-code' );
	var zipCodeSplashMessage = document.getElementById( 'zip-code-splashmessage' );
	var zipCodeLandingMessage = document.getElementById( 'zip-code-landingmessage' );

	//=======================
	//	Events
	//=======================
	//for "location button" - fire get location service
	locationButton.addEventListener( 'click', startLoadData );
	locationLandingButton.addEventListener( 'click', startLoadData );

	//when the input field changes, check if it's valid input( using an anonymous function so that we can pass parameters )
	zipCodeInput.addEventListener( 'input', function(){ validateZipCode( zipCodeInput.value.trim() ) } );
	zipCodeSplashInput.addEventListener( 'input', function(){ validateZipCode( zipCodeSplashInput.value.trim() ) } );
	zipCodeLandingButton.addEventListener( 'click', function(){ startLoadData( zipCodeSplashInput.value.trim() ) } );
	
	//create events
	eventSystem.registerEvent( 'onEventsLoaded' );
	
	//subscribe to the custom onUserCreated event
	eventSystem.addEventListener( 'onUserCreated', restaurantService.googleSearchNearby );
	eventSystem.addEventListener( 'onRestaurantsLoaded', displayRestaurants );
	eventSystem.addEventListener( 'onEventsLoaded', displayEvents ); 
	
	//VIA BUTTON
	//using an anonymous function so that we can pass a parameter
	zipCodeButton.addEventListener( 'click', function(){ startLoadData( zipCodeInput.value.trim() ) } );

	//=======================
	//	Methods
	//=======================
	//for making sure the zipcode entered is valid before we pass to our API
	function validateZipCode( tZipCode )
	{
		//Start With blank message
		zipCodeSplashMessage.innerHTML = "";
		zipCodeLandingMessage.innerHTML = "";

		//check if the user is entering characters other than values
		if( isNaN( tZipCode ) )
		{
			hideLoginButtons( "Only numbers are valid" );
			//end the function here
			return;
		}

		//check if the zipcode is the required length
		if( tZipCode.toString().length !== 5 )
		{
			//console.log( "not the right length" );
			if( tZipCode.toString().length > 5 || tZipCode.toString().length < 5 )
			{
				hideLoginButtons();
			}

			return;
		}

		//assuming we've made it this far - the zipcode should be a valid zipcode
		//so get the zipcode from our service and show the Splash button submit button
		$( zipCodeLandingButton ).removeClass( 'landing-hidden' );
		$( zipCodeLandingButton ).addClass( 'landing-visible' );
		zipCodeButton.style.display = '';
	}

	function hideLoginButtons( tErrorMessage )
	{
		//Splash Div Buttons
		zipCodeSplashMessage.style.display = '';
		$( zipCodeLandingButton ).removeClass( 'landing-visible' );
		$( zipCodeLandingButton ).addClass( 'landing-hidden' );
		//zipCodeLandingButton.style.display = 'none';

		//Main Div Buttons
		zipCodeLandingMessage.style.display = '';
		zipCodeButton.style.display = 'none';

		//if you've passed in a error message, display it
		if( tErrorMessage != null )
		{
			zipCodeLandingMessage.innerHTML = "<strong>" + tErrorMessage + "</strong>";
			zipCodeSplashMessage.innerHTML = "<strong>" + tErrorMessage + "</strong>";
		}
	}

	//get the location of the user and start the data loading
	function startLoadData( tZipCode )
	{
		isRestaurantsLoaded = false;
		isEventsLoaded = false;

		hideLoginButtons();

		//show loading page
		showLoadingPage( true );
		showMainPage( false );

		if( !isNaN( tZipCode ) )
		{
			//get location by zipcode
			loginService.getLocationByZip( tZipCode );
			console.log( 'getting location with zipCode' );
		}
		else
		{
			//get the user location based on geo stuff and start the whole process
			loginService.getLocation();
			console.log( 'getting location with location services' );
		}
	}

	function displayRestaurants( tData )
	{	
		//Remove formatting from table
		$( "#eats-table" ).dataTable().fnDestroy();
		  
		//Empty table
		$( "#eats-table tbody" ).empty();

		//console.log( eatsView );
		for( var i = 0; i < tData.length; ++i )
		{
			var row = $("<tr>");

		    //Adding Class to the row, which could be usd for an on click event
		    row.addClass( "specificEvent" );

		    //backup image in case nothing is loaded
		    var tempImageUrl = "./assets/images/restaurant.jpg";

		    //if the photos exist - get the url
		    if( tData[i].photos != null && tData[i].photos[0] != null )
	    	{
	    		var tempGoogleImageUrl = tData[i].photos[0].getUrl( { maxWidth: '100', maxHeight: '100' } );
	    		
	    		//make sure we actully got an image
	    		if( tempGoogleImageUrl != null )
    			{
    				tempImageUrl = tempGoogleImageUrl;
    			}
	    	}

		   	row.append($("<td class ='image'>" + "<img src='" + tempImageUrl + "' class='image'>" + "</td>"));
		    row.append($("<td class = 'details' event-id =" + tData[i].place_id + ">" 
		                      + "<a href='" + tData[i].website + "' target='_blank'>"
		                      + tData[i].name + "</a>"
		                      + "<p><strong>Rating " + tData[i].rating + "</strong></p>" 
		                      + tData[i].formatted_address
		                      + " - " + tData[i].formatted_phone_number + "</td>")); 

		    $( "#eats-table tbody" ).append( row );
		}

		//Include Pagination Features
	    $( "#eats-table" ).DataTable({
	        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
	        "bRetrieve": true
	    });

	    isRestaurantsLoaded = true;

	    //check if the rest of the page has loaded (getting rid of loader)
	    evalPageLoad();
	}

	//INFORMS THAT THE EVENTS ARE LOADED (does not actually display)
	function displayEvents()
	{
		isEventsLoaded = true;

		evalPageLoad();
	}

	function evalPageLoad()
	{
		//if all data is loaded and displayed
		if( isEventsLoaded && isRestaurantsLoaded )
		{
			console.log( "all data has loaded" );

			//turn off the loading page
			showLoadingPage( false );

			//show main page
			showMainPage( true );
		}
	}

	function showLoadingPage( tIsVisible )
	{
		if( tIsVisible )
		{
			$( loadingPage ).removeClass( 'splash-hidden' ).addClass( 'splash-visible' );
		}
		else
		{
			$( loadingPage ).removeClass( 'splash-visible' ).addClass( 'splash-hidden' );
		}
	}

	function showMainPage( tIsVisible )
	{
		if( tIsVisible )
		{
			$( '#main-page' ).css( 'visibility', 'visible' );
		}
		else
		{
			$( '#main-page' ).css( 'visibility', 'hidden' );
		}

		//determine if we should show the zip code button
		validateZipCode( zipCodeInput.value.trim() );
	}

	function toggleLandingPage()
	{
		//toggle fade to the rest
        var landingPage = $( "#landing-page" );

        if( landingPage.hasClass( "date-hidden" ) )
        {
        	//if the page is hidden, make it visible
        	landingPage.css( "display","block" );
            landingPage.removeClass( "date-hidden" ).addClass( "visible" );
        }
        else 
        {
        	//start the transition to fade out
            landingPage.removeClass( "visible" ).addClass( "date-hidden" );

            //turn the actual element off (so it no longer blocks input) in a second)
            setTimeout( function(){ landingPage.css( "display", "none" ) }, 1000 );

            //update the main pages zip value (so the user knows what zip they used)
            $( "#zip-code-input" ).val( $( "#zip-code" ).val() );
        }
	}
})();