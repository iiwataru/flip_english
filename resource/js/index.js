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
		var index = Index

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
                self.showReadyMessage();
            },
            error: function(data){
                self.showMessage("Not Found");
            },
        });
	};

    Index.prototype.replay = function() {
		this.manager.reset();
		this.showReadyMessage();
    };

    Index.prototype.shuffle = function() {
    };

    Index.prototype.reverse = function() {
		this.manager.toggleDirection();
		this.render();
    };

    Index.prototype.prev = function() {
		var str = this.manager.fetchPrev();
        if (!str) {
			this.showReadyMessage();
            return;
        }
    };

    Index.prototype.next = function() {
        var str = this.manager.fetchNext();
        if (!str) {
			this.showFinishMessage();
            return;
        }
        this.showMessage(str);
    };

	Index.prototype.render = function() {
		var directionStr = this.manager.isDirectionEnJa() ? "en > ja" : "ja > en";
		$("#direction").text(directionStr);
	};

    Index.prototype.showMessage = function(message) {
        $("#flipbox").text(message);
    };

	Index.prototype.showReadyMessage = function() {
		this.showMessage("Ready?");
    };

	Index.prototype.showFinishMessage = function() {
		this.showMessage("Fin.");
    };

	var Index = new Index();

})();
