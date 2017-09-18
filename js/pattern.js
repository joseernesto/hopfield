const Pattern = {
  store: {},
  code: 0
};

Pattern.reset = function () {
  Pattern.store = {};
  Pattern.code = 0;
};

Pattern.reload = function (patterns) {
  Pattern.reset();
  Pattern.store = JSON.parse(JSON.stringify(patterns)); // deep copying object

  var keys = Object.keys(Pattern.store).sort();
  for (var i = 0; i < keys.length; i++) {
    var code = parseInt(keys[i]);

    if (isNaN(code || code < 0)) {
      console.log("Error with pattern key = ", keys[i]);
      console.log("Reseting patterns");
      Patern.clear();
    }

    Pattern.code = Math.max(Pattern.code, code);
  }

  Pattern.code++;

  return;
};

Pattern.save = function (pattern) {
  Pattern.store[Pattern.code] = pattern;

  return Pattern.code++;
};

Pattern.remove = function (code) {
  delete Pattern.store[code];

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