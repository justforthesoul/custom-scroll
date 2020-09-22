import initPolyfill from './polyfill/polyfill';
import initSvgxuse from './polyfill/svgxuse';
import ieFooterNailing from './utils/ie-footer-nailing';
import initModals from './modules/init-modals';
import initCustomScroll from './modules/init-custom-scroll';
import {initAnimations} from './modules/init-animations';

// Основные полифилы если требуeтся поддержка IE
initPolyfill();
// Svgxuse IE
initSvgxuse();
// Прибитие футера IE
ieFooterNailing();
// Инициализация модальных окон
initModals();
// Инициализация кастомного скрола
initCustomScroll();
// Инициализация кастомного скрола
initAnimations();
