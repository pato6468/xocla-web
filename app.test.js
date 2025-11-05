const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');

describe('Funcionalidades de la Tienda', () => {

  beforeEach(() => {
    const dom = new JSDOM(html, { runScripts: 'dangerously' });
    global.window = dom.window;
    global.document = dom.window.document;

    const main = require('./app');
    main();
  });

  afterEach(() => {
    delete require.cache[require.resolve('./app')];
    delete global.window;
    delete global.document;
  });

  describe('Funcionalidad del Carrito de Compras', () => {
    test('debería agregar un producto al carrito', () => {
      const addToCartButton = document.querySelector('.add-to-cart-btn');
      addToCartButton.click();

      const cartCounter = document.getElementById('cart-counter');
      const cartTotalPrice = document.getElementById('cart-total-price');
      const cartItemsContainer = document.getElementById('cart-items-container');
      const cartItem = cartItemsContainer.querySelector('.cart-item');

      expect(cartCounter.textContent).toBe('1');
      expect(cartTotalPrice.textContent).toBe('120.00');
      expect(cartItem).not.toBeNull();
      expect(cartItem.textContent).toContain('Aceite de Cempasúchil');
    });

    test('debería eliminar un producto del carrito', () => {
      const addToCartButton = document.querySelector('.add-to-cart-btn');
      addToCartButton.click();

      let cartCounter = document.getElementById('cart-counter');
      expect(cartCounter.textContent).toBe('1');

      const removeButton = document.querySelector('.cart-item-remove-btn');
      removeButton.click();

      cartCounter = document.getElementById('cart-counter');
      const cartTotalPrice = document.getElementById('cart-total-price');

      expect(cartCounter.textContent).toBe('0');
      expect(cartTotalPrice.textContent).toBe('0.00');
    });

    test('debería mostrar un mensaje de carrito vacío inicialmente', () => {
        const cartItemsContainer = document.getElementById('cart-items-container');
        expect(cartItemsContainer.textContent).toContain('Tu carrito está vacío');
    });

    test('debería actualizar el total correctamente con varios productos', () => {
      const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
      addToCartButtons[0].click(); // 120
      addToCartButtons[1].click(); // 100

      const cartTotalPrice = document.getElementById('cart-total-price');
      expect(cartTotalPrice.textContent).toBe('220.00');
    });
  });

  describe('Validación de Pagos', () => {
    beforeEach(() => {
      // Añadir un artículo al carrito para habilitar el checkout
      const addToCartButton = document.querySelector('.add-to-cart-btn');
      addToCartButton.click();

      const checkoutBtn = document.getElementById('checkout-btn');
      checkoutBtn.click();
    });

    test('debería mostrar un error con un número de tarjeta inválido', () => {
      const cardInput = document.getElementById('card');
      cardInput.value = '1234';

      const paymentForm = document.getElementById('payment-form');
      paymentForm.dispatchEvent(new window.Event('submit', { bubbles: true }));

      const cardError = document.getElementById('card-error');
      expect(cardError.style.display).toBe('block');
    });

    test('debería procesar el pago con un número de tarjeta válido', () => {
      const cardInput = document.getElementById('card');
      cardInput.value = '1234567812345678';

      const paymentForm = document.getElementById('payment-form');
      paymentForm.dispatchEvent(new window.Event('submit', { bubbles: true }));

      const successMessage = document.getElementById('success-message');
      expect(successMessage.style.display).toBe('block');
    });
  });

});