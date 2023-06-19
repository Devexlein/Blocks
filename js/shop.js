'use strict';

const products = document.querySelectorAll('.product');

//* СЛАЙДЕР ТОВАРОВ с пагинацией
if (products) {
    products.forEach((el) => {
        let currentProduct = el;
        const imageSwitchItems = el.querySelectorAll('.image-switch__item');
        const imagePagination =
            currentProduct.querySelector('.image-pagination');

        if (imageSwitchItems.length > 1) {
            // добавляем дата-атрибуты, связываем с пагинацией
            imageSwitchItems.forEach((el, index) => {
                el.setAttribute('data-index', index);

                // добавляем пагинацию и текущий индекс
                imagePagination.innerHTML += `<li class="image-pagination__item ${
                    index == 0 ? 'image-pagination__item--active' : ''
                }" data-index="${index}"></li>`;
                // при наведении мыши удаляем класс --active у всех и добавляем текущему
                el.addEventListener('mouseenter', (e) => {
                    currentProduct
                        .querySelectorAll('.image-pagination__item')
                        .forEach((el) => {
                            el.classList.remove(
                                'image-pagination__item--active'
                            );
                        });
                    currentProduct
                        .querySelector(
                            `.image-pagination__item[data-index="${e.currentTarget.dataset.index}"]`
                        )
                        .classList.add('image-pagination__item--active');
                });

                // убираем мышь, класс --active возвращаем на первую картинку
                el.addEventListener('mouseleave', (e) => {
                    currentProduct
                        .querySelectorAll('.image-pagination__item')
                        .forEach((el) => {
                            el.classList.remove(
                                'image-pagination__item--active'
                            );
                        });
                    currentProduct
                        .querySelector(
                            `.image-pagination__item[data-index="0"]`
                        )
                        .classList.add('image-pagination__item--active');
                });
            });
        }
    });
}

//* FIXED-BLOCK, перемещающийся при прокрутке секции с карточками товаров
const fixedBlock = document.querySelector('.filter-price'),
    // (родитель) для определения нижней границы скрола для фильтров
    filters = document.querySelector('.filters'),
    gutter = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--gutter')
    ),
    // для расчета left-позиции fixedBlock
    container = document.querySelector('.products__container'),
    offsetLeft = container.offsetLeft + gutter,
    filtersOffsetTop = filters.offsetTop,
    // ширина блока с фильтрами
    filtersWidth = filters.offsetWidth,
    // верхний отступ блока с фильтрами
    smallOffset = gutter;

// функция движения fixedBlock
const fixedScrollBlock = () => {
    // получаем скрол (от верхней границы окна)
    let scrollDistance = window.scrollY;

    // условие: скрол в зоне карточек товаров
    if (
        scrollDistance > filtersOffsetTop - smallOffset &&
        scrollDistance <= filters.offsetHeight + filtersOffsetTop
    ) {
        fixedBlock.style.left = `${offsetLeft}px`;
        fixedBlock.style.width = `${filtersWidth}px`;
        fixedBlock.classList.remove('_absolute');
        fixedBlock.classList.add('_fixed');
    } else {
        fixedBlock.style.left = `0px`;
        fixedBlock.style.width = `100%`;
        fixedBlock.classList.remove('_fixed');
    }

    // при достижении конца блока карточек, возвращаем абсолют фильтрам
    if (
        scrollDistance >=
        filtersOffsetTop -
            smallOffset +
            filters.offsetHeight -
            fixedBlock.offsetHeight
    ) {
        fixedBlock.classList.add('_absolute');
        fixedBlock.style.left = `0px`;
        fixedBlock.style.width = `100%`;
        fixedBlock.classList.remove('_fixed');
    }
};

// обработчик скрола (вызов функции движения fixedBlock при старте страницы и скроле)
window.addEventListener('scroll', fixedScrollBlock);
