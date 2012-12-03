/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(p, parent, orig){
  var path = require.resolve(p)
    , mod = require.modules[path];

  // lookup failed
  if (null == path) {
    orig = orig || p;
    parent = parent || 'root';
    throw new Error('failed to require "' + orig + '" from "' + parent + '"');
  }

  // perform real require()
  // by invoking the module's
  // registered function
  if (!mod.exports) {
    mod.exports = {};
    mod.client = mod.component = true;
    mod.call(this, mod, mod.exports, require.relative(path));
  }

  return mod.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path){
  var orig = path
    , reg = path + '.js'
    , regJSON = path + '.json'
    , index = path + '/index.js'
    , indexJSON = path + '/index.json';

  return require.modules[reg] && reg
    || require.modules[regJSON] && regJSON
    || require.modules[index] && index
    || require.modules[indexJSON] && indexJSON
    || require.modules[orig] && orig
    || require.aliases[index];
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `fn`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api private
 */

require.register = function(path, fn){
  require.modules[path] = fn;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to){
  var fn = require.modules[from];
  if (!fn) throw new Error('failed to alias "' + from + '", it does not exist');
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj){
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function fn(path){
    var orig = path;
    path = fn.resolve(path);
    return require(path, parent, orig);
  }

  /**
   * Resolve relative to the parent.
   */

  fn.resolve = function(path){
    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    if ('.' != path.charAt(0)) {
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    }
    return require.normalize(p, path);
  };

  /**
   * Check if module is defined at `path`.
   */

  fn.exists = function(path){
    return !! require.modules[fn.resolve(path)];
  };

  return fn;
};require.register("retrofox-standarize/index.js", function(module, exports, require){
/**
 * Replaces special characters with their ascii standard equivalents
 *
 * @param {String} str
 * @api public
 */

var special = ['À','à','Á','á','Â','â','Ã','ã','Ä','ä','Å','å','Ă','ă','Ą','ą','Ć'
             , 'ć','Č','č','Ç','ç','Ď','ď','Đ','đ', 'È','è','É','é','Ê','ê','Ë','ë'
             , 'Ě','ě','Ę','ę','Ğ','ğ','Ì','ì','Í','í','Î','î','Ï','ï', 'Ĺ','ĺ','Ľ'
             , 'ľ','Ł','ł','Ñ','ñ','Ň','ň','Ń','ń','Ò','ò','Ó','ó','Ô','ô','Õ','õ'
             , 'Ö','ö','Ø','ø','ő','Ř','ř','Ŕ','ŕ','Š','š','Ş','ş','Ś','ś','Ť','ť'
             , 'Ť','ť','Ţ','ţ','Ù','ù','Ú','ú','Û','û','Ü','ü','Ů','ů','Ÿ','ÿ','ý'
             , 'Ý','Ž','ž','Ź','ź','Ż','ż','Þ','þ','Ð','ð','ß','Œ','œ','Æ','æ','µ']

  , standard = ['A','a','A','a','A','a','A','a','Ae','ae','A','a','A','a','A','a'
              , 'C','c','C','c','C','c','D','d','D','d', 'E','e','E','e','E','e'
              , 'E','e','E','e','E','e','G','g','I','i','I','i','I','i','I','i','L'
              , 'l','L','l','L','l','N','n','N','n','N','n', 'O','o','O','o','O'
              , 'o','O','o','Oe','oe','O','o','o','R','r','R','r','S','s','S','s'
              , 'S','s','T','t','T','t','T','t','U','u','U','u','U','u','Ue','ue'
              , 'U','u','Y','y','Y','y','Z','z','Z','z','Z','z','TH','th','DH','dh'
              , 'ss','OE','oe','AE','ae','u'];

module.exports = function standarize(str){
  var text = str;
  for (var i = 0, l = special.length; i < l; i++){
    if (typeof special[i] == 'string') special[i] = new RegExp(special[i], 'g');
    text = text.replace(special[i], standard[i]);
  }
  return text;
};

});
require.register("retrofox-namize/index.js", function(module, exports, require){

/**
 * Makes a string uppercase according to english name conventions
 *
 * @param {String} str
 * @api public
 */

module.exports = function namize(str){
  return str.toLowerCase().replace(/\b[a-z]|(\-[a-z])/g, function(match){
    return match.toUpperCase();
  }).replace(/(\bMc[a-z])|(\-Mc[a-z])/g, function(match){
    return match.substr(0, match.length - 1) + match.substr(-1).toUpperCase();
  });
}

});
require.register("slugize/index.js", function(module, exports, require){
/**
 * Module dependencies
 * */

try {
  var standarize = require('standarize')
    , namize = require('namize');
} catch(e){
  var standarize = require('standarize-component')
    , namize = require('namize-component');
}

/**
 * Slugize a string
 *
 * @param {String} str
 * @api public
 */

module.exports = function(str){
  return standarize(namize(str)).toLowerCase()
       .replace(/ +/g, '-')
       .replace(/[^-\w]/g, '');
};

});
require.alias("retrofox-standarize/index.js", "slugize/deps/standarize/index.js");

require.alias("retrofox-namize/index.js", "slugize/deps/namize/index.js");
