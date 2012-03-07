(function (exports, helpData) {
  'use strict';

  var USING_HELP = ('<span class="help">' + 
      'type: <code><a href="#" onclick="document.getElementById(\'gamework-prompt-getline\').value=&quot;help();&quot;; document.getElementById(\'gamework-prompt-getline\').focus()">help();</a></code> for a list of all built-in ' + 
            'functions and properties.<br>' +
      'or type: <code><a href="#" onclick="document.getElementById(\'gamework-prompt-getline\').value=&quot;help(\'&quot;; document.getElementById(\'gamework-prompt-getline\').focus()">help(<em class="arg">name</em>);</a></code> for ' + 
               'specific help regarding the <em>named</em> function ' +
               'or property.' +
    '</span>');

  function helpOverview() {
    var helpText = '';
    
    gamework.collections.foreach(function (module) {
      var documentedDefs = [], undocumented = '';
      
      helpText += '<h2>' + module.title + ' <span class="gw-def-count">' + (gamework.collections.len(gamework[module.name]) - 1) + ' functions and properties</span></h2>';
      
      gamework.collections.foreach(function (section) {
        helpText += '<h3>' + section.title + '</h3>';
      
        gamework.collections.foreach(function (def) {
          var js      = "help('" + def.name + "');",
              title   = 'type: ' + js + ' for more information',
              getline = "document.getElementById('gamework-prompt-getline')",
              onclick = getline + '.value = &quot;' + js + '&quot;; ' + getline + '.focus();';
          
          documentedDefs.push(def.name);
          
          helpText += '<code class="gw-def"><a href="#" title="' + title + '" onclick="' + onclick + '">' + def.name + '</a></code> ';
        }, section.definitions);
      }, module.sections);
      
      gamework.collections.foreach(function (def) {
        if (!gamework.collections.contains(documentedDefs, def) && (def !== 'install')) {
          undocumented += '<code class="gw-def gw-nohelp">' + def + '</code> ';
        }
      }, gamework.collections.keys(gamework[module.name]));
      
      if (undocumented) {
        helpText += '<h3>Undocumented</h3>' + undocumented;
      }
      
    }, helpData);
    
    return helpText;
  }
  
  function helpOn(name) {
    var helpText = '';
    
    gamework.collections.foreach(function (module) {
      gamework.collections.foreach(function (section) {
        gamework.collections.foreach(function (def) {
          var i, arg;
          
          if (def.name === name.toLowerCase().trim()) {
            helpText += '<h2><code class="gw-def">' + def.name + '</code></h2>';
            helpText += '<div class="gw-description">' + def.description + '</div>';
            
            if (def.type === 'property') {
              helpText += '<h3 style="display: inline">types:</h3><span class="gw-types"> ' + def.property_types.join(' | ') + '</span>';
            } else if (def.type === 'function') {
              helpText += '<h3>call signatures:</h3><ul class="gw-sigs">';
              for (i = 0; i < def.call_signatures.length; i += 1) {
                helpText += '<li><code>' + def.call_signatures[i] + '</code></li>';
              }
              helpText += '</ul>';
              
              if (def.args) {
                helpText += '<h3>arguments:</h3><table class="gw-args"><tbody>';
                for (i = 0; i < def.args.length; i += 1) {
                  arg = def.args[i];
                  helpText += '<tr>'
                  helpText += '<th><code class="gw-arg">' + arg.name + '</code><span class="gw-types"> (' + arg.types.join(' | ') + ')</span></th>';
                  helpText += '<td>' + arg.description + '</td>';
                  helpText += '</td>';
                }
                helpText += '</tbody></table>';
              }
              
              if (def.returns) {
                helpText += '<h3>returns: <span class="gw-types"> (' + def.returns.types.join(' | ') + ')</span></h3>';
                helpText += '<p class="gw-returns">' + def.returns.description + '</p>';
              }
            }
          }
        }, section.definitions);
      }, module.sections); 
    }, helpData);
    
    if (!helpText) {
      helpText = '<span class="error">No help found for ' + name + '</span>'
    }
    
    return helpText;
  }
    
  exports.install = function (ns) {
    ns.help = function (name) {
      var helpText = '<span class="gw-help">';
      
      if (typeof(name) === 'undefined') {
        helpText += helpOverview();
      } else {
        helpText += helpOn(name);
      }
      
      helpText += '</span>'
      
      return { text: helpText, __isHelpText__: true };
    };
    
    Object.defineProperties(ns.help, {
      __isHelpFunction__: { value: true },
      USING_HELP:         { value: USING_HELP }
    });
  };
  
  exports.install(exports);
}(gamework.help, gamework.help.data));
