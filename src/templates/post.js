import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import FromHistory from '../components/FromHistory';
import DateTime from '../components/DateTime';
import Headline from '../components/Headline';
import AuthorBox from '../components/AuthorBox';
import Card from '../components/Card';

const PostHeaderStyle = {
  marginBottom: '1.4rem',
};

export default ({ data }) => {
  const post = data.markdownRemark;

  return (
    <Layout>
      <Card info={post}></Card>

      <div style={PostHeaderStyle}>
        <h1>{post.frontmatter.title}</h1>
        <Headline line={post.frontmatter.headline}></Headline>
        <DateTime at={post.frontmatter.date}></DateTime>
      </div>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <FromHistory history={post.frontmatter.history}></FromHistory>

      <AuthorBox lang={post.frontmatter.lang}></AuthorBox>
    </Layout>
  );
}

export const query = graphql`
query BlogPostQuery($slug: String!) {
  markdownRemark(fields: {slug: {eq: $slug}}) {
    html
    frontmatter {
      title
      date
      lang
      headline
      history {
        from
        movedAt
      }
    }
    fields {
      url
    }
  }
}
`;
