import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/layout' //布局页


Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, resolve, reject) {
    if ( resolve || reject ) return originalPush.call(this, location, resolve, reject)
    return originalPush.call(this, location).catch((e)=>{})
}
// 通用页面, 这里的配置不需要权限
export const constRouter = [
  {
      path: '/login',
      component: () => import('@/views/login/Login'),
      hidden: true //导航菜单忽略选项
  },

  {
      path: '',
      component: Layout, //应用布局页
      redirect: '/index',
      hidden: true,
  },
  {
      path: '/index',
      component: Layout, //应用布局页
      name: 'index',
      meta:{
          title: "首页", //导航菜单项标题
          icon: 'el-icon-edit' //导航菜单图标
      },
      children: [
        {
          path: '',
          component: () => import('@/views/index/index.vue'),
          name: 'indexs',
          meta: {
            title: "首页",
            icon: 'el-icon-edit',
            roles: ['admin']
          }
        }
      ]
  },
]

// 动态路由
export const asyncRoutes = [

  {
    path: '/plan',
    component: Layout,
    redirect: '/plan',
      children: [
          {
              path: '',
              component: () => import('@/views/tooling/Plan'),
              name: 'Plan',
              meta: { title: '项目计划', icon: 'el-icon-s-order', roles: ['admin'] }
          }]
  },
    {
        path: '/report',
        component: Layout,
        redirect: '/report',
        children: [
            {
                path: '',
                component: () => import('@/views/tooling/Report'),
                name: 'Report',
                meta: { title: '任务报工', icon: 'el-icon-edit-outline', roles: ['worker','admin'] }
            }]
    },

    {
        path: '/board',
        component: Layout,
        redirect: '/board',
        children: [
            {
                path: '',
                component: () => import('@/views/tooling/Board'),
                name: 'Board',
                meta: { title: '项目进度', icon: 'el-icon-data-board', roles: ['board','admin']}
            }]
    },



]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constRouter
})

export default router

