module.exports = {
  languagePrefix: () => ``,
  mappedUrls: [
    {
      key: `멜번 사는 이야기`,
      url: `life-in-australia`,
    },
    {
      key: `개발 이야기`,
      url: `dev-life`,
    },
    {
      key: `공부`,
      url: `study`,
    },
    {
      key: `나의 이야기`,
      url: `my-stories`,
    },
    {
      key: `두루두루 IT`,
      url: `it`,
    },
    {
      key: `번역`,
      url: `translations`,
    },
    {
      key: `잡다한 생각들`,
      url: `random-thoughts`,
    },
    {
      key: `제주 사는 이야기`,
      url: `life-in-jeju`,
    },
    {
      key: `책`,
      url: `book`,
    },
    {
      key: `리뷰`,
      url: `review`,
    },
  ],
  query: `
  {
    posts: allMarkdownRemark(
      filter: {
        frontmatter: {
          private: {ne: true},
          draft: {ne: true},
          lang: {eq: "ko"},
          type: {eq: "post"},
        },
      }
      sort: {fields: [frontmatter___date], order: DESC}
      ) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            lang
            tags
            categories
          }
        }
      }
    }
  }`,
}
