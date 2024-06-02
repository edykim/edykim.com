import {taxRoute} from './../tag.js'
import {latestFirst} from './../sort.js'
import components from './../../config/components.js'

function displayTitle(data) {
    return data.frontmatter.title;
}

function parseTemplateTag(data, identifier, producer) {
    if (data.indexOf(identifier) !== -1) {
        data = data.replace(identifier, producer());
    }
    return data;
}

function createDisplayContent(node, nodes, {partial}) {
    return () => {
        let data = node.value;

        data = components.reduce((carry, component) => {
            carry = parseTemplateTag(carry, `<!-- @template ${component.key} -->`,
                () => partial(
                    node.data.fields.url,
                    component.template,
                    component.props(node, nodes)
                ));
            return carry;
        }, data);

        return data;
    }
}

const utils = {
    createDisplayContent,
    displayTitle,
    latestFirst,
    taxRoute,
};

export default utils;

