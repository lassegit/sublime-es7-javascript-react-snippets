import fs from 'fs';
import snippets from './snippets.json';

const getContent = body => {
  let sublimeContent = '';
  if (typeof body === 'string') {
    sublimeContent = body;
  } else {
    sublimeContent = body.reduce((total, current) => `${total} \n ${current}`);
  }
  return `<content><![CDATA[${sublimeContent}]]></content>`;
};

const getTabTrigger = prefix => `<tabTrigger>${prefix}</tabTrigger>`;

const getScope = () => `<scope>source.js</scope>`;

const getDescription = description =>
  `<description>${description || ''}</description>`;

const getSnippet = (content, tabTrigger, scope, description) => `<snippet>
  ${content}
  ${tabTrigger}
  ${scope}
  ${description}
</snippet>`;

const getFilename = key => {
  const sublimeFilename = key.replace(/ /g, '');
  return `${sublimeFilename}.sublime-snippet`;
};

const generateSnippets = () => {
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
};

generateSnippets();
