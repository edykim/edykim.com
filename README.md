# edykim.com

The source code for generating website is under MIT license. All contents in
`contents` are under [vary](https://edykim.com/ko/copyright/).

```bash
$ npm run build
$ serve public
```

## Template

The root of template hierarchy is `./templates/index.html`. Template can be
nested using `template(filePath, data)` function.

File path should be matched with a url structure of pages/posts. It will look up
parent directory if the matching template is not there. For example, if we have
a page with `/ko/recipe/pie/apple-pie` url, `template('header.html')` will look
up in the order below:

```
./templates/ko/recipe/pie/apple-pie/header.html
./templates/ko/recipe/pie/header.html
./templates/ko/recipe/header.html
./templates/ko/header.html
./templates/header.html
```

Still, the template can use a parent template based on hierarchy using
`parent()` function.

- Some of utility functions are provided. We can add more functions in
  `./src/template/utils.js` file.
- `ext: array` in frontmatter allows to insert any extensions in
  `./templates/_ext/`.
- Reusable components can be defined in `./config/components.js`. These
  components will replace any `<!-- @template <key> -->` strings in the content.

## local

`dev` script will provide watch via [chokidar-cli][1] and [serve][2] for local dev.

```bash
$ npm run dev
```

Alternatively, create a self-signed ssl key and then use serve.
```bash
$ openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 3650 -nodes \
        -subj "/C=XX/ST=StateName/L=CityName/O=CompanyName/OU=CompanySectionName/CN=CommonNameOrHostname"
$ npx serve --ssl-cert cert.pem --ssl-key key.pem -l 443 public
```

[1]: https://github.com/open-cli-tools/chokidar-cli
[2]: https://github.com/vercel/serve
