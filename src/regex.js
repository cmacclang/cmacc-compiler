var regex = {
    REGEX_VARIABLE: /\$\s?([\.\w]*)\s?\=?\s?(?:\[([\:\.\w\/]*)\])?(?:\s?\=\>\s?)?((?:null)|(?:["'].*["'])|(?:\{[^\;\$]*[\s}]+))?/g,
    REGEX_KEYVALUE: /(\"\w+\")\s?\:\s?((?:\"[^\"]*[\"])|(?:[\w\.]+))/g,
    REGEX_INJECT: /(\n?)((?:\s{4}|\t)*)?\{\{([\w\.]*)\}\}/g,
    REGEX_STRING: /^\"(.*)\"\,?$/,
    REGEX_COMMENT_SLASH: /^\/\/(.*)$/gm
};

module.exports = regex;


