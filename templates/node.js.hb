var exec = require('child_process').exec,
    fs = require('fs');

fs.open('{{escapeBackslashes gruntfilePath}}', 'r', function(err, data) {
  var exitCode = 0;
  if ( err ) {
    // Gruntfile.js does not exist exit cleanly.
    process.exit(exitCode);
  }

  exec('{{escapeBackslashes command}} {{escapeBackslashes task}}{{#if hook}}::{{{escapeBackslashes hook}}}{{/if}}{{#if args}} {{{escapeBackslashes args}}}{{/if}}', {
    cwd: '{{escapeBackslashes gruntfileDirectory}}'
  }, function (err, stdout, stderr) {

    console.log(stdout);

    if (err) {
      console.log(stderr || err);
      exitCode = -1;
    }{{#unless preventExit}}

    process.exit(exitCode);{{/unless}}
  });
});

