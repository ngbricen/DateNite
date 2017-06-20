/*
  THE GOAL HERE IS TO GET DATA FROM BOTH EVENTBRITE AND YELP
  1. EVENTBRITE EVENTS WILL BE DISPLAYED ON THE LEFT SIDE
    --> EVENTBRITE SHOULD FILTER BY EVENT CATEGORIES THAT ARE IDEALS FOR DATES
  2. WHILE YELP EVENTS WILL BE DISPLAYED ON THE RIGHT SIDE.  
    --> YELP SHOULD FILTER ONLY RESTAURANTS
  **ISSUE WITH YELP IS AUTHENTICATING WITH CORS, WHICH WE COULD NOT GET TO WORK
  3. USERS WILL ENTER THEIR NAME AND ZIPCODE ON THE MAIN PAGE, AND EVENTS WILL BE DISPLAYED on both LEFT AND RIGHT
    a. BASED ON THE ZIP CODE
    b. BASE ON CURRENT DATE
    c. BASE ON EVENTS THAT START AFTER 6PM (AS WE COULD THE APP DATE NITE)
  4. IT WOULD BE GREAT TO ADD FILTERS TO ALLOW USERS TO FILTER EVENTS BY CATEGORY
  5. WILL BE GREAT TO ADD PAGINATION IF YOU GET MORE THAN 10 RESULTS
  6. WE STILL NEED HELP WITH STYLING, ADDING A SUBMIT BUTTON, PLACING IT ALL IN A FORM
    -->NOTE THAT WE DON"T HAVE TO USE JUMBOTRON FOR HEADER, SO OPEN TO IDEAS HERE

*/
//We had some issues getting yelp to authenticate with "CORS"
// var yelpToken = "Bearer MFCkuq78C-cEfVRr6FNy3rn6fbzV98ThKWw2kz7QVGzakaN6vQWNyhKtBT0vD9edDTmu_W_zjeRggudF-LltV7vwfxppBVdrzvk9uBskssdh3eS8Avr6VI2odX1FWXYx"
// var yelpQueryURL = "https://api.yelp.com/v3/businesses/search?location=" ;

//Defining Variables to call the Event Brite API
var eventBriteQueryURL = "https://www.eventbriteapi.com/v3/events/search/"
var eventBriteToken = "?token=56ZIJSBXO7WBDSTCMZE2&expand=venue"

//TODO We need to got the zip Code value from $("#userName").val.trim()
//TODO We also need to validate the zip Code to make sure tha it's a number without generating an alert/prompt
var zipCode   = "&location.address=30309";

//TODO Ideally, we would like to also get the venue address, which is under the .venue node, but could not get it to work
//TODO The call recommended by EventBrite is "&expand=category,venue"; however, that did not work...
var category  = "&expand=category";

// variables for both events and restaurants are the same
var activityImage;
var activityName;
// var activityAddress;
// var activityPhone;
var activityURL;
// var acivityRatings;
var activityCategory;
var activityDate;

activityCategory = "Restaurant"
eventBriteQueryURL = eventBriteQueryURL + eventBriteToken + zipCode + category;
// + "&filter_category=" + activityCategory;


// Create AJAX call for the specific artist button being clicked
$.ajax({
  url: eventBriteQueryURL,
  method: "GET",
}).done(function(response) {
  var results = response.events;

  console.log(results);
  console.log(results.length);
  
  // $("#results-here").empty();
  //        // Looping over every returned results item
  for (var i = 0; i < 10 ; i++) {

    activityImage = results[i].logo.original.url;
    activityName= results[i].name.text;
    activityURL = results[i].url;
    
    //Some eventbrite events do not have categories
    if (results[i].category !== null){
      activityCategory = results[i].category.short_name;
    }

    activityDate = results[i].start.local;

    console.log(activityImage);
    console.log(activityName);
    console.log(activityURL);
    console.log(activityCategory);
    console.log(activityDate);

    //Function to build the event html elements and add it to the event DIV control
    addEventToControl(activityImage,activityName,activityURL,activityCategory);
  }  
});

function addEventToControl(image,name,url,category){
    var row = $("<tr>");

    //Adding Class to the row, which could be usd for an on click event
    row.addClass("specificEvent");

    // Creating and storing an image tag
    var eventImage = $("<img>");

    // Setting the src attribute of the image to a property pulled off the result item
    eventImage.attr("src", image);

    //Setting all other images variables
    eventImage.addClass("image");


    //Adding row to the table
    row.append($("<td>" + "<img src='" + image +"' class='image'>" + "</td>"));
    row.append($("<td>" + "<a href='" + url + "' target='_blank'>" + name + "</a>" + "<p><strong>" + category + "<strong></td>"));
    // row.insertCell(1).innerHTML = childSnapshot.val().role;
    // row.insertCell(2).innerHTML = childSnapshot.val().startDate;
    // row.insertCell(3).innerHTML = childSnapshot.val().monthlyRate;
    console.log(row);
    $("#event-table tbody").append(row);
}  
