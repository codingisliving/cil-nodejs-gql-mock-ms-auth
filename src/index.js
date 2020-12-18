const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const { verifyToken } = require('./utils/authUtils');
const {
    adminHandler,
    usersHandler,
    banksHandler,
    transactionsHandler
} = require('./handlers');
const tokenCred = require('./config');

const app = express();
const port = 4001;
app.use(bodyParser.json());

const authMdw = (req, res, next) => {
    const { auth } = req.headers;

    try {
        verifyToken(auth, tokenCred.key);
        next();
    }
    catch (err) {
        res.status(401).send(err);
    }
}

const dbMdw = (req, res, next) => {
    Object.assign(req, { db });
    next();
}


app.post('/admin/login', dbMdw, adminHandler.login);
app.post('/admin/add', dbMdw, adminHandler.add);

app.get('/users', authMdw, dbMdw, usersHandler.get);
app.get('/users/:id', authMdw, dbMdw, usersHandler.getOne);
app.post('/users', authMdw, dbMdw, usersHandler.post);
app.patch('/users/:id', authMdw, dbMdw, usersHandler.patch);
app.delete('/users/:id', authMdw, dbMdw, usersHandler.remove);

app.get('/banks', authMdw, dbMdw, banksHandler.get);
app.get('/banks/:id', authMdw, dbMdw, banksHandler.getOne);
app.post('/banks', authMdw, dbMdw, banksHandler.post);
app.patch('/banks/:id', authMdw, dbMdw, banksHandler.patch);
app.delete('/banks/:id', authMdw, dbMdw, banksHandler.remove);

app.get('/transactions', authMdw, dbMdw, transactionsHandler.get);
app.get('/transactions/:id', authMdw, dbMdw, transactionsHandler.getOne);
app.post('/transactions', authMdw, dbMdw, transactionsHandler.post);
app.patch('/transactions/:id', authMdw, dbMdw, transactionsHandler.patch);
app.delete('/transactions/:id', authMdw, dbMdw, transactionsHandler.remove);

app.listen(port, () => {
    console.log(`cil-nodejs-gql-mock-ms-auth listening at http://localhost:${port}`)
});
