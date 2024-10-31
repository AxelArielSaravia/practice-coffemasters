const Router = {
    id: 0,
    setMetadata(section, color) {
        document.title = section +" | Coffee Masters";
        document.querySelector("meta[name=theme-color]").content = color;
    },
    render() {
        const route = Router.route;
        if (route === "/") {
            app.DOM.MenuPage.render();
            Router.setMetadata("Menu", "#43281c");
        } else if (route === "/order") {
            app.DOM.OrderPage.render();
            Router.setMetadata("Order", "#43281c");
        } else if (route.startsWith("/product-")) {
            const id = Router.id;
            const product = app.Menu.getProductById(id);
            if (product === undefined) {
                return;
            }
            app.DOM.DetailPage.render(product);
            Router.setMetadata(product.name, "#43281c");
        }
    },
    /**@type{(
     * route: string,
     * addToHistory: boolean,
     * ) => undefined}*/
    go(route, addToHistory = true, id = 0) {
        if (addToHistory) {
            history.pushState({route}, "", route);
        }

        Router.route = route;
        Router.id = id;
        if (!document.startViewTransition) {
            Router.render();
        } else {
            document.startViewTransition(Router.render);
        }
        window.scrollX = 0;
    }
};

export default Router;
