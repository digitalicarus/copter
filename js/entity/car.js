define(['../shared', '../lib/vsprite', 'text!./car.json'], function (Shared, VSprite, car1str) {
	var carData = JSON.parse(car1str);

	console.log(carData);
	
	function Car (params) {
		params = params || {};

		this.color    = params.color || "red";
		this.scale    = params.scale || 3;
		this.scaleInv = 1/this.scale;
		this.pos      = {};
		this.angle    = params.angle || 0;
		this.turnRad  = .009;
		this.topSpeed = 5;
		this.topReverse = 2;
		this.vel      = 0;
		this.jerk     = .3;
		this.sprite   = new VSprite(carData);

		this.pos.x = params.x || Shared.canvas.width  >> 1;
		this.pos.y = params.y || Shared.canvas.height >> 1;
		
	}

	Car.prototype.draw = function () {
		Shared.ctx.save();
		Shared.ctx.strokeStyle = this.color;
		Shared.ctx.translate(this.pos.x, this.pos.y);
		Shared.ctx.scale(this.scale, this.scale);
		Shared.ctx.lineWidth = 1/this.scale;
		Shared.ctx.rotate(this.angle);
		this.sprite.drawCanvas();
		Shared.ctx.restore();
	};

	Car.prototype.accel = function () {
		this.vel += this.jerk;
		if (this.vel > this.topSpeed) {
			this.vel = this.topSpeed;
		}
	};

	Car.prototype.decel = function () {
		this.vel -= this.jerk;
		if (this.vel < -this.topReverse) {
			this.vel = -this.topReverse;
		}
	};

	Car.prototype.right = function () {
		this.angle += this.turnRad * this.vel;
	};

	Car.prototype.left = function () {
		this.angle -= this.turnRad * this.vel;
	};

	Car.prototype.update = function () {
		this.pos.x += this.vel * Math.sin(this.angle);
		this.pos.y += this.vel * -Math.cos(this.angle);
	};

	return Car;

});
