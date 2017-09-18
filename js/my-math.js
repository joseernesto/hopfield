const Vec = {};
const Matrix = {};

Vec.new = function (size, value) {
  new_vec = [];
  for (var i = 0; i < size; i++) {
    new_vec.push(value);
  }

  return new_vec;
}

Vec.equals = function (vec_a, vec_b) {
  if (vec_a.length !== vec_b.length) {
    console.log("Vec.equals(a, b): incompatible dimensions.");
    console.log("a:", vec_a);
    console.log("b:", vec_b);
  }

  for (var i = 0; i < vec_a.length; i++) {
    if (vec_a[i] !== vec_b[i]) {
      return false;
    }
  }
  
  return true;
}

Vec.dot = function (vec_a, vec_b) {
  if (vec_a.length !== vec_b.length) {
    console.log("Vec.dot(a, b): incompatible dimensions.");
    console.log("a:", vec_a);
    console.log("b:", vec_b);
  }

  var result = 0;
  for (var i = 0; i < vec_a.length; i++) {
    result += vec_a[i] * vec_b[i];
  }
  
  return result;
}

Vec.random = function (size) {
  var random_vec = [];
  for (var i = 0; i < size; i++) {
    random_vec.push(i);
  }

  for (var i = size; i >= 2; i--) {
    var random_index = Math.floor(Math.random() * i);
    var aux = random_vec[i - 1];
    random_vec[i - 1] = random_vec[random_index];
    random_vec[random_index] = aux;
  }

  return random_vec;
}

Matrix.mult = function (matrix, vec) {
  if (matrix.length !== vec.length) {
    console.log("Matrix.mult(matrix, vec): incompatible dimensions.");
    console.log("matrix:", matrix);
    console.log("vec:", vec);
  }

  var result = [];

  for (var i = 0; i < matrix.length; i++) {
    result.push(Vec.dot(matrix[i], vec));
  }
  
  return result;
}

String.prototype.hashCode = function () {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};