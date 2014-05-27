define(['shared'], function (Shared) {
	function Sprite(params) {
		var  i = null;

		params = params || {};

		if (!params) {
			throw "Sprite: no parameters passed to constructor";
		}
		if (!params.parts || !params.parts instanceof Array) {
			throw "Sprite: must supply a parts member parameter with array of components"; 
		}

		for (i in params) {
			this[i] = params[i];
		}

		this.data          = params.parts;
		this.pos           = {};
		this.pos.x         = params.x || Shared.canvas.width  >> 1;
		this.pos.y         = params.y || Shared.canvas.height >> 1;
		this.angle         = params.angle || 0;
		this.scale         = params.scale || 1;
		this.flipY         = params.flipY || true;
		this.flipX         = params.flipX || false;
		this.c             = {}; // a cache object to avoid varring
		this.defaultStroke = "red";

	}

	Sprite.prototype.drawCanvas = function () {

		if (this.data.length > 0) {
			for(this.c.i = 0; this.c.i < this.data.length; this.c.i++) {
				Shared.ctx.save();

				if (this.data[this.c.i].stroke) {
					Shared.ctx.strokeStyle = this.data[this.c.i].stroke;
				} else {
					Shared.ctx.strokeStyle = this.defaultStroke;
				}
				if (this.data[this.c.i].fill) {
					Shared.ctx.fillStyle = this.data[this.c.i].fill;
				}
 
				Shared.ctx.beginPath();
				Shared.ctx.moveTo(
					(this.flipX) ? -this.data[this.c.i].points[0] : this.data[this.c.i].points[0],
					(this.flipY) ? -this.data[this.c.i].points[1] : this.data[this.c.i].points[1]
				);

				for (this.c.j = 0; this.c.j < this.data[this.c.i].points.length; this.c.j += 2) {
					Shared.ctx.lineTo(
						(this.flipX) ? -this.data[this.c.i].points[this.c.j] : this.data[this.c.i].points[this.c.j],
						(this.flipY) ? -this.data[this.c.i].points[this.c.j+1] : this.data[this.c.i].points[this.c.j+1]
					);
				}
				Shared.ctx.stroke();
				Shared.ctx.fill();
				Shared.ctx.closePath();
				Shared.ctx.restore();

			}
		};

		
	};

	Sprite.prototype.getWidth = function () {
	};
	Sprite.prototype.getHeight = function () {
	};


	return Sprite;
});	
