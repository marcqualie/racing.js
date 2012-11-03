var RacingJS_Core = new Class({
	
	Implement: Events,
	
	//
	//	UI Elements
	//
	width: 320,
	height: 240,
	container: null,
	canvas: {},
	context: {},
	player: null,
	players: [],
	key: {},
	mouse: {
		x: 0,
		y: 0,
		down: false
	},
	map: null,
	
	load: function (obj) {
		
		addEvent('domready', function () {
		
			this.options = obj;
			this.map = obj.map;
			this.width = obj.width ? obj.width.toInt() : 320;
			this.height = obj.height ? obj.height.toInt() : 240;
			this.calc.periodical(1000 / 30, this);
			this.render.periodical(1000 / 30, this);
			
			// Default Body Styles
			var styleSheet = new Element('style', {
				type: 'text/css',
				html: '*{padding:0;margin:0}'
			}).inject($$('head')[0]);
			
			// Events
			addEvents({
				'keyup': this.onKeyUp.bind(this),
				'keydown': this.onKeyDown.bind(this),
				'onMouseDown': this.onMouseDown.bind(this),
				'onMouseUp': this.onMouseUp.bind(this),
				'click': this.onClick.bind(this)
			});
			
			// Setup Container
			this.container = new Element('div', {id: this.options.container })
				.inject(document.body)
				.setStyles({
					width: this.width,
					height: this.height
				})
			
			// Build UI
			if (this.options.ui) {
				this.options.ui.each(function (el) {
					el.inject(document.body)
				}.bind(this));
			}
			
			// Construct UI
			var canvases = ['terrain', 'players', 'effects'];
			canvases.each(function (val, key) {
				var canvas = document.createElement('canvas');	
				this.context[val] = canvas.getContext('2d');
				canvas = $(canvas);
				canvas.width = this.width;
				canvas.height = this.height;
				canvas.setStyles({
					position: 'absolute',
					top: 0,
					left: 0,
					width: this.width,
					height: this.height
				});
				this.canvas[val] = canvas;
				this.container.adopt(this.canvas[val]);
			}.bind(this));
		
		}.bind(this));
		
	},
	
	//
	//	Add Player
	//
	addPlayer: function (obj) {
				
		var player = new Player(obj);
		this.players.push(player);
		if (!obj.npc) this.player = player;
		
	},
	
	//
	//	Events
	//
	onKeyDown: function (e) {
		e.stop();
		e.preventDefault();
		this.key[e.code] = true;
		return false;
	},
	onKeyUp: function (e) {
		e.stop();
		e.preventDefault();
		this.key[e.code] = false;
		return false;
	},
	onMouseMove: function (e) {
		
	},
	onMouseDown: function (e) {
		this.mouse.down = true;
	},
	onMouseUp: function (e) {
		this.mouse.down = false;
	},
	onClick: function (e) {
		
	},
	
	//
	//	Global Rendering
	//
	calc: function () {
		this.players.each(function (player) {
			player.calc();
		})
	},
	render: function () {
		
		var context, player = this.players[0];

		context = this.context['terrain'];
		context.clearRect(0, 0, this.canvas['terrain'].width, this.canvas['terrain'].height);
//		context.fillStyle = 'rgba(0, 200, 0, .1)';
//		context.fillRect(0, 0, this.canvas['terrain'].width, this.canvas['terrain'].height);
		
		// Draw lines to mark out map
		context.beginPath();
		context.strokeStyle = 'rgba(0, 0, 0, .1)';
		context.lineWidth = 2;
		context.moveTo(this.map.checkpoints[0].x, this.map.checkpoints[0].y);
		this.map.checkpoints.each(function (point, i) {
			if (i > 0) context.lineTo(point.x, point.y);
		}.bind(this));
		context.lineTo(this.map.checkpoints[0].x, this.map.checkpoints[0].y)
		context.stroke();
		context.closePath();
		
		// Highlight Checkpoint
		this.map.checkpoints.each(function (point, i) {
			if (!player.checkpoint) player.checkpoint = new Point(0, 0);
			if (point.x == player.checkpoint.x && point.y == player.checkpoint.y) {
//				context.strokeStyle = 'rgba(0, 200, 0, .1)';
//				context.beginPath();
//				context.moveTo(player.x, player.y);
//				context.lineTo(player.checkpoint.x, player.checkpoint.y);
//				context.closePath();
//				context.stroke();
				context.strokeStyle = 'rgba(0, 0, 0, .8)';
				context.lineWidth = 4;
				context.beginPath();
				context.arc(point.x, point.y, 14, 0, Math.PI * 2, true);
				context.stroke();
				context.closePath();
				context.beginPath();
				context.fillStyle = 'rgba(255, 255, 255, 1)';
				context.arc(point.x, point.y, 12, 0, Math.PI * 2, true);
				context.fill();
				context.closePath();
//				context.fillRect(point.x - 8, point.y - 8, 16, 16);
			} else {
				context.strokeStyle = 'rgba(255, 0, 0, .6)';
				context.lineWidth = 1;
				context.beginPath();
				context.arc(point.x, point.y, 6, 0, Math.PI * 2, true);
				context.stroke();
				context.closePath();
			}
		}.bind(this));
		
		// Render Players
		context = this.context['players'];
		this.canvas['players'].width = this.canvas['players'].width;
		this.players.each(function (player) {
			player.render();
			context.drawImage(player.canvas, player.x - player.canvas.width / 2, player.y - player.canvas.height / 2);
		}.bind(this));
	}
	
});

var RacingJS = new RacingJS_Core();