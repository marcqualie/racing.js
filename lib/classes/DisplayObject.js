RacingJS.registerClass('DisplayObject', function (options) {

    console.log('car.init', options);

    self.canvas = document.createElement('canvas');
    self.context = self.canvas.getContext('2d');

    self.stage = {};

})
