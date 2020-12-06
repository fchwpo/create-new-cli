const inquirer = require('inquirer');

const askQuestions = async () => {
    return inquirer
    .prompt([
        /* Pass your questions in here */
        {
            type: 'list',
            name: 'framework',
            message: 'Pick the framework you are using',
            loop: true,
            choices: [
                {
                    name: 'React',
                    type: 'choice',
                    value: 'react',
                },
                {
                    name: 'Node',
                    type: 'choice',
                    value: 'node',
                },
            ],
        },
        {
            type: 'list',
            name: 'language',
            message: 'Preffered Language',
            loop: true,
            choices: [
                {
                    name: 'Typescript (TS)',
                    type: 'choice',
                    value: 'ts',
                },
                {
                    name: 'Javascript (JS)',
                    type: 'choice',
                    value: 'js',
                },
            ],
        },
        {
            type: 'confirm',
            name: 'webpackSetup',
            message: 'Webpack Setup Required',
        },
        {
            type: 'confirm',
            name: 'gitInit',
            message: 'Initialize Git Repository',
        },
        {
            type: 'list',
            name: 'envFilesPattern',
            message: 'Please Select env file pattern',
            loop: true,
            choices: [
                {
                    name: 'Separate .env and .env.production',
                    type: 'choice',
                    value: 'separate'
                },
                {   
                    name: 'Single .env file',
                    type: 'choice',
                    value: 'single'
                },
                {
                    name: 'Not Required',
                    type: 'choice',
                    value: 'notRequired'
                }
            ]
        }
    ]);
}

module.exports = {
    askQuestions
}