const initPolyfill = () => {
  // Source: https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
      thisArg = thisArg || window;
      for (let i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    };
  }

  // Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function(s) {
        const matches = (this.document || this.ownerDocument).querySelectorAll(s);
        let i = matches.length;
        // eslint-disable-next-line no-empty
        while (--i >= 0 && matches.item(i) !== this) {}
        return i > -1;
      };
  }

  // Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      let el = this;

      do {
        if (el.matches(s)) {
          return el;
        }
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  // Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
  (function(arr) {
    arr.forEach(function(item) {
      if (item.hasOwnProperty('prepend')) {
        return;
      }
      Object.defineProperty(item, 'prepend', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function prepend() {
          // eslint-disable-next-line prefer-rest-params
          const argArr = Array.prototype.slice.call(arguments);
          const docFrag = document.createDocumentFragment();

          argArr.forEach(function(argItem) {
            const isNode = argItem instanceof Node;
            docFrag.appendChild(
              isNode ? argItem : document.createTextNode(String(argItem))
            );
          });

          this.insertBefore(docFrag, this.firstChild);
        },
      });
    });
  })([Element.prototype, Document.prototype, DocumentFragment.prototype]);

  // Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/append()/append().md
  (function(arr) {
    arr.forEach(function(item) {
      if (item.hasOwnProperty('append')) {
        return;
      }
      Object.defineProperty(item, 'append', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function append() {
          // eslint-disable-next-line prefer-rest-params
          const argArr = Array.prototype.slice.call(arguments);
          const docFrag = document.createDocumentFragment();

          argArr.forEach(function(argItem) {
            const isNode = argItem instanceof Node;
            docFrag.appendChild(
              isNode ? argItem : document.createTextNode(String(argItem))
            );
          });

          this.appendChild(docFrag);
        },
      });
    });
  })([Element.prototype, Document.prototype, DocumentFragment.prototype]);

  // Source: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/before()/before().md
  (function(arr) {
    arr.forEach(function(item) {
      if (item.hasOwnProperty('before')) {
        return;
      }
      Object.defineProperty(item, 'before', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function before() {
          // eslint-disable-next-line prefer-rest-params
          const argArr = Array.prototype.slice.call(arguments);
          const docFrag = document.createDocumentFragment();

          argArr.forEach(function(argItem) {
            const isNode = argItem instanceof Node;
            docFrag.appendChild(
              isNode ? argItem : document.createTextNode(String(argItem))
            );
          });

          this.parentNode.insertBefore(docFrag, this);
        },
      });
    });
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

  // Source: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
  (function(arr) {
    arr.forEach(function(item) {
      if (item.hasOwnProperty('remove')) {
        return;
      }
      Object.defineProperty(item, 'remove', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: function remove() {
          if (this.parentNode !== null) {
            this.parentNode.removeChild(this);
          }
        },
      });
    });
  })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

  // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith

  if (!String.prototype.startsWith) {
    // eslint-disable-next-line no-extend-native
    Object.defineProperty(String.prototype, 'startsWith', {
      value(search, rawPos) {
        const pos = rawPos > 0 ? rawPos | 0 : 0;
        return this.substring(pos, pos + search.length) === search;
      },
    });
  }

  // Source: ie11Download

  const ie11Download = (el) => {
    if (el.href === '') {
      throw Error('The element has no href value.');
    }

    let filename = el.getAttribute('download');
    if (filename === null || filename === '') {
      const tmp = el.href.split('/');
      filename = tmp[tmp.length - 1];
    }

    el.addEventListener('click', (evt) => {
      evt.preventDefault();
      const xhr = new XMLHttpRequest();
      xhr.onloadstart = () => {
        xhr.responseType = 'blob';
      };
      xhr.onload = () => {
        navigator.msSaveOrOpenBlob(xhr.response, filename);
      };
      xhr.open('GET', el.href, true);
      xhr.send();
    });
  };

  if (window.navigator.msSaveBlob) {
    const downloadLinks = document.querySelectorAll('a[download]');
    if (downloadLinks.length) {
      downloadLinks.forEach((el) => {
        ie11Download(el);
      });
    }
  }
};

export default initPolyfill;
