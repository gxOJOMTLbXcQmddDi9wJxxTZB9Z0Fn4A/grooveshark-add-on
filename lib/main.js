var { ToggleButton } = require('sdk/ui/button/toggle');
var { Frame } = require("sdk/ui/frame");

var panels = require("sdk/panel");
var self = require("sdk/self");
var data = self.data;
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var grooveTab = null;
var grooveWorker = null;

var frame = new Frame({
  url: "./panel.html"
});
	
var handleChange = function(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

var handleHide = function() {
  button.state('window', { checked: false });
}

var button = ToggleButton({
  id: "my-button",
  label: "my button",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onChange: handleChange
});

pageMod.PageMod({
  include: "*.grooveshark.com",
  attachTo: "top",	
  contentScriptFile: data.url("groove.js"),
  onAttach: function(worker) {
	grooveWorker = worker;
	grooveWorker.port.emit("login");
	grooveWorker.port.on("songStatusChanged", function(object) {
		panel.port.emit("songStatusChanged", object);
	});
	grooveWorker.port.on("nextSong", function(object) {
		panel.port.emit("nextSong", object);
	});
	grooveWorker.port.on("previousSong", function(object) {
		panel.port.emit("previousSong", object);
  	});
  }
});

var panel = panels.Panel({
  contentURL: data.url("panel.html"),
  contentScriptFile: [data.url("jquery-ui-1.10.4/js/jquery-1.11.0.min.js"), data.url("jquery-ui-1.10.4/js/jquery-ui-1.10.4.min.js"), data.url("script.js")],
  onHide: handleHide
});

panel.port.on("login", function() {
	// PREVENT gro
	if (grooveTab === undefined || grooveTab === null ) {
		tabs.open({
			url: "http://grooveshark.com/",
			onOpen: function(tab) {
				grooveTab = tab;
			},
			onClose: function(tab) {
				grooveTab = null;
				grooveWorker = null;
			}
		});
	} else {
		grooveTab.activate();
	}
});
	
panel.port.on("getCurrentSongStatus", function() {
	//console.log("received getCurrentSongStatus in add-on main script");
	if (grooveWorker != null) {
		grooveWorker.port.emit("getCurrentSongStatus");
	} else {
		//console.log("grooveWorker is null");
	}
});
	
panel.port.on("getNextSong", function() {
	//console.log("received getCurrentSongStatus in add-on main script");
	if (grooveWorker != null) {
		grooveWorker.port.emit("getNextSong");
	} else {
		//console.log("grooveWorker is null");
	}
});
	
panel.port.on("getPreviousSong", function() {
	//console.log("received getCurrentSongStatus in add-on main script");
	if (grooveWorker != null) {
		grooveWorker.port.emit("getPreviousSong");
	} else {
		//console.log("grooveWorker is null");
	}
});
	
panel.port.on("next", function() {
	//console.log("received next in add-on main script");
	if (grooveWorker != null) {
		grooveWorker.port.emit("next");
	} else {
		//console.log("grooveWorker is null");
	}
});
	
panel.port.on("previous", function() {
	//console.log("received previous in add-on main script");
	if (grooveWorker != null) {
		grooveWorker.port.emit("previous");
	} else {
		//console.log("grooveWorker is null");
	}
});
	
panel.port.on("togglePlayPause", function() {
	//console.log("received togglePlayPause in add-on main script");
	if (grooveWorker != null) {
		grooveWorker.port.emit("togglePlayPause");
	} else {
		//console.log("grooveWorker is null");
	}
});