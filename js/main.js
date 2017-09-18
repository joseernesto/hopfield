window.onload = function () {
  UI.initImage();
  Events.setUpEvents();
  if (localStorage.hopfield) {
    Main.reloadPatterns(JSON.parse(localStorage.hopfield));
  }
}

const Main = {
  reloadPatterns: function (copy) {
    Pattern.reload(copy);
    UI.reloadList();
  }
}

function Test() {
  Pattern.test.all();
}
