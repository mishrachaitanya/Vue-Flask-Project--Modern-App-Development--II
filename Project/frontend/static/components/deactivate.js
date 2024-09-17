const deactivate={
    data(){
        return{
          password:'',
          username:localStorage.getItem('username'),

        }
    },
    methods:{
      submitForm(){
        let formData=new FormData()
        formData.append('password',this.password)
        fetch(`/api/delete/${this.username}`,{
          method:'DELETE',
          body: formData
        }).then(response =>response.json())
        .then(data => {
          if (data=="YES"){
            localStorage.setItem('username','')
            localStorage.setItem('token','')
            window.alert("Account Deleted!")
            this.$router.push('/');

          }
          else{
            window.alert("Wrong Password")
          }
        })
      }
    },
    template:`<body>
    <h1>Thank you for your journey with us. Cheers!</h1>
    <br><br><h4>Deactivation:</h4>
    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
        Delete Account
      </button>

      <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Confirmation:</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
                <form class="form-inline" method="POST">
                    <div class="form-group">
                      <label for="inputPassword6">Password</label>
                      <input v-model="password" type="password" name="passw" id="inputPassword6" class="form-control mx-sm-3" aria-describedby="passwordHelpInline">
                      <small id="passwordHelpInline" class="text-muted">
                        Please confirm your identity
                      </small>&nbsp;&nbsp;
                    </div>
                  
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button @click.prevent="submitForm" type="submit" class="btn btn-primary">Submit</button>
            </div></form>
          </div>
        </div>
      </div><br><br><br><br>
      <a :href="'/#/self/'+this.username"> Changed your mind? Click here</a>
      </body>`,
    style:``,
}

export default deactivate