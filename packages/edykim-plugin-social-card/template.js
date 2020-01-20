module.exports = ({ title, author }) =>
  `<!doctype html>
    <html lang='ko'>
      <head>
        <style>
        @import url('https://fonts.googleapis.com/css?family=Noto+Sans+KR:400,700,900&subset=korean');
        * {
          font-family: 'Noto Sans KR', sans-serif;
        }
        body {
          overflow: hidden;
        }
        h1, h2, p {
          word-break: keep-all;
          margin: 0;
        }
        
        h1 {
          line-height: 8vw;
          font-size: 8vw;
          font-weight: 900;
          letter-spacing: -0.1em;
          margin-bottom: 0;
          width: 95%;
        }
        h2 {
          line-height: 5vw;
          font-size: 4vw;
          font-weight: 700;
          letter-spacing: -0.05em;
          margin-top: 0.5em;
          margin-bottom: -1vw;
          color: #666666;
          width: 95%;
        }
        p {
          margin-top: 2em;
          font-size: 4vw;
          font-weight: 700;
          letter-spacing: -0.1em;
        }
        p span {
          font-weight: 700;
          margin-right: 0.2em;
          color: #666666;
        }
        p span:after {
          color: #dddddd;
          margin-left: 0.3em;
          content: '·';
        }
        p:before {
          content: '';
          background: #6700ed;
          width: 3vw;
          height: 3vw;
          border-radius: 50%;
          position: absolute;
          margin-top: -4.5vw;
          box-shadow: 3.5vw 0 0 #ea1f63, 7vw 0 0 #dddddd;
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
        
        .background {
          transform: rotate(5deg) translateY(-50vw) translateX(92vw);
          z-index: -1;
          left: 0;
          top: 0;
          position: absolute;
          background: #dddddd;
          box-shadow: -2vw 0 0 #eeeeee, -4vw 0 0 #fafafa;
          height: 200vw;
          width: 100vw;
        }
        </style>
      </head>
      <body>
        <div>
          <section>
            <div>
              <h1 id="title"></h1>
              <h2 id="headline"></h2>

              <p>
                 <span>${title}</span> ${author}
              </p>
            </div>
          </section>
        </div>

        <div class="background"></div>

        <script>
        function setCard(title, headline) {
          document.getElementsByTagName("h1")[0].innerText = title;
          if (headline) {
            document.getElementsByTagName("h2")[0].style.display = "block";
            document.getElementsByTagName("h2")[0].innerText = headline;
          } else {
            document.getElementsByTagName("h2")[0].style.display = "none";
          }
        }
        </script>
      </body>
    </html>
  `
