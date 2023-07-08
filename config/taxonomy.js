// key, url: null, featured: false, children: null,

const taxonomies = {
  key: `블로그`,
  children: [
    {
      key: `사는 이야기`,
      children: [
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
        {
          key: `제주 사는 이야기`,
          url: `life-in-jeju`,
        },
        {
          key: `내 이야기`,
          url: `my-stories`,
          featured: true,
        },
      ],
    },
    {
      key: `개발 이것저것`,
      children: [
        {
          key: `개발 이야기`,
          url: `dev-life`,
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
          hidden: true,
        },
        {
          key: `번역`,
          url: `translations`,
          featured: true,
        },
      ],
    },
    {
      key: `이것저것`,
      children: [
        {
          key: `잡다한 생각들`,
          url: `random-thoughts`,
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
          key: `사진`,
          url: `photography`,
          featured: true,
        },
        {
          key: `부스러기`,
          url: `memo`,
          featured: true,
        },
      ],
    },
  ],
}

let flatten = node => {
  const {children, ...rest} = node;
  if (!node.children) {
    return [rest];
  }
  const nodes = node.children.reduce((carry, node) => {
    carry = carry.concat(flatten(node));
    return carry;
  }, []);
  return [...nodes, rest];
}

module.exports = {
  keys: [{ key: `tags`, singular: `tag` }],
  tree: taxonomies,
  mappedUrls: flatten(taxonomies).filter(v => v.url),
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
      sort: {frontmatter: {date: DESC}}
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
