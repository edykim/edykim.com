import {taxRoute} from './../tag.js'
import {latestFirst} from './../sort.js'

function displayTitle(data) {
    return data.frontmatter.title;
}

const utils = {
    displayTitle,
    latestFirst,
    taxRoute,
};

export default utils;

