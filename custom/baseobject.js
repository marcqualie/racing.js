var BaseObject = (function (obj) {
	
	var self = this;
	self.options = obj;
	
	// Implement Other Classes
	if (obj.hasOwnProperty('Implement')) {
		obj.Implement.forEach(function (val) {
			var Obj = new val();
			for (var key in Obj.options) {
				if (Obj.options.hasOwnProperty(key)) {
					obj[key] = Obj.options[key];
				}
			}
		});
	}
	
	// Apply Prototypes
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			self[key] = obj[key];
		}
	}
	
	// Over-rides
	delete self.Implement;
	
	// Default Constructor
	self.baseInitialize = function () {
		
	}
	if (!self.initialize) {
		self.initialize = function () {}
	}
	
	// Return Instance
	return (function (obj) {
		self.baseInitialize(obj);
		self.initialize(obj);
		return self;
	});
	
});