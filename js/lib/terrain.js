// TODO: abs option, obj args, exception reason
Terrain = (function(){
	var ret = {};
	ret.calc = function(conf) {
		var height = conf.height,
			swing = conf.swing,
			h = conf.decay || conf.smooth || conf.smoothness,
			i = conf.degree,
			lb = (height-swing < 0) ? conf.lowerBound : null,
			ub = (swing>height) ? conf.upperBound : null;
		
		function CTE(msg) {
			this.name="CalcTerrainException";
			this.message = msg;   
			this.toString = function() {
				return this.name+": "+this.message;
			};        
		};
		
		if(typeof(i) != "number" || i<1)      {
			throw new CTE("degree must be an integer greater than 1");
		}
		if(typeof(swing) != "number" || swing<1)      {
			throw new CTE("swing must be an integer greater than 1");
		}
		if(typeof(height) != "number" || height<0) {
			throw new CTE("height must be an integer greater than 0");
		}
		if(typeof(h) != "number" || h<0 || h>1)      {
			throw new CTE("smoothness must be a floating point between 0 and 1 non-inclusive");
		}
		
		var decay = (Math.pow(2,-h));
	
		function gen(start,mid,end,swing,i) {       
			// displace midpoint      zero center swing
			//                        0 -> x : -x/2 -> x/2
			mid = mid + Math.random()*swing-(swing/2);
			mid = (lb && mid < lb) ? lb : mid;
			mid = (ub && mid > ub) ? ub : mid;                
			if(i==1) {
				i--;  
				return [mid>>0];                    
			}
			if(i>1) {
				var midleft = (mid+start)/2;
				var midright = (end+mid)/2;
				swing = swing * decay;
				i--;
				/*
				start     startright
				startleft mid
				|         endleft   endright
				|         |         |
				.    .    .    .    .
					|         |
					midleft   midright
				*/
				return gen(start,midleft,mid,swing,i)
					.concat([mid>>0])
					.concat(gen(mid,midright,end,swing,i));
			}
		}
		return gen(height,height,height,swing,i);
	};
	
	ret.interpolate = function(pts, width) {
		var ret = [],
			idx = 0,
			scale = Math.ceil(width / pts.length),
			start = pts[0],
			end = pts.pop();    
			
		function getpts(start,end,num) {
			var rise = end-start,
				slope = rise/num,
				frac = 1/num,
				retB = [];
	
			for(var j=0; j<num; j++) {
				retB.push(Math.round(slope*j+start));
				idx++;
			}
			return retB;
		}
		
		for(var i=1; i<pts.length; i++) {
			if(idx+scale>width) {break;}
			ret = ret.concat(getpts(start,pts[i],scale));
			start = pts[i];
		}
		ret = ret.concat(getpts(start,end,width-ret.length));
		return ret;
	};
	
	return ret;
})();

if (typeof define === 'function' && define.amd) {
  define(function () {
    return Terrain;
  });
}
