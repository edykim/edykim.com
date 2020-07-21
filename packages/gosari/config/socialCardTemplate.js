module.exports = site => {
  return ({ frontmatter: { title, headline } }) =>
    `<!doctype html>
    <html lang='ko'>
      <head>
        <style>
        @import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR:400,700,900&subset=korean');
        * {
          font-family: 'Noto Sans KR', sans-serif;
        }
        html, body {
          background: rgb(68,69,201);
          background: linear-gradient(155deg, rgba(68,69,201,1) 34%, rgba(69,13,205,1) 100%);
        }
        body {
          overflow: hidden;
        }
        h1, h2, p {
          word-break: keep-all;
          margin: 0;
        }

        h1 {
          color: #f7f7ff;
          line-height: 8vw;
          font-size: 8vw;
          font-weight: 900;
          letter-spacing: -0.1em;
          margin-bottom: 0;
          width: 95%;
        }
        h2 {
          color: #f7f7ff;
          opacity: 0.5;
          line-height: 5vw;
          font-size: 4vw;
          font-weight: 700;
          letter-spacing: -0.05em;
          margin-top: 0.5em;
          margin-bottom: -1vw;
          width: 95%;
        }
        p {
          margin-top: 2em;
          font-size: 4vw;
          font-weight: 700;
          letter-spacing: -0.1em;
          color: #f7f7ff;
        }

        p span {
          font-weight: 700;
          margin-right: 0.2em;
          color: #fdca40;
        }

        section {
          height: 100vh;
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
        }

        section > div {
          padding-left: 3vw;
          padding-right: 3vw;
        }
        </style>
      </head>
      <body>
        <div>
          <section>
            <div>
              <h1 id="title">${title}</h1>
              ${headline ? `<h2 id="headline">${headline}</h2>` : ""}
              <p>
                <span>${site.title}</span> ${site.author}
              </p>
            </div>
          </section>
        </div>
      </body>
    </html>

  `
}
