var Swipe;

(function() {

	Swipe = function() {
		this.delegate = null;
		this.direction = Swipe.Config.DIRECTION.NONE;
		this.position = 0;
		this.isTouchDevice = false;
		this.initDevice();
		this.setEvent();
		return this;
	};

	Swipe.instance = null;

	Swipe.Config = {
		DIRECTION: {NONE: 0, LEFT: 1, RIGHT: 2},
		THRESHOLD: 70
	};

	Swipe.getInstance = function() {
		if (Swipe.instance == null) Swipe.instance = new Swipe();
		return Swipe.instance;
	};

	Swipe.prototype.initDevice = function() {
		this.isTouchDevice = "ontouchstart" in window;
	};

	Swipe.prototype.setDelegate = function(obj) {
		this.delegate = obj;
	};

	Swipe.prototype.setEvent = function() {
		var obj = $("body");
		if (this.isTouchDevice) {
			obj.on('touchstart', this.onTouchStart);
			obj.on('touchmove', this.onTouchMove);
			obj.on('touchend', this.onTouchEnd);
		} else {
			obj.on('mousedown', this.onTouchStart);
			obj.on('mousemove', this.onTouchMove);
			obj.on('mouseup', this.onTouchEnd);
		}
	};

	Swipe.prototype.onTouchStart = function(e) {
		var swipe = Swipe.getInstance();
		swipe.position = swipe.getPosition(e);
		swipe.direction = Swipe.Config.DIRECTION.NONE;
	};

	Swipe.prototype.onTouchMove = function(e) {
		var swipe = Swipe.getInstance();
		if (swipe.position - swipe.getPosition(e) > Swipe.Config.THRESHOLD) {
			swipe.direction = Swipe.Config.DIRECTION.LEFT;
		} else if (swipe.position - swipe.getPosition(e) < -Swipe.Config.THRESHOLD){
			swipe.direction = Swipe.Config.DIRECTION.RIGHT;
		}
	};

	Swipe.prototype.onTouchEnd = function(e) {
		var swipe = Swipe.getInstance();
		if (swipe.direction == Swipe.Config.DIRECTION.LEFT) {
			swipe.delegate.swipeDetectLeft();
		} else if (swipe.direction == Swipe.Config.DIRECTION.RIGHT){
			swipe.delegate.swipeDetectRight();
		}
		return false;
	};

	Swipe.prototype.getPosition = function(e) {
		if (this.isTouchDevice) e.originalEvent.changedTouches[0].pageX;
		else return e.originalEvent.pageX;
	};

})();
