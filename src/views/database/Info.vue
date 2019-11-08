<template>
  <div>
    <el-table :data="data" border :stripe="true">
      <el-table-column align="center" prop="name" label="名称"/>
      <el-table-column align="center" prop="count" label="数据量">
        <template slot-scope="scope">
          {{readable(scope.row.count)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sizeOnDisk" label="占用空间">
        <template slot-scope="scope">
          {{readable(scope.row.sizeOnDisk)}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="totalIndexSize" label="索引占用空间">
        <template slot-scope="scope">
          {{readable(scope.row.totalIndexSize)}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="jump(scope.row.name)" icon="el-icon-document"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { DbBelong, parserMongoStr, Mongo2Str } from '@/utils/utils'
import {
  Collect
} from '@/type/database'
@Component
export default class dbInfo extends Vue {
  belong: DbBelong = { link: '' }
  data: Array<Collect> = []

  @Watch('$route.params.id')
  changeDb(val: string) {
    this.belong = parserMongoStr(this.$route.params.id)
    this.data = [...this.$store.state.db.treeData.get(this.belong.link).child.get(this.belong.db).child.values()]
  }

  readable(num:number):string{
    let unit=['b','K','M','G']
    let level=0
    while (num>1024 && level<3) {
      num/=1024
      level+=1
    }
    if (level>0){
      return num.toFixed(1)+' '+unit[level]
    }else{
      return num.toString()
    }
  }

  jump(name:string){
    let collection:DbBelong=Object.assign({},this.belong)
    collection.collect=name
    this.$router.push(`/collection/${Mongo2Str(collection)}/info`)
  }
  created() {
    this.changeDb(this.$route.params.id)
  }
  beforeDestroy() {
    this.$store.commit('OFF_EVENT', this._uid)
  }
}
</script>

<style lang="less" scoped>
</style>
