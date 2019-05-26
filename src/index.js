import fs from 'fs';
import snippets from './snippets.json';

/**
 * Get the actually code snippet
 * @param  {string} body
 */
const getContent = body => {
  let sublimeContent = '';
  if (typeof body === 'string') {
    sublimeContent = body;
  } else {
    // Some are stored as json arrays and needs to be reduced into a text snippet
    sublimeContent = body.reduce((total, current) => `${total}\n${current}`);
  }
  return `<content><![CDATA[${sublimeContent}]]></content>`;
};

/**
 * Get the tab trigger word
 * @param  {string} prefix
 */
const getTabTrigger = prefix => `<tabTrigger>${prefix}</tabTrigger>`;

/**
 * Get the scope field (defaults to scoure.js)
 */
const getScope = () => `<scope>source.js</scope>`;

/**
 * Get the description field
 * @param  {string} description
 */
const getDescription = key => `<description>${key}</description>`;

/**
 * Putting the xml tags togehter in the sublime snippet format
 * @param  {string} content
 * @param  {string} tabTrigger
 * @param  {string} scope
 * @param  {string} description [description]
 */
const getSnippet = (content, tabTrigger, scope, description) => `<snippet>
${content}
${tabTrigger}
${scope}
${description}
</snippet>`;

/**
 * Generate the file anem
 * @param  {string} key
 */
const getFilename = key => {
  const sublimeFilename = key.replace(/ /g, '').replace(/[^\w.]/g, '');
  return `${sublimeFilename}.sublime-snippet`;
};

/**
 * Generate the snippets by iterating over the object items from the snippets.json file
 */
const generateSnippets = () => {
  for (const key in snippets) {
    if (!snippets.hasOwnProperty(key)) continue;
    const { prefix, body, description } = snippets[key];
    const fileName = getFilename(key);

    try {
      const sublimeContent = getContent(body);
      const sublimeTabTrigger = getTabTrigger(prefix);
      const sublimeScope = getScope();
      const sublimeDescription = getDescription(key);
      const sublimeSnippet = getSnippet(
        sublimeContent,
        sublimeTabTrigger,
        sublimeScope,
        sublimeDescription,
      );

      fs.writeFile(`./snippets/${fileName}`, sublimeSnippet, function(err) {
        if (err) {
          return console.log(`Error occured writing: ${fileName}`);
        }
        console.log(`${fileName} added.`);
      });
    } catch (err) {
      console.log(`Error occured creating: ${fileName}`);
    }
  }
};

generateSnippets();
