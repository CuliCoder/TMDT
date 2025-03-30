document.addEventListener('DOMContentLoaded', function() {
    // Find all quantity inputs
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const decreaseButtons = document.querySelectorAll('.decrease');
    const increaseButtons = document.querySelectorAll('.increase');
    const removeButtons = document.querySelectorAll('.remove-btn');
    const cartContent = document.getElementById('cart-content');
    const emptyCart = document.getElementById('empty-cart');
    const cartItems = document.querySelectorAll('.cart-item');
    
    // Check if cart is empty
    function checkCartEmpty() {
        const cartItems = document.querySelectorAll('.cart-item');
        if (cartItems.length === 0) {
            cartContent.style.display = 'none';
            emptyCart.style.display = 'block';
        } else {
            cartContent.style.display = 'flex';
            emptyCart.style.display = 'none';
        }
    }
    
    // Update total based on quantity and price
    function updateTotal(input) {
        const cartItem = input.closest('.cart-item');
        const quantity = parseInt(input.value);
        const priceText = cartItem.querySelector('.price').textContent;
        const price = parseInt(priceText.replace(/[^\d]/g, ''));
        
        // Calculate new total
        const totalPrice = quantity * price;
        // Format as Vietnamese currency
        const formattedTotal = totalPrice.toLocaleString('vi-VN') + '₫';
        
        // Update total price
        cartItem.querySelector('.total-price').textContent = formattedTotal;
        
        // Update cart summary
        updateCartSummary();
    }
    
    // Update cart summary
    function updateCartSummary() {
        const totalPrices = Array.from(document.querySelectorAll('.total-price'))
            .map(el => parseInt(el.textContent.replace(/[^\d]/g, '')));
        
        // Calculate subtotal
        const subtotal = totalPrices.reduce((sum, price) => sum + price, 0);
        
        // Discount
        const discount = 3000000; // Fixed discount of 3,000,000₫
        
        // Calculate total
        const total = subtotal - discount;
        
        // Update summary values
        document.querySelector('.summary-row:nth-child(2) span:last-child').textContent = 
            subtotal.toLocaleString('vi-VN') + '₫';
        document.querySelector('.summary-row:nth-child(3) span:last-child').textContent = 
            '-' + discount.toLocaleString('vi-VN') + '₫';
        document.querySelector('.cart-total').textContent = 
            total.toLocaleString('vi-VN') + '₫';
    }
    
    // Set up event handlers for quantity controls
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Ensure the quantity is within bounds
            const value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
            
            updateTotal(this);
        });
    });
    
    // Decrease button handler
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (value > 1) {
                input.value = --value;
                updateTotal(input);
            }
        });
    });
    
    // Increase button handler
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
            
            if (value < 10) {
                input.value = ++value;
                updateTotal(input);
            }
        });
    });
    
    // Remove button handler
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                const cartItem = this.closest('.cart-item');
                cartItem.remove();
                updateCartSummary();
                checkCartEmpty();
            }
        });
    });
    
    // Initialize cart summary
    updateCartSummary();
    
    // Handle checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            alert('Cảm ơn bạn đã mua hàng! Tính năng thanh toán sẽ sớm được triển khai.');
        });
    }
    
    // Apply promo code button
    const applyPromoButton = document.querySelector('.discount-input button');
    if (applyPromoButton) {
        applyPromoButton.addEventListener('click', function() {
            const promoInput = document.querySelector('.discount-input input');
            if (promoInput.value.trim() === '') {
                alert('Vui lòng nhập mã giảm giá');
            } else {
                alert('Mã giảm giá không hợp lệ hoặc đã hết hạn');
                promoInput.value = '';
            }
        });
    }
});