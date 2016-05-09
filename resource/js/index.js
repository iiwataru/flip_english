var Index;

(function() {

	Index = function() {
		this.flip = new Flip();
		this.searchEnabled = true;
		this.fontSize = this.Config.FONT_SIZE.DEFAULT;
		this.setEvents();
		this.loadCache();
		this.render();
		return this;
	};

	Index.prototype.Config = {
		FONT_SIZE: {DEFAULT: 80, MIN: 20, MAX: 400, STEP: 20},
		LINE_HEIGHT_MARGIN: 8
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

		$("#search").focus(function(){
			self.searchEnabled = true;
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

		$("#zoom_out").on(ev, function() {
			self.zoomOutFontSize();
		});

		$("#zoom_in").on(ev, function() {
			self.zoomInFontSize();
		});

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
			$("body").on("touchmove", function(e) {
				e.preventDefault();
			});
		}
	};

	Index.prototype.search = function() {
		var self = this;

		// 二重処理を防止
		if (!self.searchEnabled) return;
		self.searchEnabled = false;

		// パス取得
		var simplePath = $("#search").val();

		// Text fieldからフォーカスを外す
		$("#search").blur();

		// 入力チェック
		if (simplePath.length == 0) {
			self.flip.clearData();
			self.render();

			// キャッシュ削除
			Storage.setPath("");
			Storage.setContent("");
			return;
		}

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
				self.flip.clearData();
				self.showMessage("Not Found");
			},
		});
	};

	Index.prototype.zoomOutFontSize = function() {
		if (this.fontSize <= this.Config.FONT_SIZE.MIN) return;
		this.fontSize -= this.Config.FONT_SIZE.STEP;
		this.setFontSize(this.fontSize);
	};

	Index.prototype.zoomInFontSize = function() {
		if (this.fontSize >= this.Config.FONT_SIZE.MAX) return;
		this.fontSize += this.Config.FONT_SIZE.STEP;
		this.setFontSize(this.fontSize);
	};

	Index.prototype.setFontSize = function(value) {
		$("#flipbox").css("font-size", value + "px");
		$("#flipbox").css("line-height", value + this.Config.LINE_HEIGHT_MARGIN + "px");
		this.layout();
	};

	Index.prototype.replay = function() {
		this.flip.replay();
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
		if (this.flip.prev()) this.render();
	};

	Index.prototype.next = function() {
		if (this.flip.next()) this.render();
	};

	Index.prototype.showMessage = function(message) {
		$("#flipbox").text(message);
		this.layout();
	};

	Index.prototype.clearMessage = function(message) {
		this.showMessage("");
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
	};

	Index.prototype.layout = function() {
		var flipbox = $("#flipbox");
		var top = ($(window).height() - flipbox.height()) / 2 - $("#header").height() * 1.2; // 若干上にずらして見た目調整
		var left = ($(window).width() - flipbox.width()) / 2;
		flipbox.css("top", top);
		flipbox.css("left", left);
	};

	Index.prototype.loadCache = function() {
		var path = Storage.getPath();
		var content = Storage.getContent();
		var direction = Storage.getDirection();

		// パスとコンテンツ
		if (path.length > 0 && content.length > 0) {
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
