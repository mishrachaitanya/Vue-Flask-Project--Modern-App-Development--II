
const search={
    // props: ['searchQuery'],
    data() {
      return {
        users: Object.freeze([]),
        username:localStorage.getItem('username'),
        searchquery:this.$store.state.searchQuery,
      };
    },
    mounted() {
      this.fetchUsers();
    },
    computed: {
      searchQuery() {
        return this.$store.state.searchQuery
      },},

    methods: {
      fetchUsers() {
        // const searchQuery=;
        fetch(`/api/user_search/${this.searchQuery}`)
          .then(response => response.json())
          .then(users => {
            this.users = Object.freeze(users);
            console.log(this.users)
          })
          .catch(error => console.error(error));
      },
      navigateToOtherProfile(username) {
        this.$router.push(`/other/${username}`)
      }
    },
    template:`
    <body style="height:100vh;background:linear-gradient(45deg, #e0d956,#ec6fb2)">
    <nav class="navbar sticky-top navbar-light bg-light">
        <div class="container">
            <a class="navbar-brand" href="/feed">
                <img src="https://iili.io/HoMu2xj.md.jpg" width="30" height="30" class="d-inline-block align-top" alt="">
                BlogLite
            </a>
            <div class="navbar-nav ml-auto">
                <router-link :to="''+username" class="nav-item nav-link">Homepage</router-link>
                <a class="nav-item nav-link" href="/logout">Logout</a>
            </div>
        </div>
    </nav>
    <div class="container mt-4">
  <h2>Search results:</h2>
  <table class="table" v-if="users.length > 0">
    <tbody>
      <tr v-for="user in users" :key="user.username">
        <td><router-link :to="{path:'/other/'+ user.username,params: { userid: user.username}}" @click="(event) => { this.refresh(); }" > 
        {{user.first_name}} {{user.last_name}}</router-link> </td>
        <td>
          <button type="button" name="follow" class="btn btn-light"><a href="/follow_usernameINSERTHERE">Follow</a></button>
          <button type="button" name="unfollow" class="btn btn-light"><a href="/unfollow_usernameINSERTTHERE">Unfollow</a></button>
        
          </td>
      </tr>
    </tbody>
  </table>
  <p v-else>No user found</p>
</div>
<div style="text-align:center">
    <router-link :to="''+username" >Go Back</router-link>
</div>
</body>`,
}
export default search;




// const search={
//     data(){
//         return{
//             users:'',
//             users_all:'',
//         }
//     },
//     props:['searchQuery'],
//     methods:
//     {
//           searchUser(){
//             console.group(this.searchQuery)
//                 var kk=[]
//                 fetch(`/api/user_search/${this.searchQuery}`)
//                   .then(response => response.json())
//                   .then(data => {
//                     console.log(data);
//                     this.users_all = data.map(user => ({
//                       first_name: JSON.stringify(user.first_name),
//                       last_name: JSON.stringify(user.last_name),
//                       username: JSON.stringify(user.username)
//                     }));
//                     kk=JSON.parse(JSON.stringify(this.users_all));
                    
//                     console.log(kk)
//                     // this.users=kk;
//                     // this.setUsers();
//                   })
//                   .catch(error => console.log(error))
//             },
          

//         setUsers(){
//             const fd=this.users_all
//             let i;
//             console.log(fd, fd.length)
//             var newList=[]
//             for (i=0;i<fd.length;i++){
//                 let gk={
//                     first_name:fd[i["first_name"]],
//                     last_name:fd[i["last_name"]],
//                     username:fd["username"]
//                 }
//                 newList.push(gk)
//             }
//             console.log(newList)
//         },},
    
//     watch: {
//     },
//     mounted(){
//          this.searchUser()
         
//     },