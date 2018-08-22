// User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    userName: String,
    userOffice: String,
    userEmail: String,
    userTrouble: String,
    date: { type: Date, default: Date.now }
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
