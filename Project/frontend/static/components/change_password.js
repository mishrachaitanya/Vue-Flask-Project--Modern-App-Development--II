const change_password={
    data(){
        return{
            old_password:'',
            new_password:'',
            checkP:false,
            noMatch:false,
            username:localStorage.getItem('username')
        }
    },
    watch:{
        new_password(newVal,oldVal){
            if(newVal.length < 6 || newVal.length >20){
                this.checkP=true;

            }
            else
                this.checkP=false;
        }
    },
    methods:{
        submitForm(){
            const formD=new FormData()
            formD.append('old_password',this.old_password)
            formD.append('new_password', this.new_password)
            fetch(`/api/change_password/${this.username}`,{
            method:'PUT',
            body:formD
            })
            .then(response => response.json())
            .then(data=>{
                if (data == "NOMATCH"){
                    this.noMatch=true;
                    setTimeout(() => {
                        // Code to execute after 2 minutes
                        this.noMatch = false;
                      }, 4000);
                }
                else{
                    window.alert("Password Changed Successfully!")

                }
            }).catch(error => console.error(error))

        },

    },
    
    template:`
    <body>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-sm-12 col-md-6 col-lg-6">
                <h3 class="text-center mt-4 mb-4"><u>Update Details:</u></h3>
                <form method="POST">
                    <div class="form-group">
                        <label for="inputPassword6">Old Password</label>
                        <input v-model="old_password" type="password" name="oldp" id="inputPassword6" class="form-control" placeholder="Enter old password"  required>
                        <p id="passwordHelp" class="form-text text-muted">
                        </p>
                    </div>
                    <br>
                    <div class="form-group">
                        <label for="inputPassword6">New Password&nbsp;</label>
                        <input v-model="new_password" type="password" name="newp" id="inputP" class="form-control"  required>
                        <p id="passwordHelp" class="form-text text-muted">
                            Must be 6-20 characters long.
                        </p>
                    </div>
                    <br>
                    <div v-show="checkP" class="alert alert-info" role="alert">
                        Make sure your password is 4-20 characters long.
                    </div>
                    <div v-show="noMatch" class="alert alert-warning" role="alert">
                        You provided wrong password
                    </div>
                    <button @click.prevent="submitForm" class="btn btn-primary btn-block" type="submit">Submit</button>

                    </form>
                    <a :href="'/#/self/'+this.username"> <button  class="btn btn-link">Click here to go Back!</button></a>

            </div>

        </div>
     </div>
    </body>
    `,
    style:``,
}
export default change_password;


