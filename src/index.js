import fs from 'fs';
import snippets from './snippets.json';

function getContent(body) {
  let sublimeContent = '';
  if (typeof body === 'string') {
    sublimeContent = body;
  } else {
    sublimeContent = body.reduce((total, current) => `${total} \n ${current}`);
  }
  return `<content><![CDATA[${sublimeContent}]]></content>\n`;
}

function getTabTrigger(prefix) {
  return `<tabTrigger>${prefix}</tabTrigger>\n`;
}

function getScope() {
  return `<scope>source.js</scope>\n`;
}

function getDescription(description) {
  if (!description) {
    return;
  }

  return `<description>${description}</description>`;
}

function getSnippet(content, tabTrigger, scope, description) {
  return `<snippet>${content}${tabTrigger}</snippet>`;
}

function getFilename(key) {
  const sublimeFilename = key.replace(' ', '');
  return `${sublimeFilename}.sublime-snippet`;
}

function generateSnippets() {
  for (const key in snippets) {
    if (!snippets.hasOwnProperty(key)) continue;
    const { prefix, body, description } = snippets[key];
    const fileName = getFilename(key);

    try {
      const sublimeContent = getContent(body);
      const sublimeTabTrigger = getTabTrigger(prefix);
      const sublimeScope = getScope();
      const sublimeDescription = getDescription(description);
      const sublimeSnippet = getSnippet(
        sublimeContent,
        sublimeTabTrigger,
        sublimeScope,
        sublimeDescription,
      );

      fs.writeFile(`./snippets/${fileName}`, sublimeSnippet, function(err) {
        if (err) {
          return console.log(`An error occured writing: ${fileName}`);
        }
        console.log(`${fileName} added.`);
      });
    } catch (err) {
      console.log(`An error occured creating: ${fileName}`);
    }
  }
}

generateSnippets();
