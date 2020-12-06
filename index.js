const ora = require('ora');
const path = require('path');
const { askQuestions } = require('./ask');
const { getPackages } = require('./utils/getPackages');
const { readConfigFilesInFolder } = require('./utils/readConfigFiles');
const execSh = require('exec-sh');
const execShPromise = execSh.promise;
const log = console.log;
const { writeFile, readFile, mkdir, readdir } = require('fs').promises;

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
    log(configFiles);
    log(configFolderPath);
    const {
        framework,
        language,
        webpackSetup,
        gitInit,
        envFilesPattern,
    } = await askQuestions();
    const dependencies = [];
    const devDependencies = [];
    console.log(framework, language, webpackSetup, gitInit, envFilesPattern);
    if (language === 'ts') {
        const spinner = ora('Setting up Typescript').start();
        const config = await readFile(
            configFolderPath['typescript'] +
                '/' +
                configFiles['typescript'][framework === 'react' ? 1 : 0],
        );
        const tsconfig = path.join(process.cwd(), 'tsconfig.json');
        const reqPackages = getPackages('ts');
        dependencies.push([...reqPackages.normal]);
        devDependencies.push([...reqPackages.dev]);
        await writeFile(tsconfig, config.toString());
        spinner.succeed('Typescript Configured');
    }
    if (webpackSetup) {
        const config = await readFile(
            `${configFolderPath['webpack']}/webpack.config.${language}`
        );
        const webpackConfig = path.join(process.cwd(), `webpack.config.${language}`);
        const reqPackages = getPackages('react-ts');
        dependencies.push([...reqPackages.normal]);
        devDependencies.push([...reqPackages.dev]);
        await writeFile(webpackConfig, config.toString());
        log('webpack Setup Successfully');
    }
    console.log(dependencies, devDependencies);
    const modSpinner = ora('Installing Required Modules').start();
    const devSpinner = ora('Installing Dev Dependencies').start();
    const depSpinner = ora('Installing Dependencies').start();
    // exec
    await Promise.all([
        execShPromise(`npm i -S ${dependencies.join(" ")}`, true).then(depSpinner.succeed),
        execShPromise(`npm i -S ${devDependencies.join(" ")}`, true).then(devSpinner.succeed)
    ])
    modSpinner.succeed();
})();
