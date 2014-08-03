App.Model = function(name, attrs, fns){
    this.modelName = name;
    this.fields = {};

    var _this = this;

    attrs.forEach(function(attr){
        _this.fields[attr] = null;
    });

    Object.keys(fns).forEach(function(key){
        _this[key] = fns[key];
    });
};
