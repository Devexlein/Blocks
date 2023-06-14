'use strict';

//* Menu-mobile
(() => {
    const menuButton = document.querySelector('.menu__button');
    const menuList = document.querySelector('.menu__list');

    menuButton.addEventListener('click', () => {
        let expanded = 'true' === menuButton.getAttribute('aria-expanded');
        menuButton.setAttribute('aria-expanded', !expanded),
            expanded
                ? menuButton.setAttribute('aria-label', 'Открыть меню')
                : menuButton.setAttribute('aria-label', 'Закрыть меню'),
            menuButton.classList.toggle('menu__button--open'),
            menuList.classList.toggle('menu__list--open');
    });
})();
