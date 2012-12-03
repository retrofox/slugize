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
