$(document).ready(function(){

        //Start by hiding the Submit button
        $('#landing-button').hide();

        $('#landing-button').click(function() {
            var landingPage = $("#landing-page");

            if (landingPage.hasClass("hidden")) {
                landingPage.removeClass("date-hidden").addClass("visible");

            } else {
                landingPage.removeClass("visible").addClass("date-hidden");
                setTimeout(function(){
                	landingPage.css("display","none")
                },1000);
                $("#zip-code-input").val($("#zip-code").val());
            }
        });
    });
