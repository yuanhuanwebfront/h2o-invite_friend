import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home'
import detail from '@/components/detail'
import register from '@/components/register'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: home
        }, {
            path: '/detail',
            name: 'detail',
            component: detail
        },{
            path: '/register',
            name: 'register',
            component: register
        }
    ]
})
