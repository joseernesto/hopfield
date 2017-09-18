const Hopfield = {
  size: 0,
  weights: null,
  neurons: null,
  last_pass_neurons: null,
  patterns: ''
};

Hopfield.reset = function () {
  if (LOG) console.log("LOG: Hopfield.reset()");

  Hopfield.size = 0;
  Hopfield.weights = null;
  Hopfield.neurons = null;
  Hopfield.last_pass_neurons = null;
  Hopfield.patterns = '';

  return;
}

Hopfield.resetNeurons = function () {
  if (LOG) console.log("LOG: Hopfield.resetNeurons()");

  Hopfield.neurons = null;
  Hopfield.last_pass_neurons = null;

  return;
}

Hopfield.init = function (size) {
  if (LOG) console.log("LOG: Hopfield.init(size)", size);

  Hopfield.size = size;
  Hopfield.weights = [];
  for (var i = 0; i < size; i++) {
    Hopfield.weights.push(Vec.new(size, 0));
  }

  return;
}

// Example of `patterns` argument:
// {"0": [1, -1, -1, 1], "3": [-1, -1, -1, -1], "17": [1, 1, 1, -1]}
Hopfield.setup = function (patterns) {
  if (LOG) console.log("LOG: Hopfield.setup(patterns)", JSON.stringify(patterns).hashCode());

  Hopfield.patterns = JSON.stringify(patterns);
  var number_of_patterns = Object.keys(patterns).length;
  Object.keys(patterns).sort().forEach(function (key) {
    var pattern = patterns[key];

    if (Hopfield.size === 0) {
      Hopfield.init(pattern.length);
    }

    for (var i = 0; i < Hopfield.size - 1; i++) {
      for (var j = i+1; j < Hopfield.size; j++) {
        Hopfield.weights[i][j] += pattern[i] * pattern[j];
      }
    }
  });

  for (var i = 0; i < Hopfield.size - 1; i++) {
    for (var j = i+1; j < Hopfield.size; j++) {
      Hopfield.weights[i][j] /= number_of_patterns;
      Hopfield.weights[j][i] = Hopfield.weights[i][j];
    }
  }

  return;
}

Hopfield.reload = function (patterns) {
  if (LOG) console.log("LOG: Hopfield.reload(patterns)", JSON.stringify(patterns).hashCode());

  if (Hopfield.patterns === JSON.stringify(patterns)) {
    return;
  }
  Hopfield.reset();
  Hopfield.setup(patterns);

  return;
}

Hopfield.singlePass = function (index) {
  var updated_neuron_value = Vec.dot(Hopfield.weights[index], Hopfield.neurons);
  Hopfield.neurons[index] = (updated_neuron_value >= 0 ? 1 : -1);

  return Hopfield.neurons;
}

Hopfield.fullAsyncPass = function () {
  if (LOG) console.log("LOG: Hopfield.fullAsyncPass(), Hopfield.neurons", JSON.stringify(Hopfield.neurons).hashCode());

  Hopfield.last_pass_neurons = Hopfield.neurons.slice(0, Hopfield.size);
  var order = Vec.random(Hopfield.size);
  for (var i = 0; i < order.length; i++) {
    Hopfield.singlePass(order[i]);
  }

  return Hopfield.neurons;
}

Hopfield.run = function (pattern) {
  if (LOG) console.log("LOG: Hopfield.run(pattern)", JSON.stringify(pattern).hashCode());

  Hopfield.neurons = pattern.slice(0, pattern.length);
  Hopfield.last_pass_neurons = Vec.new(pattern.length, 0);

  var counter = 20;
  while (!Vec.equals(Hopfield.neurons, Hopfield.last_pass_neurons)) {
    Hopfield.fullAsyncPass();
    if (--counter < 0) break;
  }

  return Hopfield.neurons;
}