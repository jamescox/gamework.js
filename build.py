#!/usr/bin/env python

import codecs
import json
import os
import re
import shutil
import sys

from subprocess import Popen, PIPE

try:
    from HTMLParser import HTMLParser
except ImportError:
    from html.parser import HTMLParser


def plist(pstr):
    l = []
    while 1:
        pstr, part = os.path.split(pstr)
        if not part:
            break
        
        l.append(part)
    
    l.append(pstr)
    l.reverse()
    
    return l


def findbin(name):
    possible_names = (
        name + '.exe', 
        name + '.cmd', 
        name + '.bat', 
        name + '.sh', 
        name)
    
    paths = os.environ['PATH'].split(os.pathsep)
    
    for path in paths:
        for test_name in possible_names:
            test_name = os.path.join(path, test_name)
            if os.path.exists(test_name):
                return test_name

    return name

    
def pstr(path):          return os.path.join(*path) if path else ''
def isdir(path):         return os.path.isdir(pstr(path))
def exists(path):        return os.path.exists(pstr(path))
def mtime(path):         return os.stat(pstr(path)).st_mtime if exists(path) else -1
def mkdir(path):         os.mkdir(pstr(path))
def copy(src, dest):     shutil.copy(pstr(src), pstr(dest))
def copytree(src, dest): shutil.copytree(pstr(src), pstr(dest))
def rmtree(path):        shutil.rmtree(pstr(path))
def mtimetree(path):
    time = mtime(path)
    
    for name in os.listdir(pstr(path)):
        name = path + [name]
        if isdir(name):
            sub_mtime = mtimetree(name)
        else:
            sub_mtime = mtime(name)
    
        if sub_mtime > time:
            time = sub_mtime
                
    return time
    
    
def txtopen(path, flags='r'): 
    return codecs.open(pstr(path), flags, encoding='UTF-8')


UGLIFYJS         = findbin('uglifyjs')
PROJECT_DIR      = plist(os.path.realpath(os.path.split(sys.argv[0])[0]))
SRC_DIR          = PROJECT_DIR + ['src']
EXAMPLE_SRC      = SRC_DIR + ['examples']
BUILD_DIR        = ['build']
TEMPLATE_DIR     = BUILD_DIR + ['template']
TEMPLATE_APP_DIR = TEMPLATE_DIR + ['game']
EXAMPLE_DIR      = BUILD_DIR + ['examples']
JS_SRC_DIR       = SRC_DIR + ['js']
HTML_SRC         = SRC_DIR + ['index.html']
CSS_SRC          = SRC_DIR + ['css', 'gamework.css']
JS_SOURCES       = [
  ['gamework-begin.js'],
  ['private-utils.js'],
  ['types.js'],
  ['string.js'],
  ['collections.js'],
  ['math.js'],
  ['input.js'],
  ['sound.js'],
  ['graphics', 'colors.js'],
  ['graphics', 'tilemap.js'],
  ['graphics', 'sprite.js'],
  ['graphics', 'layer.js'],
  ['graphics', 'screen.js'],
  ['graphics', 'tileset.js'],
  ['graphics', 'graphics.js'],
  ['game.js'],
  ['gamework-end.js']
]

SOURCES = [JS_SRC_DIR + src for src in JS_SOURCES] + [HTML_SRC] + [CSS_SRC]

SRC_MODIFIED   = max(map(mtime, SOURCES))
BUILD_MODIFIED = mtime(TEMPLATE_DIR + ['index.html'])


def compress_js(src):
    global UGLIFYJS
    
    p = Popen([UGLIFYJS, '--inline-script', '--no-copyright', '--max-line-len', '1024', '--reserved-names', 'Color,Vector'], stdin=PIPE, stdout=PIPE)

    p.stdin.write(bytes(src, 'UTF-8'))
    p.stdin.close()
    
    return str(p.stdout.read(), 'UTF-8').replace('</script>', '<\\/script>')
    

