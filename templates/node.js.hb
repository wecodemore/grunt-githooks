var exec = require('child_process').exec;

exec('{{escapeBackslashes command}}{{#if task}} {{escapeBackslashes task}}{{/if}}{{#if args}} {{{escapeBackslashes args}}}{{/if}}', {
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
