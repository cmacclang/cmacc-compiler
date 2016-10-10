function merge(obj1, obj2) {

    for (var i in obj2) {

        obj1[i] = obj1[i] || {}

        if (typeof obj2[i] === 'object' && obj2[i].$$str$$) {
            obj1[i] = obj2[i];
        }

        if (typeof obj2[i] === 'object' && !obj2[i].$$str$$) {
            merge(obj1[i], obj2[i]);
        }
    }

    return obj1

};

module.exports = merge;
