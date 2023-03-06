const vm = new Vue({
  el: '#app',
  data: {
    products: [],
    product: false,
    cart: [],
    toastMessage: '',
    activeToast: false,
    activeCart: false,
  },
  filters: {
    formatedPrice(value) {
      return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    },
  },
  computed: {
    cartTotal() {
      let total = 0;
      if (this.cart.length) {
        this.cart.forEach((item) => {
          total += item.preco;
        });
      }
      return total;
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
    openModal(id) {
      this.fetchProduct(id);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
    closeModal({ target, currentTarget }) {
      if (target === currentTarget) {
        this.product = false;
      }
    },
    closeModalCart({ target, currentTarget }) {
      if (target === currentTarget) {
        this.activeCart = false;
      }
    },
    addItem() {
      this.product.estoque--;
      const { id, nome, preco } = this.product;
      this.cart.push({
        id,
        nome,
        preco,
      });
      this.toast(`${nome} adicionado ao carrinho.`);
    },
    removeItem(index) {
      this.cart.splice(index, 1);
    },
    checkLocalStorage() {
      if (localStorage.cart) {
        this.cart = JSON.parse(localStorage.cart);
      }
    },
    toast(message) {
      this.toastMessage = message;
      this.activeToast = true;

      setTimeout(() => {
        this.activeToast = false;
      }, 1500);
    },
    router() {
      const hash = document.location.hash;
      if (hash) {
        this.fetchProduct(hash.replace('#', ''));
      }
    },
    checkStock() {
      const items = this.cart.filter(({ id }) => id === this.product.id);
      this.product.estoque -= items.length;
    },
  },
  watch: {
    product() {
      document.title = this.product.nome || 'Techno';
      const hash = this.product.id || '';
      history.pushState(null, null, `#${hash}`);

      if (this.product) {
        this.checkStock();
      }
    },
    cart() {
      localStorage.cart = JSON.stringify(this.cart);
    },
  },
  created() {
    this.fetchProducts();
    this.checkLocalStorage();
    this.router();
  },
});
