define([
	'shared',
	'lib/keys',
	'lib/wee',
	'lib/terrain',
	'entity/car'
], function (Shared, Keys, Wee, Terrain, Car) {
	var car              = new Car()
	,   canvas           = Shared.canvas
	,   ctx              = Shared.ctx
    ,   boutHalfHeight   = (canvas.height/1.8)|0
	,   terrainConfig    = {
			height: canvas.height/1.05,
			swing: canvas.height/.8,
			decay: .65,
			degree: 8,
			upperBound: canvas.height-30,
			lowerBound: 90
 	    }
	,   terrainPoints    = Terrain.calc(terrainConfig)
	,   terrainWindowFac = 1/5 
    ,   terrainWindow    = (terrainPoints.length * terrainWindowFac)|0
    ,   terrainDispStep  = (canvas.width / terrainWindow)|0
    ,   terrainPtr       = 0
    ,   pixelOffset      = 0
	;

	// some global canvas stuff
	ctx.lineCap = 'square';
	ctx.lineJoin = 'miter';

	Keys.on('w', function (e) {
		car.accel();
	});
	Keys.on('s', function (e) {
		car.decel();
	});
	Keys.on('a', function (e) {
		car.left();
		console.log(car.angle);
	});
	Keys.on('d', function (e) {
		car.right();
		console.log(car.angle);
	});


	function moveTerrain () {

		// when terrain pointer reaches the middle of terrain points
		// discard leading terrainWindowFac points and add another set
		// don't forget to adjust pointer relative to discard

		if (terrainPtr > terrainPoints.length>>1) {
			terrainPoints.splice(0,terrainWindow);
			terrainPoints = terrainPoints.concat(Terrain.calc(terrainConfig));
			terrainPtr -= terrainWindow-1;
		} else {
			terrainPtr += 1;
		}

	}

	function drawTerrain () {
		var i, j;

		ctx.save();

		ctx.strokeStyle = '#ffo';
		ctx.fillStyle = '#0a0';

		// bottom
		ctx.beginPath();
		ctx.moveTo(0, canvas.height);

		for (i=terrainPtr, j=0; j <= terrainWindow; i++, j++) {
			ctx.lineTo((j)*terrainDispStep - pixelOffset, terrainPoints[i]);
		}

		ctx.lineTo(canvas.width, canvas.height);
		ctx.lineTo(0, canvas.height);

		ctx.closePath();
		ctx.stroke();
		ctx.fill();
 
		// top
		ctx.beginPath();
		ctx.moveTo(0,0);

		for (i=terrainPtr, j=0; j <= terrainWindow; i++, j++) {
			ctx.lineTo(j*terrainDispStep - pixelOffset,  terrainPoints[i] - boutHalfHeight);
		}

		ctx.lineTo(canvas.width, 0);
		ctx.lineTo(0,0);

		ctx.closePath();
		ctx.stroke();
		ctx.fill();
  

		ctx.restore();
	
	}

	function drawFrameCounter () {
		ctx.save();
		ctx.font="20px monospace";
		ctx.fillStyle = '#f00';
		ctx.fillText(Wee.counter(), 2, 20);
		ctx.restore();
	}

	Wee.setRender(function () {
		Shared.ctx.clearRect(0, 0, Shared.canvas.width, Shared.canvas.height);

		// move background
		pixelOffset += 3;
		if (pixelOffset > terrainDispStep || pixelOffset % terrainDispStep === 0) {

			moveTerrain();
			pixelOffset = 0;
		}

		drawTerrain();
		drawFrameCounter();
		
		Keys.run();
		car.update();
		car.draw();

	});

	Wee.start();
});
