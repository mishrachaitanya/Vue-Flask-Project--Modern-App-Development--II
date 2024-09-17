const other_Followers={
    data(){
        return{
            
            followers_list1:[],
            followers_list:[],
            already_following: false,
            yes: false,

        }
    },
    methods:{
        fetchUsers(){
            // const all_users = ["username1", "juno123", "ShriGanesh"];
            const all_users = this.followers;

            fetch('/api/all_users_info/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_ids: all_users
            })
            })
            .then(response => response.json())
            .then(data => {
                const ok12=JSON.stringify(data)
                this.followers_list=JSON.parse(ok12);
                console.log(data);
            })
            .catch(error => {
            console.error(error);
            });

        },
        printFollowers(){
            console.log(this.followers)
            console.log(this.followers_list)
            console.log(this.followers_list[0].username)
        },
        goBack(){
            this.$router.go(-1)
            // location.reload()
        },
        follow(username){
            let obj={
                username1: localStorage.getItem('username'),
                username2: username
            }
            fetch('/api/user_info', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(obj)
              })
              .then(response => response.json())
              .then(data => {
                if(data=="FOLLOWING"){
                    this.already_following= true;
                    this.waitForUnfollow();
                }
                else{
                console.log("Success")
                this.yes=true;
                this.waitForUnfollow();
                }
              })
              .catch(error => {
                // Handle errors
                this.already_following= true;
                this.waitForUnfollow();
                  
                console.error(error)
              });
        },
        unfollow(user_){
            let obj={
                username1: localStorage.getItem('username'),
                username2: user_
            }
        },
        async waitForUnfollow() {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
            this.already_following = false;
            this.yes=false; // Change the value of already_following to false
          },
    },
    created() {
      },
    mounted() {
        this.fetchUsers()

      },
      

    template:`<body style="height:100vh;background:linear-gradient(45deg, #e0d956,#ec6fb2)">
    <nav class="navbar sticky-top navbar-light bg-light">
        <a class="navbar-brand" href="/feed">
            <img src="https://iili.io/HoMu2xj.md.jpg" width="30" height="30" class="d-inline-block align-top" alt="">
            BlogLite
        </a>

        <div class="navbar-nav ml-auto">
            <a class="nav-item nav-link" href="/feed">Homepage</a>
            <a class="nav-item nav-link" href="/logout">Logout</a>
        </div>

    </nav>
        <div v-show="yes" class="alert alert-success" role="alert">
            Success!!
        </div>

        <div v-show="already_following" class="alert alert-warning" role="alert">
            Already Following!!
        </div> 





    <button @click="goBack" class="btn btn-info">Go back </button>
    <div class="container mt-4">
        <h2>Followers:</h2>
        <table class="table table-striped table-responsive-md">
            <thead>
                <tr>
                    <th scope="col">Username</th>
                   
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in this.followers_list" :key="user.username">
                    <td>
                    
                    <router-link :to="'/other/'+user.username">
                    {{ user.first_name }} {{ user.last_name }} </router-link ></td>
                    <td>
                   
                    </td>
                </tr>
          
                <tr v-if="this.followers.length < 1 ">
                    <td>No user found.</td>
                </tr>
            </tbody>
        </table>
    </div>

</body>`,
props:['username','followers']
}

export default other_Followers;