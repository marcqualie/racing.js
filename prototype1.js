var config = {
	name: 'game1',
	width: window.innerWidth,
	height: window.innerHeight,
	container: 'racingjs-example',
	map: new Map({
		width: 640,
		height: 480,
		checkpoints: [
			new Point(100, 50),
			new Point(400, 100),
			new Point(500, 200),
			new Point(500, 350),
			new Point(300, 350),
			new Point(100, 350),
			new Point(60, 300),
			new Point(100, 250),
			new Point(150, 250),
			new Point(300, 320),
			new Point(360, 260),
			new Point(300, 200),
			new Point(150, 150),
			new Point(125, 150),
			new Point(100, 150)
		]
	}),
	ui: [
		new Element('div', {
			id: "trace",
			styles: {
				position: 'absolute',
				bottom: '10px',
				right: '10px',
				'font-family': 'monospace',
				'font-size': '14px'
			}
		}),
		new Element('input', {
			type: "button",
			id: "spawn",
			value: "Spawn Car",
			onclick: "spawnCar()",
			styles: {
				position: 'fixed',
				bottom: '10px',
				left: '10px'
			}
		})
	]
}
RacingJS.load(config);
var w = 16, h = 32;
RacingJS.addPlayer({
	source: new Resource({ /*url: 'images/car1.jpg',*/ width: w, height: h }),
	x: 32,
	y: 50,
	rotation: 90
});
//			for (var i = 0; i < 10; i++) {
//				spawnCar.delay(i * 2000);
//			}
(function () {
	var h = '';
	var human = RacingJS.players[0];
	var point = human.checkpoint;
	if (!point) return;
	var dis = human.distanceTo(point.x, point.y);
//	h += '<div>' + dis.format({decimals: 2}) + '</div><br/>';
	RacingJS.players.each(function (player, i) {
		if (i > 0 ) return;
		h += '<div>Player ' + i + ': '
		+ '<b>' + player.lap + '/5</b> '
		+ 'x:' + (player.x + player.canvas.width / 2).format({decimals: 4})
		+ ' '
		+ 'y:' + (player.y + player.canvas.height / 2).format({decimals: 4})
		+ '</div>';
	});
	$('trace').set('html', h);
}).periodical(100);
function spawnCar () {
	RacingJS.addPlayer({
		npc: 1,
		source: new Resource({ /*url: 'images/car1.jpg',*/ width: 16, height: 32 }),
		x: -32,
		y: 50,
		speedMax: (Math.random() * 50 / 10).round(2) + 3,
		rotation: 90
		//target: RacingJS.players[0]
	});
}