import {taxRoute} from './../tag.js'
import {latestFirst} from './../sort.js'
import components from './../../config/components.js'
import {getTagTree} from './../../config/tag.js'

function displayTitle(data) {
    return data.frontmatter.title;
}

function parseTemplateTag(data, identifier, producer) {
    const front = `<!-- @template ${identifier} `;
    const back = '-->';
    
    const begin = data.indexOf(front);
    if (begin !== -1) {
        const startedAt = begin + front.length;
        const end = data.indexOf(back, startedAt);

        if (end !== -1) {
            const args = data.substr(startedAt, end - startedAt).trim();
            data = data.substr(0, begin) + producer(args) + data.substr(end + back.length);
        }
    }
    return data;
}

function createDisplayContent(node, nodes, {partial}) {
    return () => {
        let data = node.value;

        data = components.reduce((carry, component) => {
            while (true) {
                const newCarry = parseTemplateTag(carry, component.key,
                    (args) => partial(
                        node.data.fields.url,
                        component.template,
                        component.props(node, nodes, args)
                    ));
                if (newCarry === carry) {
                    break;
                }
                carry = newCarry;
            }
            return carry;
        }, data);

        return data;
    }
}

function isActive(data, url, startsWith) {
    startsWith = startsWith || false;
    // remove leading slash and trailing slash
    url = url.replace(/^\//, '').replace(/\/$/, '');
    return startsWith ? data.fields.url.startsWith(url) : data.fields.url === url;
}

function helloWorld(message) {
    return 'Hello world' + message;
}

const utils = {
    helloWorld,
    createDisplayContent,
    displayTitle,
    latestFirst,
    taxRoute,
    isActive,
    getTagTree,
};

export default utils;

