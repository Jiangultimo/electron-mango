<template>
  <div class="connect">
    <prev-route :prev="'/'" />
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="链接URI">
        <el-input v-model="form.uri"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import PrevRoute from '@/components/PrevRoute/'
const { ipcRenderer } = window.require('electron')
export default {
  components: {
    PrevRoute
  },
  methods: {
    save () {
      ipcRenderer.send('reqaction', this.form)
    }
  },
  data () {
    return {
      form: {
        action: 'addDb',
        name: 'localhost',
        uri: 'mongodb://localhost:27017/'
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
