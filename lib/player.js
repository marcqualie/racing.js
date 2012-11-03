var Player = new Class({
	
	//
	//	Data
	//
	id: 0,
	name: '',
	x: 0,
	y: 0,
	width: 64,
	height: 128,
	source: null,
	canvas: null,
	context: null,
	modified: true,
	rotation: 0,
	cruise: 0,
	speed: 0,
	accelerateSpeed: 0.15,
	accelerateBackSpeed: 0.1,
	speedMax: 10,
	speedMaxReverse: 6,
	speedX: 0,
	speedY: 0,
	target: null,
	checkpoint: null,
	lap: 0,
	
	initialize: function (obj) {
		
		Object.each(obj, function (val, key) {
			if (typeof this[key] != 'function') {
				this[key] = val;
			}
		}.bind(this));
		
		// Inherit size from Resource
		if (!obj.width && this.source) this.width = this.source.width;
		if (!obj.height && this.height) this.height = this.source.height;
		
		// Build Canvas
		var canvas = document.createElement('canvas');
		this.context = canvas.getContext('2d');
		canvas = $(canvas);
		canvas.width = this.width * 8;
		canvas.height = this.height * 8;
		this.canvas = canvas;	
		
	},
	
	//
	//	
	//
	accelerate: function () {
		this.speed += this.accelerateSpeed;
		if (this.speed > this.speedMax) this.speed = this.speedMax;
	},
	brake: function (force) {
		this.speed *= force ? force : 0.975;
		if (this.speed < 0.1) this.speed = 0;
	},
	handbrake: function () {
		// TODO
	},
	reverse: function () {
		this.speed -= this.accelerateBackSpeed;
		if (0 - this.speed > this.speedMax) this.speed = this.speedMaxReverse;		
	},
	turn: function (rot) {
		if (this.speed > this.accelerateSpeed) this.rotation += rot * Math.min(this.speed, 5);
		else if (this.speed < -this.accelerateSpeed) this.rotation += rot * Math.max(this.speed, -5);
		if (this.rotation < 0) this.rotation += 360;
		else if (this.rotation > 360) this.rotation -= 360;
		this.modified = true;
	},
	
	//
	//	How much to rotate to view target
	//
	rotationTo: function (tx, ty) {
		var dir = Math.atan2(ty - this.y, tx - this.x);
		var rot = dir * 180 / Math.PI + 90;
		if (rot > 360) rot -= 360;
		if (rot < 0) rot += 360;
		return rot;
	},
	directionTo: function (tx, ty) {
		var rot = this.rotationTo(tx, ty);
		var dir = rot - this.rotation;
		if (dir < -180) dir += 360;
		if (dir > 180) dir -= 360;
		return dir;	
	},
	distanceTo: function (tx, ty) {
		var dx = this.x - tx;
		var dy = this.y - ty;
		return Math.sqrt(dx * dx + dy * dy);
	},
	
	//
	//	Render
	//
	calc: function () {
		
		// Checkpoint Calculation
		var points = RacingJS.map.checkpoints;
		if (!this.checkpoint) {
			this.checkpoint = points[0];
		}
		if (this.checkpoint) {
			points.each(function (point, i) {
				if (this.checkpoint.x == point.x && this.checkpoint.y == point.y) {
					if (this.distanceTo(point.x, point.y) < this.height) {
						if (i < points.length - 1) {
							if (i < 1) this.lap = this.lap + 1;
							this.checkpoint = points[i.toInt() + 1];
						} else {
							this.checkpoint = points[0];
						}
					}
				}
			}.bind(this));
		}
		
		// Human Controlled cars
		if (!this.npc) {
			if (RacingJS.key[37]) this.turn(-1);
			if (RacingJS.key[39]) this.turn(1);
			if (RacingJS.key[38]) this.accelerate();
			if (RacingJS.key[40]) this.speed <= 0 ? this.reverse() : this.brake();
		}
		
		// Calculate next map target for npc
		// Make NPCs Follow Target
		if (this.npc && this.checkpoint) {
			//var tar = this.rotationTo(this.target.x, this.target.y);
			var dir = this.directionTo(this.checkpoint.x, this.checkpoint.y);
			var dis = this.distanceTo(this.checkpoint.x, this.checkpoint.y);
			if (dir > this.speed) this.turn(1);
			else if (dir < -this.speed) this.turn(-1);
			
			this.cruise = 0;
			if (dis < 100) this.brake();
			if (dis < 20 && this.speed < 1) this.cruise = 1;
			else this.accelerate();
			
			// Slow down if close to target
			// if (dis < this.speed * 10 || dis < this.height * 5) {
			// 	this.brake(dis < this.height * 2 ? .96 : .99);
			// 	if (this.speed < .2) this.cruise = 1;
			// 	if (dis < this.height * 3) this.cruise = 0;
			// }
		}

		this.speed *= 0.98;
		if (this.cruise) this.speed = this.cruise;
		if (this.speed < 0.05 && this.speed > 0) this.speed = 0;
		this.speedX = Math.sin (this.rotation * Math.PI / 180) * this.speed;
		this.speedY = Math.cos (this.rotation * Math.PI / 180) * -this.speed;
		this.x = (this.x + this.speedX).round(4);
		this.y = (this.y + this.speedY).round(4);
	},
	render: function () {
		
		if (!this.modified) return;
		
		if (this.source) {
			
			var canvas = this.canvas;
			var context = this.context;
			var offsetX = canvas.width / 2, offsetY = canvas.height / 2;
			
		//	offsetX = 0;
		//	offsetY = 0;
			context.clearRect(0, 0, canvas.width, canvas.height);
		//	context.fillStyle = 'rgba(0, 0, 0, .5)';
		//	context.fillRect(0, 0, canvas.width, canvas.height);
			context.save();
			context.translate(offsetX, offsetY);
			context.rotate(this.rotation * (Math.PI / 180));
			context.translate(-offsetX, -offsetY);
		//	context.fillStyle = 'rgba(255, 0, 0, 1)';
		//	context.fillRect(offsetX - this.width / 2, offsetY - this.height / 2, this.width, this.height);
			
			context.drawImage(this.source.canvas,
				offsetX - this.width / 2,
				offsetY - this.height / 2,
				this.width,
				this.height);

			// is target on left or right?
			/*
			if (this.target && 0) {
				//var tar = this.rotation2target();
				var dir = this.directionTo(this.target.x, this.target.y);
				context.fillStyle = 'rgba(0, 255, 0, .5)';
				if (dir < 0) context.fillRect(canvas.width / 2 - this.width - 5, canvas.height / 2 - this.height / 2, 10, 10);
				if (dir > 0) context.fillRect(canvas.width / 2 + this.width - 5, canvas.height / 2 - this.height / 2, 10, 10);
			}
			*/
			
			context.restore();
		}
		this.modified = false;
	}
	
});