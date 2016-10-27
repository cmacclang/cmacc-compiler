var fs = require('fs');
var url = require('url');

function fetch(file) {

    var urlObj = url.parse(file);

    if(urlObj.protocol){
        if (typeof window !== 'undefined') {
            var request = new XMLHttpRequest();
            request.open('GET', file, false);
            request.send(null);

            if (request.status === 200) {
                return request.responseText
            }
        }else{
            return fs.readFileSync(urlObj.pathname, 'utf8');
        }
    }

    return file;


}

module.exports = fetch;
