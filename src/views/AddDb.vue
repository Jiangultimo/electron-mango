<template>
  <div class="connect">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="form.name" minlength="1"></el-input>
      </el-form-item>
      <el-form-item label="服务器地址">
        <el-input v-model="params.hosts.host"></el-input>
      </el-form-item>
      <el-form-item label="数据库端口">
        <el-input v-model="params.hosts.port"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="params.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="params.password"></el-input>
      </el-form-item>
      <el-form-item label="数据库">
        <el-input v-model="params.database"></el-input>
      </el-form-item>
      <el-form-item label="其他参数">
        <el-input v-model="params.options" placeholder="reconnectTries=30&authSource=admin"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="test">测试连接</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import mongoUtil,{mongoUri} from '@/utils/MongoUri'
const { MongoClient } = window.require('mongodb')
const { ipcRenderer, remote } = window.require('electron')
import { Component, Vue } from 'vue-property-decorator'
import {notify} from '@/type/ipc'
@Component
export default class addDb extends Vue {
  params:mongoUri= {
    username: '',
    password: '',
    hosts: {
      host: 'localhost',
      port: 27017
    },
    database: '',
    options: ''
  }
  form = {
    action: 'addDb',
    key: '',
    name: '',
    uri: ''
  }
  test () {
    this.form.uri = mongoUtil.format(this.params)
    var client = new MongoClient(this.form.uri, { useNewUrlParser: true })
    client.connect((err:Error) => {
      if (err != null) {
        this.$message.error(err.message)
        return false
      } else {
        client.close()
        this.$message.success('连接成功！')
      }
    })
  }
  save () {
    this.form.uri = mongoUtil.format(this.params)
    ipcRenderer.send('reqaction', this.form)
  }
  created () {
    document.title = '添加连接'
    if ('key' in this.$route.params) {
      const key = this.$route.params.key
      let data = remote.getGlobal('shared').dbList
      if (key in data) {
        document.title = '修改连接'
        let params = mongoUtil.parser(data[key])
        this.form = {
          action: 'editDb',
          key,
          name: key,
          uri: data[key]
        }
        this.params = params
      }
    }
  }
  mounted () {
    ipcRenderer.on('resaction', (event:Error, arg:any) => {
      if (arg.action === 'addDb' || arg.action === 'editDb') {
        window.close()
      }
    })
    ipcRenderer.on('notify', (event:Error, arg:notify) => {
      this.$message({
        type: arg.type || 'error',
        message: arg.message
      })
    })
  }
}
</script>

<style lang="less" scoped>
.connect{
  width: 600px;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -300px;
  // transform: translate(-50%, -50%);
}
</style>
