// Custom template (not so custom ;)
var exec = require('child_process').exec;

exec('grunt {{task}}', function (err, stdout, stderr) {

  var exitCode = 0;
  if (err) {
    console.log(stderr || err);
    exitCode = -1;
  }

  process.exit(exitCode);
}).stdout.on('data', function (chunk){
    process.stdout.write(chunk);
});