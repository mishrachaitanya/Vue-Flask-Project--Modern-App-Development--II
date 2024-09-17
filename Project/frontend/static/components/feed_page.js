


Vue.component('Comments_comp',{
  data(){
    return{
      comments_list:'',
      username:localStorage.getItem('username'),
      new_comment:'',
      edited_comment:'',
      cc:'',
    } 
  },created() {
    // check if token has expired every minute
    if(!localStorage.getItem('username') || !localStorage.getItem('token_expiration')){
      this.$router.push('/unauth')
    }
  },
    
  methods:{
   
    change_it(post_id){
      this.cc=post_id
    },
    delete_comment(post_id){
      let formDat=new FormData()
      formDat.append('author',this.username)
      fetch(`/api/comment/${post_id}`,{
      method:'DELETE',
      body: formDat,
      })
      .then(response=>{
        if(response.ok){
          window.location.reload();
          window.alert("Deleted");
        }
        response.json();
      })
      .then(data => console.log(data))
      .catch(error => console.error(error))
    },
    edit_comment(comment_id,comment_author,edited_comment){
      let formD=new FormData()
      formD.append('author',localStorage.getItem('username'))
      formD.append('comment', edited_comment)
      fetch(`/api/comment/${this.cc}`,{
        method:'PUT',
        body:formD
      })
      .then(response => {
        
        window.location.reload()
        response.json()})
        .then(data => console.log(data))
        .catch(error => console.error(error))
    },
    getComments(){
      fetch(`/api/comment/${this.blogid}`)
      .then(response => response.json())
      .then(data => this.comments_list=data)
      console.log(this.comments_list)
    },
    add_new_comment(new_comment){
      const formData= new FormData();
      formData.append('author',this.username);
      formData.append('comment',new_comment);

      fetch(`/api/comment/${this.blogid}`,{
        method:'POST',
        body:formData
      })
      .then(response => {
        if (response.ok){
          window.alert("Comment added")
          window.location.reload()
          // this.$router.reload
        }
      }).then(data => console.log(data))
      .catch(error => {
      window.alert("Something Wromg Please try later");
      console.error(error)
      })

    },
  },
  mounted(){
    this.getComments()

  },
  template:`
            <table>
              <tbody>
              <tr><th>Comments:</th></tr>
              <tr><td>
                Add Comment: <input type="text" v-model="new_comment" required></input>
                <button class="btn btn-info" @click="add_new_comment(new_comment)">Post</button>
              </td></tr>
                <tr v-for="comment in comments_list" :key="comment.id">
                <ul>
                  <td colspan="3" width=450> <li>{{ comment.comment }}</li></td>
                  <td>
                  
                  <router-link :to="'/other/'+comment.author" @click="(event) => { this.refresh(); }" > 

                  <img :src="'../static/uploads/' + comment.dp" style="border-radius: 40%;" height="30" width="30" /></router-link> {{comment.first_name}} </td>
                  
                  <td v-if="comment.author==username">
                  <button type="button" @click="change_it(comment.post_id)" id="modalb" class="btn btn-primary" data-toggle="modal" data-target="#newModal">
                  Edit
                  </button>
                  <button type="button" @click="delete_comment(comment.post_id)" class="btn btn-primary" >
                  Delete
                  </button></td>
                  </ul>
                  
                    <div class="modal" tabindex="-1" role="dialog" id="newModal">
                    <div class="modal-dialog" role="document">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title">Edit Comment</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body">
                          <input placeholder="Comment.." type="text" v-model="edited_comment"></input>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                          <button @click="edit_comment(comment.post_id, comment.author,edited_comment)" type="button" class="btn btn-primary">Save changes</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  </tr>
              </tbody>
              
            </table>

           
            `,
  props:['blogid']
})

