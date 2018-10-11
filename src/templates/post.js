import React from 'react';
import { graphql, Link } from 'gatsby';
import Layout from '../components/layout';
import FromHistory from '../components/FromHistory';
import DateTime from '../components/DateTime';
import Headline from '../components/Headline';
import AuthorBox from '../components/AuthorBox';
import Card from '../components/Card';
import TaxonomyLine from '../components/TaxonomyLine';

import typography from '../utils/typography';

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

      <TaxonomyLine post={post}></TaxonomyLine>

      <FromHistory history={post.frontmatter.history}></FromHistory>
      <AuthorBox lang={post.frontmatter.lang}></AuthorBox>

      <div style={{padding: '4rem 0', textAlign: 'center'}}>
        <Link style={{
          fontFamily: typography.options.headerFontFamily,
          boxShadow: 'none',
          padding: '0.6rem 1.3rem',
          borderRadius: '3px',
          fontSize: '0.8rem',
          border: '4px solid #9ecbe8',
        }} to={"/ko/archives/"}>목록으로</Link>
      </div>
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
      categories
      tags
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
