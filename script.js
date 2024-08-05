document.addEventListener('DOMContentLoaded', () => {
    const showMenuLink = document.getElementById('showMenu');
    const showCartLink = document.getElementById('showCart');
    const menuSection = document.getElementById('menuSection');
    const cartSection = document.getElementById('cartSection');

    showMenuLink.addEventListener('click', () => {
        menuSection.style.display = 'block';
        cartSection.style.display = 'none';
    });

    showCartLink.addEventListener('click', () => {
        menuSection.style.display = 'none';
        cartSection.style.display = 'block';
    });
});

function toggleFinalizacao() {
    const barraFinalizacao = document.getElementById('barraFinalizacao');
    if (barraFinalizacao.style.display === 'none') {
        barraFinalizacao.style.display = 'block';
    } else {
        barraFinalizacao.style.display = 'none';
    }
}

// Carrinho
document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.custom-checkbox');
    const cartSection = document.getElementById('cartSection');
    const carrinho = document.getElementById('carrinho');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const itemName = checkbox.getAttribute('data-name');
            const itemPrice = checkbox.getAttribute('data-price');
            const itemId = checkbox.getAttribute('id');
            const itemImg = checkbox.parentElement.querySelector('img').src;

            if (checkbox.checked) {
                addItemToCart(itemId, itemName, itemPrice, itemImg);
            } else {
                removeItemFromCart(itemId);
            }
        });
    });

    function addItemToCart(id, name, price, img) {
        const cartItem = document.createElement('li');
        cartItem.setAttribute('data-id', id);
        cartItem.innerHTML = `
            <div class="cartItem">
                <img src="${img}" alt="${name}" class="cartImg">
                <div class="cartItemDetails">
                    <span>${name}</span>
                    <span class="item-price">R$ ${price}</span>
                </div>
                <input type="number" value="1" min="1" class="item-quantity" data-price="${price}">
                <button class="remove-item">Remover</button>
            </div>
        `;
        cartItem.querySelector('.remove-item').addEventListener('click', () => removeItemFromCart(id));
        cartItem.querySelector('.item-quantity').addEventListener('change', updateCartTotal);
        carrinho.appendChild(cartItem);
        updateCartTotal();
    }

    function removeItemFromCart(id) {
        const cartItem = carrinho.querySelector(`li[data-id="${id}"]`);
        if (cartItem) {
            cartItem.remove();
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = false;
            }
            updateCartTotal();
        }
    }

    function updateCartTotal() {
        const totalElement = document.querySelector('#total');
        const total = [...carrinho.querySelectorAll('.item-quantity')].reduce((acc, input) => {
            return acc + (parseFloat(input.getAttribute('data-price')) * input.value);
        }, 0);

        const totalText = `Total: R$ ${total.toFixed(2)}`;
        if (totalElement) {
            totalElement.textContent = totalText;
        } else {
            const newTotalElement = document.createElement('li');
            newTotalElement.id = 'total';
            newTotalElement.textContent = totalText;
            carrinho.appendChild(newTotalElement);
        }
    }
});

function confirmarPedido() {
    const cartItems = document.querySelectorAll('#carrinho li');
    const nome = document.getElementById('nome').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const isPaymentSelected = document.querySelector('input[name="pagamento"]:checked');

    if (cartItems.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    if (!nome || !endereco) {
        alert("Por favor, preencha todas as informações do cliente.");
        return;
    }

    if (!isPaymentSelected) {
        alert("Por favor, selecione uma opção de pagamento.");
        return;
    }

    const total = calculateTotal(); // Calcular o valor total do pedido

    if (confirm("Você tem certeza que deseja confirmar o pedido?")) {
        let message = `Pedido confirmado!\n\nValor Total: R$ ${total.toFixed(2)}`;
        
        if (isPaymentSelected.value === 'Pix') {
            const chavePix = generateRandomPixKey(); // Gerar uma chave PIX aleatória
            message += `\nChave PIX: ${chavePix}`;
        }

        alert(message);
        location.reload(); // Recarregar a página
    }
}

function cancelarPedido() {
    const cartItems = document.querySelectorAll('#carrinho li');
    if (cartItems.length > 0) {
        if (confirm("Você tem certeza que deseja cancelar o pedido?")) {
            alert("Pedido cancelado!");
            location.reload(); // Recarregar a página
        }
    } else {
        alert("Seu carrinho está vazio!");
    }
}

// Função para calcular o valor total do pedido
function calculateTotal() {
    let total = 0;
    const totalElement = document.querySelector('#total');
    if (totalElement) {
        total = parseFloat(totalElement.textContent.replace('Total: R$ ', '').trim());
    }
    return total;
}

// Função para gerar uma chave PIX aleatória
function generateRandomPixKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let pixKey = '';
    for (let i = 0; i < 16; i++) {
        pixKey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return pixKey;
}
