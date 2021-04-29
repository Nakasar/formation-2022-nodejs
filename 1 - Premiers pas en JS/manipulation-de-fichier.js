const { readFile, writeFile }  = require('fs').promises;
const path = require('path');

(async () => {
  const fileContent = (await readFile(path.join(__dirname, './input.csv'))).toString();
  const lines = fileContent.split('\n');

  const today = new Date();
  
  const linesWithoutHeader = lines.slice(1);
  const linesWithAge = linesWithoutHeader.map((line) => {
    const [firstName, lastName, dateOfBirth] = line.split(',');

    const date = new Date(dateOfBirth);

    const ageDelta = new Date(today - date);

    const age = ageDelta.getUTCFullYear() - 1970;

    return [lastName, firstName, dateOfBirth, age];
  });

  const outputLines = ['nom,prénom,date de naissance,âge'];
  outputLines.push(...linesWithAge);

  await writeFile(path.join(__dirname, '/output.csv'), outputLines.join('\n'));
})();
