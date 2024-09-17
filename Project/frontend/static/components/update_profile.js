const update_profile={
    data(){
        return{
          fname:'',
          lname:'',
          username:'',
          image_file:'',
          about_me:'',
          username:localStorage.getItem('username')
        }
    },
    methods:{
      submitForm(){
                let file = this.file_pic
                let formData = new FormData();
                formData.append('first_name', this.fname);
                formData.append('last_name', this.lname);
                formData.append('about_me', this.about_me);
                formData.append('image', file);

                let obj={
                  'first_name': this.fname,
                  'last_name': this.lname,
                  'about_me': this.about_me,
                  'image': file,
                }
                fetch(`/api/users/${this.username}`, {
                    method: 'PUT',
                    body: formData,
                    // headers:{
                    //   'Content-Type':'multipart/form-data'
                    // }
                  })
                  .then(response => {
                    console.log(response.json())
                    window.alert("Updated Successfully")
                  })
                  .catch(error => {
                    console.log(error);
                  });
      },
      fileSelected(event){
        this.file_pic=event.target.files[0]
        console.log(event.target.files[0])
    },
    },

    template:`<body style="background-color: rgb(254, 254, 254);">
    
    <div class="container">
      <h3 class="mt-3"><u>Update Details:</u></h3>
      <form method='POST' enctype="multipart/form-data">
        <div class="row">
          <div class="col-sm-6">
            <div class="form-group">
              <label for="fname">First Name</label>
              <input v-model="fname "type="text" class="form-control" name="fname" id="fname" placeholder="First name">
            </div>
          </div>
          <div class="col-sm-6">
            <div class="form-group">
              <label for="lname">Last Name</label>
              <input v-model="lname" type="text" class="form-control" name="lname" id="lname" placeholder="Last name">
            </div>
          </div>
        </div>
      
        <div class="form-group">
          <label for="exampleFormControlTextarea1">About me:</label>
          <textarea v-model="about_me" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
        </div>
        
        <div class="form-group">
          <label class="form-label" for="customFile">Profile Picture</label>
          <input type="file" @change="fileSelected" class="form-control-file" name="dp" id="customFile">
        </div>

        <button @click.prevent="submitForm" class="btn btn-primary" type="submit">Submit</button>

        </form>
        <a :href="'/#/self/'+this.username">Click Here to go back. </a>
    </div>

</body>`,

}

export default update_profile;