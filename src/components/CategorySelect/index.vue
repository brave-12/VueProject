<template>
  <!-- 进行封装的全局组件  在品牌属性管理和spu管理属性都有使用 -->
  <div>
    <!-- 从element的表单的行内表单拿到  inline:代表的是行内表单 代表一行可以放置多个表单元素 -->
    <!-- :model="cFrom"  用于把下面获取的项目id收集到 cFrom 身上  通过vue网页插件查看 -->
    <el-form :inline="true" class="demo-form-inline" :model="cFrom">
      <el-form-item label="一级分类">
        <!-- 双向绑定获取选中项目的 id -->
        <el-select
          placeholder="请选择"
          v-model="cFrom.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cFrom.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cFrom.category3Id" @change="handler3" :disabled="show">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3, index) in list3" :key="c3.id" ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  //  props 接收父组件的这个参数 show  然后通过 show 进行展示与禁用这三个 list
  props:['show'],
  data() {
    return {
      // 一级分类的数据
      list1: [],
      // 一级分类的数据
      list2: [],
      // 一级分类的数据
      list3: [],
      // 收集相应的一级二级三级分类的id
      cFrom: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  // 组件挂载完毕：向服务器发请求，获取相应的一级分类的数据
  mounted() {
    // 获取一级分类的数据的方法
    this.getCategory1List();
  },
  methods: {
    // 获取一级分类的请求
    async getCategory1List() {
      let result = await this.$API.attr.reqCategory1List();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    // 一级分类的select事件回调(当一级分类的option发生变化的时候获取相应二级分类的数据)
    async handler1() {
      // 点击后清除二级和三级分类的数据和id
      this.list2 = []
      this.list3 = []
      this.cFrom.category2Id = ''
      this.cFrom.category3Id = ''
      // 解构出一级分类的id
      const { category1Id } = this.cFrom;
      // 把 category1Id 传给父组件的 getCategoryId
      this.$emit('getCategoryId',{categoryId:category1Id,level:1})
      // 通过一级分类的id 获取二级分类的数据
      let result = await this.$API.attr.reqCategory2List(category1Id);
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    // 二级分类的事件回调
    async handler2() {
      // 点击后清除三级分类的数据和id
      this.list3 = []
      this.cFrom.category3Id = ''
      // 解构出一级分类的id
      const { category2Id } = this.cFrom;
      // 把 category2Id 传给父组件的 getCategoryId
      this.$emit('getCategoryId',{categoryId:category2Id,level:2})
      // 通过一级分类的id 获取二级分类的数据
      let result = await this.$API.attr.reqCategory3List(category2Id);
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    // 三级分类的事件回调
    handler3(){
      // 解构出一级分类的id
      const { category3Id } = this.cFrom;
      // 把 category3Id 传给父组件的 getCategoryId
      this.$emit('getCategoryId',{categoryId:category3Id,level:3})
    }
  },
};
</script>

<style>
</style>