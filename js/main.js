/*global require,requirejs*/
requirejs.config({
	paths: {
		"aug": "vendor/aug",
		"class": "vendor/class",
		"text": "vendor/rplug/text"
	},
	shim: {
		"aug": { exports: "aug" },
		"class": { exports: "Class" }
	}
});

require(['game'], function (Game) {});
