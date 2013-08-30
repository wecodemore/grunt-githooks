# grunt-githooks

> A Grunt plugin to bind Grunt tasks to Git hooks

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-githooks --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-githooks');
```

## The "githooks" task

### Overview
In your project's Gruntfile, add a section named `githooks` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  githooks: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### <hook_name>
Type: `String`

The task that should be run by given git-hook. See the [githooks documentation](https://www.kernel.org/pub/software/scm/git/docs/githooks.html) for the list of available hooks.

If you want to run multiple tasks, separate the task names by a space. You can also create a custom
task in your Grunfile using `grunt.registerTask`

#### dest
Type: `String`
Default value: `'.git/hooks'`

The directory in which the generated hooks should go. You'll probably never have to use it, but it's
a useful option for testing

### Usage Examples

#### Simple hook

```js
grunt.initConfig({
  githooks: {
    all: {

      // Will run jshint every time we commit
      'pre-commit': 'jshint'
    }
  }
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Upcoming features

[ ] Append code if hook already exists (NodeJS only)
[ ] Insert code at a specific place in an existing hook (using some kind of marker comment) (NodeJS only)
[ ] Add support for hooks written in misc languages, esp. shell
[ ] Allow user to specify the hook template
[ ] Provide option to exit or not when hook runs (esp. if run in the middle of an existing hook)
[ ] Provide option to export the hook result in a variable
[ ] Display a warning if hook name doesn't match the name of a git hook
[ ] Display a warning if one of the task does not exist

## Release History
_(Nothing yet)_
