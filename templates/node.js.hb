var exec = require('child_process').exec;

exec('{{command}}{{#if task}} {{task}}{{/if}}{{#if args}} {{args}}{{/if}}', {
       cwd: '{{escapeBackslashes gruntfileDirectory}}'
     }, function (err, stdout, stderr) {
  
  console.log(stdout);

  var exitCode = 0;
  if (err) {
    console.log(stderr);
    exitCode = -1;
  }{{#unless preventExit}}

  process.exit(exitCode);{{/unless}}
});