const FileDealer = {
  file_url: null
}

FileDealer.createFileURL = function (content) {
  if (FileDealer.file_url !== null) {
    window.URL.revokeObjectURL(FileDealer.file_url);
  }

  var data = new Blob([JSON.stringify(content)], { type: 'text/plain' });
  FileDealer.file_url = window.URL.createObjectURL(data);
}

FileDealer.download = function (content) {
  FileDealer.createFileURL(content);

  var link = document.createElement('a');
  link.setAttribute('download', EXPORT_FILENAME + '.json');
  link.href = FileDealer.file_url;
  document.body.appendChild(link);

  window.requestAnimationFrame(function () {
    var event = new MouseEvent('click');
    link.dispatchEvent(event);
    document.body.removeChild(link);
  });
}

FileDealer.upload = function (file, done) {
  var reader = new FileReader();

  reader.onload = function (event) {
    var local_copy = JSON.parse(event.target.result);
    done(local_copy);
  }

  reader.readAsText(file);

  return null;
}