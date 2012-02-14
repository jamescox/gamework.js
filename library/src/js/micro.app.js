/*
    TODO:
     *  State stack.
     *  Loading state.
     *  Play / Pause.
     *  Frame rate control.
 */


var micro     = micro || {};
    micro.app = micro.app || {};
    
(function (exports) {
  var mainloop, loopCallbacks = [];
  
  function loadScript(src, callback) {
    var scriptEl = document.createElement('script');
    
    scriptEl.onload = callback;
    scriptEl.src    = src;
    
    document.head.appendChild(scriptEl);
  }
  
  
  function StateManager() {
    this.stateStack = [];
  }
  
  
  function IntervalMainLoop(loopCallback) {
    this.running      = false;
    this.fps          = 30;
    this.interval     = null;
    this.loopCallback = loopCallback;
  }
  
  IntervalMainLoop.prototype.setFps = function (fps) {
    if (this.fps !== fps) {
      this.fps = fps;
      
      if (this.running) {
        this.stop();
        this.start();
      }
    }
  };
  
  IntervalMainLoop.prototype.getFps = function () {
    return this.fps;
  };
  
  IntervalMainLoop.prototype.start = function () {
    if (!this.running) {
      if (this.interval) {
        window.clearInterval(this.interval);
      }
      
      this.interval = window.setInterval(this.loopCallback, 1000 / this.fps);
      this.running  = true;
    }
  };
  
  IntervalMainLoop.prototype.stop = function () {
    if (this.running) {
      if (this.interval) {
        window.clearInterval(this.interval);
        this.interval = null;
      }
      
      this.running = false;
    }
  };
  
  
  exports.install = function (ns) {
    Object.defineProperties(ns, {
      pushstate: {
        value: function (newstate) {
        }
      },
      
      popstate: {
        value: function () {
        }
      },
      
      changestate: {
        value: function (newstate) {
        }
      }
    });
    
    Object.defineProperties(ns, {
      startloadtask: {
        value: function () {
          
        }
      },
      
      completeloadtaks: {
        value: function () {
          
        }
      }
    });
    
    
    ns.__onloadhandler = function (flatten, mainScript) {
      return function () {
        micro.graphics.__reparent(document.body);
        
        if (flatten) {
          micro.types.install(window);
          micro.collections.install(window);
          micro.math.install(window);
          micro.graphics.install(window);
          micro.app.install(window);
        }
        
        loadScript(mainScript, function () {
          window.clearInterval(window.__titleAnimation__);
          document.title = 'Untitled Application';
          
          mainloop = new IntervalMainLoop(function () {
            loopCallbacks = [micro.graphics.__loopcallback];
            
            micro.collections.foreach(function (item) {
              item();
            }, loopCallbacks);
          });
          mainloop.start();
        });
      };
    };
  };
  
  exports.install(exports);
}(micro.app));
