function Timer(callback, delay) {
    var lastUpdate = null;
    var isRunning = false;

    var requestAnimFrame = (function(){
        return function(callback){
                return setTimeout(callback, 1000 / 60);
            };
    })();

    var loop = function(){
        requestAnimFrame(function(){
            var now = Date.now();
            if(!isRunning){
                lastUpdate = now;
                loop();
            }else{
                var elapsed = now - lastUpdate;
                if(lastUpdate === null || elapsed > delay){
                    callback();
                    lastUpdate = now - (elapsed % delay);
                }
                loop();
            }
        });
    };

    this.start = function() {
        if(isRunning){
            return;
        }
        lastUpdate = Date.now();
        isRunning = true;
    }

    this.stop = function() {
        isRunning = false;
    }

    this.reset = function(newDelay) {
        lastUpdate = Date.now();
        this.start();
    }

    this.resetForward = function(newDelay){
        callback();
        delay = newDelay;
        lastUpdate = Date.now();
        this.start();
    }

    loop();
}

module.exports = Timer;
