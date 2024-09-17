const display_picture={
    methods:{
        goBack() {
            this.$router.go(-1);
          }
    },
    template:`<div>
    
    <img :src="'../static/uploads/'+image" width=80% height=40%></img>
    <button @click=goBack> Go Back </button> 

    </div>
    `,
    props:['image']
}
export default display_picture