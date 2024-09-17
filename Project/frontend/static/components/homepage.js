const home={
    data(){
      return{
        username:'',
        password:'',
      }
    },
    methods:{
       async handleSubmit() {
        
          const url = '/login';
          const data = { 
            username: this.username,
            password: this.password,
          };
    
          try {
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
              },
              body: JSON.stringify(data)
            });
              
            if (!response.ok) {
              console.log("ERRRORRR")
              throw new Error('Network response was not ok');
            }
    
            const token = await response.json();
            console.log(token)
            this.token = token;
            localStorage.setItem('token_expiration',token.token_expiration)
            localStorage.setItem('token', token.access_token); // Store the token in local storage
            localStorage.setItem('username', this.username);
            console.log(this.token)
          } catch (error) {
            console.error('Error:', error);
          }
        
        const username1 = this.username; // replace with the actual username
        this.$router.push('/self/' + username1);
      },
    },
    template:`
    <body>
    
    <nav class="navbar navbar-light bg-light">
      <a class="navbar-brand" href="/need_help" style="float:left">Need Help?</a>
      <a class="navbar-brand" href="#" style="float:right">
        <img src="https://iili.io/HoMu2xj.md.jpg" width="30" height="30" class="d-inline-block align-top" alt="">
        BlogLite
      </a>
    </nav>
  
    <section class="vh-100">
      <div class="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-md-9 col-lg-6 col-xl-5">
            <img src="https://i.ibb.co/1ZykRnd/logo.jpg" class="img-fluid" alt="Sample image">
          </div>
          <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <h2 class="mt-1 mb-5 pb-1">Welcome to BlogLite</h2>
            <form method="POST" >
              
              <!-- Email input -->
              <div class="form-group">
                <input type="text" v-model="username" id="form3Example3" class="form-control form-control-lg"
                  placeholder="Enter a valid username"  name="user_id" required/>
                <label class="form-label" for="form3Example3">Username/Mobile</label>
              </div>
    
              <!-- Password input -->
              <div class="form-group">
                <input type="password" v-model="password" id="form3Example4" class="form-control form-control-lg"
                  placeholder="Enter password" name="pass" />
                <label class="form-label" for="form3Example4">Password</label>
              </div>
    
              <div class="d-flex align-items-center">
                <!-- Checkbox -->
                
                <a href="#!" class="text-body">Forgot password?</a><br>
                <div class="form-check ml-2">
                  <input class="form-check-input" type="checkbox" value="" id="form2Example3" name="check1" />
                  <label class="form-check-label" for="form2Example3">
                    Remember me
                  </label>
                </div></div>
                <div class="text-center text-lg-start mt-4 pt-2">
                  <button @click.prevent="handleSubmit" type="submit" class="btn btn-primary btn-lg"
                    style="padding-left: 2.5rem; padding-right: 2.5rem;">Login</button>
                  <p class="small fw-bold mt-2 pt-1 mb-0">Don't have an account? <a href="#/signup" class="link-danger">Register</a></p>
                </div></form></div></div></div>
                <router-link :to="'/import_job'" >Import From CSV</router-link>
                </section>
  <footer>
    <div class="container-fluid bg-primary py-4 px-2 px-md-5">
      <div class="row align-items-center justify-content-center justify-content-md-between">
        <div class="col-md-6 mb-3 mb-md-0 text-center text-md-start">
          <p class="text-white m-0">&copy; 2023 All rights reserved. MAD2 Project January 2023.</p>
        </div>
        <div class="col-md-6 text-center text-md-end">
          <a href="#!" class="text-white me-3">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a href="#!" class="text-white me-3">
            <i class="fab fa-twitter"></i>
          </a>
          <a href="#!" class="text-white me-3">
            <i class="fab fa-google"></i>
          </a>
          <a href="#!" class="text-white">
            <i class="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </div>
  </footer>
  </body>
    `,
    style:`
    .divider:after,
        .divider:before {
        content: "";
        flex: 1;
        height: 1px;
        background: #eee;
        }
        .h-custom {
        height: calc(100% - 73px);
        }
        @media (max-width: 450px) {
        .h-custom {
        height: 100%;
        }
        }
    `
    ,
    created(){
      localStorage.setItem('token_expiration','')
      localStorage.setItem('token', ''); // Store the token in local storage
      localStorage.setItem('username', '');
    },
    mounted() {
      // Add styles to the mounted component
      const styles = `.divider:after,
      .divider:before {
          content: "";
          flex: 1;
          height: 1px;
          background: #eee;
      }
      .h-custom {
          height: calc(100% - 73px);
      }
      @media (max-width: 450px) {
          .h-custom {
              height: 100%;
          }
      }`
      const style = document.createElement('style')
      style.appendChild(document.createTextNode(styles))
      document.head.appendChild(style)
    }
}
export default home;