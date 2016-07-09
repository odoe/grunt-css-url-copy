module.exports = function(grunt) {
  var BASE_URL_REGEX = 'url\\(["\']?([^"\'\\(\\)]+?)["\']?\\)[};,!\\s]';'"]"])"]'
  var path = require('path');

  function processNextUrl(fileContent, currentUrlIndex, urlArray, baseDir, resourceDir, rootDir, isVerbose, finishCallback) {
    if (++currentUrlIndex === urlArray.length) {
      finishCallback();
    } else {
      processUrl(fileContent, currentUrlIndex, urlArray, baseDir, resourceDir, rootDir, isVerbose, finishCallback);
    }
  }

  function processUrl(fileContent, currentUrlIndex, urlArray, baseDir, resourceDir, rootDir, isVerbose, finishCallback) {
    var url = urlArray[currentUrlIndex];
    var nextUrl = processNextUrl.bind(null, fileContent, currentUrlIndex, urlArray, baseDir, resourceDir, rootDir, isVerbose, finishCallback);
    try {
      if (isVerbose) {
        grunt.log.writeln('\n[ #' + (currentUrlIndex + 1) + '  ]');
      }
      var urlFullPath = path.resolve(baseDir + '/' + url.split('?').shift());
      if (isVerbose) {
      }
      if (!grunt.file.exists(urlFullPath)) {
        var missingUrlMessage = '"' + (isVerbose ? urlFullPath : url.split('?').shift()) + '" not found on disk';
        grunt.log.warn(missingUrlMessage);
        return nextUrl();
      }
      var resourceName = url.replace(/\.\.\//g, '');
      var queries = '';
      if (resourceName.indexOf('?') > -1) {
        var tmp = resourceName.split('?');
        resourceName = tmp.shift();
        var q = tmp.pop();
        queries = '?' + q;
      }
      var escapedUrl = url.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
      var copyUrlRegex = '\\([\'"]?' + escapedUrl + '[\'"]?\\)';'"]"]'
      fileContent.content = fileContent.content.replace(new RegExp(copyUrlRegex, 'g'), '("resources/' + resourceName + queries + '")');
      grunt.file.copy(rootDir + resourceName, resourceDir + '/' + resourceName);
      return nextUrl();
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn('Failed to write "' + url + '"\n');
    }
  }

  function processFile(fileSrc, fileDest, root, callback) {
    if (Array.isArray(fileSrc)) {
      fileSrc = fileSrc[0];
    }
    try {
      grunt.log.subhead('Processing source file "' + fileSrc + '"');
      var fileContent = grunt.file.read(fileSrc);
      var isVerbose = grunt.option('verbose');
      var baseDir = path.resolve(path.dirname(fileSrc));
      var rootDir = process.cwd() + '/' + root;
      var resourceDir = rootDir + 'resources';
      var urlRegex = new RegExp(BASE_URL_REGEX, 'g');
      var allUrls = [];
      var urlMatch;
      grunt.file.mkdir(resourceDir);
      while ((urlMatch = urlRegex.exec(fileContent))) {
        allUrls.push(urlMatch[1]);
      }
      var validUrls = allUrls.filter(function(url) { return (url.indexOf('data:') < 0) && (url.indexOf('//') < 0); });
      if (validUrls.length === 0) {
        grunt.log.writeln('Nothing to copy here!');
        grunt.log.writeln('File "' + fileDest + '" not created');
        return callback();
      }
      if (isVerbose) {
        grunt.log.writeln('Using "' + resourceDir + '" as base directory for URLs');
      }
      var uniqueResourceUrls = grunt.util._.uniq(validUrls);
      grunt.log.writeln(uniqueResourceUrls.length + ' resource URL' + (uniqueResourceUrls.length > 1 ? 's' : '') + ' found');
      var fileContentRef = { content: fileContent  };
      processUrl(fileContentRef, 0, uniqueResourceUrls, baseDir, resourceDir, rootDir, isVerbose, function() {
        grunt.file.write(fileDest, fileContentRef.content);
        grunt.log.writeln('Done: File "' + fileDest + '" created');
        callback();
      });
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn('URL resource copy failed\n');
    }
  }

  grunt.registerMultiTask('cssurlcopy', 'Copy URL resources to flattened folder structure.', function() {
    var async = this.async();
    grunt.log.writeln('File json "' + JSON.stringify(this.files) + '"');
    var existingFiles = this.files.filter(function(file) {
      if (!grunt.file.exists(file.src[0])) {
        return false;
      }
      return true;
    });

    var leftToProcess = existingFiles.length;
    if (leftToProcess === 0) {
      async();
    }
    var options = this.options({});
    existingFiles.forEach(function(file) {
      processFile(file.src, options.dest, options.root + '/', function() {
        if (--leftToProcess === 0) {
          async();
        }
      });
    });

  });
};
