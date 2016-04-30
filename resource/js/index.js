var Index;

(function() {

	Index = function() {
		this.manager = new FlipManager()
		this.setEvents();
		this.loadCache();
		this.render();
		return this;
	};

	Index.Config = {};

	Index.prototype.setEvents = function() {
		var self = this;

		$("#search").change(function () {
			self.search();
		});

		$("#search").focus(function () {
			$("#search").select();
		});

		$("#search").blur(function () {
			$("#search-wrap").removeClass("is-focused").removeClass("is-dirty");
		});

		$("#replay").click(function () {
			self.replay();
		});

		$("#shuffle").click(function () {
			self.shuffle();
		});

		$("#reverse").click(function () {
			self.reverse();
		});

		$("#main").click(function (e) {
			if (e.pageX < $(window).width() / 2) self.prev();
			else self.next();
		});

	};

	Index.prototype.search = function() {
		var self = this;

		// 入力チェック
		var simplePath = $("#search").val();
		if (simplePath.length == 0) return;

		// text-fieldを畳む
		$("#search").blur();

		// コンテンツ取得
		var path = "contents/" + simplePath + ".json"
		$.ajax({
			url: path,
			cache: false,
			success: function(data){
				if (self.manager.setData(data)) {
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
		this.manager.reset();
		this.render();
	};

	Index.prototype.shuffle = function() {
		this.manager.shuffle();
		this.render();
	};

	Index.prototype.reverse = function() {
		this.manager.toggleDirection();
		this.render();
	};

	Index.prototype.prev = function() {
		this.manager.prev();
		this.render();
	};

	Index.prototype.next = function() {
		this.manager.next();
		this.render();
	};

	Index.prototype.showMessage = function(message) {
		$("#flipbox").text(message);
	};

	Index.prototype.render = function() {
		// direction
		var directionStr = this.manager.isDirectionEnJa() ? "en > ja" : "ja > en";
		$("#direction").text(directionStr);

		// word
		if (this.manager.hasData()) {
			var str = this.manager.currentWord();
			if (str) this.showMessage(str);
			else this.showMessage("Ready?");
		} else {
			this.showMessage("　");
		}
	};

	Index.prototype.loadCache = function() {
		var path = Storage.getPath();
		var content = Storage.getContent();
		if (path == null || content == null) return;

		$("#search").val(path).select();
		this.manager.setData(JSON.parse(content));
		this.render();

		setTimeout(function(){
			$("#search").blur();
		}, 800);
	};

	var Index = new Index();

})();
