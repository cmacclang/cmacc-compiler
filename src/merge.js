var merge = function (json1, json2) {

    json1 = json1 || {};

    for (var i in json2) {

        if (typeof json2[i] === 'object') {
            json1[i] = merge(json1[i], json2[i]);
        } else
            json1[i] = json2[i];
    }

    return json1;

};

module.exports = merge;
