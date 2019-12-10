<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="表名">
        <el-select v-model="mbelong.collect">
          <el-option v-for="x in collections" :key="x" :value="x" :label="x" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作">
        <el-select v-model="method">
          <el-option v-for="(x,key) in methods" :key="key" :value="key" :label="x.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="参数">
        <el-input type="textarea" :autosize="true" v-model="param" clearable></el-input>
        <span>多个参数用逗号分隔</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sub">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import {
  Vue,
  Component,
  Prop
} from 'vue-property-decorator'
import { DbBelong } from '@/utils/utils'
import { parseFilter } from "mongodb-query-parser"
import { Link } from '@/type/database'
import { mongo } from '@/type/ipc'
export interface restoreData {
  belong: DbBelong
  method: string
  param: string
}

const METHODS: {
  [key: string]: {
    name: string,
    param: number
  }
} = {
  'deleteMany': {
    name: '删除多条记录',
    param: 1
  },
  'modMany': {
    name: '修改多条记录',
    param: 2
  },
}

@Component
export default class CustomCmd extends Vue {
  collections: Array<string> = []
  @Prop()
  belong!: DbBelong
  @Prop({ default: null })
  restoreData!: restoreData | null
  mbelong: DbBelong = { link: '' }
  methods = METHODS
  method: string = 'modMany'
  param: string = ''
  treeData: Map<string, Link> = new Map()

  created() {
    this.treeData = this.$store.state.db.treeData
    this.restore(this.restoreData)
  }
  save(): restoreData {
    console.log('cc save')
    return {
      belong: this.mbelong,
      method: this.method,
      param: this.param
    }
  }
  restore(data: restoreData | null): void {
    console.log('cc restore')
    if (data) {
      this.mbelong = data.belong
      this.method = data.method
      this.param = data.param
    } else {
      this.mbelong = Object.assign({}, this.belong)
      this.param = ''
    }
    let collections = this.treeData.get(this.mbelong.link)!.child.get(this.mbelong.db!)!
    this.collections = [...collections.child!.keys()]
  }
  sub() {
    let res = []
    try {
      res = parseFilter(`[${this.param}]`)
    } catch (error) {
      this.$notify.error('参数错误！' + error.toString())
      return
    }
    if (res.length != this.methods[this.method].param) {
      this.$notify.error('参数数量不对，请检查参数！')
      return
    }
    this.$store.commit('ADD_EVENT', {
      vueId: this._uid,
      handle: (data: mongo) => {
        this.$message.success(data.data)
      }    })
    const req: mongo = Object.assign({
      action: this.method,
      eventId: this.$store.state.db.eventId,
      data: res
    }, this.belong)
    this.$ipc.send('mongoReq', req)
  }
}
</script>

<style lang="less" scoped>
</style>
