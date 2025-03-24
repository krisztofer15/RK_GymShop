// Termék hozzáadása a kosárhoz
export async function addToCart(userId: string, productId: string, quantity: number) {
    try {
        const response = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, product_id: productId, quantity }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to add item to cart: ${errorData.message}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Kosár elemek lekérése az adott user alapján
export async function getCartItems(userId: string) {
    try {
        const response = await fetch(`/api/cart?user_id=${userId}`);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to fetch cart items: ${errorData.message}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Kosár elem eltávolítása
export async function removeCartItem(cartItemId: string) {
    try {
        const response = await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart_item_id: cartItemId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to remove item from cart: ${errorData.message}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Kosár elem mennyiségének frissítése
export async function updateCartItem(cartItemId: string, quantity: number) {
    try {
        const response = await fetch('/api/cart/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart_item_id: cartItemId, quantity }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to update item quantity: ${errorData.message}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        throw error;
    }
}