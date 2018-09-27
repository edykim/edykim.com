import ArchiveComponent from './archive';
import { graphql } from 'gatsby';

export default ArchiveComponent;

export const query = graphql`
query TagQuery($slug: String!, $taxonomy: [String]!) {
  markdownRemark: markdownRemark(fields: {slug: {eq: $slug}}) {
    html
    frontmatter {
      title
    }
    fields {
        url
    }
  }
  allMarkdownRemark: allMarkdownRemark(
    filter: {
      frontmatter: {
        private: {ne: true},
        draft: {ne: true},
        type: {eq: "post"},
        tags: {in: $taxonomy}
      }
    },
    sort: {
      fields: [frontmatter___date],
      order: DESC
    }) {
    edges {
      node {
        frontmatter {
          title
          date
        }
        fields {
          url
        }
      }
    }
  }
}
`;
