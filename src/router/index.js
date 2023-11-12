// 引入Vue|vue-router
import Vue from 'vue'
import Router from 'vue-router'

// 使用路由组件
Vue.use(Router)

/* 引入最外层骨架的一级组件 */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * 路由的配置：为什么不同的用户登录我们的项目  菜单(路由) 都是一样的
 * 需要把项目中的路由进行拆分
 * 常量路由：不管什么用户都可以看见的路由  比如 登陆 首页 404
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    // 访问 / 的时候重定向到下面的地址
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      // 设置侧边栏的第一个名字
      meta: { title: '首页', icon: 'dashboard' }
    }]
  }
  // ,
  // // 权限管理
  // {
  //   name: 'Acl',
  //   path: '/acl',
  //   component: Layout,
  //   redirect: '/acl/user/list',
  //   meta: {
  //     title: '权限管理',
  //     icon: 'el-icon-lock'
  //   },
  //   children: [
  //     {
  //       name: 'User',
  //       path: 'user/list',
  //       component: () => import('@/views/acl/user/list'),
  //       meta: {
  //         title: '用户管理',
  //       },
  //     },
  //     {
  //       name: 'Role',
  //       path: 'role/list',
  //       component: () => import('@/views/acl/role/list'),
  //       meta: {
  //         title: '角色管理',
  //       },
  //     },
  //     {
  //       name: 'RoleAuth',
  //       path: 'role/auth/:id',
  //       component: () => import('@/views/acl/role/roleAuth'),
  //       meta: {
  //         activeMenu: '/acl/role/list',
  //         title: '角色授权',
  //       },
  //       hidden: true,
  //     },
  //     {
  //       name: 'Permission',
  //       path: 'permission/list',
  //       component: () => import('@/views/acl/permission/list'),
  //       meta: {
  //         title: '菜单管理',
  //       },
  //     },
  //   ]
  // },
  // // 商品管理
  // {
  //   path: '/product',
  //   // 代表了该路由属于 Layout 骨架
  //   component: Layout,
  //   name: 'Product',
  //   meta: { title: '商品管理', icon: 'el-icon-goods' },
  //   // /product 路由的子路由
  //   children: [
  //     {
  //       path: 'trademark',
  //       name: 'Trademark',
  //       component: () => import('@/views/product/tradeMark'),
  //       meta: { title: '品牌管理' }
  //     },
  //     {
  //       path: 'attr',
  //       name: 'Attr',
  //       component: () => import('@/views/product/Attr'),
  //       meta: { title: '品牌属性管理' }
  //     },
  //     {
  //       path: 'spu',
  //       name: 'Spu',
  //       component: () => import('@/views/product/Spu'),
  //       meta: { title: 'Spu管理' }
  //     },
  //     {
  //       path: 'sku',
  //       name: 'Sku',
  //       component: () => import('@/views/product/Sku'),
  //       meta: { title: 'Sku管理' }
  //     }
  //   ]
  // }

]

/** 异步路由：不同的用户(角色)  需要过滤筛选出的路由 */
export const asyncRoutes = [
  // 权限管理
  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock'
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        component: () => import('@/views/acl/user/list'),
        meta: {
          title: '用户管理',
        },
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: {
          title: '角色管理',
        },
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权',
        },
        hidden: true,
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: {
          title: '菜单管理',
        },
      },
    ]
  },
  // 商品管理
  {
    path: '/product',
    // 代表了该路由属于 Layout 骨架
    component: Layout,
    name: 'Product',
    meta: { title: '商品管理', icon: 'el-icon-goods' },
    // /product 路由的子路由
    children: [
      {
        path: 'trademark',
        name: 'Trademark',
        component: () => import('@/views/product/tradeMark'),
        meta: { title: '品牌管理' }
      },
      {
        path: 'attr',
        name: 'Attr',
        component: () => import('@/views/product/Attr'),
        meta: { title: '品牌属性管理' }
      },
      {
        path: 'spu',
        name: 'Spu',
        component: () => import('@/views/product/Spu'),
        meta: { title: 'Spu管理' }
      },
      {
        path: 'sku',
        name: 'Sku',
        component: () => import('@/views/product/Sku'),
        meta: { title: 'Sku管理' }
      }
    ]
  },
  // 测试管理
  {
    path: '/test',
    // 代表了该路由属于 Layout 骨架
    component: Layout,
    name: 'Test',
    meta: { title: '测试管理', icon: 'el-icon-goods' },
    // /product 路由的子路由
    children: [
      {
        path: 'test1',
        name: 'Test1',
        component: () => import('@/views/Test/Test1'),
        meta: { title: '测试管理1' }
      },
      {
        path: 'test2',
        name: 'Test2',
        component: () => import('@/views/Test/Test2'),
        meta: { title: '测试管理2' }
      }

    ]
  }
]

/** 任意路由：当路径出现错误的时候 */
export const anyRoutes = [
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  // 因为注册的路由是(死的)  (活的)路由是根据不同用户可以展示不同菜单
  router.matcher = newRouter.matcher // reset router
}

export default router
