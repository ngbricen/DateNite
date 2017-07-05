$(document).ready(function()
{
    //Start by hiding the Submit button
    $( '#zip-landing-button' ).hide();

    $( '#zip-landing-button' ).click( function() { hideLoginContent() } );
    $( '#location-landing-button' ).click( function() { hideLoginContent() } );
});

function hideLoginContent()
{
     var landingPage = $( "#landing-content" );

    if( landingPage.hasClass( "hidden" ) )
    {
        landingPage.removeClass( "date-hidden" ).addClass( "visible" );
    } 
    else
    {
        landingPage.removeClass( "visible" ).addClass( "date-hidden" );
        setTimeout(function(){ landingPage.css( "display","none" ) }, 1000 );
        $( "#zip-code-input" ).val( $("#zip-code").val() );
    }
}


