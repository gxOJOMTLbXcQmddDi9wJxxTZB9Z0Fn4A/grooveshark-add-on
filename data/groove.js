// Grooveshark Control Script
var contentEval = function(source) {
	//console.log("contentEval");
	//console.log(source);
  	// Check for function input.
  	if ('function' == typeof source) {
    	// Execute this function with no arguments, by adding parentheses.
    	// One set around the function, required for valid syntax, and a
    	// second empty set calls the surrounded function.
    	source = '(' + source + ')();'
  	}

	// Create a script node holding this  source code.
  	var script = document.createElement('script');
  	script.setAttribute("type", "application/javascript");
  	script.textContent = source;
 
  	// Insert the script node into the page, so it will run, and immediately
  	// remove it to clean up.
  	document.body.appendChild(script);
  	document.body.removeChild(script);
};

function groovesharkCallback() {
	//console.log("groovesharkCallback");
	function songStatusCallback(object) {
		//console.log("songStatusCallback");
		/*if (object.song != null) {
			console.log("Song name: " + object.song.songName);
			console.log("Artist: " + object.song.artistName);
			console.log("Album: " + object.song.albumName);
		} else {
			console.log("No song yet...");
		}
		console.log("Status: " + object.status);*/
		var event = document.createEvent('CustomEvent');
		event.initCustomEvent("GrovesharkSongStatusChangedEvent", true, true, object);
		document.documentElement.dispatchEvent(event);
	};	
	window.Grooveshark.setSongStatusCallback(songStatusCallback);
};

window.addEventListener("GrovesharkSongStatusChangedEvent", function(event) {
	self.port.emit("songStatusChanged", event.detail);
}, false);

window.addEventListener("GrovesharkNextSongEvent", function(event) {
	self.port.emit("nextSong", event.detail);
}, false);

window.addEventListener("GrovesharkPreviousSongEvent", function(event) {
	self.port.emit("previousSong", event.detail);
}, false);

self.port.on("login", function() {
	contentEval(groovesharkCallback + "\ngroovesharkCallback();");
});

self.port.on("getNextSong", function() {
	//console.log("received login in add-on groove script");
	contentEval("var song = window.Grooveshark.getNextSong(); var event = document.createEvent('CustomEvent'); event.initCustomEvent(\"GrovesharkNextSongEvent\", true, true, song); document.documentElement.dispatchEvent(event);");
});

self.port.on("getPreviousSong", function() {
	//console.log("received login in add-on groove script");
	contentEval("var song = window.Grooveshark.getPreviousSong(); var event = document.createEvent('CustomEvent'); event.initCustomEvent(\"GrovesharkPreviousSongEvent\", true, true, song); document.documentElement.dispatchEvent(event);");
});

self.port.on("pause", function() {
	//console.log("received pause in add-on groove script");
	contentEval("window.Grooveshark.pause()");
});

self.port.on("play", function() {
	//console.log("received play in add-on groove script");
	contentEval("window.Grooveshark.play()");
});

self.port.on("previous", function() {
	//console.log("received previous in add-on groove script");
	contentEval("window.Grooveshark.previous()");
});

self.port.on("next", function() {
	//console.log("received next in add-on groove script");
	contentEval("window.Grooveshark.next()");
});

self.port.on("togglePlayPause", function() {
	//console.log("received togglePlayPause in add-on groove script");
	contentEval("window.Grooveshark.togglePlayPause()");
});
