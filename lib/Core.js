var RacingJS = (function () {

    var self = this;
    self._options = {};
    self._classes = {};


    // Setup
    self.setup = function (options) {
        self._options = options;

        self.stage = self.newClass('Stage');

        return self;
    }


    // Register internal class
    self.registerClass = function (className, classDefinition) {

        // Create object for storing class data
        var classMetaData = {
            'def': classDefinition
        };

        // Extend class
        if (className.indexOf(' < ') > -1) {
            var classNames = className.split(' < ');
            classMetaData._extends = classNames[1];
            className = classNames[0];
        }

        self._classes[className] = classMetaData;

    };

    // New object instance
    self.newClass = function (className, classArguments) {

        if (! self._classes[className]) {
            throw '"' + className + '" is not a registered class.';
        }

        var classMetaData = self._classes[className];
        if (classMetaData['_extends']) {
            console.log('extending ' + className + ' with interface from ' + classMetaData._extends);
        }

        var classObject = new classMetaData.def(classArguments);
        return classObject;

    };


    // Load game
    self.load = function (loadFunc) {
        loadFunc(self);
    };


    // Main game loop
    self.loop = function (loopFunc) {
        setInterval(loopFunc, 1000);
    };


    // Return function instance
    return self;

})();
