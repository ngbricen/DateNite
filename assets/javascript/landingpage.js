$(document).ready(function(){


        // $('#landing-page').addClass("hidden");

        $('#landing-button').click(function() {
            var landingPage = $("#landing-page");

            console.log("hello");

            if (landingPage.hasClass("hidden")) {
                landingPage.removeClass("date-hidden").addClass("visible");

            } else {
                landingPage.removeClass("visible").addClass("date-hidden");
                setTimeout(function(){
                	landingPage.css("display","none")
                },1000);
            }
        });
    });
