<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="fitter">
        <el-input v-model="query.fitter"/>
      </el-form-item>
      <el-form-item label="project">
        <el-tag
          v-for="(v,k) in query.project"
          :key="k"
          closable
          :disable-transitions="false"
          @close="removeProject(k)"
        >{{v==1?'显示':'隐藏'}} {{k}}</el-tag>
        <el-input
          v-if="newProject.show"
          v-model="newProject.value"
          @keyup.enter.native="projectConfirm"
        >
          <template slot="append">
            <el-select v-model="newProject.display">
              <el-option label="显示" :value="1"/>
              <el-option label="隐藏" :value="-1"/>
            </el-select>
          </template>
        </el-input>
        <el-button v-else @click="newProject.show=true" icon="el-icon-plus">project</el-button>
      </el-form-item>
      <el-form-item label="sort">
        <el-tag
          v-for="(v,k) in query.sort"
          :key="k"
          closable
          :disable-transitions="false"
          @close="removeSort(k)"
        >{{v==1?'升序':'降序'}} {{k}}</el-tag>
        <el-input
          v-if="newSort.show"
          v-model="newSort.name"
          @keyup.enter.native="sortConfirm"
        >
          <template slot="append">
            <el-select v-model="newSort.sort">
              <el-option label="升序" :value="1"/>
              <el-option label="降序" :value="-1"/>
            </el-select>
          </template>
        </el-input>
        <el-button v-else @click="newSort.show=true" icon="el-icon-plus">sort</el-button>
      </el-form-item>
      <el-form-item label="skip">
        <el-input v-model.number="query.skip"/>
      </el-form-item>
      <el-form-item label="limit">
        <el-input v-model.number="query.limit"/>
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="search" icon="el-icon-search">查找</el-button>
    <ul>
      <li v-for="(v,i) in data" :key="i">{{JSON.stringify(v)}}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { DbBelong, parserMongoStr } from '@/utils/utils'
import { parseFilter } from "mongodb-query-parser"
import { mongo } from '@/type/ipc'
enum sortType {
  asc = 1,
  desc = -1
}
enum displayType {
  display = 1,
  hide = -1
}
interface sort {
  show:boolean
  name: string
  sort: sortType
}
interface project {
  show:boolean
  value: string
  display: displayType
}
interface queryObj {
  fitter: string
  sort: any
  project: any
  limit: number
  skip: number
}
const QUERY: queryObj = {
  fitter: '',
  sort: {},
  project: {},
  limit: 20,
  skip: 0
}

@Component
export default class collectInfo extends Vue {
  belong: DbBelong = { link: '' }
  query: queryObj = Object.assign({}, QUERY)
  newProject:project = { show: false, value: '', display: displayType.display }
  newSort:sort = { show: false, name: '', sort: sortType.asc }
  data: Array<Object> = []

  projectConfirm() {
    if (this.newProject.value != '') {
      this.$set(this.query.project, this.newProject.value, this.newProject.display)
    }
    this.newProject = { show: false, value: '', display: 1 }
  }
  removeProject(key: string) {
    delete this.query.project[key]
    this.query.project = Object.assign({}, this.query.project)
  }
  sortConfirm() {
    if (this.newSort.name != '') {
      this.$set(this.query.project, this.newSort.name, this.newSort.sort)
    }
    this.newSort = { show: false, name: '', sort: sortType.asc }
  }
  removeSort(key: string) {
    delete this.query.sort[key]
    this.query.sort = Object.assign({}, this.query.sort)
  }
  @Watch('$route.params.id')
  changeCollect(val: string) {
    this.belong = parserMongoStr(this.$route.params.id)
  }
  search() {
    let query = Object.assign({}, this.query)
    try {
      query.fitter = parseFilter(query.fitter)
    } catch (error) {
      this.$message.error('fitter参数非法！')
      return
    }

    this.$store.commit('ADD_EVENT', {
      vueId: this._uid,
      handle: (data: mongo) => {
        this.data = data.data
      }    })
    const req: mongo = Object.assign({
      action: 'find',
      eventId: this.$store.state.db.eventId,
      data:query
    }, this.belong)
    this.$ipc.send('mongoReq', req)
  }
  created() {
    this.changeCollect(this.$route.params.id)
  }
  beforeDestroy() {
    this.$store.commit('OFF_EVENT', this._uid)
  }
}
</script>

<style lang="less" scoped>
</style>
