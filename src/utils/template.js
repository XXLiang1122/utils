export function insertConfig (cof) {
  config = cof
  return tpl()
}

let config = {}

const tpl = () =>
`<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1,user-scalable=no">
      <title>${config.title || '标题'}</title>
      <style>
        html {
          font-size: calc(100vw/3.75);
          -webkit-text-size-adjust: 100%;
        }
        body {
          width: 100%;
          margin: 0;
          overflow: auto;
        }
        img {
          position: relative;
          z-index: -1;
          display: block;
          width: 100%;
        }
        .btn {
          position: absolute;
        }
        .fixed-btn {
          position: fixed;
        }
      </style>
    </head>
    <body>
    <img src="${config.image}">
    ${btn()}
    ${fixedBtn()}
    </body>
    </html>`

const btn = () => {
  let tpl = ''
  config.btn.forEach(item => {
    tpl += `<a href="${item.link}"><div class="btn" style="width: ${item.width}; height: ${item.height}; top: ${item.top}; left: ${item.left}; display: ${item.width ? 'block' : 'none'}"></div></a>`
  })
  return tpl
}

const fixedBtn = () => {
  let tpl = ''
  config.fixedbtn.forEach(item => {
    tpl += `<a href="${item.link}"><div class="fixed-btn" style="width: ${item.width}; height: ${item.height}; top: ${item.top}; left: ${item.left}; display: ${item.width ? 'block' : 'none'}"></div></a>`
  })
  return tpl
}

const fixable =
`<script>
  (function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
  })(document, window);
</script>`
