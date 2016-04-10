# Changelog

 - 2016-04-10   v0.6.0   Fixes `peerDependencies` in preparation of Grunt 1.0.0, props @arithmetric
 - 2016-01-06   v0.5.0   Adds `{{ hook }}` template variable (props @markcarver), package again available on _NPM_, updates for contributing docs
 - 2015-02-08   v0.4.0   Pipe stdout for live updates
 - 2014-07-30   v0.3.2   Moved from @rhumaric to @wecodemore, updated default Nodejs template, updated badges
 - 2013-12-17   v0.3.1   [Escaping fix in the hooks templates](https://github.com/wecodemore/grunt-githooks/pull/15) by @gyoshev.
 - 2013-11-13   v0.3.0   New *command* option to specify which command to run, in case full path to Grunt is needed. NodeJS template now uses new `escapeBackslashes` helper to make sure backslashes ('\') are properly escaped when written in the hook
 - 2013-10-05   v0.2.0   New *args* option to specify arguments to hooked task. Bugfix to allow running grunt when the Gruntfile is not at the root of the project.
 - 2013-09-02   v0.1.0   Initial functionalities