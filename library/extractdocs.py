import codecs
import re

import markdown


sources = ['micro.math.js']


head = '''<!DOCTYPE html>

<html>
  <head>
    <meta charset="UTF-8">
    <title>micro.js - User Manual</title>
    
    <style type="text/css">
      p, h1, h2, h3, h4, h5, h6 {
        margin: 0.5em 0;
      }
      
      .codehilite {
        margin: 0.5em 0;
      }
    
      .codehilite pre {
        margin: 0 0 0 2em;
        
        border:  1px solid grey;
        padding: 0.5em;
        border-radius: 0.5em;
        
        font: 12pt/110% monospace;
      }
    </style>
  </head>
  <body>

'''

foot = '''
  </body>
</html>
'''


def extractdocs(source):
    docs = ''
    
    for match in re.finditer(r'\/\*\*(.*?)\*\/', source, re.S | re.M | re.U):
        docs += '\n'.join(line.strip()[3:] for line in match.group(1).strip().split('\n')) + '\n\n'
    
    docs = docs.replace('-->', '-->\n\n').replace('<!--', '\n\n<!--')
    
    return docs


if __name__ == '__main__':
    docs = ''
    for sourcefn in sources:
        text = codecs.open(sourcefn, mode='r', encoding='utf-8').read()
        docs += extractdocs(text) + '\n\n'
    
    print(docs)
    
    with codecs.open('documentation.html', 'w', encoding='utf-8') as f:
        f.write(head)
        f.write(markdown.markdown(docs, ['codehilite'])
            .replace('<!-- begin section -->',     '<div class="section">')
            .replace('<!-- begin sub-section -->', '<div class="sub-section">')
            .replace('<!-- begin definition -->',  '<div class="definition">')
            .replace('<!-- end definition -->',    '</div>')
            .replace('<!-- end sub-section -->',   '</div>')
            .replace('<!-- end section -->',       '</div>'))
        f.write(foot)
        