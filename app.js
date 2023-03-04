const vm = new Vue({
  el: '#app',
  data: {
    products: [],
    product: false,
  },
  filters: {
    formatedPrice(value) {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    },
  },
  methods: {
    async fetchProducts() {
      const response = await fetch('./api/produtos.json');
      const json = await response.json();
      this.products = json;
    },
    async fetchProduct(id) {
      const response = await fetch(`./api/produtos/${id}/dados.json`);
      const json = await response.json();
      this.product = json;
    },
  },
  created() {
    this.fetchProducts();
  },
});
