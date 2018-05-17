module.exports = function(value, name){
    if (name == 'You') {
        return value;
    } else {
        return `${value}s`;
    };
};
