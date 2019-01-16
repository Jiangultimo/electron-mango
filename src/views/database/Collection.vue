<template>
  <div>
    <p>I'll show collect info {{belong.collect}}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { DbBelong, parserMongoStr } from '@/utils/utils'

@Component
export default class collectInfo extends Vue {
  belong:DbBelong={link:''}

  @Watch('$route.params.id')
  changeCollect(val:string){
    this.belong=parserMongoStr(this.$route.params.id)
  }
  created(){
    this.changeCollect(this.$route.params.id)
  }
  beforeDestroy(){
    this.$store.commit('OFF_EVENT',this._uid)
  }
}
</script>

<style lang="less" scoped>
</style>
