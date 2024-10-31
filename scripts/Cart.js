const Cart = {
    data: [],
    EVENT_APPCARTCHANGE: new Event("appcartchange"),
    /**@type{(id: number) => undefined}*/
    add(id) {
        const product = app.Menu.getProductById(id);
        for (let i = 0;; i += 1) {
            if (i === Cart.data.length) {
                Cart.data.push({product, quantity: 1});
                break;
            }
            let cart = Cart.data[i];
            if (cart.product.id === id) {
                cart.quantity += 1;
                break;
            }
        }
        window.dispatchEvent(Cart.EVENT_APPCARTCHANGE);
    },
    subtract(id) {
        for (let i = 0; i < Cart.data.length; i += 1) {
            const cart = Cart.data[i];
            if (cart.product.id === id) {
                if (cart.quantity > 1) {
                    cart.quantity -= 1;
                    window.dispatchEvent(Cart.EVENT_APPCARTCHANGE);
                } else if (cart.quantity === 1) {
                    Cart.data.splice(i, 1);
                    window.dispatchEvent(Cart.EVENT_APPCARTCHANGE);
                }
                return;
            }
        }
    },
    remove(id) {
        for (let i = 0; i < Cart.data.length; i += 1) {
            const cart = Cart.data[i];
            if (cart.product.id === id) {
                Cart.data.splice(i, 1);
                window.dispatchEvent(Cart.EVENT_APPCARTCHANGE);
                return;
            }
        }
    },
    clear() {
        Cart.data.length = 0;
        window.dispatchEvent(Cart.EVENT_APPCARTCHANGE);
    }
};

export default Cart;
