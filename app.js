function putWordsIntoSpans (str, klass) {
	if(typeof str !== "string") throw new Error("Invalid input");
	if(klass && typeof klass !== "string") throw new Error("Invalid class");

	var str_split = str.split(" ");
	for (var i = 0; i < str_split.length; i++) {
		if(!klass) str_split[i] = "<span>" + str_split[i] + "</span>";
		else str_split[i] = "<span class='"+ klass +"'>" + str_split[i] + "</span>";
	}
	return str_split.join(" ");
}

function addOrientationListener (callback, context) {
	function callbackCaller() {
		callback.call(context, arguments);
	}
	if (window.DeviceOrientationEvent) {
		window.addEventListener("deviceorientation", callbackCaller, false);
	}
	else if (window.OrientationEvent) {
		window.addEventListener("MozOrientation", callbackCaller, false);
	}
	else {
		throw new Error("OrientationUnsupported");
	}
}
var current_beta_gamma = {
	beta: 0,
	gamma: 0
};
try {
	addOrientationListener(handleShake);
}
catch (e) {
	$("body").html("Orientation not supported");
}

function calculateDelta (set1, set2) {
	return {
		beta: set1.beta - set2.beta,
		gamma: set1.gamma - set2.gamma
	};
}
function handleShake (e) {
	var delta = calculateDelta(e[0], current_beta_gamma);
	current_beta_gamma.beta = e[0].beta;
	current_beta_gamma.gamma = e[0].gamma;
}
setInterval(function() {
	SpeedChecker.calculateShakeSpeed.call(SpeedChecker);
}, 200);

var SpeedChecker = function() {
	var last_beta_gamma = {
		beta: current_beta_gamma.beta,
		gamma: current_beta_gamma.gamma
	};
	var shake_callbacks = [];
	function triggerCallbacks () {
		for (var i = 0; i < shake_callbacks.length; i++) {
			shake_callbacks[i].context = shake_callbacks[i].context || window;
			shake_callbacks[i].callback.call(shake_callbacks[i].context);
		}
	}
	return {
		calculateShakeSpeed: function() {
			var delta = calculateDelta(last_beta_gamma, current_beta_gamma);
			if(delta.beta > 10 || delta.gamma > 10) {
				triggerCallbacks();
			}
			// console.log(delta);
			last_beta_gamma = {
				beta: current_beta_gamma.beta,
				gamma: current_beta_gamma.gamma
			};
		},
		onHardShake: function(callback, context) {
			shake_callbacks.push({
				callback: callback,
				context: context
			});
		}
	};
}();

SpeedChecker.onHardShake(function() {
	replaceTypingWithSpans();
	makeWordsFallDown();
});

function makeWordsFallDown () {
	setTimeout(function() {
		var spans = document.querySelectorAll("span");
		for (var i = 0; i < spans.length; i++) {
			spans[i].classList.add("falldown_animation");
		}
	}, 1000);
}
function replaceTypingWithSpans (argument) {
	var textarea = document.querySelector("textarea");
	var typed_string = textarea.value;
	var span_string = "<div class='span_container'>" + putWordsIntoSpans(typed_string, "span_word") + "</div>";
	document.body.innerHTML = span_string;
}

var btn = document.querySelector("button");
btn.addEventListener("click", replaceTypingWithSpans, false);

var started_typing = false;
var textarea = document.querySelector("textarea");
function removeTypeSomething () {
	textarea.value = textarea.value.replace("Type Something", "");
	textarea.removeEventListener("keyup", removeTypeSomething);
}
textarea.addEventListener("keyup", removeTypeSomething);

