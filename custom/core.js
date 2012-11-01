(function () {
	
	
	//
	//	Attach events to window
	//
	window.Global = new BaseObject({
		Implement: [Events]
	});
	window.addEvent = (function () { return Global.addEvent.attachVars(arguments); });
	
})();