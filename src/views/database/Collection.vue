<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="fitter">
        <el-input v-model="query.fitter" />
      </el-form-item>
      <el-form-item label="project">
        <el-tag
          v-for="(v,k) in query.projection"
          :key="k"
          closable
          :disable-transitions="false"
          @close="removeProject(k)"
        >{{v==1?'显示':'隐藏'}} {{k}}</el-tag>
        <el-input
          v-if="newProject.show"
          v-model="newProject.value"
          ref="newProject"
          @keyup.enter.native="projectConfirm"
          @keyup.esc.native="newProject.show=false"
        >
          <template slot="append">
            <el-select style="width:90px" v-model="newProject.display">
              <el-option label="显示" :value="1" />
              <el-option label="隐藏" :value="-1" />
            </el-select>
          </template>
        </el-input>
        <el-button v-else @click="showProject" icon="el-icon-plus">project</el-button>
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
          ref="newSort"
          @keyup.enter.native="sortConfirm"
          @keyup.esc.native="newSort.show=false"
        >
          <template slot="append">
            <el-select v-model="newSort.sort">
              <el-option label="升序" :value="1" />
              <el-option label="降序" :value="-1" />
            </el-select>
          </template>
        </el-input>
        <el-button v-else @click="showSort" icon="el-icon-plus">sort</el-button>
      </el-form-item>
      <el-form-item label="skip">
        <el-input v-model.number="query.skip" />
      </el-form-item>
      <el-form-item label="limit">
        <el-input v-model.number="query.limit" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="search" icon="el-icon-search">查找</el-button>
    <el-divider></el-divider>
    <el-card shadow="hover" v-for="(v,i) in data" :key="i" style="width:100%">
      <el-row type="flex" justify="space-around">
        <el-col class="item-json">
          <json-viewer :value="v" :expand-depth="5" copyable boxed sort></json-viewer>
        </el-col>
        <el-col class="item-btns">
          <el-button type="primary" @click="mod(v)" icon="el-icon-edit">修改</el-button>
          <el-button type="danger" @click="del(v)" icon="el-icon-delete">删除</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-pagination class="list-pager"
      background
      @current-change="jump"
      :current-page="nowPage"
      layout="total,  prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <el-dialog title="修改数据" :visible.sync="modData.show">
      <div>
        <el-input type="textarea" v-model="modData.data"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modData.show = false">取 消</el-button>
        <el-button type="primary" @click="subMod">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
const { remote } = window.require('electron')
import { Vue, Component, Watch } from 'vue-property-decorator'
import { DbBelong, parserMongoStr } from '@/utils/utils'
import { parseFilter } from "mongodb-query-parser"
import { mongo } from '@/type/ipc'
import JsonViewer from 'vue-json-viewer'
import _ from 'lodash'
enum sortType {
  asc = 1,
  desc = -1
}
enum displayType {
  display = 1,
  hide = -1
}
interface sort {
  show: boolean
  name: string
  sort: sortType
}
interface project {
  show: boolean
  value: string
  display: displayType
}
interface queryObj {
  fitter: string
  sort: any
  projection: any
  limit: number
  skip: number
}
const QUERY: queryObj = {
  fitter: '',
  sort: {},
  projection: {},
  limit: 10,
  skip: 0
}

@Component({
  components: {
    JsonViewer
  }
})
export default class collectInfo extends Vue {
  belong: DbBelong = { link: '' }
  query: queryObj = _.cloneDeep(QUERY)
  newProject: project = { show: false, value: '', display: displayType.display }
  newSort: sort = { show: false, name: '', sort: sortType.asc }
  data: Array<Object> = []
  nowPage: number = 1
  total: number = 0
  modData = {
    show: false,
    id: '',
    data: ''
  }

  del(obj: any) {
    if ('_id' in obj) {
      let data = obj['_id']['$oid']
      this.$store.commit('ADD_EVENT', {
        vueId: this._uid,
        handle: (data: mongo) => {
          let delNum = data.data
          this.$message.success(`已删除${delNum}条记录`)
          this.search()
        }      })
      const req: mongo = Object.assign({
        action: 'del',
        eventId: this.$store.state.db.eventId,
        data
      }, this.belong)
      this.$ipc.send('mongoReq', req)
    } else {
      this.$message.error('没有找到_id，无法操作！')
    }
  }

  /**
   * 打开修改模态框
   */
  mod(val: any) {
    if ('_id' in val) {
      this.modData.id = val['_id']['$oid']
      this.modData.data = JSON.stringify(val)
      this.modData.show = true
    } else {
      this.$message.error('没有找到_id，无法操作！')
    }
  }

  subMod() {
    this.$store.commit('ADD_EVENT', {
      vueId: this._uid,
      handle: (data: mongo) => {
        this.$message.success(`修改成功！`)
        this.modData.show = false
        this.search()
      }    })
    const req: mongo = Object.assign({
      action: 'mod',
      eventId: this.$store.state.db.eventId,
      data: this.modData
    }, this.belong)
    this.$ipc.send('mongoReq', req)
  }

  showProject() {
    this.newProject.show = true
    this.$nextTick(() => (this.$refs['newProject'] as Vue).focus())
  }
  projectConfirm() {
    if (this.newProject.value != '') {
      this.$set(this.query.projection, this.newProject.value, this.newProject.display)
    }
    this.newProject = { show: false, value: '', display: displayType.display }
  }
  removeProject(key: string) {
    this.$delete(this.query.projection, key)
  }

  showSort() {
    this.newSort.show = true
    this.$nextTick(() => (this.$refs['newSort'] as Vue).focus())
  }
  sortConfirm() {
    if (this.newSort.name != '') {
      this.$set(this.query.sort, this.newSort.name, this.newSort.sort)
    }
    this.newSort = { show: false, name: '', sort: sortType.asc }
  }
  removeSort(key: string) {
    this.$delete(this.query.sort, key)
  }

  @Watch('$route.params.id')
  changeCollect(val: string) {
    this.belong = parserMongoStr(val)
    this.search()
  }
  search() {
    let query = Object.assign({}, this.query)
    query.skip += (this.nowPage - 1) * query.limit
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
      data: query
    }, this.belong)
    this.$ipc.send('mongoReq', req)
  }
  jump(val: number) {
    this.nowPage = val
    this.search()
  }

  beforeDestroy() {
    this.$store.commit('OFF_EVENT', this._uid)
  }
  mounted() {
    if (!this.$store.state.tab.restore) {
      //如果没有存数据，初始化
      this.changeCollect(this.$route.params.id)
    }
    this.$store.commit('REG_CALLBACK', { cid: this._uid, callback: { save: this.save, restore: this.restore } })
  }
  save() {
    let res = {
      query: _.cloneDeep(this.query),
      newProject: _.cloneDeep(this.newProject),
      newSort: _.cloneDeep(this.newSort),
    }
    return res
  }
  restore(info: any) {
    if (!_.isEmpty(info)) {
      this.query = info.query
      this.newProject = info.newProject
      this.newSort = info.newSort
    } else {
      //新开的页面，需要重新初始化
      this.query = _.cloneDeep(QUERY)
      this.newProject = { show: false, value: '', display: displayType.display }
      this.newSort = { show: false, name: '', sort: sortType.asc }
    }
    this.changeCollect(this.$route.params.id)
  }
}
</script>

<style lang="less" scoped>
.item-btns {
  min-width: 200px;
  padding-left: 20px;
  align-items: center;
  display: flex;
}
.list-pager{
  padding-bottom: 50px;
}
</style>
