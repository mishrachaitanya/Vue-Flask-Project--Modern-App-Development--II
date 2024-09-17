const exportblog= {
    data() {
      return {
        url:'',
        blogid: '',
        username: '',
        title: '',
        caption: '',
        image: '',
        time:'',
        email:''
      }
    },
    methods: {
        async fetchBlog() {
            await fetch(`/api/blog/${this.blogid}`)
            .then(response => response.json())
            .then(data => {
                this.username=data.username;
                this.title=data.title;
                this.caption=data.caption;
                this.image=data.image;
                this.time=data.time;
                })
            .catch(error =>{
                console.log(error)
                window.alert("Unable to perform the operation")
            })
            },
            
            exportBlog() {
              const blogData = {
                blogid: this.blogid,
                username: this.username,
                title: this.title,
                caption: this.caption,
                image: this.image,
                time: this.time,
              };
              const dataStr =
                "data:text/csv;charset=utf-8," +
                "blogid,username,title,caption,image,time\n" +
                Object.values(blogData).join(",") +
                "\n";
              const downloadAnchorNode = document.createElement("a");
              downloadAnchorNode.setAttribute("href", encodeURI(dataStr));
              downloadAnchorNode.setAttribute("download", "blogpost.csv");
              document.body.appendChild(downloadAnchorNode);
              downloadAnchorNode.click();
              downloadAnchorNode.remove();
            },
            
      sendasemail(){
        fetch(`/export_file/${this.blogid}/${this.email}`)
        .then(response => response.json())
        .then(data => window.alert("You'll get it soon!"))
        .catch(error =>{
          window.alert("Something wrong")
        console.error(error)})}
      
    },
    mounted(){
        this.url=window.location.href

        const f=this.url.split("/")
        const l=f.length
        this.blogid=f[l-1]

        this.fetchBlog()
    },
    template:`
    <div style="text-align: center;padding-top:15%">
    <div >
    <!-- Blog post content goes here -->
    <button @click="exportBlog" class="btn btn-primary">Click here to export</button><br>
    <button @click="sendasemail"> Or send as an email? Enter:</button>
    <input type="text" v-model="email"/>
    <br><br><br><br><router-link :to="'/self/'+username">Go back</router-link>
  </div>
</div>

`,
  }
  export default exportblog
  