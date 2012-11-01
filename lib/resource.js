var Resource = new Class({
	
	data: {},
	canvas: null,
	context: null,
	width: 0,
	height: 0,
	rotation: 0,
	
	initialize: function (data) {
		
		// 
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		this.width = data.width ? data.width : 50;
		this.height = data.height ? data.height : 50;
		this.rotation = data.rotation ? data.rotation : 0;
		canvas.width = this.width;
		canvas.height = this.height;
		
		// 
		this.data = data;
		this.canvas = canvas;
		this.context = context;
		
		// Attach Texture
		if (data.url) {
			var img = new Image();
			img.onload = function () {
				this.context.clearRect(0, 0, this.width, this.height);
				this.context.save();
				if (this.rotation) {
					this.context.translate(this.width / 2, this.height / 2);
					this.context.rotate(this.rotation * (Math.PI / 180));
					this.context.translate(-(this.width / 2), -(this.height / 2));
				}
				this.context.drawImage(img, 0, 0, this.width, this.height);
				this.context.restore();
			}.bind(this)
			img.src = data.url;
		}
		
		// Default Rectangle for Car shape
		context.fillStyle = 'rgba(111, 111, 111, 1)';
		context.fillRect(0, 0, this.width, this.height);
		context.fillStyle = 'rgba(0, 0, 0, 1)';
		context.fillRect(0, this.height / 4 + 2, this.width, this.height / 2);
		context.fillStyle = 'rgba(255, 255, 255, 1)';
		context.fillRect(0, 0, 2, 1);
		context.fillRect(this.width - 2, 0, 2, 1);
		context.fillStyle = 'rgba(255, 0, 0, 1)';
		context.fillRect(0, this.height - 1, 1, 1);
		context.fillRect(this.width - 1, this.height - 1, 1, 1);
		
	}
	
})