Vue.component('NavBar',{
  data(){
    return{
        username:localStorage.getItem('username'),
        searchQuery:'',
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
  },},
  mounted(){
          
  },
  template:`<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#"><img src="https://i.ibb.co/mHWFTWV/logo.jpg" width="60" height="40" alt="Logo"></a>
  Your Feed
  <form class="form-inline mx-auto">
    <input v-model="searchQuery" class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
    <router-link :to="{ name: 'Search', params: { searchQuery: searchQuery }}">
    <button class="btn btn-outline-success my-2 my-sm-0" >Search</button></router-link>
    </router-link>
    </form>
  <div class="navbar-nav ml-auto">

  <router-link :to="{ name: 'self_profile' }" @click="(event) => { this.refresh(); }" ><button class="btn btn-primary">My Profile</button></router-link>  

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
</nav>`
})


















const feed={
    data(){
        return{
          username:localStorage.getItem('username'),
          searchQuery:'',
          all_comments:'',
          my_first_name:'',
          my_last_name:'',
          my_about_me:'',
          my_dp:'',
          my_dp_path:'',
          followers:'',
          follower_details:'',
          all_blogs:'',
          hasLiked:[],

          liked_post:false,
          already_liked:false,
          like_first:false,
          disliked:false,
          likeornolike:false,
        }
    },
    methods:{
      like_post(blogid){
        let formData1=new FormData()
        formData1.append('author',this.username)

        fetch(`/api/like_post/${blogid}`,{
          method:'POST',
          body: formData1
        })
        .then(response=>{
          
          if (response.ok){
            this.liked_post=true;
            this.likeornolike=true;
            setTimeout(()=>this.liked_post=false,1000);
          }
          return response.json()
        })
        .then(data =>{
          if(data == "ALREADYLIKED"){
            this.already_liked=true
            
            setTimeout(()=>this.already_liked=false,1000);
          }
         
        })
      },
      dislike_post(blogid){
        let formData1=new FormData()
        formData1.append('author',this.username)

        fetch(`/api/dislike_post/${blogid}`,{
          method:'POST',
          body:formData1
        })
        .then(response =>{
          if(response.ok){
            this.disliked=true;
            this.likeornolike=false;
            setTimeout(()=>this.disliked=false,1000);
          }
          return response.json()
        })
        .then(data => {
          if(data=="LIKEFIRST"){
            this.like_first=true;
            setTimeout(() => this.like_first=false,1000);
          }
          
        })
        .catch(error => {
          window.alert("Something went wrong. sorry")
          console.error(error)
        })
      },


      getAllBlogs(){
        const ff=new FormData()
        ff.append('names',localStorage.getItem('username'))
        fetch('/api/get_all_posts',{
          method:'POST',
          // headers:{
          //   'Content-Type':'application/json'
          // },
          body: ff
        })
        .then(response => response.json())
        .then(data => {
          console.log(data,'lklklkl')
          this.all_blogs=data
        })
        .catch(error => console.log(error))
      },


      getUserDetails(){
        const url = `/api/users/${this.username}`;
        const options = {
          method: 'GET',
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
            this.my_first_name=data.first_name;
            this.my_last_name=data.last_name;
            this.my_about_me=data.about_me;
            this.my_dp=data.profile_photo;
            this.my_dp_path=`../static/uploads/${this.my_dp}`
            
          })
          .catch(error => {
            console.error('Error:', error);
          });
          
      },
        async getFollowers(){
          const url = `/api/user_info/${this.username}`;
          let foll=[];
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
            const following = data.following ;
            const followers = data.followers || [];
            foll=data.followers
            this.following=[...following]
            this.followers=followers
            console.log(this.following,'ghgvjhgjhbmb')
            const result = { following, followers };
            this.getFollowersDetails()
            // console.log(result); // log the result
            return result; 
          } catch (error) {
            console.error(error);
            return { following: [], followers: [] }; // return an empty array for both following and followers in case of error
          }

        },
        async getFollowersDetails(){
          console.log("HERE:", ...this.following)
          let abc={
            "names":[...this.following]
          }
          await fetch('/api/following_details',{
            method:'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body: JSON.stringify(abc)
          })
          .then(response => response.json())
          .then(data => {
            console.log(data,'FOLLOWERSSSDETIALSSS')
            this.follower_details=data
          })
          .catch(error => console.log(error))
        },
      likeBlog(blogid){

        let data= new FormData
        data.append('author',this.username) 
        fetch(`/api/like/${blogid}`,{
          method:'POST',
          body: dataForm
        })
        .then(response => response.json())
        .then(data => {
          this.hasLiked.push(blogid)
          console.log(data)
          })
        .catch(error => console.log(error))
      
      
      },
      shouldDisplayMessage(user1) {
        const username = localStorage.getItem('username');
        // console.log(user1)
        // console.log(username!=user1, 'gsadgasgsagsdg')
        return username!=user1
      },
      check_if_valid(){
        fetch(`/valid_user/${this.username}`, {
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
    computed:{

    },
    mounted(){
      this.getUserDetails()
      this.getFollowers()
      
      this.getAllBlogs()
      this.check_if_valid()
    },
    template:`
    <body>
    <NavBar ></NavBar>
  


    <br>
    <div class="alert alert-success" v-show="liked_post" role="alert">
    Success!!
    </div> 
    <div class="alert alert-waring" v-show="already_liked" role="alert">
    You already liked this post.
    </div>
    <div class="alert alert-danger" v-show="like_first" role="alert">
    You need to like it first.
    </div>
    <div class="alert alert-info" v-show="disliked" role="alert">
    Done
    </div> 




    <div class="container-fluid">
        <div class="row">
            <div class="col-sm-3" style="width: 24%;">
                <div class="card">
                    <img :src=my_dp_path class="card-img-top" alt="...">
                    <div class="card-body">
                        <h4 class="card-title">{{my_first_name}} {{my_last_name}}</h4>
                        <p class="card-text" style="margin-bottom: 0;">{{my_about_me}} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    </div>
                </div>
             
                
            
            </div>
            <div class="col-sm-7" style="width: 52%;" v-if="all_blogs.length>0">
              <div style="max-height: 90vh; overflow-y: auto;">
                <table class="table" style="width: 98%;">
                <template v-for="blog in all_blogs">
                  <tbody v-if="shouldDisplayMessage(blog.username)">
                    <tr>
                      <th><div style="float:left"> <b>{{blog.title}}</B>&nbsp;&nbsp;</div> <div style="float:right">By: <router-link :to="'/other/'+blog.username" style="text-decoration:none"><img :src="'../static/uploads/' + blog.dp" style="border-radius: 40%;" height="30" width="30" />  &nbsp;{{blog.first_name}}{{blog.last_name}}</router-link></div>
                      </br>

                    <router-link :to="{ name: 'picture', params: { image: blog.image } }">

                      <img :src="'../static/uploads/'+blog.image" width=80% height=40%></img></router-link></th>
                    

                      </tr>

                    <tr>
                  
                    <td>{{blog.caption}} &nbsp;&nbsp;&nbsp;&nbsp;
                        <button  style="outline: none !important;border: none;background: transparent;" @click="like_post(blog.blogid)">
                          <img  src="https://upload.wikimedia.org/wikipedia/commons/2/23/Facebook_Like_button.svg" width=40 height=30> </img>
                        </button>
                        
                        <button  style="outline: none !important;border: none;background: transparent;" @click="dislike_post(blog.blogid)">
                          <img  src="https://www.freeiconspng.com/uploads/dislike-button-png-0.jpg" width=40 height=30> </img>
                        </button>
                        <router-link :to="{ name: 'likers',params: { blogid: blog.blogid }}" @click="(event) => { this.refresh(); }" >
                          Likes
                        </router-link>
                      </td>
                    </tr>
                    <tr>
                      <Comments_comp :blogid=blog.blogid></Comments_comp>
                    </tr>
                  </tbody>
                  </template>
                </table>
              </div>
            </div>
            <div class="col-sm-2" style="width: 20%;">
            <table class="table">
            <tbody>
                <tr>
                    <th>Following</th>
                </tr>
                <tr v-for="user in follower_details">
                    <td>
                    
                    <router-link :to="'/other/'+user.username" @click="(event) => { this.refresh(); }" > 
                    {{user.first_name}} {{user.last_name}}</router-link>
                    
                    </td>
                </tr>
            </tbody>
        </table>
            </div>
            
        </div>
    </div>
    
</body>
    `,
}


export default feed

