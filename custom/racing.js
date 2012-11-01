var RacingJS = new BaseObject({
	
	Implement: [Events],
	
	name: 'default',
	
	// Constructor
	initialize: function (obj) {
		this.name = obj.name;
	},
	
	// Run this after DOMReady
	load: function (obj) {
		this.log('Initialized');
	},
	
	// Debugging
	log: function (str) {
		if (!window.console) return false;
		console.log('[' + this.name + '] ', str);
	}
	
});