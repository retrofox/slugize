var slugize = require('../');

describe('slugize(string)', function(){
  it('should return a string equal to \'josip-radosevic\'', function(){
    slugize('Josip Radošević').should.be.equal('josip-radosevic');
  });

  it('should return a string equal to \'le-lys-sucree\'', function(){
    slugize('lë lys sucrée').should.be.equal('le-lys-sucree');
  });
});
