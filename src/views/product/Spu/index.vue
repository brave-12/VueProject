<template>
  <div>
    <!-- Card 卡片 信息聚合在卡片容器中展示   上半部分卡片 -->
    <el-card style="margin: 20px 0px">
      <!-- 三级联动已经是全局组件 -->
      <!-- 如果 scene 就不显示三级联动 -->
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene!=0"
      ></CategorySelect>
    </el-card>
    <!-- 下半部分卡片 -->
    <el-card>
      <!-- 底部这里将来有三部分进行切换 -->
      <div  v-show="scene==0">
        <!-- 展示SPU列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <!-- 按钮下的表格 -->
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <!-- 操作 -->
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 这里的按钮将来用 hintButton 替换 -->
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="handler(row)"></hint-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除spu" slot="reference"></hint-button>
              </el-popconfirm>
              
            </template>
          </el-table-column>
        </el-table>
        <!--
          分页器
          @size-change="handleSizeChange"   修改分页器每页展示条数的回调
          @current-change="handleCurrentChange"  点击分页器页数的回调 -->
        <el-pagination
          style="text-align:center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->, sizes, total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :total="total">
        </el-pagination>

      </div>

      <SpuForm  v-show="scene==1" @changeScene="changeScene" ref="spu"></SpuForm>
      <!-- Spu本身相当于一个类  而添加 Sku 则相当于添加一个实例 -->
      <SkuForm  v-show="scene==2" ref="sku" @changeScenes="changeScenes"></SkuForm>
    </el-card>
    <!-- before-close 对话框关闭前的回调 -->
    <el-dialog :title="`${spu.spuName}的SKU列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <!-- table 展示 sku 列表   :data="gridData" -->
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
        <el-table-column prop="price" label="价格" width="width"></el-table-column>
        <el-table-column prop="weight" label="重量" width="width"></el-table-column>
        <el-table-column prop="prop" label="默认图片" width="width">
          <!-- 插入图片需要作用域插槽 -->
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
</div>
</template>

<script>
// 引入子组件
import SpuForm from './SpuForm';
import SkuForm from './SkuForm';
export default {
  name: "Spu",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 控制三级联动的可操作行
      page:1, // 分页器当前第几页
      limit:3, // 每一页需要展示多少条数据
      records:[], // spu 列表的数据
      total:0, // 分页器一共需要展示的数据条数
      // 用于需要展示哪个div的参数   0 代表展示SPU列表数据
      scene:0,
      // 控制 查看SPU列表 对话框的显示与隐藏
      dialogTableVisible:false,
      spu:{},
      // 存储 SKU 列表的数据
      skuList:[],
      loading:true,
 
    };
  },
  methods: {
    // 三级联动的自定义事件  可以把子组件的相应id传递给父组件
    getCategoryId({ categoryId, level }) {
      // categoryId:获取一二三级分类id  level:为了区分是几级 id
      if (level == 1) {
        this.category1Id = categoryId;
        // 清除二三级分类的 id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        // 代表三级分类的id有了  需要发请求获取对应数据进行展示
        this.category3Id = categoryId;
        // 获取SPU列表数据
        this.getSpuList();
      }
    },
    // 获取SPU列表数据的方法
    async getSpuList(pages = 1) {
      // pages 用于分页器  因为在分页器使用这个回调的时候会默认注入一个当前页数的参数  
      this.page = pages
      const {page,limit,category3Id} = this
      // 携带三个参数：page 第几页    limit 每一页需要展示多少条数据     三级分类 id
      let result = await this.$API.spu.reqSpuList(page,limit,category3Id)
      if(result.code==200){
        this.total = result.data.total
        this.records = result.data.records
      }
    },
    // 点击分页器的第几页按钮的回调   在 getSpuList 里直接添加一个数即可不用额外写一个回调
    // handleCurrentChange(page){
    //   // 替换最新的页数
    //   this.page = page
    //   // 重新获取列表数据
    //   this.getSpuList()
    // }
    // 当分页器的某一个展示数据条数发送变化的回调
    handleSizeChange(limit){
      // 修改参数
      this.limit = limit
      // 重新获取列表数据
      this.getSpuList()
    },
    // 添加SPU按钮的回调
    addSpu(){
      this.scene = 1
      // 通知 SpuForm 发请求--两个
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改某一个spu
    updateSpu(row){
      this.scene = 1
      // 父组件在子组件身上定义一个 ref   通过 $refs 获取子组件 SpuForm 的方法 initSpuData
      // 并且可以将选中的 spu的 row(spu的数据) 传过去
      this.$refs.spu.initSpuData(row)
    },
    // 自定义事件的回调(SpuForm)
    changeScene({scene,flag}){
      // flag 是为了区分保存按钮是添加还是修改
      // 切换结构
      this.scene = scene
      // 子组件通知父组件切换场景  需要再次获取SPU列表的数据进行展示  并且需要停留在当前页
      if(flag=="修改"){
        // 跳转回来停留在当前页
        this.getSpuList(this.page)
      } else {
        // 跳转回来停留在第一页
        this.getSpuList()
      }
    },
    // 删除 SPU 的按钮回调
    async deleteSpu(row){
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if(result.code == 200){
        this.$message({type:'success',message:'删除成功'})
        // 重新获取 删除数据之后的数据
        // 并且需要判断 spu 列表的数据的长度是否大于1  如果大于1则停留在当前页  反之则停留在上一页
        this.getSpuList(this.recorde.length>1?this.page:this.page-1)
      }
    },
    // 添加SKU按钮的回调
    addSku(row){
      // 切换场景
      this.scene = 2
      // 父组件调用子组件的方法，让子组件发请求----三个请求
      // 参数需要包含三个 categoryId 以及 row.id   因为 category3Id row里面有索引可以这样写
      this.$refs.sku.getData(this.category1Id,this.category2Id,row)
    },
    // skuForm 通知父组件修改场景
    changeScenes(scene){
      this.scene = scene
    },
    // 查看 SKU 的按钮的回调
    async handler(spu){
      // 点击按钮的时候  对话框可见
      this.dialogTableVisible = true
      // 保存 SPU 的信息
      this.spu = spu
      // 获取 SKU 列表的数据进行展示
      let result = await this.$API.spu.reqSkuList(spu.id)
      if(result.code==200){
        this.skuList = result.data
        // loading 效果隐藏
        this.loading = false
      }
    },
    // 关闭对话框前的回调
    close(done){
      // loading 属性再次变为真
      this.loading = true
      // 清除sku列表数据  防止出现回显的情况
      this.skuList = []
      // 关闭对话框
      done()
    },
  },
  // 注册组件
  components:{
    SpuForm,
    SkuForm
  }
};
</script>

<style>
</style>