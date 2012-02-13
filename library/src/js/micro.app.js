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
  var stateStack = [''], 
      nextLoadJobId = 1, 
      loadJobs = {}, 
      fps = 60, 
      updateInterval;
  
  
  function loadScript(src, callback) {
    var scriptEl = document.createElement('script');
    
    scriptEl.onload = callback;
    scriptEl.src    = src;
    
    document.head.appendChild(scriptEl);
  }
  
  
  function enter() {
    var state     = stateStack[stateStack.length - 1],
        enterName = 'enter';
    
    if (state) {
      enterName += '_' + state;
    }
    
    if (typeof(window[enterName]) === 'function') {
      window[enterName]();
    }
  }
  
  
  function update() {
    var state     = stateStack[stateStack.length - 1],
        updateName = 'update';
    
    if (state) {
      updateName += '_' + state;
    }
    
    if (typeof(window[updateName]) === 'function') {
      window[updateName]();
    }
  }
  
  
  function leave() {
    var state     = stateStack[stateStack.length - 1],
        leaveName = 'leave';
    
    if (state) {
      leaveName += '_' + state;
    }
    
    if (typeof(window[leaveName]) === 'function') {
      window[leaveName]();
    }
  }
  
  
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
        value: function (description) {
          var loadJobId = nextLoadJobId;
          
          loadJobs[loadJobId] = description;
          
          nextLoadJobId += 1;
          
          // TODO:  Enter loading state.
          
          return loadJobId;
        }
      },
      
      completeloadtaks: {
        value: function (id) {
          delete loadJobs[id];
          
          if (micro.collections.len(loadJobs) === 0) {
            // TODO:  Leave loading state.
          }
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
        });
      };
    };
  };
  
  exports.install(exports);
}(micro.app));
