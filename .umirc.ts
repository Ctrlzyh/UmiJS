import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  title:'loading...',
  links: [
    // href的图片你可以放在public里面，直接./图片名.png 就可以了，也可以是cdn链接
    { rel: 'icon', href: './assets/login_top_logo.ico' },
  ],
  routes: [
    {
      path: '/',
      redirect: '/login',
      history: 'hash',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
      menuRender: false,
      headerRender: false,
      history: 'hash',
    },
    {
      name: '登录',
      path: '/login',
      component: './Login',
      menuRender: false,
      headerRender: false,
      history: 'hash',
    },
    {
      name: '注册',
      path: '/register',
      component: './Register',
      menuRender: false,
      headerRender: false,
      history: 'hash',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
      menuRender: false,
      headerRender: false,
      history: 'hash',
    },
  ],
  npmClient: 'yarn',
  // base: '/cms/',
  // publicPath: './',

  proxy: {
    '/api': {
      'target': 'http://heymock.uneedcode.com/',
      'changeOrigin': true,
      'pathRewrite': { '^/api' : 'mock/5fcb3bdb1f1f08da' },
    },
  },
});

