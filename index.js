var fs = require('fs'),
    request = require('request');
    jsdom = require('jsdom');

var html = fs.readFileSync('./index.html', { encoding: 'utf8'});
// console.log(html);

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

// download('https://emoji.slack-edge.com/T02H9LDKY/360_worship/666f2d158c24ae1d.gif', '360_worship', function(){
//   console.log('done');
// });

jsdom.env(html, ["http://code.jquery.com/jquery.js"], function(err, window) {
  var elements = window.document.querySelectorAll('.emoji_row span');
  Array.prototype.forEach.call(elements, function(el, i){
    var url = el.getAttribute('data-original');
    if(url) {
      var tmp = url.split('.');
      var fileType = tmp[tmp.length - 1];
      var tmp = url.split('/');
      var fileName = tmp[tmp.length - 2];
      download(url, fileName + '.' + fileType, function() {
        console.log('done');
      })
    }
  });
});
