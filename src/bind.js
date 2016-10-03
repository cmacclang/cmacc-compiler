function bind(src) {

    // Bind variables
    for (var i in src) {
        if (src[i] && src[i]['$$obj$$']) {
            for (var j in src[i]['$$obj$$']) {

                if (!j.match(/^\$\$(.*)\$\$/)) {
                    src[j] = src[i][j];
                }

            }
        }
    }
};

module.exports = bind;
