module.exports = function(target,ratio) {
  var distFileName = target;

  return {
    cssFormat: 'scss',
    cssVarMap: function(sprite) {
      var name = target.replace('@', '');
      sprite.name = sprite.name;
    },
    imgPath: '../images/'+distFileName+'.png',
    cssTemplate: 'client/sass/_sprite/sprite'+ratio+'.scss.mustache',
    src: 'client/images/'+target+'/*.png',
    dest: 'client/dist/'+target+'/images/'+distFileName+'.png',
    destCss: 'client/sass/'+target+'/import/common/sprite.scss'
  };
}
