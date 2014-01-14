var spawn = require('child_process').spawn;

var grunt_process = spawn(
  '{{escapeBackslashes command}}',
  [ {{#if task}}'{{escapeBackslashes task}}'{{/if}}  ].concat({{#if args}}'{{{escapeBackslashes args}}}'.split(' '){{/if}}),
  {
    cwd: '{{escapeBackslashes gruntfileDirectory}}',
    stdio: 'inherit'
  }
);

grunt_process.on('close', function(exitCode) {
  {{#unless preventExit}}process.exit(exitCode);{{/unless}}
});
