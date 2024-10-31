const DOM = {
    navlinks: undefined,
    main: undefined,
    badge: undefined,
    templateMenuPage: undefined,
    templateMenuItem: undefined,
    templateDetailPage: undefined,
    templateProductItem: undefined,
    templateCartItem: undefined,
    templateOrderEmpty: undefined,
    templateOrderPage: undefined,
    init() {
        DOM.navlinks = document.getElementById("navlinks");
        DOM.main = document.getElementById("main");
        DOM.badge = document.getElementById("badge");

        DOM.templateDetailPage = (
            document.getElementById("template-details-page").content
        );
        DOM.templateProductItem = (
            document.getElementById("template-product-item").content
        );
        DOM.templateCartItem = (
            document.getElementById("template-cart-item").content
        );

        const templateMenu = document.getElementById("template-menu").content;
        DOM.templateMenuPage = templateMenu.children["page"];
        DOM.templateMenuItem = templateMenu.children["element"];

        const templateOrder = document.getElementById("template-order").content;
        DOM.templateOrderEmpty = templateOrder.children["empty"];
        DOM.templateOrderPage = templateOrder.children["page"];

        DOM.navlinks.addEventListener("click", DOM.navlinksOnclick, false);
    },
    navlinksOnclick(event) {
        const target = event.target;
        if (target.localName === "a") {
            event.preventDefault();
            const href = target.getAttribute("href");
            if (location.pathname !== href) {
                app?.Router.go(href);
            }
        }
    },
    MenuPage: {
        /**@type{() => HTMLElement}*/
        create() {
            const templatePage = DOM.templateMenuPage.cloneNode(true);
            if (app.Menu.data.length > 0) {
                const menu = templatePage.querySelector("ul")
                for (let category of app.Menu.data) {
                    const templateItem = DOM.templateMenuItem.cloneNode(true);
                    templateItem.querySelector("h3").append(category.name);

                    for (let product of category.products) {
                        const item = DOM.ProductItem.create(product);
                        templateItem.querySelector("ul").appendChild(item);
                    }

                    menu.appendChild(templateItem);
                }
            } else {
                templatePage.querySelector("ul").textContent = "Loading...";
            }
            return templatePage;
        },
        render() {
            const template = DOM.MenuPage.create();
            DOM.main.replaceChildren(template);
            DOM.main.onclick = DOM.MenuPage.onclick;
        },
        onclick(event) {
            const target = event.target;
            if (target.localName === "button") {
                let id = target.parentElement.firstElementChild.app_productId;
                app.Cart.add(id);
            } else if (target.localName === "a" 
                || target.parentElement.localName === "a"
            ) {
                const a = target.closest("a");
                event.preventDefault();
                app?.Router.go(
                    a.getAttribute("href"),
                    true,
                    a.app_productId
                );
           }
        },
    },
    ProductItem: {
        /**@type{(product: {
         *  id: number,
         *  name: string,
         *  price: number,
         *  description: string,
         *  image: string
         * }) => HTMLElement}*/
        create(product) {
            const template = DOM.templateProductItem.cloneNode(true);
            template.querySelector("h4").textContent = product.name;
            template.querySelector("p.price").textContent = (
                `$${product.price.toFixed(2)}`
            );
            let img = template.querySelector("img");
            img.setAttribute(
                "src",
                "data/images/"+product.image
            );
            img.style.viewTransitionName = "image-"+String(product.id);

            let a = template.querySelector("a");
            a.app_productId = product.id;
            a.setAttribute(
                "href",
                "/product-"+String(product.id)
            );
            return template;
        },
    },
    DetailPage: {
        /**@type{(product: {
         *  id: number,
         *  name: string,
         *  price: number,
         *  description: string,
         *  image: string
         * }) => HTMLElement}*/
        create(product) {
            const template = DOM.templateDetailPage.cloneNode(true);
            template.querySelector("h2").textContent = product.name;
            let img = template.querySelector("img");
            img.setAttribute(
                "src",
                "/data/images/"+product.image
            );
            img.style.viewTransitionName = "image-"+String(product.id);

            template.querySelector(".description").textContent = (
                product.description
            );
            template.querySelector(".price").textContent = (
                "$" + product.price.toFixed(2)
            );

            const button = template.querySelector("button");
            button.app_productId = product.id;

            return template;
        },
        /**@type{(
         *  product: {
         *      id: number,
         *      name: string,
         *      price: number,
         *      description: string,
         *      image: string
         *  }
         * ) => HTMLElement}*/
        render(product) {
            DOM.main.replaceChildren(DOM.DetailPage.create(product));
            DOM.main.onclick = this.onclick;

        },
        onclick(event) {
            const target = event.target;
            if (target.localName === "button") {
                app?.Cart.add(event.target.app_productId);
            } else if (target.localName === "a") {
                event.preventDefault();
                history.back();
            }
        }
    },
    OrderPage: {
        /**@type{() => DocumentFragment}*/
        createEmpty() {
            const template = DOM.templateOrderEmpty.cloneNode(true);
            return template;
        },
        /**@type{(carts: Array<{quantity: number, product: Product}>) => DocumentFragment}*/
        createPage(carts) {
            const template = DOM.templateOrderPage.cloneNode(true);
            const ul = template.querySelector("ul");
            let total = 0;
            for (let cart of carts) {
                const item = DOM.CartItem.create(cart);
                total += cart.quantity * cart.product.price;
                ul.appendChild(item);
            }
            template.querySelector(".total-price").textContent = (
                "$"+total.toFixed(2)
            );

            const form = template.querySelector("form");
            form.addEventListener("submit", this.onsubmit, false);
            return template;
        },
        render() {
            if (app.Cart.data.length === 0) {
                DOM.main.onclick = null;
                DOM.main.replaceChildren(DOM.OrderPage.createEmpty());
            } else {
                DOM.main.replaceChildren(
                    DOM.OrderPage.createPage(app.Cart.data)
                );
                DOM.main.onclick = DOM.OrderPage.onclick;
            }
        },
        onclick(event) {
            const target = event.target;
            if (target.localName === "button" && target.className === "delete") {
                app.Cart.subtract(target.app_productId);
            }
        },
        onsubmit(event) {
            event.preventDefault();
            event.target.reset();
            app.Cart.clear();
        },

    },
    CartItem: {
        /**@type{(cart: {quantity: number, product: Product}>) => DocumentFragment}*/
        create(cart) {
            const template = DOM.templateCartItem.cloneNode(true);
            template.querySelector(".qty").textContent = `${cart.quantity}x`;
            template.querySelector(".name").textContent = cart.product.name;
            template.querySelector(".price").textContent = (
                "$"+cart.product.price.toFixed(2)
            );
            template.querySelector("button").app_productId = cart.product.id;
            return template;
        }
    }

};

export default DOM;
