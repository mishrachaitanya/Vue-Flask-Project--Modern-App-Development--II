
const other_profile={
  
    data(){ 
        return{
          first_name:'',
          last_name:'',
          about_me:'',
          dp:'',
          dp_path:'',
          show_modal:false,  
          file_pic:null,
          title:'',
          caption:'',
          blogid:null,
          all_blogs:[],
          followers:[],
          following:[],
          nofi:0,
          nofo:0,
          searchQuery:'',
          userid:'',
          unfollowed:'',
          my_following:'',
          username:localStorage.getItem('username'),
          already_following_:false,
          already_unfollowed:false,
          my_followers:'',
          exist:false,
        }
    },
    created() {
      const userId = this.$route.params.other_username;
      console.log(userId)
      const loggedInUserId = localStorage.getItem('username')
      console.log(loggedInUserId)
      console.log("FSFAW")
      if (userId === loggedInUserId) {
        // Redirect to self_profile page if the user is trying to access their own profile
        this.$router.push('/self/'+loggedInUserId);
      }
    },
    
    methods:{

      async logout() {
        await fetch('/logout', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(response => {
          if (response.ok) {
            // Clear the access token from local storage and redirect to the login page
            localStorage.removeItem('token');
            window.location.href = '/';
          } else {
            throw new Error('Failed to logout');
          }
        })
        .catch(error => {
          console.error(error);
          // Display an error message to the user
          alert('Failed to logout');
        });
    },
      async timepass(){
        setTimeout(() => {
          this.already_following = false;
          this.already_unfollowed= false;
        }, 2000);
      },
      unfollow(){
        fetch('/api/user_info', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "username1": this.username,
            "username2": this.userid
          })
        })
        .then(response => {
          return response.json();
        })
        .then(data => {
          if(data =="NOTFOUND"){
            this.already_unfollowed= true;
            this.timepass()
          }
            console.log(data)
        })
        .catch(()=> {
        console.error(error)
        });
        console.log("ASAAS")
        location.reload()
      },
      iFollow(){
        fetch(`/api/user_info/${this.username}`)
        .then(response => response.json())
        .then(data => {
          console.log(data.following)
          this.my_following=[...data.following]
          console.log(this.my_following,"KK")
        })
        .catch(error => console.log(error))


      },
      
      follow_user(){
        
        if(this.my_following.includes(this.userid)){
          this.already_following_=true;
          this.timepass();
          return;
        }


        let obj={
          "username1":this.username,
          "username2":this.userid
        }
        fetch(`/api/user_info`,{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify(obj),
        }).then(response => response.json())
        .then(data => {
          if (data=="FOLLOWING"){
            
            this.already_following_=true;
            this.timepass();
            // this.timepass()
          }
          location.reload()
          console.log(data)
          }
          )
        .catch(error => {
        
          console.error(error)})

      },
      async waitForUnfollow() {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
        this.unfollowed = false;
        this.yes=false; // Change the value of unfollowed to false
      },
      update_this_user(){
        this.userid=window.location.href
        const k=this.userid.split("/");
        const len1=k.length
        this.userid=k[len1-1]
        console.log(this.userid)
        
      },
     
      async fetchUserDetails(){
        await fetch(`/api/users/${this.userid}`)
        .then(response => response.json())
        .then(data=>{
            this.first_name=data.first_name
            this.last_name=data.last_name
            this.about_me=data.about_me
            this.dp=data.profile_photo
            console.log(data)
          })
          this.dp_path=`../static/uploads/${this.dp}`
      },

      updateFol(){
        this.nofi=this.following.length;
        this.nofo=this.followers.length;
        console.log(this.following.length)
      },
      
      refresh(){
        window.location.reload()
      },
      
      fileSelected(event){
        this.file_pic=event.target.files[0]
        console.log(event.target.files[0])
    },
      fetchBlogs(){
        const username=this.userid;
        fetch(`/api/blogs/${username}`)
        .then(response => response.json())
        .then(data => {
          this.all_blogs= data;
        })
        .catch(error =>{
          console.error("Unable to fetch blogs. See: ", error)
        })
      },
      async fetchFollowerFollowing(){
        const url = `/api/user_info/${this.userid}`;
        const options = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        };
      
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          console.log(data); // log the response data 
          const following = data.following || [];
          const followers = data.followers || [];
          this.following=following
          this.followers=followers
          const result = { following, followers };
          console.log(result); // log the result
          return result; 
        } catch (error) {
          console.error(error);
          return { following: [], followers: [] }; // return an empty array for both following and followers in case of error
        }
      },
      newAgain(){
      
        location.reload()
      },
    
    searchSubmit(){

      },
      async whom_i_follow(){
        await fetch(`api/user_info/${localStorage.getItem('username')}`)
        .then(response => response.json())
        .then(data => {
          // console.log(data)
          this.my_followers=data.followers
          console.log(this.followers,'hfashfasf')
          // this.$router.reload()
          if (this.followers.includes(localStorage.getItem('username'))) {
            this.exist = true;
          }
        })
        .catch(error=> console.error(error))
 
      }
  },
    
    mounted() {
      this.iFollow()
      this.update_this_user()
      this.whom_i_follow()
        this.fetchUserDetails()
        
        this.fetchBlogs()
        this.fetchFollowerFollowing()
        this.updateFol()

    },
    
    template:`
    <body>
      <!-- Navigation bar -->
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#"><img src="https://i.ibb.co/mHWFTWV/logo.jpg" width="60" height="40" alt="Logo"></a>
        {{first_name}} {{last_name}}
        <form class="form-inline mx-auto">
          <input v-model="searchQuery" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
          <router-link :to="{ name: 'Search', params: { searchQuery: searchQuery } }">
          <button class="btn btn-outline-success my-2 my-sm-0" >Search</button></router-link>
          </router-link>
          </form>
        <div class="navbar-nav ml-auto">
        <router-link :to="{ name: 'feed' }" @click="(event) => { this.refresh(); }" ><button class="btn btn-primary">Homepage</button></router-link>  
          <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
              
              <a class="dropdown-item" @click="logout" href="#">Logout</a>
            </div>
          </div>
        </div>
      </nav>
    <div v-show="already_following_" class="alert alert-warning" role="alert">
      Already Following
  </div> 
      <div v-show="already_unfollowed" class="alert alert-warning" role="alert">
      Not Following!!
  </div> 




      <!-- Container row with image, about section, and table -->
      <div class="container-fluid bg-secondary py-3" >
        <div class="row align-items-center" style="background:linear-gradient(45deg, #e0d956,#ec6fb2) ;min-height: 270px;" >
          <div class="col-md-3">
            <img :src=dp_path class="img-fluid" alt="Image 1">
          </div>
          <div class="col-md-1 d-flex flex-column justify-content-center">
          <button @click="follow_user()"  type="button" class="btn btn-primary btn-sm">Follow</button>
          <button @click="unfollow(userid)" type="button" class="btn btn-secondary btn-sm">Unfollow</button>
          </div>
          <div class="col-md-5 " style="text-align:left">
            <h4>About</h4>
            <p>{{about_me}}Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac erat eget augue euismod tempus in sed est.</p>
            <p><b>Number of Posts: {{all_blogs.length}} </b></p>


          </div>
          <div class="col-md-3">
            <table class="table table-striped">
              <thead>
                <tr><th>
                <router-link :to="{ name: 'other_follower', params: { username: userid,followers: followers } }" @click="(event) => { this.refresh(); }" class="btn btn-info">Followers</router-link>
                </th>
                  <th><router-link :to="{ name: 'other_following', params: { username: userid, following:following } }" @click="(event) => { this.refresh(); }" class="btn btn-info">Following</router-link>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{{followers.length}}</td>
                  <td>{{following.length}}</td>
                </tr>
                
              </tbody>
            </table>
          </div>
        </div>
      </div>
    
    
      <!-- -->
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Upload Picture</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
          <form method="POST" enctype="multipart/form-data" >
              
          <div class="form-group">
              <label for="title1">Title</label>
              <input class="form-control" v-model="title" name="title" type="text" placeholder="Default input" id="title1" required>
              <br>
              <label for="exampleFormControlTextarea1">Caption/Description</label>
              <textarea name="caption" v-model="caption" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
          </div>
          <label class="form-label" for="customFile">Upload </label>
          <input type="file" @change="fileSelected" class="form-control" name="pic2" id="customFile" />
      
        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="submit" @click.prevent="add_image" name="upload_submit" class="btn btn-primary">Save changes</button>
          </div>
        </form></div>
        </div>
          </div>
      </div>
  
    <!-- -->
    
    
    <!-- Cards section -->
      <div class="container-fluid py-3">
        
        <div class="row" v-if="exist">
            <div v-for="blog in this.all_blogs" :key="blogid" class="card col-md-3" style="width: 18rem;">
                <img v-bind:src="'../static/uploads/' + blog.image" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">{{blog.title}}</h5>
                  <p class="card-text">{{blog.caption}}Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  
                  </div>
              </div>
        </div>
    </div>
  </body>
        `,
}

