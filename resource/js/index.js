var Index;

(function() {

	Index = function() {
		this.flip = new Flip();
		this.setEvents();
		this.loadCache();
		this.render();
		return this;
	};

	Index.prototype.setEvents = function() {
		var self = this;

		$("#search").change(function() {
			self.search();
		});

		$("#search").keyup(function(e){
			// Return key
			if (e.which == 13) self.search();
		});

		$("#search").blur(function() {
			// Text fieldを畳む
			$("#search-wrap").removeClass("is-focused").removeClass("is-dirty");
		});

		$(window).resize(function() {
			self.layout();
		});

		// タッチデバイスならtouchendイベントを採用する
		var isTouchDevice = "ontouchstart" in window;
		var ev = isTouchDevice ? "touchend" : "click";

		$("#replay").on(ev, function() {
			self.replay();
		});

		$("#shuffle").on(ev, function() {
			self.shuffle();
		});

		$("#reverse").on(ev, function() {
			self.reverse();
		});

		$("#main").on(ev, function(e) {
			var x = isTouchDevice ? e.originalEvent.changedTouches[0].pageX : e.originalEvent.pageX;
			if (x < $(window).width() / 2) self.prev();
			else self.next();
		});

		if (isTouchDevice) {
			// 縦スクロールを無効にする
			$("body").on("touchmove", self.preventScroll, false);
		}
	};

	Index.prototype.preventScroll = function(event) {
		event.preventDefault();
	};

	Index.prototype.search = function() {
		var self = this;

		// 入力チェック
		var simplePath = $("#search").val();
		if (simplePath.length == 0) return;

		// Text fieldからフォーカスを外す
		$("#search").blur();

		// 表示クリア
		self.clearMessage();

		// コンテンツ取得
		var path = "contents/" + simplePath + ".json"
		$.ajax({
			url: path,
			cache: false,
			success: function(data){
				if (self.flip.setData(data)) {
					self.render();

					// キャッシュ登録
					Storage.setPath(simplePath);
					Storage.setContent(JSON.stringify(data));
				}
				else self.showMessage("Invalid format");
			},
			error: function(data){
				self.showMessage("Not Found");
			},
		});
	};

	Index.prototype.replay = function() {
		this.flip.reset();
		this.render();
	};

	Index.prototype.shuffle = function() {
		this.flip.shuffle();
		this.render();
	};

	Index.prototype.reverse = function() {
		this.flip.toggleDirection();
		this.render();
		Storage.setDirection(this.flip.getDirection());
	};

	Index.prototype.prev = function() {
		this.flip.prev();
		this.render();
	};

	Index.prototype.next = function() {
		this.flip.next();
		this.render();
	};

	Index.prototype.clearMessage = function(message) {
		$("#flipbox").text("　");
	};

	Index.prototype.showMessage = function(message) {
		$("#flipbox").text(message);
	};

	Index.prototype.render = function() {
		// direction
		var directionStr = this.flip.isDirectionEnJa() ? "en > ja" : "ja > en";
		$("#direction").text(directionStr);

		// word
		if (this.flip.hasData()) {
			var str = this.flip.currentWord();
			if (str) this.showMessage(str);
			else this.showMessage("Ready?");
		} else {
			this.clearMessage();
		}

		this.layout();
	};

	Index.prototype.layout = function() {
		var top = ($(window).height() - $("#flipbox").height()) / 2 - $("#header").height() * 1.2; // 若干上にずらして見た目調整
		var left = ($(window).width() - $("#flipbox").width()) / 2;
		$("#flipbox").css("top", top);
		$("#flipbox").css("left", left);
	};

	Index.prototype.loadCache = function() {
		var path = Storage.getPath();
		var content = Storage.getContent();
		var direction = Storage.getDirection();

		// パスとコンテンツ
		if (path != null && content != null) {
			$("#search").val(path).select();
			this.flip.setData(JSON.parse(content));
			setTimeout(function(){
				$("#search").blur();
			}, 800);
		}

		// 方向
		if (direction != null) {
			this.flip.setDirection(direction);
			this.flip.resetLanguage();
		}

		this.render();
	};


	var Index = new Index();

})();
