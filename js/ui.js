const UI = {
  input_image: null,
  output_image: null,
  painting: 1,
  is_mouse_down: 0
};

UI.mouseDown = function () {
  UI.is_mouse_down += 1;
};

UI.mouseUp = function () {
  UI.is_mouse_down = 0;
};

UI.newPixel = function (id) {
  var pixel = document.createElement('div');
  pixel.classList.add('pixel');
  pixel.setAttribute('pattern-id', id);

  return pixel;
};

UI.initImage = function () {
  UI.input_image = document.getElementById('input-image');
  UI.output_image = document.getElementById('output-image');
  for (var i = 0; i < PATTERN_SIZE; i++) {
    var pixel = UI.newPixel(i);
    UI.input_image.appendChild(pixel);
    UI.output_image .appendChild(pixel.cloneNode(true));
  }

  return;
};

UI.onPixelClick = function (event) {
  var pixel = event.target;
  var pattern_id = parseInt(pixel.getAttribute('pattern-id'));

  UI.painting = pixel.classList.toggle('active');

  return;
};

UI.onPixelEnter = function (event) {
  if (!UI.is_mouse_down) {
    return;
  }

  var pixel = event.target;

  if (UI.painting) {
    pixel.classList.add('active');
  } else {
    pixel.classList.remove('active');
  }

  return;
};

UI.resolvePixels = function (image) {
  if (image === undefined) {
    return UI.input_image.children;
  }
  return image.children;
};

UI.applyPattern = function (pattern, image) {
  var pixels = UI.resolvePixels(image);

  for (var i = 0; i < pixels.length; i++) {
    if (pattern[i] === 1) {
      pixels[i].classList.add('active');
    } else {
      pixels[i].classList.remove('active');
    }
  }

  return;
};

UI.clearPattern = function (image) {
  var pixels = UI.resolvePixels(image);
  for (var i = 0; i < pixels.length; i++) {
    pixels[i].classList.remove('active');
  }

  return;
};

UI.invertPattern = function (image) {
  var pixels = UI.resolvePixels(image);
  for (var i = 0; i < pixels.length; i++) {
    pixels[i].classList.toggle('active');
  }

  return;
};

UI.selectPattern = function () {
  var input_pattern = UI.toPattern();
  UI.applyPattern(input_pattern, UI.output_image);

  return;
};

UI.toPattern = function (image) {
  var pattern = [];
  var pixels = UI.resolvePixels(image);
  for (var i = 0; i < pixels.length; i++) {
    if (pixels[i].classList.contains('active')) {
      pattern.push(1);
    } else {
      pattern.push(-1);
    }
  }

  return pattern;
};

UI.addPatternToList = function (code) {
  var pattern = Pattern.get(code);
  var list = document.getElementById("list");

  var list_item = document.createElement('div');
  var title = document.createElement('span');
  var apply_button = document.createElement('button');
  var remove_button = document.createElement('button');

  title.innerHTML = "Padrão #" + code;
  apply_button.innerHTML = "aplicar";
  remove_button.innerHTML = "remover";

  Events.setupApplyPattern(apply_button, pattern);
  Events.setupRemovePattern(remove_button, list_item, list, code);

  list_item.appendChild(title);
  list_item.appendChild(apply_button);
  list_item.appendChild(remove_button);

  list.appendChild(list_item);

  return;
};

UI.addPatternsToList = function (codes) {
  codes.forEach(function (code) {
    UI.addPatternToList(code);
  });

  return;
};

UI.clearList = function () {
  var list = document.getElementById("list");
  while (list.lastChild) {
    list.removeChild(list.lastChild);
  }

  return;
};

UI.reloadList = function () {
  UI.clearList();
  UI.addPatternsToList(Pattern.getCodes());

  return;
};