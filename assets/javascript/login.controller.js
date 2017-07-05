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
	//zipCodeButton.addEventListener( 'click', function(){ loginService.getLocationByZip( zipCodeInput.value.trim() ) } );

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
			//console.log( "only numbers are valid" );
			//Splash Div  - still OK since this will be hidden when going to Main Div
			zipCodeSplashMessage.style.display = '';
			zipCodeSplashMessage.innerHTML = "<strong>Only numbers are valid</strong>";
			zipCodeLandingButton.style.display = 'none';

			//Main Div
			zipCodeLandingMessage.style.display = '';
			zipCodeLandingMessage.innerHTML = "<strong>Only numbers are valid</strong>";
			zipCodeButton.style.display = 'none';

			//end the function here
			return;
		}

		//check if the zipcode is the required length
		if( tZipCode.toString().length !== 5 )
		{
			//console.log( "not the right length" );
			if(tZipCode.toString().length > 5){

				//Splash Div  - still OK since this will be hidden when going to Main Div
				zipCodeSplashMessage.style.display = '';
				zipCodeSplashMessage.innerHTML = "<strong>Not the right length - Enter Only 5 Digits</strong>";
				zipCodeLandingButton.style.display = 'none';

				//Main Div
				zipCodeLandingMessage.style.display = '';
				zipCodeLandingMessage.innerHTML = "<strong>Not the right length - Enter Only 5 Digits</strong>";
				zipCodeButton.style.display = 'none';
			}

			return;
		}

		//assuming we've made it this far - the zipcode should be a valid zipcode
		//soget the zipcode from our service and show the Splash button submit button
		zipCodeLandingButton.style.display = '';
		zipCodeButton.style.display = '';

		//loginService.getLocationByZip( tZipCode );
	}

	//get the location of the user and start the data loading
	function startLoadData( tZipCode )
	{
		//show loading page
		showLoadingPage();

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

	//when you actually press the button
	function loginZipCode( tZipCode )
	{
		showLoadingPage();
		loginService.getLocationByZip( tZipCode );

	}

	function showLoadingPage()
	{
		//show loading page
		$( loadingPage ).removeClass( 'splash-hidden' ).addClass( 'splash-visible' );
	}

	function displayRestaurants( tData )
	{
		console.log( "restaurant data:" );
		console.log( tData );
		console.log( tData.length );
		
		//Remove formatting from table
		$("#eats-table").dataTable().fnDestroy();
		  
		//Empty table
		$("#eats-table tbody").empty();

		//console.log( eatsView );
		for( var i = 0; i < tData.length; ++i )
		{
			var row = $("<tr>");

		    //Adding Class to the row, which could be usd for an on click event
		    row.addClass("specificEvent");

		    // Creating and storing an image tag
		    var eventImage = $("<img>");

		    // Setting the src attribute of the image to a property pulled off the result item
		    eventImage.attr("src", "./assets/images/restaurant.jpg");

		    //Setting all other images variables
		    eventImage.addClass("image");

		    //Adding row to the table
		    row.append($("<td class ='image'>" + "<img src='./assets/images/restaurant.jpg' class='image'>" + "</td>"));
		    row.append($("<td class = 'details' event-id =" + tData[i].place_id + ">" 
		                      + "<strong>Rating " + tData[i].rating + "</strong>" 
		                      + "<p><a href='" + tData[i].website + "' target='_blank'></p>" 
		                      + tData[i].name + "</a>" 
		                      + "<p>" + tData[i].formatted_address
		                      + " - " + tData[i].formatted_phone_number + "</p></td>")); 

		    $("#eats-table tbody").append( row );
		}

		//Include Pagination Features
	    $("#eats-table").DataTable({
	        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
	        "bRetrieve": true
	    });

	    isRestaurantsLoaded = true;

	    //check if the rest of the page has loaded (getting rid of loader)
	    evalPageLoad();
	}

	//FOR NOW THIS JUST INFORMS THAT THE EVENTS ARE LOADED (does not actually display)
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
			console.log( "YASSSS" );

			//remove loading page
			$( loadingPage ).removeClass( 'splash-visible' ).addClass( 'splash-hidden' );
			
			//toggle fade to the rest
            var landingPage = $("#landing-page");

            if (landingPage.hasClass("hidden"))
            {
                landingPage.removeClass("date-hidden").addClass("visible");

            }
            else 
            {
                landingPage.removeClass("visible").addClass("date-hidden");
                setTimeout(function(){ landingPage.css( "display","none") },1000 );
                $("#zip-code-input").val($("#zip-code").val());
            }
		}
	}

})();