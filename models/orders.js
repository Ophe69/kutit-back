var mongoose = require('mongoose');


var OrdersSchema = mongoose.Schema({
    type: String,
    prix: Number,
    date: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    proId: {type: mongoose.Schema.Types.ObjectId, ref: 'Professionnels'}
});

const OrdersModel = mongoose.model('orders', OrdersSchema);

module.exports = OrdersModel;
