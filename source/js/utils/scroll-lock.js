const body = document.querySelector('body');

// eslint-disable-next-line consistent-return
const getScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth;
};

const getBodyScrollTop = () => {
  return (
    self.pageYOffset ||
    (document.documentElement && document.documentElement.ScrollTop) ||
    (document.body && document.body.scrollTop)
  );
};

const disableScrolling = (noScrollbar) => {
  if (!noScrollbar) {
    const scrollWidth = getScrollbarWidth();
    body.setAttribute('style', `padding-right: ${scrollWidth}px;`);
  }
  if (!window.MSStream && !/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    body.classList.add('scroll-lock');
  } else {
    setTimeout(() => {
      body.classList.add('scroll-lock-ios');
      body.dataset.scrollY = `${getBodyScrollTop()}`;
      body.style.top = `-${document.body.dataset.scrollY}px`;
    }, 600);
  }
};

const enableScrolling = () => {
  if (!window.MSStream && !/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    body.classList.remove('scroll-lock');
  } else {
    body.removeAttribute(`style`);
    body.classList.remove('scroll-lock-ios');
    window.scrollTo(0, +document.body.dataset.scrollY);
  }
};

export {disableScrolling, enableScrolling};
