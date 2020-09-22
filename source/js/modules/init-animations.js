const transitionBlockVertical = document.querySelectorAll('[data-animate-block="vertical"]');
const transitionBlockHorizontal = document.querySelectorAll('[data-animate-block="horizontal"]');
const ANIMATE_SHIFT = 100;
let elWidth;
let elLeft;
let windowWidth;
let elTop;
let windowHeight;

const trackingTransitionBlock = () => {
  document.activeElement.blur();
  if (transitionBlockVertical.length) {
    transitionBlockVertical.forEach((el) => {
      launchVerticalAnimation(el);
    });
  }
  if (transitionBlockHorizontal.length) {
    transitionBlockHorizontal.forEach((el) => {
      launchHorizontalAnimation(el);
    });
  }
};

const launchVerticalAnimation = (el) => {
  const transitionDelay = el.dataset.transitionGroupDelay;
  if (transitionDelay) {
    setTimeout(() => {
      animateVerticalGroup(el);
    }, transitionDelay);
  } else {
    animateVerticalGroup(el);
  }
};

const launchHorizontalAnimation = (el) => {
  const transitionDelay = el.dataset.transitionGroupDelay;
  if (transitionDelay) {
    setTimeout(() => {
      animateHorizontalGroup(el);
    }, transitionDelay);
  } else {
    animateHorizontalGroup(el);
  }
};

const renurnAnimatePointVertical = (el) => {
  elTop = el.getBoundingClientRect().top;
  windowHeight = window.innerHeight;
  return windowHeight - elTop - ANIMATE_SHIFT;
};

const renurnAnimatePointHorizontal = (el) => {
  windowWidth = window.innerWidth;
  elWidth = el.getBoundingClientRect().width;
  elLeft = el.getBoundingClientRect().x;
  return windowWidth - elWidth / 2 - elLeft;
};

const startElAnimation = (el, i) => {
  if (!el.classList.contains('visible')) {
    setTimeout(() => {
      el.classList.add('visible');
    }, 100 * i);
  }
};

const animateVerticalGroup = (group) => {
  const transitionGroup = group.querySelectorAll('[data-animate-group]');
  transitionGroup.forEach((el) => {
    if (renurnAnimatePointVertical(el) > 0) {
      const transitionEl = el.querySelectorAll('[data-animate-child]');
      transitionEl.forEach((child, i) => {
        startElAnimation(child, i);
      });
    }
  });
};

const animateHorizontalGroup = (group) => {
  const transitionGroup = group.querySelectorAll('[data-animate-group]');
  transitionGroup.forEach((el, i) => {
    if (i === 0) {
      const transitionEl = el.querySelectorAll('[data-animate-child]');
      if (renurnAnimatePointVertical(el) > 0) {
        transitionEl.forEach((child, i) => {
          startElAnimation(child, i);
        });
      }
    } else {
      const transitionEl = el.querySelectorAll('[data-animate-child]');
      if (renurnAnimatePointHorizontal(el) > 0) {
        transitionEl.forEach((child, i) => {
          startElAnimation(child, i);
        });
      }
    }
  });
};

const initAnimations = () => {
  trackingTransitionBlock();
  window.addEventListener('scroll', trackingTransitionBlock);
};

export {initAnimations, trackingTransitionBlock};
