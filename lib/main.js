const { Cu } = require("chrome");
Cu.import("resource:///modules/CustomizableUI.jsm");

var { ToggleButton } = require('sdk/ui/button/toggle');
var { Toolbar } = require("sdk/ui/toolbar");
var { Frame } = require("sdk/ui/frame");

var panels = require("sdk/panel");
var self = require("sdk/self");
var data = self.data;
var tabs = require("sdk/tabs");
var pageMod = require("sdk/page-mod");
var grooveTab;
var grooveWorker;
var tag = "p";

var frame = new Frame({
  url: "./panel.html"
});

var toolbar = Toolbar({
  title: "My A toolbar",
  items: [frame],
  hidden: false,
  customizable: true,
  onShow: showing,
  onHide: hiding
});

function showing(e) {
  console.log("showing");
  console.log(e);
}

function hiding(e) {
  console.log("hiding");
  console.log(e);
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
  }
});

var panel = panels.Panel({
  contentURL: data.url("panel.html"),
  contentScriptFile: [data.url("jquery-ui-1.10.4/js/jquery-1.11.0.min.js"), data.url("jquery-ui-1.10.4/js/jquery-ui-1.10.4.min.js"), data.url("script.js")],
  onHide: handleHide
});

panel.port.on("login", function() {
	tabs.open({
		url: "http://grooveshark.com/",
		onOpen: function onOpen(tab) {
			grooveTab = tab;
		},
		onClose: function onOpen(tab) {
			grooveTab = null;
		}
	});
});
	
panel.port.on("next", function() {
	//console.log("received next in add-on main script");
	if (grooveTab != null) {
		grooveWorker.port.emit("next");
	} else {
		//console.log("grooveWorker is null");
	}
});
	
panel.port.on("previous", function() {
	//console.log("received previous in add-on main script");
	if (grooveTab != null) {
		grooveWorker.port.emit("previous");
	} else {
		//console.log("grooveWorker is null");
	}
});
	
panel.port.on("togglePlayPause", function() {
	//console.log("received togglePlayPause in add-on main script");
	if (grooveTab != null) {
		grooveWorker.port.emit("togglePlayPause");
	} else {
		//console.log("grooveWorker is null");
	}
});
	
function handleChange(state) {
  if (state.checked) {
    panel.show({
      position: button
    });
  }
}

function handleHide() {
  button.state('window', {checked: false});
}

CustomizableUI.createWidget({
	id : "aus-hello-button-dea",
	defaultArea : CustomizableUI.AREA_PANEL,
	label : "Hello Button AREA_PANEL",
	tooltiptext : "Hello!",
	onCommand : function(aEvent) {
	  let win = aEvent.target.ownerDocument.defaultView;
	  win.alert("Hello!");
    }
});

var widgetID = "foobar";
var buttonID = "widget:" + require("sdk/self").id + "-" + widgetID;
var toolbarName = "My Extension Toolbar";
require("sdk/widget").Widget({
	id : "aus-hello-button",
	//defaultArea : CustomizableUI.AREA_NAVBAR,
	label : "Hello Button 2",
	tooltiptext : "Hello!",
	contentURL: data.url("panel.html"),
	onCommand : function(aEvent) {
	  let win = aEvent.target.ownerDocument.defaultView;
	  win.alert("Hello!");
    }
});

if (firstRun)
{
  var winUtils = require("sdk/deprecated/window-utils");
  for (var window in winUtils.browserWindowIterator())
  {
    var toolbox = window.gNavToolbox;
    if (toolbox)
    {
      // Does the button exist already?
      var button = toolbox.ownerDocument.getElementById(buttonID);
      if (button && button.parentNode.getAttribute("toolbarname") == toolbarName)
        continue;  // Button already in the right toolbar
      else if (button)
      {
        // Remove button from its current location
        var toolbar = button.parentNode;
        toolbar.removeChild(button);

        // Make sure this change is persisted
        toolbar.setAttribute("currentset", toolbar.currentSet);
        toolbar.ownerDocument.persist(toolbar.id, "currentset");
      }

      var toolbar = toolbox.appendCustomToolbar("My Extension Toolbar", buttonID);
      toolbar.currentSet = toolbar.getAttribute("currentset");
      toolbar.ownerDocument.persist(toolbar.id, "currentset");

      // Send change notification, the widget needs reinitializing
      var event = toolbox.ownerDocument.createEvent("Events");
      event.initEvent("customizationchange", true, true);
      toolbox.dispatchEvent(event);
    }
  }
}

let panel = doc.createElement("panelview");
let iframe = doc.createElement("iframe");
 
panel.setAttribute("id", "aus-view-panel");
iframe.setAttribute("id", "aus-view-iframe");
iframe.setAttribute("type", "content");
iframe.setAttribute("src", "chrome://aus-view/content/player.html");
 
panel.appendChild(iframe);
doc.getElementById("PanelUI-multiView").appendChild(panel);

CustomizableUI.createWidget(
		  { id : "aus-view-button",
		    type : "view",
		    viewId : "aus-view-panel",
		    defaultArea : CustomizableUI.AREA_NAVBAR,
		    label : "Hello Button AREA_NAVBAR",
		    tooltiptext : "Hello!",
		    onViewShowing : function (aEvent) {
		      // initialize code
		    },
		    onViewHiding : function (aEvent) {
		      // cleanup code
		    }
		  });

/*CustomizableUI.registerArea(
{ aAreaId : "BRA",
	type : CustomizableUI.TYPE_TOOLBAR,
	defaultPlacements: ["aus-hello-button"],
});
*/
