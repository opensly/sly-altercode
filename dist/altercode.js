#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);

// Import dependencies

class Crawler {
  config;
  requiredFiles = [];
  
  constructor(config) {
    this.config = config;
    this.getFilesOfDir(this.config.sourceDir);
  }

  getFilesOfDir(dir) {
    const files = fs__namespace.readdirSync(dir).map(f => path.join(dir, f));
    files.forEach(f => {
      if (fs__namespace.statSync(f).isDirectory()) {
        this.getFilesOfDir(f);
      } else if (this.isFileAllowed(f)) {
        this.requiredFiles.push(f);
      }
    });
  }

  isFileAllowed(file) {
    const excludeExtns = this.config.excludeExtns || [];
    if (!fs__namespace.existsSync(file) || fs__namespace.statSync(file).size === 0) {
      return false;
    }
    for (const ext of excludeExtns) {
      if (file.includes(ext)) {
        return false;
      }
    }
    return true;
  }

}

const configPath  = process.argv[3];
let appConfig;

fs__namespace.readFile(configPath, 'utf8', function (err, data) {
  if (err) throw err;

  appConfig = JSON.parse(data);
  let list  = new Crawler(appConfig);
  console.log('Impact files - ', list.requiredFiles.length);
  console.log(list.requiredFiles);

});
