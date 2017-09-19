const Pattern = {
  store: {},
  code: 0
};

Pattern.reset = function () {
  Pattern.store = {};
  Pattern.code = 0;
  Pattern.updateLocalStorage();
};

Pattern.hasEmptyStore = function () {
  return Object.keys(Pattern.store).length === 0;
}

Pattern.updateLocalStorage = function () {
  if (Pattern.hasEmptyStore()) {
    delete localStorage.hopfield;
    return;
  }

  localStorage.hopfield = JSON.stringify(Pattern);

  return;
}

Pattern.reload = function (copy) {
  Pattern.store = JSON.parse(JSON.stringify(copy.store)); // deep-copying the object
  Pattern.code = parseInt(copy.code);
  Pattern.updateLocalStorage();

  return;
};

Pattern.save = function (pattern) {
  Pattern.store[Pattern.code++] = pattern;
  Pattern.updateLocalStorage();

  return Pattern.code - 1;
};

Pattern.remove = function (code) {
  delete Pattern.store[code];
  Pattern.updateLocalStorage();

  return;
};

Pattern.get = function (code) {
  return Pattern.store[code];
};

Pattern.getCodes = function () {
  return Object.keys(Pattern.store).sort();
};

Pattern.invert = function (pattern) {
  var size = pattern.length;
  var inverted = pattern.slice(0, size);

  for (var i = 0; i < size; i++) {
    inverted[i] *= -1;
  }

  return inverted;
};

Pattern.disturb = function (pattern, intensity) {
  var size = pattern.length;
  var disturbed = pattern.slice(0, size);
  for (var i = 0; i < size; i++) {
    if (Math.random() < intensity) {
      disturbed[i] *= -1;
    }
  }

  return disturbed;
};

Pattern.random = function () {
  var pattern = Vec.new(PATTERN_SIZE, 1);
  var density = Math.random();
  for (var i = 0; i < pattern.length; i++) {
    if (Math.random() < density) {
      pattern[i] = -1;
    }
  }

  return pattern;
}

Pattern.test = {
  invert: function () {
    var arr = [1, -1, -1, 1, -1];
    var inv = [-1, 1, 1, -1, 1];
    console.log("Pattern.invert: ", Pattern.util.compare(Pattern.invert(arr), inv));
  },

  all: function () {
    Pattern.test.invert();
  }
};

Pattern.util = {
  compare: function (a, b) {
    if (a instanceof Array && b instanceof Array) {
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }

    return false;
  }
};