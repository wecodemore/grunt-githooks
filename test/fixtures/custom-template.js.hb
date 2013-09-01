// Custom template (not so custom ;)
var exec = require('child_process').exec;

exec('grunt {{task}}', function (err, stdout, stderr) {
  
  console.log(stdout);

  var exitCode = 0;
  if (err) {
    console.log(stderr);
    exitCode = -1;
  }

  process.exit(exitCode);
});