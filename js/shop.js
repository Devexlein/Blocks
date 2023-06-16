'use strict';

const products = document.querySelectorAll('.product');

if (products) {
    //* слайдер изображений товара с пагинацией
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
