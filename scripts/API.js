const API = {
    url: "/data/menu.json",
    /**@type{() => Promise<Object>}*/
    async fetchMenu() {
        const result = await fetch(API.url);
        return await result.json();
    },
    fetchMenuError(error) {
        console.error("Error loading data");
        console.error(error);
    }
}

export default API;
