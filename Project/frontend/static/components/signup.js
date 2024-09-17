
const signup={
    data(){
        return{

        }
    },
    template:`<body>
    <!-- Section: Design Block -->
      <div class="container-fluid py-4">
          <div class="row justify-content-center">
              <div class="col-lg-6 col-md-8 col-sm-10">
                  <div class="card">
                      <div class="card-body p-5 text-center">
                          <h2 class="fw-bold mb-5">Sign up now</h2>
                          <form enctype="multipart/form-data">
                              <!-- 2 column grid layout with text inputs for the first and last names -->
                              <div class="form-row mb-4">
                                  <div class="col">
                                      <div class="form-outline">
                                          <input type="text" v-model="fname" name="fname" id="form3Example1" class="form-control" required />
                                          <label class="form-label" for="form3Example1">First name</label>
                                      </div>
                                  </div>
                                  <div class="col">
                                      <div class="form-outline">
                                          <input type="text" v-model="lname" name="lname" id="form3Example2" class="form-control" />
                                          <label class="form-label" for="form3Example2">Last name</label>
                                      </div>
                                  </div>
                              </div>
  
                              <!-- Email input -->
                              <div class="form-outline mb-4">
                                  <input type="text" v-model="uname" name="uname" id="form3Example3" class="form-control" required/>
                                  <label class="form-label" for="form3Example3">Username</label>
                              </div>
  
                              <!-- Password input -->
                              <div class="form-outline mb-4">
                                  <input type="password" v-model="passw" name="pass" id="form3Example4" class="form-control" required />
                                  <label class="form-label" for="form3Example4">Password</label>
                              </div>
                              <div class="form-outline mb-4">
                              <input type="text" v-model="about_me" name="about_me" id="form3Example6" class="form-control"  />
                              <label class="form-label" for="form3Example4">About You</label>
                          </div>
  
                              <!-- Checkbox -->
                              <div class="custom-file mb-4">
                                 <input type="file" @change="fileSelected" class="custom-file-input" id="customFile" name="image1" />
                                  <label class="custom-file-label" for="customFile">Profile photo</label> 
                              </div>
  
                              <!-- Submit button -->
                              <button type="submit" @click.prevent="submitForm"
                              class="btn btn-primary btn-block mb-4"
                              v-bind:disabled="!isTrue"> Sign up </button>

      
  
  
  <!-- Register buttons -->
  <div class="d-flex justify-content-center align-items-center mt-4">
      <p class="mb-0 me-3">Already have an account?</p>
      <a href="/" class="text-body text-decoration-none">Login</a>
  </div>
  </form>
  </div>
  </div>
  <div v-if="gthan4" class="alert alert-warning">
  <strong>Warning!</strong> Username needs to be atleast 4 character long.
</div>
<div v-if="lthan20" class="alert alert-warning">
  <strong>Warning!</strong> Username cannot be greater than 20 character.
</div>
<div v-if="unameexist" class="alert alert-warning">
  <strong>Warning!</strong> Username already taken. Please try some other username.
</div>
<div v-if="pthan4" class="alert alert-warning">
  <strong>Warning!</strong> Password needs to be atleast 4 character long.
</div>

  </div>
  
  <div class="col-lg-6 mb-5 mb-lg-0">
      <img src="https://iili.io/HoMu2xj.md.jpg" alt="BLOGPOST" border="0" class="w-100 rounded-4 shadow-4"
       />
  </div>
  </div>
  </div>
  <!-- Jumbotron -->
  </section>
  <!-- Section: Design Block -->
  </div></body>`,
  data(){
    return{
        fname:'',
        lname:'',
        uname:'',
        passw:'',
        dp:'',
        gthan4: false,
        pthan4: false,
        lthan20: false,
        unameexist:false,
        isTrue:false,
        ulist:[],
        file_pic:'',
        imageUrl:null,
        about_me:'',
    }
  },
  watch:{
    uname: function(newValue,oldValue){
        console.log(this.uname, newValue.length)
        if(this.uname.length<4){
            this.gthan4= true;
        }
        if(newValue.length>=4){
            
            this.gthan4= false;
        }
        if (newValue.length>20){
            this.lthan20=true;
        }
        if (newValue.length <=20){
            this.lthan20= false;
        }
        
        if(this.checkagain()){
            console.log(this.checkagain)
            this.unameexist=true;
        }
        if(!this.checkagain()){
            this.unameexist=false;
        }
        this.check()
        
        
        // console.log("Change in uname")
    },
    fname:function (newValue){
        if(this.fname==''){
            this.isTrue=false;
        } 
    },
    passw: function(newValue,oldValue){
        if(this.passw.length<4){
            this.pthan4= true;
        }
        else{
            this.pthan4= false;
        }
        this.check()
    },},
    mounted(){
        this.searchUser()
      },
  
    methods:{
        submitForm(event){

            let obj={
                "first_name": "Chaitanya",
                "last_name": "Mishra",
                "username": "username212",
                "profile_photo": "LKO",
                "about_me": "LKO",
                "password":"Password"
            }
            
                let file = this.file_pic
                let formData = new FormData();
                if (this.fname==''){
                    window.alert("First name required.")
                    return
                }
                formData.append('first_name', this.fname);
                formData.append('last_name', this.lname);
                formData.append('username', this.uname);
                formData.append('about_me', this.about_me);
                formData.append('password', this.passw);
                formData.append('image', file);
                // axios.post('/upload', formData)
                //   .then(response => {
                //     console.log(response.data);
                //   })
                //   .catch(error => {
                //     console.log(error);
                //   });
                fetch('/add_user', {
                    method: 'POST',
                    body: formData,
                  })
                  .then(response => {
                    window.alert("Profile Created Successfully. Please Login!")
                  })
                  .catch(error => {
                    console.log(error);
                  });
              
         
        },
        fileSelected(event){
            this.file_pic=event.target.files[0]
            console.log(event.target.files[0])
        },
        check() {
    
            // console.log(this.gthan4 , this.lthan20 , this.unameexist)
            if(!this.gthan4 && !this.lthan20 && !this.unameexist){
                this.isTrue= true;
            }
            else{
                this.isTrue= false;
            }
        },

     
        async searchUser(){
            try {
              const response = await fetch('/api/all_users/', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                mode: 'no-cors',
              });
              const data = await response.json();
              console.log(data);
              this.ulist=data;
              console.log(this.ulist)
              
            } catch (error) {
              console.log(error);
            }
          },

        checkagain(){
            
                if(this.ulist.includes(this.uname)){
                    return true;
                }
                else 
                return false;
        },},

}
export default signup



//STYLE
/* <style>
body {
    height:100vh;
    background:linear-gradient(45deg, #e0d956,#ec6fb2);
}

.card {
    background: hsla(0, 0%, 100%, 0.55);
    backdrop-filter: blur(30px);
}

img {
    border: 0;
    max-width: 100%;
    height: auto;
}
</style> */