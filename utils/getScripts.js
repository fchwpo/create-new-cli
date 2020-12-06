const getScripts = (packageFor) => {
    switch(packageFor){
        case 'ts': 
            return {
                "format": "prettier --write \"src/**/*.js\" \"src/**/*.ts\"",
            }
        case 'react-ts':
            return {
                "format": "prettier --write \"src/**/*.js\" \"src/**/*.jsx\"  \"src/**/*.tsx\" \"src/**/*.ts\"  \"src/**/*.css\" \"src/**/*.scss\"",
                "build:dev": "webpack -w --mode development",
                "build": "webpack --mode production",
                "start": "webpack serve --mode development --env development",
            }
    }
}

module.exports = {
    getScripts
}