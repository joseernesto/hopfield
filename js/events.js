const Events = {};

Events.setUpEvents = function () {
  document.body.onmousedown = UI.mouseDown;
  document.body.onmouseup = UI.mouseUp;

  var pixels = UI.input_image.children;
  for (var i = 0; i < pixels.length; i++) {
    pixels[i].addEventListener("mousedown", UI.onPixelClick);
    pixels[i].addEventListener("mouseenter", UI.onPixelEnter);
  }

  document.getElementById("save-pattern").addEventListener("click", function () {
    var code = Pattern.save(UI.toPattern());
    UI.addPatternToList(code);
    UI.outdateNetwork();
  });

  document.getElementById("clear-pattern").addEventListener("click", function () {
    UI.clearPattern();
  });

  document.getElementById("invert-pattern").addEventListener("click", function () {
    UI.invertPattern();
  });

  document.getElementById("random-pattern").addEventListener("click", function () {
    UI.applyPattern(Pattern.random());
  });

  document.getElementById("disturb-pattern").addEventListener("click", function() {
    var intensity_input = document.getElementById("disturb-intensity");
    var intensity = parseFloat(intensity_input.value);

    if (isNaN(intensity) || intensity < 0 || intensity >= 1) {
      intensity = 0.1;
      intensity_input.value = intensity;
    }

    var disturbed_pattern = Pattern.disturb(UI.toPattern(), intensity);
    UI.applyPattern(disturbed_pattern);
  });

  document.getElementById("select-pattern").addEventListener("click", UI.selectPattern);

  document.getElementById("clear-list").addEventListener("click", function () {
    Pattern.reset();
    UI.clearList();
  });

  document.getElementById("import-list").addEventListener("change", function (event) {
    var file = event.target.files[0];
    FileDealer.upload(file, Main.reloadPatterns);
    UI.outdateNetwork();
  });

  document.getElementById("export-list").addEventListener("click", function () {
    FileDealer.download(Pattern);
  });

  document.getElementById("create-network-from-list").addEventListener("click", function () {
    if (Pattern.hasEmptyStore()) {
      alert("\n"
          + "Nenhum padrão armazenado para criar a rede.\n"
          + "\n"
          + "- Crie e salve um ou mais padrões\n"
          + "- Importe um arquivo válido")
      return;
    }
    Hopfield.reload(Pattern.store);
    UI.networkUpdated();
  });

  document.getElementById("full-async-pass").addEventListener("click", function () {
    if (Events.hopfieldNotSet()) { return; }

    if (Hopfield.neurons === null) {
      Hopfield.neurons = UI.toPattern(UI.output_image);
    }
    var recovered_pattern = Hopfield.fullAsyncPass();
    UI.applyPattern(recovered_pattern, UI.output_image);
  });

  document.getElementById("run-slow-hopfield").addEventListener("click", function () {
    if (Events.hopfieldNotSet()) { return; }

    if (Hopfield.neurons === null) {
      Hopfield.neurons = UI.toPattern(UI.output_image);
    }
    Hopfield.slowFullAsyncPass();
  });

  document.getElementById("run-hopfield").addEventListener("click", function () {
    if (Events.hopfieldNotSet()) { return; }

    var pattern = UI.toPattern(UI.output_image);
    var recovered_pattern = Hopfield.run(pattern);
    UI.applyPattern(recovered_pattern, UI.output_image);
  });

  document.getElementById("clear-output").addEventListener("click", function() {
    Hopfield.resetNeurons();
    UI.clearPattern(UI.output_image);
  });

  document.getElementById("stop-animation").addEventListener("click", function() {
    STOP_ANIMATION = true;
  });

  document.getElementById("speed-up-animation").addEventListener("click", function() {
    TIME_STEP.default /= TIME_STEP.multiplier;
    TIME_STEP.flick /= TIME_STEP.multiplier;
  });

  document.getElementById("slow-down-animation").addEventListener("click", function() {
    TIME_STEP.default *= TIME_STEP.multiplier;
    TIME_STEP.flick *= TIME_STEP.multiplier;
  });
}

Events.setupCheckPattern = function (button, pattern) {
  button.addEventListener("click", function () {
    UI.applyPattern(pattern);
  });
}

Events.setupSelectPattern = function (button, pattern) {
  button.addEventListener("click", function () {
    UI.applyPattern(pattern, UI.output_image);
  });
}

Events.setupRemovePattern = function (button, item, parent, code) {
  button.addEventListener("click", function () {
    parent.removeChild(item);
    Pattern.remove(code);
    UI.outdateNetwork();
  });
}

Events.alert = function (message) {
  console.log("ALERTA: ", message);
}

Events.hopfieldNotSet = function () {
  if (Hopfield.weights === null) {
    alert("Rede não inicializada. Clique em criar rede.");
    return true;
  }

  return false;
}