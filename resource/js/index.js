var Index;

(function() {

	Index = function() {
		this.manager = new FlipManager()
		this.setEvents();
		this.render();
		return this;
	};

	Index.Config = {};

	Index.prototype.setEvents = function() {
		var self = this;

        $("#search").change(function () {
            self.search();
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

        $("#prev").click(function () {
            self.prev();
        });

        $("#next").click(function () {
            self.next();
        });
    };

    Index.prototype.search = function() {
        var self = this;

        // 入力チェック
        var simplePath = $("#search").val();
        if (simplePath.length == 0) return;

        // text-fieldを畳む
        $("#search-wrap").removeClass("is-focused").removeClass("is-dirty");

        // コンテンツ取得
        var path = "contents/" + simplePath + ".json"
        $.ajax({
            url: path,
			cache: false,
            success: function(data){
                if (self.manager.setData(data)) self.render();
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
			this.showMessage("No data");
		}
	};

    Index.prototype.showMessage = function(message) {
        $("#flipbox").text(message);
    };

	var Index = new Index();

})();
