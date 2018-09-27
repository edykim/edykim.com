/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const config = require('./gatsby-config');
const urlResolve = require('url').resolve;

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

// generate redirect file
// const path = require('path');
const fs = require('fs');
const pify = require('pify');
const mkdirp = require('mkdirp');

const writeFile = pify(fs.writeFile)
const runQuery = (handler, query) =>
  handler(query).then(r => {
    if (r.errors) {
      throw new Error(r.errors.join(`, `))
    }

    return r.data
  })

exports.onPostBuild = async ({ graphql }) => {
  const query = `
  {
    redirects: allMarkdownRemark {
      edges {
        node {
          frontmatter {
            private
            draft
            history {
              from
            }
          }
          fields {
            url
          }
        }
      }
    }
  }`;

  const filename = 'redirect.json';
  const publicPath = './public';

  const result = await runQuery(graphql, query);

  var redirects = [];
  result.redirects.edges.forEach(({ node }) => {
    if (node.frontmatter.private || node.frontmatter.draft) return;
    if (!node.frontmatter.history || node.frontmatter.history.length === 0) return;

    const to = urlResolve(config.siteMetadata.siteUrl, node.fields.url);
    const result = node.frontmatter.history.map(v => ({
      from: v.from,
      to
    }));
    
    redirects = redirects.concat(result);
  });

  const outputPath = path.join(publicPath, filename);
  const outputDir = path.dirname(publicPath);
  if (!fs.existsSync(outputDir)) {
    mkdirp.sync(outputDir);
  }

  await writeFile(outputPath, JSON.stringify(redirects, null, 2));
  console.log(`${redirects.length} of redirections generated. (${outputPath})`)
  return Promise.resolve();
}