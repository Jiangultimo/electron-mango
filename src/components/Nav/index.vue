<template>
  <div class="nav">
    <!-- <new-connect />
    <connected />
    <history /> -->
    <el-row class="tac">
      <el-col :span="24">
        <h5 class="title">Vue Electron MongoDB</h5>
        <el-menu default-active="2" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <el-menu-item v-for="(item, index) in navConfig" :key="item.key" :index="String(index)" @click="handleJump(item.path)" style="text-align: center;">
            <span slot="title">{{item.label}}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import History from '@/components/History/index.vue'
import NewConnect from '@/components/NewConnect/index.vue'
import navConfig from './nav.config'
import {
  Vue,
  Component,
  Watch
} from 'vue-property-decorator'
@Component({
  components: {
    History,
    NewConnect
  }
})
export default class Nav extends Vue {
  @Watch('navConfig')
  handleJump(link: string) {
    this.$router.push(link)
  }
  data() {
    return {
      navConfig: navConfig
    }
  }
}
</script>

<style lang="less" scoped>
.nav {
  display: flex;
  flex-direction: column;
}
.title{
  text-align: center;
}
</style>
