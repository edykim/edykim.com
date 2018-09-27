import React from 'react';
import Helmet from 'react-helmet';

export default ({ info }) => {
  const excerpt = info.html.replace(/(<([^>]+)>)/ig, '').replace("\n", '').substr(0, 300) + '...';
  // how to inject this?
  const url = 'https://edykim.com' + (info.fields.url.substr(0, 1) !== '/' ? '/' : '') + info.fields.url;

  const imageRegex = /<img[^>]+src="(https:\/\/[^">]+)"/g;
  const images = imageRegex.exec(info.html);
  const firstImage = images && images.length > 2 ? images[1] : null;

  return <Helmet title={info.frontmatter.title}>
    <html lang={info.frontmatter.lang} />
    <link rel="canonical" href={url} />
    <meta property="og:locale" content={info.frontmatter.lang === 'ko' ? 'ko_KR' : 'en_US'} />
    <meta property="og:type" content="article" />
    <meta property="og:title" content={info.frontmatter.title} />
    <meta property="og:description" content={excerpt} />
    <meta property="og:url" content={url} />
    <meta property="og:site_name" content="Here, Edward" />
    <meta property="article:tag" content={ info.frontmatter.tags && info.frontmatter.tags.length > 0 ? info.frontmatter.tags.join(', ') : ''} />
    <meta property="article:section" content={ info.frontmatter.categories && info.frontmatter.categories.length > 0 ? info.frontmatter.categories.join(', ') : ''} />
    <meta property="article:published_time" content={info.frontmatter.date} />
    <meta property="article:modified_time" content={info.frontmatter.modified || info.frontmatter.date} />
    <meta property="og:updated_time" content={info.frontmatter.modified || info.frontmatter.date} />

    <meta name="twitter:card" content="summary" />
    <meta name="twitter:description" content={excerpt} />
    <meta name="twitter:title" content={info.frontmatter.title} />
    <meta name="twitter:site" content="@haruair" />
    <meta name="twitter:creator" content="@haruair" />

    {firstImage ? <meta name="twitter:image" content={firstImage} /> : ''}
    {firstImage ? <meta name="og:image" content={firstImage} /> : ''}
    {firstImage ? <meta name="og:image:secure_url" content={firstImage} /> : ''}
  </Helmet>
};
