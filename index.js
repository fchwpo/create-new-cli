const { exec } = require('child_process');
const path = require('path');
const { askQuestions } = require('./ask');
const { readConfigFilesInFolder } = require('./utils/readConfigFiles');
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
    console.log(framework, language, webpackSetup, gitInit, envFilesPattern);
    if (language === 'ts') {
        const config = await readFile(
            configFolderPath['typescript'] +
                '/' +
                configFiles['typescript'][framework === 'react' ? 1 : 0],
        );
        exec("sh scripts/typescript.sh");
        const tsconfig = path.join(process.cwd(), 'tsconfig.json');
        await writeFile(tsconfig, config.toString());
        log('tsconfig.json Created Successfully');
    }
    if (webpackSetup) {
        const config = await readFile(
            `${configFolderPath['webpack']}/webpack.config.${language}`
        );
        const webpackConfig = path.join(process.cwd(), `webpack.config.${language}`);
        await writeFile(webpackConfig, config.toString());
        exec(`sh scripts/react-${language}.sh`);
        log('webpack Setup Successfully');
    }
})();
