const fs = require('fs');

const getFileContentByPath = path => {
    return fs.readFileSync(path, 'utf-8');
};

const saveFileContentByPath = (path, content) => {
    finalContent =
        typeof content === 'string' ? content : JSON.stringify(content);
    fs.writeFileSync(path, finalContent, err => {
        if (err) {
            return console.log(err);
        }
        console.log('save path content success');
    });
};

module.exports = {
    getFileContentByPath,
    saveFileContentByPath
};
