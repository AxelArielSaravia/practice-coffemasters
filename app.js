import API    from "./scripts/API.js";
import Menu   from "./scripts/Menu.js";
import Router from "./scripts/Router.js";
import Cart  from "./scripts/Cart.js";
import DOM    from "./scripts/DOM.js";

window.app = {
    Router: Router,
    Menu: Menu,
    Cart: Cart,
    DOM: DOM,
};

window.addEventListener(
    "DOMContentLoaded",
    function () {
        DOM.init();
        API.fetchMenu()
        .then(Menu.loadData)
        .catch(API.fetchMenuError);
        Router.go(location.pathname, false);
    },
    false
);

window.addEventListener(
    "appcartchange",
    function (event) {
        if (location.pathname === "/order") {
            app.DOM.OrderPage.render();
        }
        let qty = 0;
        for (let cart of Cart.data) {
            qty += cart.quantity
        }
        app.DOM.badge.textContent = String(qty);
        app.DOM.badge.hidden = qty === 0;
    },
    false
);

window.addEventListener(
    "appmenuchange",
    function (event) {
        app.DOM.MenuPage.render();
    },
    false
);

window.addEventListener(
    "popstate",
    function (event) {
        if (event.state !== null) {
            Router.go(event.state.route, false);
        }
    },
    false
);
