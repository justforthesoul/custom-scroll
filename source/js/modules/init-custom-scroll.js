import {trackingTransitionBlock} from './init-animations';

const scrollContainer = document.querySelector('.scroll-container');
const scrollTranslator = document.querySelector('.scroll-translator');
const scroller = document.querySelector('.scroller');
const horizontalScrollBlock = document.querySelector('.horizontal-scroll');
const horizontalScrollWrapper = document.querySelector('.horizontal-scroll__content');
const horizontalScrollItems = document.querySelectorAll('.horizontal-scroll__item');
const horizontalScrollTitle = document.querySelector('.horizontal-scroll__title');
const horizontalScrollImgs = document.querySelectorAll('.horizontal-scroll__item-img');
const allActiveElement = document.querySelectorAll('input, checkbox, a, button, textarea, radio, select, option');
let horizontalTop;
let horizontalScrollWidth;
let horizontalScrollBlockOffset;
let horizontalScrollTitleWidth;
let horizontalScrollImgOffset;
let horizontalScrollImgWidth;
let current = 0;
let coefficient;
let activeElement;
let activeShift;

const easeOutQuad = (a, b, t) => {
  return (1 - t) * a + t * b;
};

const animate = () => {
  const i = easeOutQuad(current, window.pageYOffset, 0.08);
  current = Math.floor(i * 100) / 100;
  if (horizontalScrollBlock) {
    setHorizontalScroll(current);
    animateHorizontalImgs();
  } else {
    setStandartScroll(current);
  }
  window.requestAnimationFrame(animate);
};

const setStandartScroll = (current) => {
  scrollTranslator.style.transform = 'translate3d(0,' + -current + 'px, 0)';
};

const setHorizontalScroll = (current) => {
  setStandartScroll(current);
  if (current - horizontalTop >= horizontalScrollWidth) {
    scrollTranslator.style.transform = 'translate3d(0,' + -(current - horizontalScrollWidth) + 'px, 0)';
  } else if (current >= horizontalTop) {
    horizontalScrollWrapper.style.transform = 'translate3d(' + (-current + horizontalTop) + 'px, 0, 0)';
    horizontalScrollTitle.style.transform =
      'translate3d(' +
      (-current + horizontalTop) / ((horizontalScrollWidth / horizontalScrollTitleWidth) * 2) +
      'px, 0, 0)';
    scrollTranslator.style.transform = 'translate3d(0,' + -horizontalTop + 'px, 0)';
  } else {
    horizontalScrollWrapper.style.transform = 'translate3d(0, 0, 0)';
  }
};

const returnHorizontalScrollWidth = (arr) => {
  let width = 0;
  arr.forEach((el, index) => {
    if (index === arr.length - 1) {
      return;
    }
    const margin = Number(window.getComputedStyle(el, null).getPropertyValue('margin-right').split('px')[0]);
    if (margin) {
      width += el.getBoundingClientRect().width + margin;
    } else {
      width += el.getBoundingClientRect().width;
    }
  });
  return width;
};

const setScrollerHeight = () => {
  scroller.style.height = scrollTranslator.scrollHeight + 'px';
  if (horizontalScrollBlock) {
    horizontalScrollWidth = returnHorizontalScrollWidth(horizontalScrollItems);
    horizontalScrollTitleWidth = horizontalScrollTitle.getBoundingClientRect().width;
    horizontalTop = horizontalScrollBlock.offsetTop;
    scroller.style.height = scrollTranslator.scrollHeight + returnHorizontalScrollWidth(horizontalScrollItems) + 'px';
  }
};

const animateHorizontalImgs = () => {
  horizontalScrollImgs.forEach((el, i) => {
    horizontalScrollImgOffset = el.getBoundingClientRect().x;
    horizontalScrollImgWidth = el.getBoundingClientRect().width;
    if (horizontalScrollImgOffset < (horizontalScrollImgWidth / 2)) {
      coefficient = (horizontalScrollImgOffset + horizontalScrollImgWidth) / horizontalScrollImgWidth;
      el.style.opacity = coefficient;
      el.style.filter = 'grayscale(' + (1 - coefficient) + ')';
    } else {
      el.style.opacity = 1;
      el.style.filter = 'grayscale(0)';
    }
  });
};

const returnActiveIndex = () => {
  let index;
  allActiveElement.forEach((el, i) => {
    if (el.classList.contains('active-element')) {
      el.classList.remove('active-element');
      index = i;
    }
  });
  return index;
};

const movingOnTabClick = (el) => {
  document.body.classList.add('moving');
  const parent = el.closest('.tab-area');
  activeShift = parent.getBoundingClientRect().top + window.pageYOffset;
  if (parent && parent.classList.contains('horizontal-scroll')) {
    const closestParent = el.closest('.horizontal-scroll__item');
    if (closestParent) {
      horizontalScrollBlockOffset = closestParent.getBoundingClientRect().x;
      activeShift = parent.getBoundingClientRect().top + window.pageYOffset + horizontalScrollBlockOffset;
    }
  }
  el.classList.add('active-element');
  window.scrollTo(0, activeShift);
  setTimeout(() => {
    trackingTransitionBlock();
  }, 600);
  setTimeout(() => {
    el.focus();
  }, 1200);
  setTimeout(() => {
    document.body.classList.remove('moving');
  }, 1500);
};

const tabMoving = (e) => {
  if (e.keyCode === 9 && !e.shiftKey) {
    e.preventDefault();
    if (e.target === document.body && !document.body.classList.contains('moving')) {
      activeElement = allActiveElement[0];
      movingOnTabClick(activeElement);
    } else if (!document.body.classList.contains('moving')) {
      activeElement = allActiveElement[returnActiveIndex() + 1];
      if (!activeElement) {
        activeElement = allActiveElement[0];
      }
      movingOnTabClick(activeElement);
    }
  }
  if (e.shiftKey && e.keyCode === 9) {
    e.preventDefault();
    if (e.target === document.body && !document.body.classList.contains('moving')) {
      activeElement = allActiveElement[allActiveElement.length - 1];
      movingOnTabClick(activeElement);
    } else if (!document.body.classList.contains('moving')) {
      activeElement = allActiveElement[returnActiveIndex() - 1];
      if (!activeElement) {
        activeElement = allActiveElement[allActiveElement.length - 1];
      }
      movingOnTabClick(activeElement);
    }
  }
};

const initCustomScroll = () => {
  if (scrollContainer) {
    setScrollerHeight();
    animate();
    window.addEventListener('resize', setScrollerHeight);
    window.addEventListener('keydown', tabMoving);
  }
};

export default initCustomScroll;
