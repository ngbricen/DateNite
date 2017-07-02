//We had some issues getting yelp to authenticate with "CORS"
var yelpToken = "Bearer MFCkuq78C-cEfVRr6FNy3rn6fbzV98ThKWw2kz7QVGzakaN6vQWNyhKtBT0vD9edDTmu_W_zjeRggudF-LltV7vwfxppBVdrzvk9uBskssdh3eS8Avr6VI2odX1FWXYx"
var yelpQueryURL = "https://api.yelp.com/v3/businesses/search?location=" ;

//Defining Variables to call the Event Brite API
var queryURL = "";
var eventBriteQueryURL = "https://www.eventbriteapi.com/v3/events/search/"
var eventBriteToken = "?token=56ZIJSBXO7WBDSTCMZE2"

//TODO Ideally, we would like to also get the venue address, which is under the .venue node, but could not get it to work
//TODO The call recommended by EventBrite is "&expand=category,venue"; however, that did not work...
var category  = "&expand=category";

// variables for both events and restaurants are the same
var activityId;
var activityImage;
var activityName;
var activityURL;
var activityCategory;
var activityDate;
var activityHour;
var activityMeridiem;
var activityDateFormatted;
var EventsWithinDays = 10;
var dayDiff;
var selection; 
var eventCount = 0;
var myEventDate;
var myEventName;
var myEventURL;

//Hide My Events since there are none
$("#myEvents").hide();

eventSystem.addEventListener( 'onUserCreated', searchEvents );

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
                      + myEventName + "</a></td>")); 
  row.append($("<td class ='eventRemove'> <a href='#'><span class='glyphicon glyphicon-remove-sign'></span></a></td>"));

  $("#myEvent-table tbody").append(row);

});

//Remove Rows when remove icon is clicked
$(document).on("click",".eventRemove",function(){  
  //Remove Row
  $(this).closest('tr').remove();

  //Update the header and counter
  eventCount--;
  $("#myEventHeader").text("My Events (" + eventCount + ")");
  
  //Hide the events section if there are none
  if (eventCount === 0){

    //Hide My Events since there are none and collapse in
    $("#myEvents").hide();
    // $(".collapse").collapse();
  }

  return false;
});

//Wrapper for user created event (to establish the new user location)
function searchEvents( tUser )
{
  //override zipcode with the new one from the user
  zipCode = '&location.address=' + tUser.zipCode;
  queryURL = eventBriteQueryURL + eventBriteToken + zipCode + category;
  callEventBrite( queryURL );
}

//Call EventBrite and DisplayEvents
function callEventBrite(queryURL){
  //Initialize Events Header
  $("#events").text("Events Within " + EventsWithinDays + " days");


  //Remove formatting from table
  $("#event-table").dataTable().fnDestroy();
  
  //Empty table
  $("#event-table tbody").empty();


  $.ajax({
    url: queryURL,
    method: "GET",
  }).done(function(response) {
    var results = response.events;

    console.log(queryURL);
    console.log(results);
    
    for (var i = 0; i < results.length; i++) {

      activityId = results[i].id;

      //Get Image or replace with Generic if image does not exist
      if (results[i].logo !== null){
        activityImage = results[i].logo.original.url;
      }
      else{
        activityImage = "./assets/images/noimage.jpg";
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

      //In a case where the activity is 9/29 5PM and current time is 9/28 10PM
      //The diff function above will return 0 as if it's on the same day - this is resolved below
      if (dayDiff === 0 && moment(activityDate).format("MM/DD/YY") !== moment().format("MM/DD/YY")){
        dayDiff = 1;
      }

      activityDateFormatted =  moment(activityDate).format("MM/DD/YY h:mmA");
      activityHour =  moment(activityDate).format("h");
      activityMeridiem =  moment(activityDate).format("A");

      //Function to build the event html elements and add it to the event DIV control
      //Only if the event occurrs on the current day and occurs in the evening
     if (dayDiff <=EventsWithinDays && activityHour >= 5 && activityMeridiem === "PM"){
        addEventToControl(activityImage,activityName,activityURL,activityCategory,activityDateFormatted,activityId);
     }
    }

    // //Include Pagination Features
    $("#event-table").DataTable({
        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
        "bRetrieve": true
    });

  });

}

function addEventToControl(image,name,url,category,date,eventId){

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
    row.append($("<td class = 'details' event-id =" + eventId + ">" 
                      + "<strong>" + date + "</strong>" 
                      + "<p><a href='" + url + "' target='_blank'></p>" 
                      + name + "</a>" 
                      + "<p><strong>" + category + "</strong></p></td>")); 
                        // + "<p><strong>In " + dayDiff + " days</strong></td>"));
    $("#event-table tbody").append(row);
}  

//Actions when users enters a message
$(".categories").on("click",function(event){
  //Get the selection from the dropdown
  selection = $(this).attr("category-id");

  zipCode = '&location.address=' + $("#zip-code-input").val().trim();

  //Replace the dropdownheader text and attribute
  $("#categories").text($(this).text());
  $("#categories").attr("category-id",selection);

  //Get the Day range for what is preselected
  EventsWithinDays = $("input[name=dayradio]:radio:checked").attr("day-id");
  
  //If the Selection is none
  if (selection === "0"){
     queryURL = eventBriteQueryURL + eventBriteToken + zipCode + category;
     $("#events").html("<strong>Events Within " + EventsWithinDays + " days</strong>");
  }
  else {
    queryURL = eventBriteQueryURL + eventBriteToken + zipCode + category + "&categories=" + selection;
    $("#events").html("<strong>Events Within " + EventsWithinDays + " days - Filtered by " + $(this).text() + "</strong>");
  }
  
  callEventBrite(queryURL);
});

//Actions when users enters a message
$(".dayrange").on("click",function(event){
  //Get the selection from the dropdown
  EventsWithinDays = $(this).attr("day-id");

  //Get the selection from the dropdown
  selection =  $("#categories").attr("category-id");

  zipCode = '&location.address=' + $("#zip-code-input").val().trim();

  //If the Selection is none
  if (selection === "0"){
     queryURL = eventBriteQueryURL + eventBriteToken + zipCode + category;
     $("#events").html("<strong>Events Within " + EventsWithinDays + " days</strong>");
  }
  else {
    queryURL = eventBriteQueryURL + eventBriteToken + zipCode + category + "&categories=" + selection;
    $("#events").html("<strong>Events Within " + EventsWithinDays + " days - Filtered by " + $(this).text() + "</strong>");
  }
  
  callEventBrite(queryURL);
});