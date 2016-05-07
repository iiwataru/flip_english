var Flip;

(function() {

	Flip = function() {
		this.data = [];
		this.index = Flip.Config.INDEX_INIT;
		this.direction = Flip.Config.DIRECTION.EN_JA;
		this.language = Flip.Config.LANGUAGE.EN;
		return this;
	};

	Flip.Config = {
		DIRECTION: {EN_JA: 0, JA_EN: 1},
		LANGUAGE: {EN: 0, JA: 1},
		INDEX_INIT: -1
	};

	Flip.prototype.setData = function(data) {
		var dataArray = eval(data);
		if (!this.validate(dataArray)) return false;
		this.data = dataArray;

		this.reset();
		return true;
	};

	Flip.prototype.clearData = function() {
		this.data = [];
		this.reset();
	};

	Flip.prototype.validate = function(data) {
		// array であること
		if (!Array.isArray(data)) return false;

		// en, ja を持つこと
		for (var i = 0, len = data.length; i < len; i++) {
			if (data[i].en == null || data[i].ja == null) return false;
		}

		return true;
	};

	Flip.prototype.hasData = function() {
		return this.data && Array.isArray(this.data) && this.data.length > 0;
	};

	Flip.prototype.getDataCount = function() {
		if (!this.hasData()) return 0;
		return this.data.length;
	};

	Flip.prototype.reset = function() {
		this.resetIndex();
		this.resetLanguage();
	};

	Flip.prototype.resetIndex = function() {
		this.index = Flip.Config.INDEX_INIT;
	};

	Flip.prototype.resetLanguage = function() {
		this.language = this.isDirectionEnJa() ? Flip.Config.LANGUAGE.EN : Flip.Config.LANGUAGE.JA;
	};

	Flip.prototype.currentWord = function() {
		if (!this.hasData()) return null;
		if (this.index < 0 || this.index >= this.getDataCount()) return null;
		return this.isLanguageEn() ? this.data[this.index].en : this.data[this.index].ja;
	};

	Flip.prototype.prev = function() {
		if (!this.hasData()) return false;

		if (this.index == Flip.Config.INDEX_INIT) {
			this.index = this.getDataCount() - 1;
		} else {
			if (this.isLanguagePrimary()) {
				this.index = (this.index == 0) ? Flip.Config.INDEX_INIT : this.index - 1;
			}
		}

		if (this.index != Flip.Config.INDEX_INIT) this.toggleLanguage();

		return true;
	};

	Flip.prototype.next = function() {
		if (!this.hasData()) return false;

		if (this.index == Flip.Config.INDEX_INIT) {
			this.index = 0;
		} else {
			if (!this.isLanguagePrimary()) {
				this.index = (this.index == this.getDataCount() - 1) ? Flip.Config.INDEX_INIT : this.index + 1;
			}
			this.toggleLanguage();
		}
		return true;
	};

	Flip.prototype.shuffle = function() {
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

	Flip.prototype.isLanguagePrimary = function() {
		if (this.isDirectionEnJa() && (this.language == Flip.Config.LANGUAGE.EN)) return true;
		if (!this.isDirectionEnJa() && (this.language == Flip.Config.LANGUAGE.JA)) return true;
		return false;
	};

	Flip.prototype.setDirection = function(value) {
		if (value != Flip.Config.DIRECTION.EN_JA && value != Flip.Config.DIRECTION.JA_EN) return;
		this.direction = value;
		if (this.index == Flip.Config.INDEX_INIT) this.resetLanguage();
	};

	Flip.prototype.getDirection = function() {
		return this.direction;
	};

	Flip.prototype.toggleDirection = function() {
		if (this.direction == Flip.Config.DIRECTION.EN_JA) {
			this.setDirection(Flip.Config.DIRECTION.JA_EN);
		} else {
			this.setDirection(Flip.Config.DIRECTION.EN_JA);
		}
	};

	Flip.prototype.toggleLanguage = function() {
		this.language = (this.language == Flip.Config.LANGUAGE.EN) ? Flip.Config.LANGUAGE.JA : Flip.Config.LANGUAGE.EN;
	};

	Flip.prototype.isDirectionEnJa = function() {
		return this.direction == Flip.Config.DIRECTION.EN_JA;
	};

	Flip.prototype.isLanguageEn = function() {
		return this.language == Flip.Config.LANGUAGE.EN;
	};

})();
