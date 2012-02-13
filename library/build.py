import codecs
import os
import re
import shutil

import markdown


build_dir    = ['build']
doc_dir      = build_dir + ['doc']
tmpl_dir     = build_dir + ['template']
src_dir      = ['src']
js_src_dir   = src_dir + ['js']
html_src_dir = src_dir + ['html']
css_src_dir  = src_dir + ['css']


def pstr(path):
    return os.path.join(*path)
  

def exists(path):
    return os.path.exists(pstr(path))


def mkdir(path):
    for i in range(1, len(path) + 1):
        parent = path[:i]
        if not exists(parent):
            os.mkdir(pstr(parent))
  

def listdir(path):
    for subpath in os.listdir(pstr(path)):
        yield path + [subpath]
        

def section(md_source, level=3):
    md_source = '\n%s\n' % md_source
    output    = ''
    
    in_section = False
    for frag in re.split(r'(\n\#{2,' + str(level) + r'}\s)', md_source, re.S | re.U | re.M):
        hashes = frag.strip()
        if (hashes == '#' * len(hashes)):
           if in_section:
               output += '\n\n<!-- end section -->\n\n'
               in_section = False
               
           if len(hashes) == level:
               frag = '\n\n<!-- begin section -->\n\n' + frag
               in_section = True
               
        output += frag
    
    if in_section:
        output += '<!-- end section -->\n\n'
    
    return output
    
    
def extract_docs(source):
    docs = ''
    
    for match in re.finditer(r'\/\*\*(.*?)\*\/', source, re.S | re.M | re.U):
        docs += '\n'.join(line.strip()[3:] 
                for line in match.group(1).strip().split('\n')) + '\n\n'
        
    docs = '<!-- begin article -->\n\n' + section(section(docs, 4), 3) + '\n\n<!-- end article -->'
    
    return docs
    

def build_docs():
    template_html = codecs.open(pstr(html_src_dir + ['doc.tmpl.html']), 'r', encoding='utf-8').read()
    all_in_one = u''
    shutil.copy(pstr(css_src_dir + ['doc.css']), pstr(doc_dir + ['css', 'default.css']))
    
    for js_souce_fn in listdir(js_src_dir):
        if os.path.splitext(js_souce_fn[-1])[1] != '.js':
            continue
          
        with codecs.open(pstr(js_souce_fn), 'r', encoding='utf-8') as fi:
            js_source = fi.read()
            md_source = extract_docs(js_source)
            doc_html = (markdown.markdown(md_source, ['codehilite', 'headerid(forceid=False)'])
                .replace('<!-- begin article -->', '<article>')
                .replace('<!-- end article -->',   '</article>')
                .replace('<!-- begin section -->', '<section>')
                .replace('<!-- end section -->',   '</section>'))
        
        all_in_one += doc_html
        
        html_fn = pstr(doc_dir + [js_souce_fn[-1]])[:-3] + '.html'
        with codecs.open(html_fn, 'w', encoding="utf-8") as fo:
            doc_html = template_html.format(pre_title='', post_title='', body=doc_html)
            fo.write(doc_html)
            
    with codecs.open(pstr(doc_dir + ['all.html']), 'w', encoding="utf-8") as fo:
        doc_html = template_html.format(pre_title='', post_title='', body=all_in_one)
        fo.write(doc_html)

    
def main(args):
    mkdir(doc_dir + ['css'])
    mkdir(tmpl_dir)
    
    build_docs()

  
if __name__ == '__main__':
    import sys
    
    sys.exit(main(sys.argv[1:]))