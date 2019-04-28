import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index')
      }
    ]
  },

  {
    path: '/wallet',
    component: Layout,
    redirect: '/wallet/userlist',
    name: 'Wallet',
    meta: { title: '用户&钱包', icon: 'wallet' },
    hidden: false,
    children: [
      {
        path: 'userlist',
        meta: { title: '用户列表' },
        component: () => import('@/views/wallet/UserList')
      },
      {
        path: 'withdrawlist',
        meta: { title: '提币列表' },
        component: () => import('@/views/wallet/WithdrawList')
      },
      {
        path: 'depositlist',
        meta: { title: '存币列表' },
        component: () => import('@/views/wallet/DepositList')
      }
    ]
  },

  {
    path: '/vendor',
    meta: { title: '商户', icon: 'vendor' },
    component: Layout,
    redirect: '/vendor/vendorlist',
    name: 'Vendor',
    hidden: false,
    children: [
      {
        path: 'vendorlist',
        meta: { title: '商户列表' },
        component: () => import('@/views/vendor/VendorList')
      },
      {
        path: 'vendorconfig',
        meta: { title: '商户配置' },
        component: () => import('@/views/vendor/VendorConfig')
      },
      {
        path: 'vendorapply',
        meta: { title: '商户申请' },
        component: () => import('@/views/vendor/VendorApply')
      }
    ]
  },

  {
    path: '/trade',
    meta: { title: '交易', icon: 'trade' },
    component: Layout,
    redirect: '/trade/buy',
    name: 'Trade',
    hidden: false,
    children: [
      {
        path: 'buy',
        meta: { title: '兑换交易-买' },
        component: () => import('@/views/trade/Buy')
      },
      {
        path: 'sell',
        meta: { title: '兑换交易-卖' },
        component: () => import('@/views/trade/Sell')
      },
      {
        path: 'record',
        meta: { title: '兑换记录' },
        component: () => import('@/views/trade/Record')
      }
    ]
  },

  {
    path: '/discovery',
    meta: { title: '发现', icon: 'discovery' },
    component: Layout,
    redirect: '/discovery/index',
    name: 'Discovery',
    hidden: false,
    children: [
      {
        path: 'index',
        component: () => import('@/views/discovery/index')
      }
    ]
  },

  {
    path: '/finance',
    meta: { title: '理财管理', icon: 'finance' },
    component: Layout,
    redirect: '/finance/orderlist',
    name: 'Finance',
    hidden: false,
    children: [
      {
        path: 'productlist',
        meta: { title: '产品列表' },
        component: () => import('@/views/finance/ProductList')
      },
      {
        path: 'orderlist',
        meta: { title: '订单列表' },
        component: () => import('@/views/finance/OrderList')
      }
    ]
  },

  {
    path: '/permission',
    meta: { title: '权限', icon: 'permission' },
    component: Layout,
    redirect: '/permission/systemuser',
    name: 'Permission',
    hidden: false,
    children: [
      {
        path: 'systemuser',
        meta: { title: '系统用户' },
        component: () => import('@/views/permission/SystemUser')
      },
      {
        path: 'rolelist',
        meta: { title: '角色列表' },
        component: () => import('@/views/permission/RoleList')
      },
      {
        path: 'perimissionlist',
        meta: { title: '权限列表' },
        component: () => import('@/views/permission/PermissionList')
      }
    ]
  },

  {
    path: '/information',
    meta: { title: '信息设置', icon: 'info' },
    component: Layout,
    redirect: '/information/announcement',
    name: 'Information',
    hidden: false,
    children: [
      {
        path: 'announcement',
        meta: { title: '公告设置' },
        component: () => import('@/views/information/Announcement')
      },
      {
        path: 'banner',
        meta: { title: 'banner设置' },
        component: () => import('@/views/information/Banner')
      },
      {
        path: 'application',
        meta: { title: 'app版本设置' },
        component: () => import('@/views/information/Application')
      }
    ]
  },

  {
    path: '/configuration',
    meta: { title: '配置', icon: 'config' },
    component: Layout,
    redirect: '/configuration/basic',
    name: 'configuration',
    hidden: false,
    children: [
      {
        path: 'basic',
        meta: { title: '基本配置' },
        component: () => import('@/views/configuration/Basic')
      },
      {
        path: 'currency',
        meta: { title: '币种配置' },
        component: () => import('@/views/configuration/Currency')
      },
      {
        path: 'convert',
        meta: { title: '兑换配置' },
        component: () => import('@/views/configuration/Convert')
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
