var gamework = {};
    gamework.interactive = {};

(function (exports) {
  // http://davidchambersdesign.com/escaping-html-in-javascript/
  function makeSafe(text) {
    return text.replace(/[&<>"'` ]/g, function (chr) {
      var code = chr.charCodeAt(0);
      
      return (code !== 32) ? '&#' + code + ';' : '&nbsp;';
    });
  };
  
  
  function Console(screen, sep, console) {
    var iframe, self = this;
    
    this.outputLines = 0;
    this.screen      = document.getElementById(screen);
    this.sep         = document.getElementById(sep);
    this.console     = document.getElementById(console);
    this.getLine     = this.console.getElementsByTagName('input')[0];
    this.output      = this.console.getElementsByTagName('ul')[0];
    this.goButton    = this.console.getElementsByTagName('button')[0];
    this.context     = this.screen.getElementsByTagName('iframe')[0].contentWindow;
    
    this.goButton.onclick = function () {
      self.go();
    };
    
    this.getLine.onkeyup = function (e) {
      if (typeof(e) === 'undefined') {
        e = window.event;
      }
      
      if (e.keyCode === 13) {
        self.go();
      }
    };
  }
  
  
  Console.prototype.codeExample = function (code) {
    var eventHandler, jsLiteral = JSON.stringify(code);
    
    eventHandler = "(function () { " + 
      "var getline = document.getElementById('" + this.getLine.id + "'); " + 
      "getline.value = " + makeSafe(jsLiteral) + "; " + 
      "getline.focus(); " + 
    "}())";
    
    code = makeSafe(code);
    
    return '<code><a href="#" onclick="' + eventHandler + '">' + code + '</a></code>';
  };
  
   
  Console.prototype.repr = function (value) {
    var repr = '';
    
    if (value === null) {
      repr = '<div class="gw-null"><code class="gw-value">null</code></div>';
    } else {
      switch (typeof(value)) {
      case 'number':
        repr = '<div class="gw-number"><code class="gw-value">' + value + 
               '</code></div>';
        break;
      
      case 'string':
        repr = '<div class="gw-string"><code class="gw-value">' + 
                 makeSafe(JSON.stringify(value)) + 
               '</code></div>';
        break;
      
      default:
        if (typeof(value.__repr__) !== 'undefined') {
          repr = value.__repr__;
        } else {
          repr = '<div class="gw-value"><code class="gw-value">' + 
                   makeSafe(value + '') + 
                 '</code></div>';
        }
        break;
      }
    }
    
    return repr;
  };
  
  
  Console.prototype.go = function () {
    var result, error, output, code = this.getLine.value.trim();
    
    if (code !== '') {
      this.outputLines += 1;
      
      output = '<li class="gw-line gw-' + 
               ((this.outputLines % 2 === 0) ? 'even' : 'odd') + 
               '">' +
               this.codeExample(code);
      
      try {
        with (this.context) {
          result = eval(code);
        }
      } catch (e) { 
        error = e; 
      }
      
      this.getLine.value = '';
      
      if (!error) {
        if (typeof(result) !== 'undefined') {
          output += '<hr>' + this.repr(result);
        }
      } else {
        output += '<hr><div class="gw-error">' + makeSafe(error.toString()) + '</div>';
      }
      
      this.output.innerHTML = output + '</li>' + this.output.innerHTML;
    }
  };
  
  exports.Console = Console;
}(gamework.interactive));
