function main() {
    // --- CÓDIGO DEL MENÚ (Sin cambios) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => { nav.classList.toggle('is-open'); menuToggle.classList.toggle('is-open'); });
    }
    if (nav) {
        nav.querySelectorAll('a:not(.submenu-parent > a)').forEach(link => { link.addEventListener('click', () => { nav.classList.remove('is-open'); if (menuToggle) { menuToggle.classList.remove('is-open'); } }); });
    }
    const submenuParents = document.querySelectorAll('.submenu-parent > a');
    submenuParents.forEach(parent => { parent.addEventListener('click', (e) => { e.preventDefault(); parent.parentElement.classList.toggle('is-open'); }); });
    document.addEventListener('click', (e) => {
        const isMenuOpen = nav && nav.classList.contains('is-open');
        const clickedInsideNav = nav && nav.contains(e.target);
        const clickedOnToggle = menuToggle && menuToggle.contains(e.target);
        if (isMenuOpen && !clickedInsideNav && !clickedOnToggle) {
            nav.classList.remove('is-open');
            if (menuToggle) {
                menuToggle.classList.remove('is-open');
            }
        }
    });


    /* ==============================================
     ETAPA 4.2: LÓGICA DE AUTENTICACIÓN (MODIFICADA)
    ============================================== */

    // --- Elementos del DOM (Autenticación) ---
    const authLinks = document.getElementById('auth-links');
    const showLoginBtn = document.getElementById('show-login-btn');
    const showRegisterBtn = document.getElementById('show-register-btn');

    const userStatusDiv = document.getElementById('user-status');
    const userEmailSpan = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');

    // Modales
    const authModal = document.getElementById('auth-modal');
    const authModalCloseBtn = document.getElementById('auth-modal-close-btn');
    const paymentModal = document.getElementById('payment-modal');
    const paymentModalCloseBtn = document.getElementById('payment-modal-close-btn');
    const backdrop = document.getElementById('modal-backdrop'); // <-- FONDO GRIS

    // Formularios de Autenticación
    const authStepLogin = document.getElementById('auth-step-login');
    const loginForm = document.getElementById('login-form');
    const googleLoginBtn = document.getElementById('google-login-btn'); // <-- Botón Google Login
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');

    const authStepRegister = document.getElementById('auth-step-register');
    const registerForm = document.getElementById('register-form');
    const googleRegisterBtn = document.getElementById('google-register-btn'); // <-- Botón Google Register
    const registerEmailInput = document.getElementById('register-email');
    const registerPasswordInput = document.getElementById('register-password');
    const registerError = document.getElementById('register-error');


    // --- Elementos del DOM (Carrito y Pago) ---
    let cart = [];
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartCounter = document.getElementById('cart-counter');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalElement = document.getElementById('cart-total-price');
    const cartEmptyMsg = document.getElementById('cart-empty-msg');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartCheckoutError = document.getElementById('cart-checkout-error');

    // Formulario de Pago
    const paymentForm = document.getElementById('payment-form');
    const paymentInstructions = document.getElementById('payment-instructions');
    const paymentEmailInput = document.getElementById('email');
    const successMessage = document.getElementById('success-message');
    const cardError = document.getElementById('card-error');

    // --- Funciones de Modales (Generales) ---
    function openModal(modal) { if(modal) { modal.classList.add('is-open'); backdrop.classList.add('is-open'); } }
    function closeModal(modal) { if(modal) { modal.classList.remove('is-open'); backdrop.classList.remove('is-open'); } }

    function closeAllModals() {
        closeModal(cartSidebar);
        closeModal(authModal);
        closeModal(paymentModal);
    }

    function showAuthStep(stepToShow) {
        if (stepToShow === 'login') {
            if(authStepLogin) authStepLogin.style.display = 'block';
            if(authStepRegister) authStepRegister.style.display = 'none';
        } else {
            if(authStepLogin) authStepLogin.style.display = 'none';
            if(authStepRegister) authStepRegister.style.display = 'block';
        }
    }

    // --- Eventos de Cierre de Modales ---
    if(cartCloseBtn) cartCloseBtn.addEventListener('click', () => closeModal(cartSidebar));
    if(authModalCloseBtn) authModalCloseBtn.addEventListener('click', () => closeModal(authModal));
    if(paymentModalCloseBtn) paymentModalCloseBtn.addEventListener('click', () => closeModal(paymentModal));

    if(backdrop) backdrop.addEventListener('click', closeAllModals);

    // --- Listeners para botones del Header ---
    if(showLoginBtn) showLoginBtn.addEventListener('click', () => {
        showAuthStep('login');
        openModal(authModal);
    });

    if(showRegisterBtn) showRegisterBtn.addEventListener('click', () => {
        showAuthStep('register');
        openModal(authModal);
    });

    /* ==============================================
     ETAPA 4.3: LÓGICA DE CARRITO Y PAGO
    ============================================== */

    if(cartToggleBtn) cartToggleBtn.addEventListener('click', () => openModal(cartSidebar));

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.producto');
            const product = {
                id: productCard.dataset.id,
                nombre: productCard.dataset.nombre,
                precio: parseFloat(productCard.dataset.precio),
                cartId: Date.now() + Math.random()
            };
            cart.push(product);
            updateCartUI();
            openModal(cartSidebar);
        });
    });

    function updateCartUI() {
        if(cartCheckoutError) cartCheckoutError.style.display = 'none';
        if(cartItemsContainer) cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            if(cartItemsContainer && cartEmptyMsg) cartItemsContainer.appendChild(cartEmptyMsg.cloneNode(true));
            if(cartTotalElement) cartTotalElement.textContent = '0.00';
            if(cartCounter) {
                cartCounter.textContent = '0';
                cartCounter.style.display = 'none';
            }
        } else {
            let total = 0;
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <span>${item.nombre} ($${item.precio.toFixed(2)})</span>
                    <button class="cart-item-remove-btn" data-cart-id="${item.cartId}">&times;</button>
                `;
                if(cartItemsContainer) cartItemsContainer.appendChild(cartItem);
                total += item.precio;
            });
            if(cartTotalElement) cartTotalElement.textContent = total.toFixed(2);
            if(cartCounter) {
                cartCounter.textContent = cart.length;
                cartCounter.style.display = 'block';
            }
        }
    }

    if(cartItemsContainer) cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('cart-item-remove-btn')) {
            const idToRemove = parseFloat(e.target.dataset.cartId);
            cart = cart.filter(item => item.cartId !== idToRemove);
            updateCartUI();
        }
    });

    if(checkoutBtn) checkoutBtn.addEventListener('click', () => {
        if(cartCheckoutError) cartCheckoutError.style.display = 'none';
        if (cart.length === 0) {
            if(cartCheckoutError) cartCheckoutError.style.display = 'block';
            return;
        }

        closeModal(cartSidebar);
        showAuthStep('login');
        openModal(authModal);
    });

    if(paymentForm) paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        const cardInput = document.getElementById('card');
        const cardNumber = cardInput.value.replace(/\s/g, '');
        if(cardError) cardError.style.display = 'none';

        if (cardNumber.length !== 16 || isNaN(cardNumber)) {
            if(cardError) cardError.style.display = 'block';
            return;
        }

        if(paymentInstructions) paymentInstructions.style.display = 'none';
        if(paymentForm) paymentForm.style.display = 'none';
        if(successMessage) successMessage.style.display = 'block';

        setTimeout(() => {
            if(successMessage) successMessage.style.display = 'none';
            if(paymentInstructions) paymentInstructions.style.display = 'block';
            if(paymentForm) {
                paymentForm.style.display = 'block';
                paymentForm.reset();
            }
            cart = [];
            updateCartUI();

            closeModal(paymentModal);

            window.scrollTo(0, 0);
        }, 3000);
    });

    updateCartUI();
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', main);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = main;
}