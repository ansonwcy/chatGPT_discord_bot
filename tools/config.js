const fs = require('node:fs')

const constDir = __dirname + '/../src/constant'
const dataDir = __dirname + '/../src/data';
const configDir = __dirname + '/../src/config';

// create data directory
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// create chat_history.json
if (!fs.existsSync(dataDir + '/chatHistory.json')) {
    fs.writeFileSync(dataDir + '/chatHistory.json', '{}');
}

// create config directory
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
}

// create config.json
if (!fs.existsSync(configDir + '/config.json')) {
    fs.writeFileSync(configDir + '/config.json', '{}');
    fs.readFile(constDir + '/config.sample.json', 'utf8', (err, data) => {
        if (err) throw err;
        fs.writeFile(configDir + '/config.json', data, (err) => {
            if (err) throw err;
        });
    });
}

// create bot.yml
if (!fs.existsSync(configDir + '/bot.yml')) {
    fs.writeFileSync(configDir + '/bot.yml', '');
    fs.readFile(constDir + '/bot.sample.yml', 'utf8', (err, data) => {
        if (err) throw err;
        fs.writeFile(configDir + '/bot.yml', data, (err) => {
            if (err) throw err;
        });
    });
}