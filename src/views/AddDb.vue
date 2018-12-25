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

<script>
import mongoUri from '@/utils/MongoUri'
const { MongoClient } = window.require('mongodb')
const { ipcRenderer, remote } = window.require('electron')
export default {
  methods: {
    test () {
      this.form.uri = mongoUri.format(this.params)
      console.log(this.form.uri)
      var client = new MongoClient(this.form.uri, { useNewUrlParser: true })
      client.connect((err) => {
        if (err != null) {
          this.$message.error(err.message)
          return false
        } else {
          client.close()
          this.$message.success('连接成功！')
        }
      })
    },
    save () {
      this.form.uri = mongoUri.format(this.params)
      ipcRenderer.send('reqaction', this.form)
    }
  },
  created () {
    if ('key' in this.$route.params) {
      const key = this.$route.params.key
      let data = remote.getGlobal('shared').dbList
      if (key in data) {
        let params = mongoUri.parse(data[key].uri)
        this.form = {
          action: 'editDb',
          key,
          name: data[key].name,
          uri: data[key].uri
        }
        this.params = params
      }
    }
  },
  data () {
    return {
      params: {
        username: '',
        password: '',
        hosts: {
          host: 'localhost',
          port: 27017
        },
        database: '',
        options: ''
      },
      form: {
        action: 'addDb',
        key: '',
        name: '',
        uri: ''
      }
    }
  },
  mounted () {
    ipcRenderer.on('resaction', (event, arg) => {
      if (arg.action === 'addDb') {
        if (arg.status) {
          window.close()
        } else {
          this.$notify.error({
            title: '添加失败',
            message: arg.info
          })
        }
      }
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
