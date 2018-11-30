import React from 'react';
import './AuthorBox.css';

const detail = {
    en: {
        name: `Edward Kim`,
        description: `I'm a full stack software developer. I love to help capturing small idea and make big.`,
        links: [
            {
                name: 'twitter',
                link: 'https://twitter.com/heyedykim'
            },
            {
                name: 'github',
                link: 'https://github.com/edykim'
            },
            {
                name: 'rss',
                link: '/feed.xml'
            },
            {
                name: 'about',
                link: '/'
            },
        ]
    },
    ko: {
        name: `김용균`,
        description: `후후후`,
        links: [
            {
                name: 'twitter',
                link: 'https://twitter.com/haruair'
            },
            {
                name: 'github',
                link: 'https://github.com/edykim'
            },
            {
                name: 'rss',
                link: '/ko/feed.xml'
            },
            {
                name: 'about',
                link: '/ko/'
            },
        ]
    }
}

export default ({lang}) => {
    const card = detail[lang] || detail['en'];
    return <div className="author-box">
        <div className="author-box--name">🥳 {card.name}</div>
        <div className="author-box--desc">{card.description}</div>
        <div className="author-box--links">
            {card.links.map(({ name, link }, index) => {
                return <a key={index} href={link}>{name}</a>
            })}
        </div>
    </div>
};
