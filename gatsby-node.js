/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: 'pages' });

    createNodeField({
      node,
      name: 'slug',
      value: slug
    })

    var url = node.fields.slug;

    if (node.frontmatter.url) {
      url = node.frontmatter.url;
    }

    else if (node.frontmatter.slug) {
      const typePrefix = node.frontmatter.type !== 'page' ? node.frontmatter.type + '/' : '';
      url = typePrefix + node.frontmatter.slug;
    }

    // put the language in url
    if (node.frontmatter.lang && node.frontmatter.lang !== 'en') {
      url = node.frontmatter.lang + '/' + url;
    }

    // double slash slashed
    url = url.replace(/\/\//g, '/');
    if (url.substr(-1) !== '/') url += '/';

    createNodeField({
      node,
      name: 'url',
      value: url
    })
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                type
                taxonomy
                private
                draft
              }
              fields {
                slug
                url
              }
            }
          }
        }
      }
      `).then(result => {
        result.data.allMarkdownRemark.edges.forEach(({ node }) => {
          if (node.frontmatter.private || node.frontmatter.draft) return;

          var context = {
            slug: node.fields.slug,
          };

          var componentName = 'post';

          if (node.frontmatter.type === 'archive') {
            componentName = 'archive';
          } else if (node.frontmatter.type === 'page') {
            componentName = 'page';
          } else if (node.frontmatter.type === 'category' || node.frontmatter.type === 'tag') {
            componentName = node.frontmatter.type;
            context['taxonomy'] = node.frontmatter.taxonomy;
          }

          createPage({
            path: node.fields.url,
            component: path.resolve(`./src/templates/${componentName}.js`),
            context,
          })
        });
        resolve();
    });
  });
};
