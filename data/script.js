// Add-On Content Script
var isPaused = true;

var clicked = false;

var togglePlayPause = function() {
	var play =  $('.play');
	//console.log("togglePlayPause: isPaused=" + isPaused);
	if (isPaused) {
		play.tooltip({ content: "Play" });
		play.prop('id', 'play');
	} else {
		play.tooltip({ content: "Pause" });
		play.prop('id', 'pause');
	}
}

var elapsedTime = 0;

var isIncrementingElapsedTime = false;

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
    	//console.log("clicked previous in add-on panel")
    	self.port.emit("previous");
    });
    
    var next = $('#next');
	next.prop('title', "Next Song");
    next.click(function() {
    	//console.log("clicked next in add-on panel")
    	self.port.emit("next");
    });
    
    var logo = $('#logo');
	logo.prop('title', "Open Grooveshark");
    logo.click(function() {
    	//console.log("clicked logo in add-on panel")
    	self.port.emit("login");
    });

    $(document).tooltip();

	window.setInterval(function() {
		if (isIncrementingElapsedTime) {
			elapsedTime += 1000;
			$('#time-elapsed').html(formatDuration(elapsedTime));
		}
		self.port.emit("getPreviousSong");
		self.port.emit("getNextSong");
	}, 1000);

	//console.log('loaded');
});

var formatTime = function(time) {
	return (time < 10 ? "0" + time : time) 
};

var formatDuration = function(time) {
	time /= 1000;
	var minutes = Math.floor(time / 60);
	var seconds = Math.ceil(time - minutes * 60);
	return formatTime(minutes) + ":" + formatTime(seconds);
};

var updateElapsedTime = function(status) {
	isIncrementingElapsedTime = (status === 'playing');
	if (status !== 'paused' && status !== 'bufferring' && status !== 'playing') {
		elapsedTime = 0;
	}
};

self.port.on("songStatusChanged", function(object) {
	if (object != null) {
		if (object.song != null) {
			var song = object.song;
			var songName = song.songName;
			var imageElement = $('#current-song-img');
			imageElement.prop('title', songName);
			imageElement.prop('src', song.artURL);
			var titleElement = $('#current-song-title');
			titleElement.prop('title', songName);
			titleElement.html(songName);
			var artistName = song.artistName;
			var artistElement = $('#current-song-artist');
			artistElement.prop('title', artistName);
			artistElement.html(artistName);
			//console.log("calculatedDuration: " + song.calculatedDuration/1000);
			//console.log("estimateDuration: " + song.estimateDuration/1000);
			$('#time-total').html(formatDuration(object.song.calculatedDuration));
		} else {
			//console.log("No song yet...");
		}
		var status = object.status;
		//console.log("Status: " + status);
		isPaused = object.status === 'paused';
		if (!clicked) {
			togglePlayPause();
		}
		updateElapsedTime(status);
		clicked = false;			
	}
});

self.port.on("nextSong", function(song) {
	if (song != null) {
		var songName = song.songName;
		var imageElement = $('#song-next-art');
		imageElement.prop('title', songName);
		imageElement.prop('src', song.artURL);
		var titleElement = $('#song-next-name');
		titleElement.prop('title', songName);
		titleElement.html(songName);
		var artistName = song.artistName;
		var artistElement = $('#song-next-artist');
		artistElement.prop('title', artistName);
		artistElement.html(artistName);
	}
});


self.port.on("previousSong", function(song) {
	if (song != null) {
		var songName = song.songName;
		var imageElement = $('#song-previous-art');
		imageElement.prop('title', songName);
		imageElement.prop('src', song.artURL);
		var titleElement = $('#song-previous-name');
		titleElement.prop('title', songName);
		titleElement.html(songName);
		var artistName = song.artistName;
		var artistElement = $('#song-previous-artist');
		artistElement.prop('title', artistName);
		artistElement.html(artistName);
	}
});
