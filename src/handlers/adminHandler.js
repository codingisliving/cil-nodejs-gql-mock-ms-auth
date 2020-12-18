const bcrypt = require('bcrypt');
const authUtils = require('../utils/authUtils');
const tokenCred = require('../config');

const login = async (req, res) => {
    const { db: { admin } } = req;
    const { username, password } = req.body;

    try {
        const list = admin.list();
        const result = list.find((item) => item.username === username);

        let verifyPass = false;

        if (result.password) {
            verifyPass = await bcrypt.compare(password, result.password);
        }

        if (verifyPass) {
            const token = authUtils.createToken(tokenCred.key, { username, password }, tokenCred.expiry);
            res.send({
                status: 'success',
                message: `Logged as ${username}`,
                token
            });
        }

        res.send({
            status: 'error',
            message: 'Wrong username or password!'
        });
    }
    catch(err) {
        res.send('ERROR: ' + err.message);
    }
};

const add = async (req, res) => {
    const { db: { admin } } = req;
    const { username, password } = req.body;

    try {
        const result = admin.create({
            username,
            password: await bcrypt.hash(password, tokenCred.saltRounds)
        });
        res.send(result);
    }
    catch(err) {
        res.send('ERROR: ' + err.message);
    }
};

module.exports = { login, add };
