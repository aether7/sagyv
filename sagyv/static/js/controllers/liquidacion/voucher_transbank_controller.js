function VoucherTransbankController($http, $scope){
    this.scope = $scope;
    this.vouchers = [];
    this.voucher = {};
}

VoucherTransbankController.mixin({
    addVoucher: function(){
        this.vouchers.push();
    },

    removeVoucher: function(index){
        this.vouchers.splice(index, 1);
    }
});

module.exports = VoucherTransbankController;
