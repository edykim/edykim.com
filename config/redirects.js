export default {
  redirects: [
    redirect('ko', '', 'https://www.haruair.com', 'ko/'),
    redirect('ko', '', 'https://www.haruair.com/feed', 'ko/feed.xml'),
    redirect('ko', '', 'https://www.haruair.com/blog', 'ko/post/list/'),
    redirect('ko', '', 'https://www.haruair.com/translation', 'ko/tag/translations/'),
    redirect('ko', '', 'https://www.haruair.com/php', 'ko/tag/php/'),
    redirect('ko', '', 'https://www.haruair.com/ng', 'ko/tag/angularjs/'),
  ],
}

function redirect(lang, title, fromURL, toURL) {
  return {
    data: {
      frontmatter: {
        lang,
        title,
        history: [
          {
            from: fromURL,
          },
        ],
      },
      fields: {
        url: toURL,
      },
    },
  }
}