export default other_profile














// <div class="row">
//             <div class="card col-md-3" style="width: 18rem;">
//                 <img src="../static/assets/logo.JPG" class="card-img-top" alt="...">
//                 <div class="card-body">
//                   <h5 class="card-title">Card title</h5>
//                   <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//                   <a href="#" class="btn btn-primary">Go somewhere</a>
//                 </div>
//               </div>
//             <div class="card col-md-3" style="width: 18rem;">
//                 <img src="../static/assets/logo.JPG" class="card-img-top" alt="...">
//                 <div class="card-body">
//                   <h5 class="card-title">Card title</h5>
//                   <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//                   <a href="#" class="btn btn-primary">Go somewhere</a>
//                 </div>
//             </div>
//             <div class="card col-md-3" style="width: 18rem;">
//                 <img src="../assets/logo.JPG" class="card-img-top" alt="...">
//                 <div class="card-body">
//                   <h5 class="card-title">Card title</h5>
//                   <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//                   <a href="#" class="btn btn-primary">Go somewhere</a>
//                 </div>
//               </div>
//               <div class="card col-md-3" style="width: 18rem;">
//                 <img src="../assets/logo.JPG" class="card-img-top" alt="...">
//                 <div class="card-body">
//                   <h5 class="card-title">Card title</h5>
//                   <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//                   <a href="#" class="btn btn-primary">Go somewhere</a>
//                 </div>
//               </div>
//         </div>