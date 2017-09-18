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
  });

  document.getElementById("clear-pattern").addEventListener("click", function () {
    UI.clearPattern();
  });

  document.getElementById("invert-pattern").addEventListener("click", function () {
    UI.invertPattern();
  });

  document.getElementById("select-pattern").addEventListener("click", UI.selectPattern);

  document.getElementById("clear-list").addEventListener("click", function () {
    Pattern.reset();
    UI.clearList();
  });

  document.getElementById("import-list").addEventListener("change", function (event) {
    var _updatePatterns = function (patterns) {
      Pattern.reload(patterns);
      UI.reloadList();
    }

    var file = event.target.files[0];
    FileDealer.upload(file, _updatePatterns);
  });

  document.getElementById("export-list").addEventListener("click", function () {
    FileDealer.download(Pattern.store);
  });

  document.getElementById("one-hopfield-pass").addEventListener("click", function () {
    if (Hopfield.neurons === null) {
      Hopfield.neurons = UI.toPattern(UI.select_image);
    }
    var recovered_pattern = Hopfield.fullAsyncPass();
    UI.applyPattern(recovered_pattern, UI.output_image);
  });

  document.getElementById("run-hopfield").addEventListener("click", function () {
    Hopfield.reload(Pattern.store);
    var pattern = UI.toPattern(UI.select_image);
    var recovered_pattern = Hopfield.run(pattern);
    UI.applyPattern(recovered_pattern, UI.output_image);
  });

  document.getElementById("clear-output").addEventListener("click", function() {
    Hopfield.resetNeurons();
    UI.clearPattern(UI.output_image);
  });

  document.getElementById("disturb-pattern").addEventListener("click", function() {
    var select_pattern = UI.toPattern(UI.select_image);
    var intensity_input = document.getElementById("disturb-intensity");
    var intensity = parseFloat(intensity_input.value);

    if (isNaN(intensity) || intensity < 0 || intensity >= 1) {
      intensity = 0.1;
      intensity_input.value = intensity;
    }

    var disturbed_pattern = Pattern.disturb(select_pattern, intensity);
    UI.applyPattern(disturbed_pattern, UI.select_image);
  });
}