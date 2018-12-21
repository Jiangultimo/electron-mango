<template>
<el-row class="tac">
  <el-col :span="24">
    <el-menu :default-active="defaultActive" class="el-menu-vertical-demo" mode="horizontal">
      <el-menu-item v-for="(nav, index) in navs" :index="`${index}`" :key="index">
        <router-link :to="nav.link">
          <i class="el-icon-setting"></i>
          <span>{{nav.label}}</span>
        </router-link>
      </el-menu-item>
    </el-menu>
  </el-col>
</el-row>
</template>

<script>
export default {
  data () {
    return {
      defaultActive: '0',
      navs: [
        {
          link: '/',
          label: 'Electron-Mango',
          index: '0'
        }, {
          link: '/database/add',
          label: '添加数据库',
          index: '1'
        }, {
          link: '/about',
          label: '关于electron-mango',
          index: '2'
        }
      ]
    }
  },
  mounted () {
    this.afterRefreshPage()
  },
  methods: {
    // 页面刷新之后激活正确的路由
    afterRefreshPage () {
      const curAddr = window.location.hash.replace(/#\//g, '')
      const curRoute = this.navs.find(item => item.link.includes(curAddr))
      this.defaultActive = curRoute.index
    }
  }
}
</script>

<style lang="less" scoped>
.tac{
  a{
    text-decoration: none;
  }
}
</style>
