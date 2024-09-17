const store = new Vuex.Store({
    state:{
        count: 0,
        products: [],
        searchQuery: ''
    },
    getters:{
        get_count: function(state){
            return state.count
        },
        getsearchQuery: state => state.searchQuery
    },
    mutations:{
        update_count: function(state, quantity){
            state.count += quantity;
        },
        update_cost: function(state, payload){
            state.cost += payload.price * payload.quantity;
        },
        setSearchQuery(state, searchQuery) {
            state.searchQuery = searchQuery;
        }
    },
    actions:{
        get_products: function(context){
            fetch('/api/userdetails')
            .then(r => r.json())
            .then(d => context.commit("update_count", d))
        }
    }
});


export default store


// this.$store.commit("update_cost", total_count,price)
// this.$store.dispatch("get_products")// Use it in the mounted hook if needed form the start