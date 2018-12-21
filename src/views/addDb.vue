<template>
  <div>
    名称：
    <input type="text" v-model="d.name">
    <br>连接URI:
    <input type="text" v-model="d.uri">
    <button @click="save">保存</button>
  </div>
</template>

<script>
// const { ipcRenderer } = require('electron')
export default {
  components: {},
  methods: {
    save () {
      // ipcRenderer.send('addDb', this.d)
    }
  },
  data () {
    return {
      d: {
        name: '',
        uri: 'mongodb://[2400:a480:1:2::48]:27017/'
      }
    }
  }
}
</script>
