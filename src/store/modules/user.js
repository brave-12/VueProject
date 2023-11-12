// 引入登录|退出登录|获取用户信息的接口函数
import { login, logout, getInfo } from '@/api/user'
// 获取token|设置token|删除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 路由模块当中重置路由的方法
import { anyRoutes, resetRouter, asyncRoutes, constantRoutes } from '@/router';
import router from '@/router'

// 箭头函数
const getDefaultState = () => {
  return {
    // 获取 token
    token: getToken(),
    // 存储用户名
    name: '',
    // 存储用户图像
    avatar: '',
    // 服务器返回的菜单信息(根据不同的角色：返回的标记信息，数组里面的元素是字符串)
    routes:[],
    // 按钮权限信息
    buttons:[],
    // 角色信息
    roles:[],
    // 对比之后(项目中已有的异步路由 与服务器返回的标记信息进行对比最终需要展示的理由)
    resultAsyncRoutes:[],
    // 用户最终需要展示的全部路由
    resultAllRoutes:[],
  }
}

const state = getDefaultState()

// 唯一修改state的地方
const mutations = {
  // 重置state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    // 用户名、用户头像、菜单权限标记、按钮权限标记、角色信息
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.routes = userInfo.routes
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },
  // 最终计算出来的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    // vuex 保存当前用户的异步路由  注意  一个用户需要展示完成路由：常量、异步、任意路由
    state.resultAsyncRoutes = asyncRoutes
    // 计算出当前用户需要展示的所有路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes, anyRoutes)
    // 给路由器添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

// actions
const actions = {
  // 处理登录业务
  async login({ commit }, userInfo) {
    // 解构出用户名与密码
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    // console.log(result);
    if (result.code==20000) {
      // vuex 存储token
      commit('SET_TOKEN', result.data.token)
      // 本地化持久存储token
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
    // 老的写法：没有使用 async 和 await
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // 获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 获取用户信息：返回数据包含  用户名name、用户头像avatar、routes[返回的标志：不同的用户应该展示哪些菜单的标记]
        // roles：用户角色信息  buttons[按钮的权限信息]
        const { data } = response
        // vuex 存储用户的全部信息
        commit('SET_USERINFO', data)
        commit('SET_RESULTASYNCROUTES', computedAsyncRoutes(asyncRoutes, data.routes))
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

/** 定义一个函数：两个数组进行对比  对比出当前用户到底显示哪些异步路由
 * asyncRoutes 是路由器返回真实的   routes 是全部  然后对于这些数据进行过滤
 */
const computedAsyncRoutes = (asyncRoutes, routes) => {
  // 过滤出当前用户【超级管理员|普通员工】需要展示的异步路由  item 具体代表每一项
  return asyncRoutes.filter(item => {
    // 数组当中没有这个元素返回索引值为 -1  如果有这个元素返回的索引值一定不是 -1
    if (routes.indexOf(item.name)!=-1) {
      // 递归   为了验证二级路由三级路由等等
      if (item.children && item.children.length) {
        // 吧孩子项目进行验证是否匹配
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

