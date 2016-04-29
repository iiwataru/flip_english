var FlipManager;

(function() {

	FlipManager = function() {
		this.data = [];
		this.index = FlipManager.Config.INDEX_INIT;
		this.direction = FlipManager.Config.DIRECTION.EN_JA;
		this.language = FlipManager.Config.LANGUAGE.EN;
		return this;
	};

	FlipManager.Config = {
		DIRECTION: {EN_JA: 0, JA_EN: 1},
		LANGUAGE: {EN: 0, JA: 1},
		INDEX_INIT: -1
	};

	FlipManager.prototype.setData = function(data) {
		var dataArray = eval(data);
		if (!this.validate(dataArray)) return false;
		this.data = dataArray;

		this.reset();
		return true;
	};

	FlipManager.prototype.validate = function(data) {
		// array であること
		if (!Array.isArray(data)) return false;

		// en, ja を持つこと
		for (var i = 0, len = data.length; i < len; i++) {
			if (data[i].en == null || data[i].ja == null) return false;
		}

		return true;
	};

	FlipManager.prototype.hasData = function() {
		return this.data && Array.isArray(this.data) && this.data.length > 0;
	};

	FlipManager.prototype.getDataCount = function() {
		if (!this.hasData()) return 0;
		return this.data.length;
	};

	FlipManager.prototype.reset = function() {
		this.index = FlipManager.Config.INDEX_INIT;
		this.language = this.isDirectionEnJa() ? FlipManager.Config.LANGUAGE.EN : FlipManager.Config.LANGUAGE.JA;
	};

	FlipManager.prototype.currentWord = function() {
		if (!this.hasData()) return null;
		if (this.index < 0 || this.index >= this.getDataCount()) return null;
		return this.isLanguageEn() ? this.data[this.index].en : this.data[this.index].ja;
	};

	FlipManager.prototype.prev = function() {
		if (!this.hasData()) return false;

		if (this.index == FlipManager.Config.INDEX_INIT) {
			this.index = this.getDataCount() - 1;
		} else {
			if (this.isLanguagePrimary()) {
				this.index = (this.index == 0) ? FlipManager.Config.INDEX_INIT : this.index - 1;
			}
			this.toggleLanguage();
		}
		return true;
	};

	FlipManager.prototype.next = function() {
		if (!this.hasData()) return false;

		if (this.index == FlipManager.Config.INDEX_INIT) {
			this.index = 0;
		} else {
			if (!this.isLanguagePrimary()) {
				this.index = (this.index == this.getDataCount() - 1) ? FlipManager.Config.INDEX_INIT : this.index + 1;
			}
			this.toggleLanguage();
		}
		return true;
	};

	FlipManager.prototype.shuffle = function() {
		// shuffle data
		var m = this.data.length, t, i;
		while (m) {
			i = Math.floor(Math.random() * m--);
			t = this.data[m];
			this.data[m] = this.data[i];
			this.data[i] = t;
		}

		this.reset();
	};

	FlipManager.prototype.isLanguagePrimary = function() {
		if (this.isDirectionEnJa() && (this.language == FlipManager.Config.LANGUAGE.EN)) return true;
		if (!this.isDirectionEnJa() && (this.language == FlipManager.Config.LANGUAGE.JA)) return true;
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
