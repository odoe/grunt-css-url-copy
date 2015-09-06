# grunt-css-url-copy

> Copy url resources in css files to flattened folder structure.

The purpose of this plugin is to use it with other css minifiers that may merge multiple css files that all reference relative paths to image and font resources.
This plugin will copy all resources to a single location that the minified resources can access.

This plugin will copy your css file to a new file and not modify the original.

Inspired by [css-url-embed](https://github.com/mihhail-lapushkin/grunt-css-url-embed).

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-css-url-copy --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-css-url-copy');
```

## The "css_url_copy" task

### Overview
In your project's Gruntfile, add a section named `cssurlcopy` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  cssurlcopy: {
    options: {
      root: 'release',
      dest: 'release/app.css'
    },
    src: [
      'release/app/css/main.css'
    ],
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
