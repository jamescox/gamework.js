#!/usr/bin/python2

import json
import os
import re
import shutil
import subprocess
import sys

from HTMLParser import HTMLParser


class CompressParser(HTMLParser):
  output     = '<!DOCTYPE html>'
  currenttag = ''
  
  def __init__(self):
    HTMLParser.__init__(self)
    
    self.micro_js   = json.dumps('<script>' + subprocess.check_output([
      'java', '-jar', 'tools/compiler.jar', '--js', 
      'src/js/micro/types.js',
      'src/js/micro/string.js',
      'src/js/micro/collections.js',
      'src/js/micro/math.js',
      'src/js/micro/graphics.js',
      'src/js/micro/app.js'
    ]))[:-1] + '<\/script>"'
    
  
  def handle_starttag(self, tag, attrs):
    self.currenttag = tag
    
    if tag != 'link':
      if attrs:
        self.output += '<%s %s>' % (tag, ' '.join('%s=%r' % attr for attr in attrs))
      else:
        self.output += '<%s>' % tag
    else:
      css = ' '.join(open('src/css/micro.css').read().split()).replace('; } ', '}').replace(', ', ',').replace(' { ', '{').replace(': ', ':').replace('; ', ';')
      self.output += '<style>%s</style>' % css
  
  def handle_endtag(self, tag):
    self.output += '</%s>' % tag
    if tag == 'head':
      self.output += '\n'
        
  def handle_data(self, data):
    if self.currenttag == 'script':
      begin = data.find('// begin includes')
      end   = data.find('// end includes')

      if (begin != -1) and (end != -1):
        data = data[:begin] + ('document.write(%s);' % self.micro_js) + data[end:]
        
      open('.script-tmp.js', 'w').write(data)
      data = subprocess.check_output(['java', '-jar', 'tools/compiler.jar', '--js', '.script-tmp.js'])
      os.remove('.script-tmp.js')
    else:
      data = ' '.join(data.split())
      
    self.output += data
    

def build_micro_js():
  parser = CompressParser()
  parser.feed(open('src/index.html').read())

  if not os.path.exists('build'):
    os.mkdir('build')
  
  if not os.path.exists('build/template'):
    os.mkdir('build/template')
  
  if not os.path.exists('build/examples'):
    os.mkdir('build/examples')
      
  open('build/template/index.html', 'w').write(parser.output)
  shutil.copy('src/main.default.js', 'build/template/main.js')
  
  for example in os.listdir('src/examples'):
    example_src  = 'src/examples/' + example
    example_dest = 'build/examples/' + example
    
    if os.path.isdir(example_src):
      shutil.copytree(example_src, example_dest)
      open(example_dest + '/index.html', 'w').write(parser.output
      )
  
  
def clean():
  try:
    shutil.rmtree('build')
  except OSError:
    pass
  
  
def main(args):
  if len(args) == 0:
    build_micro_js()
  elif args[0] == 'clean':
    clean()
  
  
if __name__ == '__main__':
  main(sys.argv[1:])
  
  
