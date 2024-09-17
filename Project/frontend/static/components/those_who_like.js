const likers={
    data(){
        return{
            username:localStorage.getItem('username'),
            info:'',
        }
    },
    methods:{
        async fetchInfo(){
            fetch(`/api/like/${this.blogid}`)
            .then(response => response.json())
            .then(data => this.info=data)
            .catch(error => console.log(error))
        }
    },
    mounted(){
        this.fetchInfo()
    },
    template:`<body>
    <div class="container">
        <h2 class="mt-4 mb-4">LIKED BY:</h2>
        <span v-if="info.length==0">None</span>
        <ol class="list-group">
                <li v-for="i in info" class="list-group-item">
                    <div v-if="i.username==username">
                        <a href="/people/{i.username }">You</a>
                    </div>
                    <div v-else>
                        <a href="/people/{i.username }">{{ i.first_name }} {{ i.last_name }}</a>
                    </div>
                </li>
        </ol>
        <a :href="'/#/'+username+'/feed'" class="btn btn-secondary mt-4">Go back!</a>
    </div>
</body>`,
props:['blogid']
}

export default likers;