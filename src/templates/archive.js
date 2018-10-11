import React from 'react';
import { Link, graphql } from 'gatsby';
import _ from 'lodash';
import DateTime from '../components/DateTime';
import Layout from '../components/layout';
import Card from '../components/Card';


export default ({ data }) => {
  const post = data.markdownRemark;
  const list = data.allMarkdownRemark.edges;
  const merged = _.groupBy(list, ({node}) => node.frontmatter.date.substring(0, 4));
  const years = _.reverse(Object.keys(merged));
  return (
    <Layout>
      <Card info={post}></Card>
      <h1>{post.frontmatter.title}</h1>
      <div className="content" dangerouslySetInnerHTML={{ __html: post.html }} />
      {years.map((year, yearIndex) => {
        return (
          <div key={yearIndex}>
            <h2>{year}</h2>
            <ul>
            {merged[year].map(({node}, index) =>
              <li key={index}>
                <Link to={`/${node.fields.url}`}>
                  {node.frontmatter.title}
                </Link>
                <DateTime at={node.frontmatter.date}></DateTime>
              </li>
            )}
            </ul>
          </div>
        )
      })}
    </Layout>
  );
}

export const query = graphql`
query ArchivesQuery($slug: String!) {
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
      frontmatter: { private: { ne: true }, draft: { ne: true }, type: { eq: "post"} }
      },
    sort: {fields: [frontmatter___date], order: DESC},
    ) {
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
