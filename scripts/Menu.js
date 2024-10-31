const Menu = {
    data: [],
    EVENT_APPMENUCHANGE: new Event("appmenuchange"),
    /**@type{(data: unknown) => undefined}*/
    loadData(data) {
        if (Array.isArray(data)) {
            Menu.data = data;
            window.dispatchEvent(Menu.EVENT_APPMENUCHANGE);
        }
    },
    /**@type{(id: number) => undefined | {
     *  id: number,
     *  name: string,
     *  price: number,
     *  description: string,
     *  image: string,
     * }}*/
    getProductById(id) {
        for (let c of Menu.data) {
            if (!Array.isArray(c.products)) {
                continue;
            }
            for (let p of c.products) {
                if (p.id == id) {
                    return p;
                }
            }
        }
        return undefined;
    },
};

export default Menu;
