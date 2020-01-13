import Vue from 'vue'
import Login from './src/Login.vue'
import axios from 'axios'
import VueCookies from 'vue-cookie'

Vue.use(axios)
Vue.use(VueCookies)

new Vue({
    el: '#app',
    components: { Login },
    template: '<Login>',
    render: h => h(Login)
})
