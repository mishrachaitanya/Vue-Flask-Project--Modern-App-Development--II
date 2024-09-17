const upload_image={
  data(){
    return{
      title:'',
      caption:'',
      image_file:'',
    }
  },
  methods:{
    getSubmitData(){
      obj={
        title:this.title,
        caption:this.caption,
        file:this.image_file,
      }
      
    }
  }
  ,
    template:`
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
              <form method="POST" enctype="multipart/form-data">      
              <div class="form-group">
                  <label for="title1">Title</label>
                  <input class="form-control" v-model="title" name="title" type="text" placeholder="Default input" id="title1" required>
                  <br>
                  <label for="exampleFormControlTextarea1">Caption/Description</label>
                  <textarea name="caption" v-model="caption" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
              </div>
              <label class="form-label" for="customFile">Upload </label>
              <input type="file" class="form-control"name="pic2" id="customFile" />
          </div>
          <div class="modal-footer">      
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="submit" @click="getSubmitData" name="upload_submit" class="btn btn-primary">Save changes</button>
              </form>
          </div>
        </div>
      </div>
    </div>`
}
export default upload_image