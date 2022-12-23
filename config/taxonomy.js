module.exports = {
  keys: [{ key: `tags`, singular: `tag` }],
  mappedUrls: [
    {
      key: `개발 이야기`,
      url: `dev-life`,
      featured: true,
    },
    {
      key: `공부`,
      url: `study`,
    },
    {
      key: `내 이야기`,
      url: `my-stories`,
      featured: true,
    },
    {
      key: `두루두루 IT`,
      url: `it`,
      featured: true,
    },
    {
      key: `두루두루 it`,
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
      featured: true,
    },
    {
      key: `리뷰`,
      url: `review`,
      featured: true,
    },
    {
      key: `요리 레시피`,
      url: `recipe`,
      featured: true,
    },
    {
      key: `부스러기`,
      url: `memo`,
      featured: true,
    },
    {
      key: `사진`,
      url: `photography`,
      featured: true,
    },
    {
      key: `미국 사는 이야기`,
      url: `life-in-us`,
      featured: true,
    },
    {
      key: `멜번 사는 이야기`,
      url: `life-in-australia`,
      featured: true,
    },
  ],
  query: `
  {
    posts: allMarkdownRemark(
      filter: {
        frontmatter: {
          private: {ne: true},
          draft: {ne: true},
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
