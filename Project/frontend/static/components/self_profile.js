// import edit_post from "./edit_self_post.js";
// const routes = [
//   {
//     path: '/self/:blogid/edit_post',
//     name: 'edit-post',
//     component: edit_post,
//     props: true
//   }
// ]
// const router= new VueRouter({
//   routes,
// })
{/* <template>
  <div>
    <input type="file" @change="handleFileUpload">
  </div>
</template>

<script>
export default {
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const csv = reader.result;
        const rows = csv.split('\n');
        const data = [];

        for (let i = 1; i < rows.length; i++) {
          const columns = rows[i].split(',');
          if (columns.length !== 3) {
            // Invalid CSV row, skip it
            continue;
          }
          data.push({
            title: columns[0].trim(),
            caption: columns[1].trim(),
            image: columns[2].trim()
          });
        }

        // Do something with the extracted data, such as sending it to your Flask API
      };

      reader.readAsText(file);
    }
  }
};
</script> */}

const self_profile={
    data(){
        return{
          username: localStorage.getItem('username'),
          token: localStorage.getItem('token'),
          first_name:'',
          last_name:'',
          about_me:'',
          dp:'',
          dp_path:'',
          show_modal:false,  
          file_pic:null,
          //////////////////////
          title:'',
          caption:'',
          //////////////////////
          blogid:null,
          all_blogs:[],
          followers:[],
          following:[],
          nofi:0,
          nofo:0,
          searchQuery:'',
          no_of_posts:'',
          my_following:[],
        }
    },
    created() {
      // check if token has expired every minute
      if(!localStorage.getItem('username') || !localStorage.getItem('token_expiration')){
        this.$router.push('/unauth')
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
        }
      ,
      updateFol(){
        this.nofi=this.following.length;
        this.nofo=this.followers.length;
        console.log(this.following.length)
      },
      async fetchUserDetails (){
        const url = `/api/users/${this.username}`;
        const options = {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        };
        fetch(url, options)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            console.log(data);
                               // JSON object received
            this.first_name=data.first_name;
            this.last_name=data.last_name;
            this.about_me=data.about_me;
            this.dp=data.profile_photo;
            this.dp_path=`../static/uploads/${this.dp}`
          })
          .catch(error => {
            console.error('Error:', error);
          });



      },
      refresh(){
        window.location.reload()
      },
      add_image(event){
        // this.file_pic=event.target.files[0]
        // console.log(event.target.files[0])
        let file = this.file_pic
        let formData = new FormData();
        formData.append('title', this.title);
        formData.append('caption', this.caption);
        formData.append('image', file);
        formData.append('username',this.username);
        fetch('/api/blog', {
          method: 'POST',
          body: formData,
        })
        .then(response => {
          console.log(response)
          window.alert("Image added Successfully.")
          $("exampleModal").modal("hide")
          window.location.reload()
        })
        .catch(error => {
          console.log(error);
        });

      },
      fileSelected(event){
        this.file_pic=event.target.files[0]
        console.log(event.target.files[0])
    },
      fetchBlogs(){
        const username=this.username;
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
        const url = `/api/user_info/${this.username}`;
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
          this.my_following=following
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
      handleSubmit() {
        this.$store.commit('setSearchQuery', this.searchQuery)
        // this.$router.push('/#/self/search')
      },
      check_if_valid(){
        const hash = window.location.hash; 
        const part = hash.split('/'); 
        const username1 = part[2]; 

        fetch(`/valid_user/${username1}`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then(response => {
          if (response.ok) {
            return response.text();
          } 
          else {
            // this.logout()
            console.log(response.json())
            window.location.href = '/#/unauth'
            // throw new Error('Network response was not ok.');
            
          }
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
      },
      
    
    
  },
 
    
    mounted() {
        this.fetchUserDetails()
        this.fetchBlogs()
        this.fetchFollowerFollowing()
        this.updateFol()
        this.check_if_valid()
        // this.newAgain()
        // const { followers, following } = this.$route.params;
        // this.$store.commit('setFollowers', followers);
        // this.$store.commit('setFollowing', following);
    },
    



    template:`
    <body>
      <!-- Navigation bar -->
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#"><img src="https://i.ibb.co/mHWFTWV/logo.jpg" width="60" height="40" alt="Logo"></a>
        Hello {{first_name}} {{last_name}}
        <form class="form-inline mx-auto">
          <input v-model="searchQuery" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
          <router-link :to="{ name: 'Search', params: { searchQuery: searchQuery }}">
          <button @click="handleSubmit" class="btn btn-outline-success my-2 my-sm-0" >Search</button></router-link>
          </router-link>
          </form>
        <div class="navbar-nav ml-auto">

        <router-link :to="{ name: 'feed' }" @click="(event) => { this.refresh(); }" ><button class="btn btn-primary">Homepage</button></router-link>  

            <div class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Dropdown
            </a>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
              <a class="dropdown-item"><router-link :to="{ name: 'update_profile' }" @click="(event) => { this.refresh(); }" >Update profile</router-link>
              </a>
              <a class="dropdown-item" >
              <router-link :to="{ name: 'change_password' }" @click="(event) => { this.refresh(); }" >Change password</router-link>  
              </a>
              <a class="dropdown-item" >              <router-link :to="{ name: 'deactivate' }" @click="(event) => { this.refresh(); }" >Deactivate</router-link>  
              </a>
              <div class="dropdown-divider"></div>
              <a @click="logout" class="dropdown-item" href="#">Logout</a>
            </div>
          </div>
        </div>
      </nav>
    
      <!-- Container row with image, about section, and table -->
      <div class="container-fluid bg-secondary py-3">
        <div class="row align-items-center" style="background:linear-gradient(45deg, #e0d956,#ec6fb2)">
          <div class="col-md-3">
            <img :src=dp_path class="img-fluid" alt="Image 1">
          </div>
          <div class="col-md-6 text-center" >
            <h4>About</h4>
            <p>{{about_me}}Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac erat eget augue euismod tempus in sed est.</p>
            <p>Number of Posts: {{all_blogs.length}}</p>

            
           <button type="button" id="modalb" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
            Upload Image
            </button> 
            <!--<button class=" btn btn-primary" >Upload Image</button>-->


          </div>
          <div class="col-md-3">
            <table class="table table-striped">
              <thead>
                <tr><th>
                <router-link :to="{ name: 'followers', params: { username: username,followers: followers } }" @click="(event) => { this.refresh(); }" class="btn btn-info">Followers</router-link>
                </th>
                  <th><router-link :to="{ name: 'following', params: { username: username, following:following } }" @click="(event) => { this.refresh(); }" class="btn btn-info">Following</router-link>
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
        
        <div class="row">
            <div v-for="blog in this.all_blogs" :key="blogid" class="card col-md-3" style="width: 18rem;">
                
            <router-link :to="{ name: 'picture', params: { image: blog.image } }">
            <img v-bind:src="'../static/uploads/' + blog.image" class="card-img-top" alt="...">
                </router-link>
            
            <div class="card-body">
                  <h5 class="card-title">{{blog.title}}</h5>
                  <p class="card-text">{{blog.caption}}Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                 
                  <router-link :to="{ name: 'edit-post', params: { blogid: blog.blogid } }" @click="(event) => { this.refresh(); }" class="btn btn-primary">Edit/Delete</router-link>
                  <router-link :to="'/blog/export/'+blog.blogid" >Share/Export</router-link>
                  
                  </div>
              </div>
        </div>
    </div>
  </body>
        `,
}

export default self_profile
