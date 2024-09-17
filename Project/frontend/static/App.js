
import homepage from "./components/homepage.js"
import signup from "./components/signup.js"
import self_profile from "./components/self_profile.js"
import edit_post from "./components/edit_self_post.js"
import following from "./components/people_you_follow.js"
import followers from "./components/your_followers.js"
import update_profile from "./components/update_profile.js"
import change_password from "./components/change_password.js"
import deactivate from "./components/deactivate.js"
import search from "./components/search.js"
import other_profile from "./components/other_profile.js"
import feed from "./components/feed_page.js"
import likers from "./components/those_who_like.js"
import exportblog from "./components/export.js"
import other_Follower from "./components/other_follower.js"
import other_following from "./components/other_following.js"
import logout from "./components/logout.js"
import store from "./store.js"
import unauthorized from "./components/unauthorized.js"
import display_picture from "./components/display_picture.js"
import import_blog from "./components/import_job.js"
Vue.component('Header',{ // Global Component
    template:`<div>{{this.name}}</div>`,
    data (){
        return {
            name :"Chaitanya Mishra",
            
        }
    },
})




const routes=[
    { path: '/', component: homepage},
    { path: '/signup', component: signup},
    { path: '/self/:username',name:'self_profile', component:self_profile},
    { path: '/self/:blogid/edit_post',name: 'edit-post',component: edit_post,props: true},
    { path: '/self/:username/followers', name:'followers',component: followers, props: true},
    { path: '/self/:username/following' , name:'following', component: following, props: true},
    { path: '/self/:username/update_profile', name:'update_profile', component: update_profile},
    { path :'/self/:username/change_password',name :'change_password', component: change_password },
    { path: '/self/:username/deactivate', name:'deactivate', component:deactivate},
    { path: '/self/search', name:'Search', component:search, props: true},
    { path: '/other/:other_username', name:'other_profile', component: other_profile},
    { path: '/:username/feed', name:'feed', component: feed},
    { path: '/feed/likedby', name:'likers', component: likers, props: true},
    { path: '/blog/export/:blogid', name:'export_blog', component: exportblog, props: true},
    { path: '/logout', component:logout},
    { path: '/other/:username/follower', name:'other_follower', component: other_Follower, props: true},   
    { path: '/picture/:image',    name: 'picture',    component: display_picture,    props: true},
    { path:'/other/:username/following', name:'other_following', component: other_following, props: true},
    { path:'/unauth', name:'unauthorized', component: unauthorized},
    { path:'/import_job', component:import_blog}
    // { path: '/self/:blogid/edit_post', component: edit_post},
    
]
const router= new VueRouter({
    routes,
})

const bodyOther={
    template:`<div>Body part</div>`
}
new Vue({
    el:'#app',
    // data(){
    //     return{
    //         description:"Image Desc",
    //     }
    // },
    store:store,
    template:`<div>
    <router-view></router-view>
 
    </div>`,
    //Use : to bind it with an object otherwise it treats it as a string
    methods:{

    },
    created() {
      // check if token has expired every minute
      setInterval(() => {
          const tokenExpiration = localStorage.getItem('token_expiration')
          if (tokenExpiration && new Date().getTime() > tokenExpiration * 1000) {
              localStorage.removeItem('access_token')
              localStorage.removeItem('token_expiration')
              this.$router.push('/logout')
          }
      }, 600)},
    router,
    
    components:{
         // Objects need to be registered here
        // 'body-Other':bodyOther,  // Giving it a different name
        // Footer1,
        // likers,
    },

})

