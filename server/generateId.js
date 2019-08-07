const uniqueId = ()=> {
    return 'id-' + Math.random().toString(36).substr(2, 16);
};
module.exports = uniqueId;