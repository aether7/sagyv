var Voucher = require('./voucher_model.js');

function VoucherTransbank(){
    Voucher.call(this, 'transbank');
}

VoucherTransbank.mixin(Voucher, {
    _calcularTotal: function(){}
});

module.exports = VoucherTransbank;
