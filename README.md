# grunt-githooks

> A Grunt plugin to help bind Grunt tasks to Git hooks

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
    all: {
      options: {
        // Target-specific options go here
      },
      // Hook definitions go there
    }
  },
})
```

#### Defining a few hooks

Hooks are listed as keys of your target configuration. 
**Any key other than `option`** is considered the name of a hook you want to create. 
The simplest way to define a hook is to provide a **space-separated list of the tasks you want the hook to run as the value**. 

For example:
```js
grunt.initConfig({
  githooks: {
    all: {
      // Will run the jshint and test:unit tasks at every commit
      'pre-commit': 'jshint test:unit',
    }
  }
});
```

The plugin warns you if the name matches one of the [hooks announced in the Git documentation](https://www.kernel.org/pub/software/scm/git/docs/githooks.html).
It will still create the hook, though, in case Git introduces new hooks in the future.

#### Hook specific options

If you need to override a few options for a given hook only, you can *use and Object instead of a String*. 
The `taskNames` property will then correspond to the tasks you want to run. 
Any other key will be merged into the options.

```js
grunt.initConfig({
  githooks: {
    all: {
      options: {
        template: 'path/to/a/template'
      },
      // Will bind the jshint and test:unit tasks 
      // with the template specified above
      'pre-commit': 'jshint test:unit',

      // Will bind the bower:install task
      // with a specific template
      'post-merge': {
        taskNames: 'bower:install',
        template: 'path/to/another/template'
      }
    }
  }
})
```

#### Working with existing hooks

If you happen to have existing hooks in your hook folder, the plugin *appends the code launching Grunt* at the end of your hooks. 
You can also insert marker comments in your hooks to specify exactly where you want them inserted.
Your existing hook would look something like this:

```js
// Some code run before Grunt starts

// GRUNT-GITHOOKS START // GRUNT-GITHOOKS END

// Some code run after Grunt starts
```

The markers get automatically inserted when the plugin appends code, so hooks get updated cleanly the next time you run `grunt githooks`.

#### Customising hook output

By default, the plugin generate NodeJS scripts for the hooks. 
Reasonning behind this is that creating Shell scripts won't work well for people using Windows.
Plus, NodeJS is already installed as Grunt kinda needs it. 
However, you're not tied to it and you can customise the generated script entirely. In case of a Shell script:

```js
grunt.initConfig({
  githooks: {
    all: {
      options: {
        // Customize the hashbang to say 'Shell script'
        hashbang: '#!/bin/sh',
        // Plugin comes in with a sheel script template already. Handy, innit?
        template: './node_modules/grunt-githooks/templates/shell.hb',
        // Customize the markers so comments start with #
        startMarker: '## LET THE FUN BEGIN',
        endMarker: '## PARTY IS OVER'
      }
    }
  }
});
```

In the template, you've got access to the following variables:

 - *task*: String with the name of the tasks to be run
 - *args*: String with the list of arguments to provide to the task
 - *gruntfileDirectory*: Absolute path to the directory containing the Gruntfile
 - *preventExit*: Flag telling if the hook should avoid exiting after the grunt task

#### Extending the plugin

Pretty annoying when you're using a library that's missing the exact extension point you need to tweak its functionalities? 
`grunt-githooks` is based on a lot of small functions and most of them are exposed so you can override them. 
If you need feel, free to tinker with the internals (at your own risk though ;)). Could be something along:

```js
var gruntGithooks = require('grunt-githooks/tasks/githooks');

var originalFunction = gruntGithooks.internals.Hook.prototype.getHookContent;
gruntGithooks.internals.Hook.prototype.getHookContent = function () {
  console.log('Loading content of an existing hook');
  originalFunction.apply(this, arguments);
};
```

### Options

#### hashbang
Type: `String`
Defaults: `'#!/usr/bin/env node'`

The hashbang that will be used at the top of the hook script file. If a hook
already exist, the hashbang will be used to check if its ok to append/insert
code in it (to avoid inserting Node code in a Python hook for example).

#### template
Type: `String`

Path to the Handlebars template used to generate the code that will run Grunt
in the hook. Default template is the `node.js.hb` file located in the `templates` folder of the plugin. 
It also contains a `shell.hb` file with the template for a shell script hook.

#### startMarker
Type: `String`
Default: `'// GRUNT-GITHOOKS START'`

#### endMarker
Type: `String`
Default: `'// GRUNT-GITHOOKS END'`

`startMarker` and `endMarker` are markers the plugin use to know where to insert code if a hook already exist. 
If the existing hook doesn't have these markers, the code will simply be appended.

#### preventExit
Type: `Boolean`
Default `false`

By default, the inserted code will exit the process after Grunt has run, using a -1 exit code if the task(s) failed. 
If you're inserting the code running Grunt in the middle of an existing hook,
you might want to disable this so any code after what was inserted by the plugin runs.

#### dest
Type: `String`
Default value: `'.git/hooks'`

You probably won't use this one much, but in case you need to put the hooks somewhere else than in the `.git/hooks` folder, this is the option to use.


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).


## Release History
 
 - 2013-10-05   v0.2.0   New *args* option to specify arguments to hooked task. Bugfix to allow running grunt when the Gruntfile is not at the root of the project.
 - 2013-09-02   v0.1.0   Initial functionnalities
