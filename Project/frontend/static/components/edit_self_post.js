const edit_post={
    data(){
        return{
          old_title:'',
          old_caption:'',
          new_title:'',
          new_caption:'',
          username:localStorage.getItem('username'),
        }
    },
    methods:{
      async changeTitle(){
          let dataobj={
            "title":this.new_title
          }
          fetch(`/api/edit_title/${this.blogid}`,{
          method:'PUT',
          headers:{
            'Content-Type':'application/json'},
          body:JSON.stringify(dataobj)
        }).then(response =>{
          console.log(response.json())
        }).then(data => console.log(data)).catch(error => console.error(error))
        window.location.reload();

      },
      async changeCaption(){
        const url = `/api/edit_caption/${this.blogid}`;
        const options = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            caption: this.new_caption
          })
        };
      
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          console.log(data); // log the response data to the console
        } catch (error) {
          console.error(error);
        }
        window.location.reload();
      },
      goBack() {
        this.$router.go(-1);
        
      },
      deletePost(){
        fetch(`/api/blog/${this.blogid}`, {
          method: 'DELETE'
        }).then(response =>{
          this.$router.push('/self/'+this.username);
          window.location.reload()
        })
      },
      fetchData(){
        fetch(`/api/blog/${this.blogid}`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          this.old_title=data.title;
          this.old_caption=data.caption;
          
        }).catch(error =>{
          console.error(error)
        });
        
      },
    },
    mounted(){
      this.fetchData();
    },
    template:`
    <body >

    <form method="POST" enctype="multipart/form-data">
    <div class="form-group">
      <label for="exampleFormControlInput1">Current Title:&nbsp;{{this.old_title}}</label>
      <input v-model=new_title type="text" class="form-control" name="title" id="exampleFormControlInput1" placeholder="_title_">
      <button type="submit" @click.prevent="changeTitle" class="btn btn-primary mb-2">Change Title</button><br>
    </div>
    
    <div class="form-group">
      <label for="exampleFormControlTextarea1">Current Caption:&nbsp;{{this.old_caption}}</label>
      <textarea v-model="new_caption" class="form-control" name="caption" id="exampleFormControlTextarea1" rows="3"></textarea>
      <button type="submit" @click.prevent="changeCaption" class="btn btn-primary mb-2">Change Caption</button>
    </div>
    
    <br>
    
    <!--<div class="form-group">
        <label for="exampleFormControlFile1">Change Image:</label>
        <input type="file" name="change_image" class="form-control-file" id="exampleFormControlFile1">
        <button type="submit" class="btn btn-primary mb-2">Change Image</button><br>-->
  
    </div></form>
    <button type="button" @click="goBack" class="btn btn-primary btn-lg btn-block">Done Editing</button>
        <h3>OR </h3><br>
        <button type="button" data-toggle="modal" data-target="#newmodal" class="btn btn-primary btn-lg" >Delete post?</button>
        
        <div class="modal" tabindex="-1" role="dialog" id="newmodal">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>This will permanently delete the blog. This action cannot be undone!</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button @click.prevent="deletePost" type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    
        </body>
    `,
    props:['blogid']
}
export default edit_post