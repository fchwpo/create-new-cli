
const path = require('path');
const { writeFile, readFile } = require('fs').promises;

const addNpmScripts = async (scripts) => {
    let packageJson = await readFile(__dirname + '/../package.json');
    packageJson = JSON.parse(packageJson.toString());
    packageJson.scripts = {
        ...packageJson.scripts,
        ...scripts
    };
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    await writeFile(packageJsonPath, (JSON.stringify(packageJson)).toString());
};

module.exports = {
    addNpmScripts
}