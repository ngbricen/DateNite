//We had some issues getting yelp to authenticate with "CORS"
var yelpToken = "Bearer MFCkuq78C-cEfVRr6FNy3rn6fbzV98ThKWw2kz7QVGzakaN6vQWNyhKtBT0vD9edDTmu_W_zjeRggudF-LltV7vwfxppBVdrzvk9uBskssdh3eS8Avr6VI2odX1FWXYx"
var yelpQueryURL = "https://api.yelp.com/v3/businesses/search?location=" ;

//Defining Variables to call the Event Brite API
var queryURL = "";
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
var activityURL;
var activityCategory;
var activityDate;
var activityHour;
var activityMeridiem;
var activityDateFormatted;
var EventsWithinDays = 5;
var dayDiff;
var selection; 
var eventCount = 0;
var myEventDate;
var myEventName;
var myEventURL;
//Hide My Events since there are none
$("#myEvents").hide();

//When user selects an event, need to add it to "My Events" section
$(document).on("click",".specificEvent",function(){
  eventCount++;

  //Update the header
  $("#myEventHeader").text("My Events (" + eventCount + ")");

  //Only Display the My Event panel once, otherwise, it will be run on every selection
  if (eventCount === 1){
    $("#myEvents").show();    
  }

  //Adding rows to My Event Panel

  //Get Key Variables from the click event
  myEventDate = $(this).find("strong").text();
  myEventName = $(this).find("a").text();
  myEventURL = $(this).find("a").attr("href");;

  var row = $("<tr>");

  //Adding Class to the row, which could be usd for an on click event
  row.addClass("myEvent");

  row.append($("<td class = 'myDetails'>" + "<strong>" + myEventDate + " - </strong>" 
                      + "<a href='" + myEventURL + "' target='_blank'>" 
                      + myEventName + "</a>")); 
  row.append($("<td class ='eventRemove'> <a href='#'><span class='glyphicon glyphicon-remove-sign'></span></a>"));

  $("#myEvent-table tbody").append(row);

});

//Remove Rows when remove icon is clicked
$(document).on("click",".eventRemove",function(){  
  //Remove Row
  $(this).closest('tr').remove();

  //Update the header and counter
  eventCount--;
  $("#myEventHeader").text("My Events (" + eventCount + ")");
  
  return false;
});

//Call EventBrite and DisplayEvents
queryURL = eventBriteQueryURL + eventBriteToken + zipCode + category;
callEventBrite(queryURL);

function callEventBrite(queryURL){
  //Initialize Events Header
  $("#events").text("Events Within " + EventsWithinDays + " days");
  
  //Empty table
  $("#event-table tbody").empty();

  $.ajax({
    url: queryURL,
    method: "GET",
  }).done(function(response) {
    var results = response.events;

    for (var i = 0; i < 40 ; i++) {

      if (results[i].logo.original !== null){
        activityImage = results[i].logo.original.url;
      }
      else{
        activityImage = "";
      }
      
      activityName= results[i].name.text;
      activityURL = results[i].url;
      
      //Some eventbrite events do not have categories
      if (results[i].category !== null){
        activityCategory = results[i].category.short_name;
      }

      activityDate = results[i].start.local;

      // To calculate the days difference and keep the positive value
      dayDiff = Math.abs(moment(activityDate).diff(moment(), "days"));

      activityDateFormatted =  moment(activityDate).format("MM/DD/YY h:mmA");
      activityHour =  moment(activityDate).format("h");
      activityMeridiem =  moment(activityDate).format("A");

      //Function to build the event html elements and add it to the event DIV control
      //Only if the event occurrs on the current day and occurs in the evening
      if (dayDiff <=EventsWithinDays && activityHour >= 6 && activityMeridiem === "PM"){
        addEventToControl(activityImage,activityName,activityURL,activityCategory,activityDateFormatted,dayDiff);
      }
    }

    //Include Pagination Features
    $("#event-table").DataTable({
        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
         "bDestroy": true
    });


  });

}

function addEventToControl(image,name,url,category,date,dayDiff){
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
    row.append($("<td class ='image'>" + "<img src='" + image +"' class='image'>" + "</td>"));
    row.append($("<td class = 'details'>" + "<strong>" + date + "</strong>" 
                        + "<p><a href='" + url + "' target='_blank'></p>" 
                         + name + "</a>" 
                        + "<strong> - " + category + "</strong>")); 
                        // + "<p><strong>In " + dayDiff + " days</strong></td>"));
    $("#event-table tbody").append(row);
}  

//Actions when users enters a message
$(".categories").on("click",function(event){
  
  //Get the selection from the dropdown
  selection = $(this).attr("category-id");

  //Replace the dropdownheader text and attribute
  $("#categories").text($(this).text());
  $("#categories").attr("category-id",selection);

  //Get the Day range for what is preselected
  EventsWithinDays = $("input[name=dayradio]:radio:checked").attr("day-id");
  
  //If the Selection is none
  if (selection === "0"){
     queryURL = eventBriteQueryURL + eventBriteToken + zipCode + category;
     $("#events").text("Events Within " + EventsWithinDays + " days");
  }
  else {
    queryURL = eventBriteQueryURL + eventBriteToken + zipCode + category + "&categories=" + selection;
    $("#events").html("Events Within " + EventsWithinDays + " days<strong> - Filtered by " + $(this).text() + "</strong>");
  }
  
  callEventBrite(queryURL);
});

//Actions when users enters a message
$(".dayrange").on("click",function(event){
  //Get the selection from the dropdown
  EventsWithinDays = $(this).attr("day-id");

  //Get the selection from the dropdown
  selection =  $("#categories").attr("category-id");
  
  //If the Selection is none
  if (selection === "0"){
     queryURL = eventBriteQueryURL + eventBriteToken + zipCode + category;
     $("#events").text("Events Within " + EventsWithinDays + " days");
  }
  else {
    queryURL = eventBriteQueryURL + eventBriteToken + zipCode + category + "&categories=" + selection;
    $("#events").html("Events Within " + EventsWithinDays + " days<strong> - Filtered by " + $(this).text() + "</strong>");
  }
  
  callEventBrite(queryURL);
});