define('base/fella/platforms/xul/files', [], function() {
  var files = function() {
    var that = {};

    var CC = {},
        CI = {};
    
    try {
      CC = Components.classes;
      CI = Components.interfaces;
    } catch (e) {
      return that;
    }

    var initFile = function (path) {
      var file = CC['@mozilla.org/file/local;1'].createInstance(CI.nsILocalFile);
      file.initWithPath(path);
      return file;
    };

    that.getInfo = function (path, callback) {
      var file = CC['@mozilla.org/file/local;1'].createInstance(CI.nsILocalFile);
      file.initWithPath(path);

      var fileInfo = {
        size: file.fileSize,
        lastModified: file.lastModifiedTime,
        name: file.leafName,
        nativePath: file.nativePath,
        path: file.path
      
      };
      callback(null, fileInfo);
    };
    that.createDirectory = function (path, permission) {
      return that.create(path, 'directory', permission);
    };
    that.create = function (path, type, permission) {
      var nsType = "";
      if (type === "directory") {
        nsType = CI.nsIFile.DIRECTORY_TYPE;
      } else{
        nsType = CI.nsIFile.NORMAL_FILE_TYPE;
      } 
      console.log("creating:"+path);
      var file = initFile(path);
      if (!file.exists() || !file.isDirectory() ) {
        file.create (nsType, permission);
      }
      //TODO: throw error if exists
    };

    that.exists = function (path) {
      var file = initFile(path);
      return file.exists();
    },

    that.isDirectory = function (path) {
      var file = initFile(path);
      return (file.exists()) ? file.isDirectory(): false;
    };

    that.readFile = function (path, callback) {
      var data = "",
        file,
        fstream,
        cstream;

      file = CC['@mozilla.org/file/local;1'].createInstance(CI.nsILocalFile);
      file.initWithPath(path);
      
      fstream = CC['@mozilla.org/network/file-input-stream;1'].createInstance(CI.nsIFileInputStream);
      cstream = CC['@mozilla.org/intl/converter-input-stream;1'].createInstance(CI.nsIConverterInputStream);

      fstream.init(file, -1, 0, 0);
      cstream.init(fstream, "UTF-8", 0, 0);
      console.log("reading file");
      var str = {};
      while(cstream.readString(0xffffffff, str) != 0) {
        data += str.value;
      }
      cstream.close();
      callback(null, data);
    };

    that.readIniFile = function (path, callback) {
      console.log("readIniFile");
      var categories = { global: {} };
      if(!that.exists(path)) {
        return callback("File '"+ path + "' doesn't exist", null);
      }

      that.readFile(path, function (err, content) {
        if(err) {
          return callback(err, null);
        }
        
        if(!content || content.length <= 0) {
          return callback(null, categories);
        }

        function newCategory(name) {
          var cat = {};
          categories[name] = cat;
          return cat;
        }
        
        var lines = content.toString().split(/\r?\n/),
            i = 0,
            len = lines.length,
            matchCategory = new RegExp(/^\[(.*)\]$/),
            matchField = new RegExp(/^(.*)?=(.*)$/),
            matchComment = new RegExp(/^\s*(;.*)?$/),
            matchWhitespaces = new RegExp(/^[ \s]+|[ \s]+$/g),
            match,
            currentCategory = newCategory("root");
        
        for( ; i < len; i++) {
          if(matchComment.test(lines[i])) {
            //skip this
          } else if (match = lines[i].match(matchCategory)) {
            currentCategory = newCategory(match[1].replace(matchWhitespaces, ''));
          } else if (match = lines[i].match(matchField)) {  
            currentCategory[match[1].replace(matchWhitespaces, '')] = match[2].replace(matchWhitespaces, '');
          } else {
            throw new Error("Line '" + lines[i] + "' is invalid.");
          }
        }
        console.log("HEHE");
        callback(null, categories);
      });
    };

    /*
    * TODO: make it more configurable, this implementation is very limited
    */
    that.writeFile = function (path, contents, callback) {
      var file,
        foStream,
        converter;

      file = initFile(path);
      
      console.log("writing into" + path);
      console.log(contents);

      foStream = CC['@mozilla.org/network/file-output-stream;1'].createInstance(CI.nsIFileOutputStream);
      //flags for opening files
      //0x01 Open for reading only
      //0x02 Open for writing only
      //0x04 Open for reading and writing
      //0x08 If the file does not exist, the file is created, if the file exists, this has no effect
      //0x10 File pointer is set to the end of the file
      //0x20 if the file exists, the length is truncated to 0
      //0x40 if set, each write will wait for both the file data and file status to be phyically updated
      //0x80 if the file does not exist, than created, if it exists than no action at all

      foStream.init(file, 0x02 | 0x08 | 0x20, 0777, 0);

      converter = CC['@mozilla.org/intl/converter-output-stream;1'].createInstance(CI.nsIConverterOutputStream);
      converter.init(foStream, 'UTF-8', 0, 0);
      converter.writeString(contents);
      converter.close(); //close the file
      callback(null, true);
    };
    that.writeIniFile = function (path, config, callback) {
      console.log("writing configFile");

      var content = "";
      for( category in config ) {
        if(config.hasOwnProperty(category)) {
          content += "[" + category + "]\n";
          for ( entry in config[category] ) {
            if(config[category].hasOwnProperty(entry)) {
              content += entry + " = " + config[category][entry] + "\n";
            }
          }
          content += "\n";
        }
      }
      
      that.writeFile(path, content, callback);
    };

    that.getUserHome = function () {
      var dirService = CC['@mozilla.org/file/directory_service;1'].getService(CI.nsIProperties);
      var homeDirFile = dirService.get("Home", CI.nsIFile);
      return homeDirFile.path;
    };

    return that;
  };
  return files;
});
