(function() {
    // 1. INJETA O BOTÃO FLUTUANTE (Em todas as páginas)
    // Verifica se estamos na pasta "page products" para ajustar o link
    const cartLink = "/carrinho/carrinho.html";

    const buttonHTML = `
        <a href="${cartLink}" class="cart-float" aria-label="Abrir carrinho">
            <i class="fa-solid fa-basket-shopping"></i>
            <span class="cart-float__count" id="cartCount">0</span>
        </a>
    `;
    document.body.insertAdjacentHTML('beforeend', buttonHTML);

    // 2. LÓGICA GLOBAL
    let cart = JSON.parse(localStorage.getItem("emporioCart")) || [];
    
    const cartCountEl = document.getElementById("cartCount");
    const formatBRL = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    function saveCart() {
        localStorage.setItem("emporioCart", JSON.stringify(cart));
    }

    // Atualiza apenas a bolinha do botão flutuante
    if (cartCountEl) {
        const totalItens = cart.reduce((acc, item) => acc + item.quantidade, 0);
        cartCountEl.textContent = totalItens;
    }

    // Função que a página do produto vai chamar
    window.addToCart = function(produto) {
        const itemExistente = cart.find(item => item.nome === produto.nome && item.corte === produto.corte);
        if (itemExistente) {
            itemExistente.quantidade += produto.quantidade;
        } else {
            cart.push(produto);
        }
        saveCart();

        const count = cart.reduce((acc, cur) => acc + cur.quantidade, 0)
        document.querySelector("#cartCount").innerHTML = count

        // window.location.href = cartLink; // Redireciona para a página do carrinho
    };

    // 3. LÓGICA EXCLUSIVA DA PÁGINA CARRINHO.HTML
    const cartItemsContainer = document.getElementById("cartItemsContainer");

    console.log("YAYAAAA")

    if (cartItemsContainer) {
        const cartTotalPriceEl = document.getElementById("cartTotalPrice");
        const checkoutBtn = document.getElementById("checkoutBtn");

        function renderCartPage() {
            cartItemsContainer.innerHTML = "";
            let total = 0;

            if (cart.length === 0) {
                cartItemsContainer.innerHTML = `
                    <div class="cart-empty">
                        <p>Seu carrinho está vazio.</p>
                        <a href="index.html#catalogo" style="color:goldenrod; text-decoration:none;">Ver produtos</a>
                    </div>`;
                cartTotalPriceEl.textContent = "R$ 0,00";
                return;
            }

            cart.forEach((item, index) => {
                const subtotal = item.preco * item.quantidade;
                total += subtotal;

                const div = document.createElement("div");
                div.classList.add("cart-item");
                div.innerHTML = `
                    ${item.imagem ? `<img src="${item.imagem}" class="cart-item__img" alt="${item.nome}">` : '<div class="cart-item__img"></div>'}
                    <div class="cart-item__info">
                        <h4>${item.nome}</h4>
                        <span>${item.quantidade} un (${item.corte})</span>
                    </div>
                    <div class="cart-item__price">${formatBRL(subtotal)}</div>
                    <button class="cart-item__remove" onclick="removeFromCart(${index})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(div);
            });

            cartTotalPriceEl.textContent = formatBRL(total);
        }

        // Remove item
        window.removeFromCart = function(index) {
            cart.splice(index, 1);
            saveCart();
            renderCartPage();
            if(cartCountEl) cartCountEl.textContent = cart.reduce((acc, item) => acc + item.quantidade, 0);
        };

        // Checkout
        checkoutBtn.addEventListener("click", () => {
            console.log("CLICK")

            if (cart.length === 0) {
                alert("Seu carrinho está vazio!");
                return;
            }

            let mensagem = "Olá, Empório GE! Gostaria de fazer o seguinte pedido:%0A%0A";
            let total = 0;

            cart.forEach(item => {
                const subtotal = item.preco * item.quantidade;
                total += subtotal;
                mensagem += `*${item.nome}* (${item.corte})%0A`;
                mensagem += `Qtd: ${item.quantidade} un | Subtotal: ${formatBRL(subtotal)}%0A%0A`;
            });

            mensagem += `*TOTAL DO PEDIDO:* ${formatBRL(total)}`;
            window.open(`https://wa.me/5581986836253?text=${mensagem}`, "_blank");
        });

        // Inicia a página
        renderCartPage();
    }
})();