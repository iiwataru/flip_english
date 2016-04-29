var Index;

(function() {

	Index = function() {
		this.manager = new FlipManager()
		this.initialize();
		return this;
	};

	Index.Config = {};

	Index.prototype.initialize = function() {
		this.setEvents();
		this.render();
	};

	Index.prototype.render = function() {
		var directionStr = this.manager.isDirectionEnJa() ? "en > ja" : "ja > en";
		$("#direction").text(directionStr);
	};

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
            success: function(data){
                if (!self.manager.setData(data)) {
                    self.showMessage("Data received, but invalid format.");
                    return;
                }
                self.showMessage("Ready!");
            },
            error: function(data){
                self.showMessage("Not Found");
            },
        });
	};

    Index.prototype.showMessage = function(message) {
        $("#flipbox").text(message);
    };

    Index.prototype.replay = function() {
    };

    Index.prototype.shuffle = function() {
    };

    Index.prototype.reverse = function() {
		this.manager.toggleDirection();
		this.render();
    };

    Index.prototype.prev = function() {
    };

    Index.prototype.next = function() {
        var str = this.manager.fetch();
        if (!str) {
            this.showMessage("Fin.");
            return;
        }
        this.showMessage(str);
    };

	var Index = new Index();

})();
