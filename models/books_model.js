const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title : {
        type: String,
        unique: true,
        required: true
    },
    content: {
        type: String
    },
    urlImg: {
        type: String
    },
    status: {
        type: Boolean,
        default: 1,
    },
    date_created: {
        type: Date,
        default: Date.now()
    },
    date_updated: {
        type: Date,
        default: Date.now()
    },
    idCategory:{
        type: mongoose.Schema.Types.ObjectId
    },
    id_user:{
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('books', productSchema);