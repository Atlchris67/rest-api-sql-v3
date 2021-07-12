const path = require('path');
const output = path.join(__dirname, "./models");
const options = { directory: output, caseFile: 'l', caseModel: 'p', caseProp: 'c', lang: 'ts', singularize: true, spaces: true, indentation: 2 };
// Edit the configuration below for your database dialect

// sqlite
const storage = path.join(__dirname, "../fsjstd-restapi.db");
const sqlite = {
    dbname: 'fsjstd-restapi',
    user: '',
    pass: '',
    options: {
        dialect: 'sqlite',
        storage: storage
    },
    autoOptions: {
        dialect: 'sqlite',
        storage: storage,
        ...options
    }
};


// Change to export appropriate config for your database
module.exports = sqlite;