// Add-On Content Script

$(document).ready(function() {
	$('.play').attr('title', "Play");
	$('.play').click(function() {
		if ($(this).attr('id') == 'pause') {
			$(this).tooltip({ content: "Play" });
			$(this).attr('id', 'play');
		} else {
			$(this).tooltip({ content: "Pause" });
			$(this).attr('id', 'pause');
		}
    	self.port.emit("togglePlayPause");
	})
	
	$('#previous').attr('title', "Previous Song");
    $('#previous').click(function() {
    	console.log("clicked previous in add-on panel")
    	self.port.emit("previous");
    });
    
	$('#next').attr('title', "Next Song");
    $('#next').click(function() {
    	console.log("clicked next in add-on panel")
    	self.port.emit("next");
    });
    
	$('#logo').attr('title', "Open Grooveshark");
    $('#logo').click(function() {
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
		$('#current-song-img').attr('title', songName);
		$('#current-song-img').attr('src', object.song.artURL);
		$('#current-song-title').attr('title', songName);
		$('#current-song-title').html(songName);
		var artistName = object.song.artistName;
		$('#current-song-artist').attr('title', artistName);
		$('#current-song-title').html(artistName);
	} else {
		console.log("No song yet...");
	}
	console.log("Status: " + object.status);
});
