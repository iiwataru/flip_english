var FlipManager;

(function() {

	FlipManager = function() {
		this.initialize();
        this.data = [];
        this.index = 0;
		this.direction = FlipManager.Config.DIRECTION.EN_JA;
		this.language = FlipManager.Config.LANGUAGE.EN;
		return this;
	};

	FlipManager.Config = {
		DIRECTION: {EN_JA: 0, JA_EN: 1},
		LANGUAGE: {EN: 0, JA: 1}
	};

	FlipManager.prototype.initialize = function() {
	};

    FlipManager.prototype.setData = function(data) {
        var self = this;
        if (!self.validate(data)) return false;

        self.data = eval(data);
		self.reset();
        return true;
	};

    FlipManager.prototype.validate = function(data) {
        return true;
    };

	FlipManager.prototype.reset = function() {
		this.index = 0;
		this.language = this.isDirectionEnJa() ? FlipManager.Config.LANGUAGE.EN : FlipManager.Config.LANGUAGE.JA;
	};

	FlipManager.prototype.currentWord = function() {
		if (this.index < 0 || this.index >= this.data.length) return null;
		return this.isLanguageEn() ? this.data[this.index].en : this.data[this.index].ja;
	};

	FlipManager.prototype.fetchPrev = function() {
		var str = this.currentWord();
		if (str === null) return null;
		if (this.isLastLanguage()) this.index--;
		this.toggleLanguage();
        return str;

    };

	FlipManager.prototype.fetchNext = function() {
		var str = this.currentWord();
		if (str === null) return null;
		if (this.isLastLanguage()) this.index++;
		this.toggleLanguage();
        return str;

    };

	FlipManager.prototype.isLastLanguage = function() {
		if (this.isDirectionEnJa() && (this.language == FlipManager.Config.LANGUAGE.JA)) return true;
		if (!this.isDirectionEnJa() && (this.language == FlipManager.Config.LANGUAGE.EN)) return true;
		return false;
	};

	FlipManager.prototype.toggleDirection = function() {
		this.direction = (this.direction == FlipManager.Config.DIRECTION.EN_JA) ? FlipManager.Config.DIRECTION.JA_EN : FlipManager.Config.DIRECTION.EN_JA;
    };

	FlipManager.prototype.toggleLanguage = function() {
		this.language = (this.language == FlipManager.Config.LANGUAGE.EN) ? FlipManager.Config.LANGUAGE.JA : FlipManager.Config.LANGUAGE.EN;
    };

	FlipManager.prototype.isDirectionEnJa = function() {
		return this.direction == FlipManager.Config.DIRECTION.EN_JA;
	};

	FlipManager.prototype.isLanguageEn = function() {
		return this.language == FlipManager.Config.LANGUAGE.EN;
	};

})();
