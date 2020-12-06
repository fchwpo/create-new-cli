const { writeFile, readFile, mkdir, readdir } = require('fs').promises;

const readConfigFilesInFolder = async (folderPath) => {
    return readdir(folderPath).catch(console.log)
}

module.exports = {
    readConfigFilesInFolder
}