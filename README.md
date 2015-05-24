# Extensions Bulk Installer
[Brackets Text Editor](http://brackets.io) extension which enables bulk installation of extensions from saved JSON file. No more need for painfull manual installation of extensions to synchronize Brackets instances on different machines.

# How it works
- Open "Extensions Bulk Installer" extension by clicking icon in the right side toolbar, or by "Ctrl/Cmd-Alt-M" command.
- Click "Export to file" button to export all currently installed extensions to file. 
- Optionaly edit exported file to mark which extensions to skip during import process, by setting extension flag to "false". 
- Install easily group of extensions from the exported file on a different machine, just by clicking "Install from file" button and selecting exported file.
- Share your list of favourite extensions with others
    
# Example exported file
```
myExtensions.json
{
  "extensions": {
    "brackets-beautify": true,
    "brackets-darker": true,
    "drewkoch.icons": true,
    "zaggino.brackets-git": true,
    "hirse.outline-list": true,
    "edc.brackets-snippets": true,
    "dnbard.documents-toolbar": true,
    "codemirror.esnext.highlight": true,
    "brackets-emmet": true,
    "milosh86.extensions-bulk-installer": false,
    "dnbard.extensions-rating": true,
    "funcdocr": true,
    "brackets-hoganjs-language": true,
    "le717.html-skeleton": true,
    "pflynn.regex-editor": true,
    "jslint.configurator": true,
    "gruehle.markdown-preview": true,
    "brackets-mustache-language": true,
    "brackets-mystique-theme": true,
    "brackets-nodejs": true,
    "renanveroneze.brackets-open-terminal-here": true,
    "brackets-pep8": true,
    "quickdocsjs": true,
    "asgerf.bracket-rename": true,
    "brackets-semicenter": true,
    "spell-check": true,
    "ternific": true
  }
}
```