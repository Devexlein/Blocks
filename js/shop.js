'use strict';

const products = document.querySelectorAll('.product');
const productsBtn = document.querySelectorAll('.product__btn');
const cartProductsList = document.querySelector('.cart-content__list');
const cart = document.querySelector('.cart');
const cartQuantity = document.querySelector('.cart__quantity');
const fullPrice = document.querySelector('.fullprice');
let price = 0;

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
    // получаем числовое значение переменной
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
        // ограничиваем ширину блока с фильтрами
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

//* Добавление товара в корзину
// рандомный ID для идентификации товара в корзине (будет нужен для удаления из корзины)
const randomId = () => {
    return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
};

// удаление пробелов и символов из стоимости товара
const priceWithoutSpaces = (str) => {
    return str.replace(/\s/g, '');
};

// возврат пробелов в стоимость товара (отделяем тысячи)
const normalPrice = (str) => {
    return String(str).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
};

// суммирование суммы стоимости товара
const plusFullPrice = (currentPrice) => {
    return (price += currentPrice);
};

// уменьшает общую сумму стоимости товара
const minusFullPrice = (currentPrice) => {
    return (price -= currentPrice);
};

// выводит общую сумму стоимости товара
const printFullPrice = () => {
    fullPrice.textContent = `${normalPrice(price)} ₽`;
};

// выводит количество товара (при исп-ии simplebar ищем генерируемый им контейнер - вместо текущего родителя в разметке)
const printQuantity = () => {
    let length =
        cartProductsList.querySelector('.simplebar-content').children.length;
    cartQuantity.textContent = length;
    // при наличии содержимого добавляем класс, иначе удаляем
    length > 0 ? cart.classList.add('active') : cart.classList.remove('active');
};

// генерирует разметку внутреннего содержимого корзины
const generateCartProduct = (img, title, price, id) => {
    return ` 

    <li class="cart-content__item">
        <article class="cart-content__product cart-product" data-id="${id}">
            <img class="cart-product__image" src="${img}"/>
            <div class="cart-product__text">
                <h3 class="cart-product__title">
                    ${title}
                </h3>
                <span class="cart-product__price">${normalPrice(price)} ₽</span>
            </div>
            <button class="cart-product__delete" aria-label="Удалить товар из корзины"></button>
        </article>
    </li>

    `;
};

// удаляет товар из корзины
const deleteProduct = (productParent) => {
    // id товара, по которому был клик
    let id = productParent.querySelector('.cart-product').dataset.id;
    // снимаем блокировку с кнопки товара
    document
        .querySelector(`.product[data-id="${id}"]`)
        .querySelector('.product__btn').disabled = false;

    // числовое значение стоимости товара
    let currentPrice = parseInt(
        priceWithoutSpaces(
            productParent.querySelector('.cart-product__price').textContent
        )
    );
    // пересчитываем общую стоимость товара (без учета удаляемого)
    minusFullPrice(currentPrice);
    // выводим общую стоимость товара (без учета удаляемого)
    printFullPrice();
    // удаляем данные товара из корзины
    productParent.remove();
    // обновляем количество товаров в корзине
    printQuantity();
};

productsBtn.forEach((el) => {
    // находим родителя кнопки (карточка товара) и устанавливаем data-id
    el.closest('.product').setAttribute('data-id', randomId());
    // при клике на кнопку
    el.addEventListener('click', (e) => {
        // текущий элемент (кнопка), по которому был клик
        let self = e.currentTarget;
        // карточка товара, по которому был клик
        let parent = self.closest('.product');
        // набор данных из карточки товара для формирования строки в корзине
        let id = parent.dataset.id;
        let img = parent
            .querySelector('.image-switch__img img')
            .getAttribute('src');
        let title = parent.querySelector('.product__title').textContent;
        // числовое значение стоимости товара
        let priceNumber = parseInt(
            priceWithoutSpaces(
                parent.querySelector('.product-price__current').textContent
            )
        );
        // формируем ообщую сумму стоимости товара в корзине
        plusFullPrice(priceNumber);
        // выводим общую сумму
        printFullPrice();
        // добавляем данные товара в корзину
        cartProductsList
            .querySelector('.simplebar-content')
            .insertAdjacentHTML(
                'afterbegin',
                generateCartProduct(img, title, priceNumber, id)
            );
        // после добавления товара, считаем и выводим количество товаров в корзине
        printQuantity();
        // блокируем кнопку добавленного товара
        self.disabled = true;
    });
});

// удаляем товар из корзины (т.к. товар добавляется динамически, слушаем единственный статичный контейнер)
cartProductsList.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-product__delete')) {
        // удаляем динамически добавленный <li> с товаром
        deleteProduct(e.target.closest('.cart-content__item'));
    }
});
