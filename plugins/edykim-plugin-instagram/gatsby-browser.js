const injectInstagramScript = () => {
  function addJS(jsCode) {
    var s = document.createElement(`script`)

    s.type = `text/javascript`
    s.innerText = jsCode
    document.getElementsByTagName(`head`)[0].appendChild(s)
  }
  addJS(`
            window.instagram = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
      t = window.instagram || {};
    if (d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://www.instagram.com/embed.js";
    fjs.parentNode.insertBefore(js, fjs);
    t._e = [];
    t.ready = function(f) {
      t._e.push(f);
    };
    return t;
  }(document, "script", "instagram-wjs"));
  `)
}

let injectedInstagramScript = false
exports.onRouteUpdate = function({ location }) {
  if (document.querySelector(`.instagram-media`) !== null) {
    if (!injectedInstagramScript) {
      injectInstagramScript()
      injectedInstagramScript = true
    }

    if (
      typeof instgrm !== `undefined` &&
      window.instgrm.widgets &&
      typeof window.instgrm.widgets.load === `function`
    ) {
      window.instgrm.widgets.load()
    }
  }
}
