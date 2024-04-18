const taxonomies = {
  key: `블로그`,
  children: [
    {
      key: `사는 이야기`,
      children: [
        {
          key: `미국 사는 이야기`,
          url: `life-in-us`,
        },
        {
          key: `멜번 사는 이야기`,
          url: `life-in-australia`,
        },
        {
          key: `제주 사는 이야기`,
          url: `life-in-jeju`,
          hidden: true,
        },
        {
          key: `내 이야기`,
          url: `my-stories`,
        },
        {
          key: `부스러기`,
          url: `memo`,
        },
      ],
    },
    {
      key: `개발 이것저것`,
      children: [
        {
          key: `개발 이야기`,
          url: `dev-life`,
        },
        {
          key: `개발 잡동사니`,
          url: `it`,
        },
        {
          key: `번역`,
          url: `translations`,
        },
        {
          key: `리눅스`,
          url: `linux`,
        },
        {
          key: `자바스크립트`,
          url: `js`,
        },
        {
          key: `PHP`,
          url: `php`,
        },
      ],
    },
    {
      key: `이것저것`,
      children: [
        {
          key: `책`,
          url: `book`,
        },
        {
          key: `리뷰`,
          url: `review`,
        },
        {
          key: `요리 레시피`,
          url: `recipe`,
        },
        {
          key: `사진`,
          url: `photography`,
        },
        {
          key: `음악`,
          url: `music`,
        },
        {
          key: `여행`,
          url: `travel`,
          hidden: true,
        },
      ],
    },
  ],
}

function flatten(node) {
  const { children, ...rest } = node
  if (!node.children) {
    return [rest]
  }
  const nodes = node.children.reduce((carry, node) => {
    carry = carry.concat(flatten(node))
    return carry
  }, [])
  return [...nodes, rest]
}

export function getMappedTags() {
    return flatten(taxonomies);
}

export function getTagTree() {
    return taxonomies;
}

