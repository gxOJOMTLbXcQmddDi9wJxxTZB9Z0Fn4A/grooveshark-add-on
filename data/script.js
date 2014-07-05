// Add-On Content Script
var isPaused = true;

var clicked = false;

var togglePlayPause = function() {
	var play =  $('.play');
	console.log("togglePlayPause: isPaused=" + isPaused);
	if (isPaused) {
		play.tooltip({ content: "Play" });
		play.prop('id', 'play');
	} else {
		play.tooltip({ content: "Pause" });
		play.prop('id', 'pause');
	}
}


$(document).ready(function() {
	var play = $('.play');
	play.prop('title', "Play");
	play.click(function() {
		clicked = true;
		isPaused = $(this).prop('id') === 'pause';
		togglePlayPause();
    	self.port.emit("togglePlayPause");
	});
	
	var previous = $('#previous');
	previous.prop('title', "Previous Song");
    previous.click(function() {
    	console.log("clicked previous in add-on panel")
    	self.port.emit("previous");
    });
    
    var next = $('#next');
	next.prop('title', "Next Song");
    next.click(function() {
    	console.log("clicked next in add-on panel")
    	self.port.emit("next");
    });
    
    var logo = $('#logo');
	logo.prop('title', "Open Grooveshark");
    logo.click(function() {
    	console.log("clicked logo in add-on panel")
    	self.port.emit("login");
    });

    $(document).tooltip();
	console.log('loaded');
});

self.port.on("songStatusChanged", function(object) {
	console.log("receiveid songStatusChanged in add-on content script");
	if (object.song != null) {
		var songName = object.song.songName;
		$('#current-song-img').prop('title', songName);
		$('#current-song-img').prop('src', object.song.artURL);
		$('#current-song-title').prop('title', songName);
		$('#current-song-title').html(songName);
		var artistName = object.song.artistName;
		$('#current-song-artist').prop('title', artistName);
		$('#current-song-artist').html(artistName);
	} else {
		console.log("No song yet...");
	}
	console.log("Status: " + object.status);
	isPaused = object.status === 'paused';
	if (!clicked) {
		togglePlayPause();
	}
	clicked = false;
});
