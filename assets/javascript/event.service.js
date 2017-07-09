//TODO
//Add ability to cleanly remove events and event subscriptions
//To prevent memory leaks

//=======================
//	Events
//=======================
//event constructor
function Event( name )
{
	this.name = name;
	this.callbacks = [];
}

//add method to allow for registering callback functions to the event itself
Event.prototype.registerCallback = function( tCallback )
{
	this.callbacks.push( tCallback );
}

//TODO add callback removal (so event listeners can be unsubscribed)
Event.prototype.unregisterCallback = function( tCallback )
{
	//console.log( this.callbacks.indexOf( tCallback ) );
	//this.callbacks.splice( this.callbacks.indexOf );
	for( var i = this.callbacks.length - 1; i >= 0; --i )
	{
		console.log( this.callbacks[i] );
		if( this.callbacks[i] === tCallback )
		{
			console.log( "yes they match" );
			//there is a match - go ahead and remove the event
			this.callbacks.splice( i, 1 );
		}
		else
		{
			console.log( "no callbacks matched - unable to remove" );
		}
	}

	console.log( this.callbacks );
}

//=======================
//	Event System
//=======================
//making use of Reactor Pattern

//this is the main object that holds all events
function EventSystem()
{
	//object that holds all events
	this.events = {};
}

//method to add and event to the main event object
EventSystem.prototype.registerEvent = function( tEventName )
{
	//check if the event already exists
	for( var tempEvent in this.events )
	{
		if( tEventName == tempEvent )
		{
			//if it exists, do not add it and log a warning (return the function early)
			console.log( 'event ' + tEventName + ' already exists and was not added!' );
			return;
		}
	}

	var event = new Event( tEventName );

	//add the new event
	this.events[tEventName] = event;
};

//removes the whole event - but does not remove individual callbacks
//(though there are removed with the event I assume)
EventSystem.prototype.unregisterEvent = function( tEventName )
{
	//check if the event already exists
	for( var tempEvent in this.events )
	{
		if( tEventName == tempEvent )
		{
			console.log( 'event found and was removed' + tEventName );
			delete this.events[tempEvent];
		}
	}

	//console.log( "remaining events" );
	//console.log( this.events )
}

//for firing the actual event - assuming it exists
EventSystem.prototype.dispatchEvent = function( eventName, eventArgs )
{
	//check if the event exists
	if( this.events[eventName] != null )
	{
		//dispatch the event
		this.events[eventName].callbacks.forEach( function( callback )
		{
			//console.log( eventArgs );
	    	callback( eventArgs );
	  	});
	}
	else
	{
		console.log( "event does not exists so was not dispatched!" );
	}
};

//to start listening for then event in question
EventSystem.prototype.addEventListener = function( tEventName, tCallback )
{
	this.events[tEventName].registerCallback( tCallback );
};

//TODO implement remove event listener logic ( removing an individual callback from an event )
EventSystem.prototype.removeEventListener = function( tEventName, tCallback )
{
	//this.events[tEventName].unregisterCallback( tCallback );
	if( this.events[tEventName] != null )
	{
		this.events[tEventName].unregisterCallback( tCallback );
	}
	else
	{
		console.log( "no event by the name exists - could not remove event listener" );
	}
}

//=======================
//	Initilization
//=======================
//make a new instance at the global scope
var eventSystem = new EventSystem();