class CompressingHtmlParser(HTMLParser):
    def __init__(self, js_src, css_src):
        HTMLParser.__init__(self)
        
        self.__in_script = False
        self.__js_src    = js_src
        self.__css_src   = css_src
        self.__output    = ['<!DOCTYPE html>\n']

    @property
    def output(self): return ''.join(self.__output)
    
    def handle_starttag(self, tag, attrs):
        attrs = ' '.join('%s="%s"' % attr for attr in attrs)
        
        if tag == 'script':
            self.__in_script = True
            
        if tag == 'link':
            code = '<style>' + self.__css_src + '</style>\n'
        else:
            if attrs:
                code = '<%s %s>' % (tag, attrs)
            else:
                code = '<%s>' % tag
    
        self.__output.append(code)
    
    def handle_endtag(self, tag):
        self.__output.append('</%s>' % tag)
        
        if tag == 'script':
            self.__output.append('\n')
            self.__in_script = False
            
    def handle_data(self, data):
        if self.__in_script:
            includes_begin = data.find('// begin includes')
            includes_end   = data.find('// end includes')
            
            if (includes_begin != -1) and (includes_end != -1):
                code  = json.dumps(['<script>'] + self.__js_src.split('\n') + ['</script>'])
                #quote = code[0]
                #code  = code.replace('\\n', '\\n' + quote + '+\n' + quote)
                code  = r"document.write(%s.join('\n'));" % code
                data  = data[:includes_begin] + code + data[includes_end:]
            
            data = compress_js(data)
            if (includes_begin != -1) and (includes_end != -1):
                data = data.replace('document.write([', 'document.write([\n').replace('].join("\\n")', '\n].join("\\n")')
        else:
            data = ' '.join(data.split())
            
        self.__output.append(data)
        
        
def build_js_sources():
    combined = []
    for src in JS_SOURCES:
        f = txtopen(JS_SRC_DIR + src)
        combined.append(f.read())
        f.close()
    
    return ''.join(combined)
    

def build_html(js_src, css_src):
    parser = CompressingHtmlParser(js_src, css_src)
    
    parser.feed(txtopen(HTML_SRC).read())
    
    return parser.output
    

def compress_css(src):
    out = ' '.join(src.split())
    
    # This is sufficient for the CSS I use.
    out = re.sub(r'\;\s*\}', '}', out)
    out = re.sub(r'\s*\}\s*', '}', out)
    out = re.sub(r'\s*\{\s*', '{', out)
    out = re.sub(r'\s*\,\s*', ',', out)
    out = re.sub(r'\s*\:\s*', ':', out)
    out = re.sub(r'\s*\;\s*', ';', out)
    
    return out
    

def build_examples():
    print('Updating examples')
    rmtree(EXAMPLE_DIR)
    copytree(EXAMPLE_SRC, EXAMPLE_DIR)
    for cat in os.listdir(pstr(EXAMPLE_DIR)):
        cat = EXAMPLE_DIR + [cat]
        for example in os.listdir(pstr(cat)):
            example = cat + [example]
            copy(TEMPLATE_DIR + ['index.html'], example + ['index.html'])


def main(args):
    global BUILD_MODIFIED
    
    if not exists(BUILD_DIR):
        mkdir(BUILD_DIR)
        BUILD_MODIFIED = -1
    if not exists(TEMPLATE_DIR):
        mkdir(TEMPLATE_DIR)
        BUILD_MODIFIED = -1
    if not exists(TEMPLATE_APP_DIR):
        mkdir(TEMPLATE_APP_DIR)
        BUILD_MODIFIED = -1
    if not exists(EXAMPLE_DIR):
        mkdir(EXAMPLE_DIR)
    

    if SRC_MODIFIED > BUILD_MODIFIED:
        js_src  = build_js_sources()
        js_src  = compress_js(js_src)
        css_src = compress_css(txtopen(CSS_SRC).read())
        
        html = build_html(js_src, css_src)
    else:
        html = txtopen(TEMPLATE_DIR + ['index.html']).read()
    
    txtopen(TEMPLATE_DIR + ['index.html'], 'w').write(html)
    
    if mtime(SRC_DIR + ['game', 'main.default.js']) > mtime(TEMPLATE_APP_DIR + ['main.js']):
        copy(SRC_DIR + ['game', 'main.default.js'], TEMPLATE_APP_DIR + ['main.js'])
    
    
    build_examples()
    
    
    return 0
    

if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
    
