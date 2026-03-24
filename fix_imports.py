import os
import re

src_dir = os.path.join(os.getcwd(), 'src')

# Collect all files
all_files = []
for root, dirs, files in os.walk(src_dir):
    for f in files:
        if f.endswith('.ts') or f.endswith('.tsx'):
            all_files.append(os.path.join(root, f))

export_map = {}

export_named_regex = re.compile(r'export\s+(?:const|let|var|function|class|type|interface)\s+([a-zA-Z0-9_]+)')
export_default_regex = re.compile(r'export\s+default\s+(?:function\s+)?([a-zA-Z0-9_]+)?')
export_bracket_regex = re.compile(r'export\s+\{([^}]+)\}')

for file in all_files:
    if file.endswith('index.ts') or file.endswith('index.tsx'):
        continue
    
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for match in export_named_regex.finditer(content):
        export_map[match.group(1)] = {'file': file, 'is_default': False}
        
    for match in export_default_regex.finditer(content):
        name = match.group(1)
        if not name:
            name = os.path.splitext(os.path.basename(file))[0]
        export_map[name] = {'file': file, 'is_default': True}
        
    for match in export_bracket_regex.finditer(content):
        exports = [e.strip() for e in match.group(1).split(',')]
        for exp in exports:
            if not exp: continue
            if ' as ' in exp:
                parts = exp.split(' as ')
                export_map[parts[1].strip()] = {'file': file, 'is_default': False}
            else:
                export_map[exp] = {'file': file, 'is_default': False}

# Add default fallback for files with 'export default' but no name
for file in all_files:
    if file.endswith('index.ts') or file.endswith('index.tsx'):
        continue
    name = os.path.splitext(os.path.basename(file))[0]
    if name not in export_map:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'export default' in content:
            export_map[name] = {'file': file, 'is_default': True}

def get_alias_path(abs_path):
    posix_path = abs_path.replace('\', '/')
    src_idx = posix_path.find('/src/')
    if src_idx == -1: return None
    
    rel_path = posix_path[src_idx + 5:]
    rel_path = re.sub(r'\.tsx?$', '', rel_path)
    
    if rel_path.startswith('features/Attendance/'): return '@attendance/' + rel_path[len('features/Attendance/'):]
    if rel_path.startsWith('features/Auth/'): return '@auth/' + rel_path[len('features/Auth/'):]
    if rel_path.startswith('features/Classes/'): return '@classes/' + rel_path[len('features/Classes/'):]
    if rel_path.startswith('features/RoleSelection/'): return '@role-selection/' + rel_path[len('features/RoleSelection/'):]
    if rel_path.startswith('features/Settings/'): return '@settings/' + rel_path[len('features/Settings/'):]
    if rel_path.startswith('shared/'): return '@shared/' + rel_path[len('shared/'):]
    return '@/' + rel_path

import_regex = re.compile(r'import\s+\{([^}]+)\}\s+from\s+[\'"]([^\'"]+)[\'"]')
default_import_regex = re.compile(r'import\s+([a-zA-Z0-9_]+)\s+from\s+[\'"]([^\'"]+)[\'"]')

changed = 0

for file in all_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    replacements = {}
    
    # 1. Named imports
    for match in import_regex.finditer(content):
        block = match.group(0)
        names_str = match.group(1)
        path_str = match.group(2)
        
        if any(x in path_str for x in ['components', 'hooks', 'styles', 'types', 'utils', 'constants', 'services', 'validation', 'index']):
            names = [n.strip() for n in names_str.split(',') if n.strip()]
            new_imports = []
            all_found = True
            
            for name in names:
                search_name = name
                alias = name
                if ' as ' in name:
                    parts = name.split(' as ')
                    search_name = parts[0].strip()
                    alias = parts[1].strip()
                
                exp = export_map.get(search_name) or export_map.get(alias)
                if exp:
                    alias_path = get_alias_path(exp['file'])
                    if not alias_path:
                        all_found = False; break
                    
                    if exp['is_default']:
                        if search_name != alias:
                            new_imports.append(f'import {alias} from "{alias_path}";')
                        else:
                            new_imports.append(f'import {search_name} from "{alias_path}";')
                    else:
                        if search_name != alias:
                            new_imports.append(f'import {{ {search_name} as {alias} }} from "{alias_path}";')
                        else:
                            new_imports.append(f'import {{ {search_name} }} from "{alias_path}";')
                else:
                    # check if we can fall back to directly importing if it's already a direct import that just didn't get mapped
                    # wait, if it's already not a barrel import we shouldn't touch it
                    if not (path_str.endswith('components') or path_str.endswith('hooks') or path_str.endswith('index')):
                        all_found = False
                        break
                    
                    all_found = False
                    break
            
            if all_found and new_imports:
                replacements[block] = '\n'.join(new_imports)

    # Apply replacements
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    if content != original_content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        changed += 1

print(f"Changed {changed} files.")
