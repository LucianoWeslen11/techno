const vm = new Vue({
  el: "#app",
  data: {
    products: [],
    product: false,
    shoppingCart: [],
    shoppingCartActive: false,
    mensageAlert:  'Produto foi adcionado com sucesso!',
    alertActive: false
  },
  filters: {
    numberPrice(value){
      return value.toLocaleString("pt-BR", { 
        style: "currency", 
        currency: "BRL"
      })
    }
  },
  computed: {
    shoppingCartTotal(){
      let total = 0;

      if(this.shoppingCart.length){
        this.shoppingCart.forEach(product => {
          total += product.price;
        });
      }

      return total;
    }
  },
  methods: {
    fetchProducts(){
      fetch("./api/products.json")
        .then(res => res.json())
        .then(res => {
          this.products = res;
        })
    },
    fetchProduct(id){
      fetch(`./api/products/${id}/data.json`)
        .then(res => res.json())
        .then(res => {
          this.product = res;
        })
    },
    closePopUp({target, currentTarget}){
      if(target === currentTarget){
        this.product = false;
      }
    },
    closeShoppingCart({ target, currentTarget }) {
      if (target === currentTarget) {
        this.shoppingCartActive = false;
      }
    },
    addProduct(){
      this.product.stock--;
      const {id, name, price} = this.product;

      this.shoppingCart.push({id, name, price});
      this.alert(`${name}foi adcionado com sucesso!`);
    },
    removeProduct(index){
      this.shoppingCart.splice(index, 1);
    },
    checkLocalStorage(){
      if(window.localStorage.shoppingCart){
        this.shoppingCart = JSON.parse(window.localStorage.shoppingCart);
      }
    },
    alert(msg) {
      this.mensageAlert = msg;
      this.alertActive = true;
      setTimeout(() => {
        this.alertActive = false;
      }, 1500);
    },
    router() {
      const hash = document.location.hash;
      if (hash){
        this.fetchProduto(hash.replace("#", ""));
      }
    },
    compareStock(){
      const items = this.shoppingCart.filter(({ id }) => id === this.product.id);
      this.product.stock -= items.length;
    }
  },
  watch: {
    product(){
      document.title = this.product.name || "Techno";
      const hash = this.product.id || "";
      history.pushState(null, null,`#${hash}`);
      if (this.product) {
        this.compareStock();
      }
    },
    shoppingCart(){
      window.localStorage.shoppingCart = JSON.stringify(this.shoppingCart);
    }
  },
  created(){
    this.fetchProducts();
    this.checkLocalStorage();
    this.router();
  }
})