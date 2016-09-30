var merge = function (json1, json2) {

    json1 = json1 || {}

    //console.log(json1);

    if (typeof json1 !== 'object') {
        json1 = json2;
        return json1;
    }

    for (var i in json2) {

        if (typeof json2[i] === 'object')
            json1[i] = merge(json1[i], json2[i]);
        else {
            if (i !== '$$file$$') {
                json1[i] = json2[i];
            }
        }

    }

    console.log(json1);

    return json1

};

module.exports = merge;
