const { DataStore } = require('notarealdb');

const store = new DataStore('./data');

module.exports = {
    banks: store.collection('banks'),
    transactions: store.collection('transactions'),
    users: store.collection('users'),
    admin: store.collection('admin')
};
