/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');

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
