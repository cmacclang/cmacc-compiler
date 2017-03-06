var fs = require('fs');
var url = require('url');
var path = require('path');

var cash = {}

function fetch(file, options) {

    options = options || {}

    //TODO: Hack for file path windows
    if(/^win/.test(process.platform) ){
        file = file.replace(/(\w\w\w\w\:\/\/)(\w\:)/, 'file:///' + '$2')
    }

    var urlObj = url.parse(file);


    if(urlObj.protocol){

        if (typeof window !== 'undefined' && window.location.host) {

            if(urlObj.protocol === 'npm:' || urlObj.protocol === 'yarn:'){
                console.log(urlObj)
                file = path.join('node_modules', urlObj.hostname, urlObj.path)
            }

            var request = new XMLHttpRequest();
            request.open('GET', file, false);
            request.send(null);

            if (request.status === 200) {
                return request.responseText
            }else {
                var e = new Error('Cannot load file');
                e.file = file;
                throw e
            }

        }else{

            if(urlObj.protocol === 'file:'){
                var location = decodeURI(urlObj.pathname);

                //TODO: Hack for file path windows
                if(/^win/.test(process.platform) ){
                    location = location.substring(1)
                }
                return fs.readFileSync(location, 'utf8');
            }

            if(urlObj.protocol === 'http:' || urlObj.protocol === 'https:'){

                var location = url.format(urlObj);

                if(cash[location]){
                    return cash[location];
                }

                var request = require('sync-request');
                var res = request('GET', location);

                if(res.statusCode === 200) {
                    cash[location] = res.getBody().toString('utf8')
                    return res.getBody().toString('utf8');
                } else{
                    throw new Error('Cannot fetch: ' + url.format(urlObj))
                }
            }

            if(urlObj.protocol === 'npm:' || urlObj.protocol === 'yarn:'){
                var findRoot = require('find-root');
                var packageRoot = options.path ? findRoot(options.path.replace('file://', '')) : findRoot(process.cwd());
                var nodeModules = path.join(packageRoot, 'node_modules')
                var location = path.join(nodeModules, decodeURI(urlObj.host), decodeURI(urlObj.pathname));
                return fs.readFileSync(location, 'utf8');
            }
        }
    }

    return file;

}

module.exports = fetch;
