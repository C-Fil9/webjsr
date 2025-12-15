const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
    },
    balance: { type: Number, default: 0 },
    avatar: { type: String, default: '' }, // Default avatar path
    purchasedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;