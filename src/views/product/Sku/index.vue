<template>
  <div>
    <!-- 表格 table -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <!-- 插入图片的作用域插槽 -->
      <el-table-column  label="默认图片" width="110">
        <template slot-scope="{row,index}">
          <img :src="row.skuDefaultImg" style="width:80px;height:80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"></el-table-column>
      <el-table-column prop="price" label="价格" width="80"></el-table-column>
      <!-- 作用域插槽  添加五个按钮   其中上传和下架不同时显示 -->
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="success" icon="el-icon-bottom" size="mini" @click="sale(row)" v-if="row.isSale == 0" ></el-button>
          <el-button type="success" icon="el-icon-top" size="mini" @click="cancel(row)" v-else ></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 
      @size-change="handleSizeChange"   当前页的条数变化时触发
      @current-change="handleCurrentChange"    点击分页器触发
      :page-sizes  用于控制当前页展示条数(也就是设置sizes的时候)
    -->
    <el-pagination
    style="text-align:center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
      :total="total">
    </el-pagination>

    <!-- 从右向左的 抽屉效果 -->
    <!--  :visible.sync="drawer"  控制显示与隐藏  :direction="direction"   控制打开的方向 默认从右到左所以可以删除 -->
    <!--  :with-header="false" 控制删除按钮 因为不需要所以删除   :show-close="true" 控制X按钮显示与一隐藏-->
    <el-drawer :visible.sync="drawer" :show-close="false" size="40%">
      <!-- 第一行文字 -->
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
            <el-tag type="success" v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right:10px">{{attr.attrId}}-{{attr.valueId}}</el-tag>
        </el-col>
      </el-row>
      <!-- 商品图片 -->
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
    name: 'Sku',
    data() {
      return {
        // 初始化默认参数
        // 代表当前第几页
        page:1,
        // 代表当前页面有几条数据
        limit:10,
        // records 存储 sku 列表的数据
        records:[],
        // 存储分页器一共展示的数据
        total:0,
        // 存储 SKU 信息
        skuInfo:{},
        // 控制者抽屉的显示与隐藏
        drawer:false,
        direction: 'rtl',
      }
    },
    // 组件挂载完毕
    mounted() {
      // 获取 sku 列表的方法
      this.getSkuList()
    },
    methods: {
      // 获取 sku 列表数据的方法
      // 因为分页器有用到这个函数调用  所以需要额外设置一个参数用于定义某一页
      async getSkuList(pages = 1){
        this.page = pages
        // 解构出默认参数
        const {page,limit} = this
        let result = await this.$API.sku.reqSkuList(page,limit)
        if(result.code == 200){
          this.total = result.data.total
          this.records = result.data.records
        }
      },
      // 当前页的数量改变的时候触发事件
      handleSizeChange(limit){
        // 修改参数
        this.limit = limit
        // 重新获取数据
        this.getSkuList()
      },
      // 上架
      async sale(row){
        let result = await this.$API.sku.reqSale(row.id)
        if(result.code==200){
          row.isSale = 0
          this.$message({type:'success',message:'上架'})
          // 视频本身没有  额外添加实现功能  
          this.getSkuList()
        }
      },
      // 下架
      async cancel(row){
        let result = await this.$API.sku.reqCancel(row.id)
        if(result.code==200){
          row.isSale = 1
          this.$message({type:'success',message:'下架'})
          this.getSkuList()
        }
      },
      // 修改按钮提示信息
      edit(){
        this.$message('正在开发中')
      },
      // 获取 SKU 详情的方法
      async getSkuInfo(row){
        // 展示抽屉
        this.drawer = true
        // 获取 SKU 的数据
        let result = await this.$API.sku.reqSkuById(row.id)
        if(result.code == 200){
          this.skuInfo = result.data
        }
      },
    },
}
</script>

<style scoped>
/* scoped 只针对当前组件样式   但是如果有 import vue 文件    可以通过标签影响到导入文件的样式
   但是如果说导入的vue文件内的h3没有div包裹  就会被这里的css样式影响(子组件的跟标签 拥有父组件当中一样的的自定义属性)
   但是子组件继承的是嵌套子文件的 div 样式  而不是父组件内的 div 样式  所以没有使用父组件的 div 样式
   如果子组件的style的地方添加scoped  就能使用父组件的同名style样式  
   
   而且会在当前子组件(data)的结构上添加一个 data-v-xxxxx 自定义属性
   vue 通过属性选择器  给需要添加的元素添加上样式  h3[data-v-29dbc514]


   可以在子组件中添加 深度选择器：  写法1 使用 ::v-deep(经常用于 SCSS)     写法2 使用 >>> 操作符 (经常用于原生 CSS)
    写法3  使用/deep/(经常用于LESS)     写法4 使用:deep(<inner-selector>)

 */

  /* .el-col-5 是因为上面设置 el-col 的span大小为 5  在浏览器中就会渲染显示 */
  .el-row .el-col-5{
    font-size: 18px;
    text-align: right;
  }
  .el-col{
    margin:10px;
  }
  /* 想要影响到子组件姚使用深度选择器  */
  >>>.el-carousel__button{
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
  }
</style>


<style>
/* 直接引入的 Carousel 走马灯样式(也就是轮播图样式) */
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  /* 不能放在上面有 scoped 的 style 里面   因为有深度选择器 */
  /* .el-carousel__button{
    width: 10px;
    height: 10px;
    background: red;
    border-radius: 50%;
  } */
</style>