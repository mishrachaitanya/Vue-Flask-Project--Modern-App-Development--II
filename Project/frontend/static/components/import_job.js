const import_blog={
  
    template:`
    <div>
        Upload Here as CSV
      <input type="file" @change="handleFileUpload">
        <a href="/#/">Go back</a>
    </div>
  `,
    methods:{
        
            handleFileUpload(event) {
              const file = event.target.files[0];
              const formData = new FormData();
              formData.append('file', file);
        
              fetch('/api/csv_upload/', {
                method: 'POST',
                body: formData
              })
                .then(response => response.json())
                .then(data => {
                    if (data=="Success")
                    window.alert("Success")
                  // Handle the API response data
                })
                .catch(error => {
                  console.error(error)
                });
            }
          
          
    }
}

export default import_blog