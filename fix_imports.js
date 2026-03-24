const fs = require('fs');
const path = require('path');
const srcDir = path.join(__dirname, 'src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file.startsWith('.')) continue;
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allFiles = getAllFiles(srcDir);
const exportMap = {};

const exportNamedRegex = /export\s+(?:const|let|var|function|class|type|interface)\s+([a-zA-Z0-9_]+)/g;
const exportDefaultRegex = /export\s+default\s+(?:function\s+)?([a-zA-Z0-9_]+)?/g;
const exportBracketRegex = /export\s+\{\s*([a-zA-Z0-9_,\s]+)\s*\}/g;

for (const file of allFiles) {
  if (path.basename(file) === 'index.ts' || path.basename(file) === 'index.tsx') continue;
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = exportNamedRegex.exec(content)) !== null) {
    exportMap[match[1]] = { file, isDefault: false };
  }
  while ((match = exportDefaultRegex.exec(content)) !== null) {
    if (match[1]) exportMap[match[1]] = { file, isDefault: true };
    else exportMap[path.basename(file).replace(/\.tsx?$/, '')] = { file, isDefault: true };
  }
  while ((match = exportBracketRegex.exec(content)) !== null) {
    const exports = match[1].split(',').map(s => s.trim()).filter(Boolean);
    for (const exp of exports) {
      if (exp.includes(' as ')) exportMap[exp.split(' as ')[1].trim()] = { file, isDefault: false };
      else exportMap[exp] = { file, isDefault: false };
    }
  }
}

for (const file of allFiles) {
    if (path.basename(file) === 'index.ts' || path.basename(file) === 'index.tsx') continue;
    const name = path.basename(file).replace(/\.tsx?$/, '');
    if (!exportMap[name]) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('export default')) exportMap[name] = { file, isDefault: true };
    }
}

const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
let changedFiles = 0;

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  let match;
  const replacements = [];
  importRegex.lastIndex = 0;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importBlock = match[0];
    const importNamesStr = match[1];
    const importPath = match[2];
    
    if ((importPath.startsWith('@') || importPath.startsWith('.')) && 
       (importPath.endsWith('components') || importPath.endsWith('hooks') || 
        importPath.endsWith('styles') || importPath.endsWith('types') || 
        importPath.endsWith('utils') || importPath.endsWith('constants') ||
        importPath.endsWith('services') || importPath.endsWith('validation') ||
        importPath.includes('/components/') || importPath.includes('/hooks/') ||
        importPath.endsWith('index'))) {
        
        const names = importNamesStr.split(',').map(s => s.trim()).filter(Boolean);
        let newImports = [];
        let allFound = true;
        
        for (const name of names) {
           let searchName = name;
           let alias = name;
           if (name.includes(' as ')) {
               const parts = name.split(' as ');
               searchName = parts[0].trim();
               alias = parts[1].trim();
           }
           
           const exp = exportMap[searchName] || exportMap[alias];
           if (exp) {
               let relPath = exp.file.split(/\|\//).join('/');
               const srcIndex = relPath.indexOf('/src/');
               relPath = relPath.substring(srcIndex + 5);
               
               let newImportPath = '';
               if (relPath.startsWith('features/Attendance/')) newImportPath = '@attendance/' + relPath.substring('features/Attendance/'.length);
               else if (relPath.startsWith('features/Auth/')) newImportPath = '@auth/' + relPath.substring('features/Auth/'.length);
               else if (relPath.startsWith('features/Classes/')) newImportPath = '@classes/' + relPath.substring('features/Classes/'.length);
               else if (relPath.startsWith('features/RoleSelection/')) newImportPath = '@role-selection/' + relPath.substring('features/RoleSelection/'.length);
               else if (relPath.startsWith('features/Settings/')) newImportPath = '@settings/' + relPath.substring('features/Settings/'.length);
               else if (relPath.startsWith('shared/')) newImportPath = '@shared/' + relPath.substring('shared/'.length);
               else newImportPath = '@/' + relPath;
               
               newImportPath = newImportPath.replace(/\.tsx?$/, '');
               
               if (exp.isDefault) {
                   if (searchName !== alias) newImports.push('import ' + alias + ' from "' + newImportPath + '";');
                   else newImports.push('import ' + searchName + ' from "' + newImportPath + '";');
               } else {
                   if (searchName !== alias) newImports.push('import { ' + searchName + ' as ' + alias + ' } from "' + newImportPath + '";');
                   else newImports.push('import { ' + searchName + ' } from "' + newImportPath + '";');
               }
           } else {
               allFound = false;
               break;
           }
        }
        
        if (allFound && newImports.length > 0) {
            replacements.push({ old: importBlock, new: newImports.join('\n') });
        }
    }
  }
  
  for (const rep of replacements) content = content.replace(rep.old, rep.new);
  if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      changedFiles++;
  }
}
console.log('Changed ' + changedFiles + ' files.');
