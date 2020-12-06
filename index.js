const ora = require('ora');
const path = require('path');
const { askQuestions } = require('./ask');
const { getPackages } = require('./utils/getPackages');
const { readConfigFilesInFolder } = require('./utils/readConfigFiles');
const execSh = require('exec-sh');
const { getScripts } = require('./utils/getScripts');
const { addNpmScripts } = require('./utils/addScripts');
const execShPromise = execSh.promise;
const { writeFile, readFile } = require('fs').promises;

const configFolderPath = {
    typescript: path.resolve(__dirname, 'config/typescript'),
    webpack: path.resolve(__dirname, 'config/webpack'),
};

const configFiles = {};

const readAllConfigDir = async () => {
    for (let key in configFolderPath) {
        configFiles[key] = await readConfigFilesInFolder(configFolderPath[key]);
    }
};

(async () => {
    await readAllConfigDir();
    const {
        framework,
        language,
        webpackSetup,
        gitInit,
        envFilesPattern,
    } = await askQuestions();
    const dependencies = [];
    const devDependencies = [];
    let scripts = {};
    if (language === 'ts') {
        scripts = {
            ...getScripts('ts'),
        };
        const spinner = ora('Setting up Typescript').start();
        const config = await readFile(
            configFolderPath['typescript'] +
                '/' +
                configFiles['typescript'][framework === 'react' ? 1 : 0],
        );
        const tsconfig = path.join(process.cwd(), 'tsconfig.json');
        const reqPackages = getPackages('ts');
        dependencies.push(...reqPackages.normal);
        devDependencies.push(...reqPackages.dev);
        await writeFile(tsconfig, config.toString());
        spinner.succeed('Typescript Configured Successfully');
    }
    if (webpackSetup) {
        scripts = {
            ...getScripts('react-ts'),
        };
        const spinner = ora('Setting up Webpack').start();
        const config = await readFile(
            `${configFolderPath['webpack']}/webpack.config.${language}`,
        );
        const webpackConfig = path.join(
            process.cwd(),
            `webpack.config.${language}`,
        );
        const reqPackages = getPackages('react-ts');
        dependencies.push(...reqPackages.normal);
        devDependencies.push(...reqPackages.dev);
        await writeFile(webpackConfig, config.toString());
        spinner.succeed('Webpack Configured Successfully');
    }
    await addNpmScripts(scripts);
    const depSpinner = ora('Installing Dependencies').start();
    await execShPromise(
        `npm i -S ${dependencies.join(' ')} --no-progress --quiet`,
    );
    depSpinner.succeed();
    const devSpinner = ora('Installing Dev Dependencies').start();
    await execShPromise(
        `npm i -D ${devDependencies.join(' ')} --no-progress --quiet`,
    );
    devSpinner.succeed();
})();
