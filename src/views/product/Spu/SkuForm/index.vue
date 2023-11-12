<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <!-- 平台属性 -->
      <el-form-item label="平台属性">
        <!-- 行内表单元素 -->
        <el-form :inline="true" ref="form" label-width="80px">
          <!-- 平台属性右侧下拉菜单 -->
          <el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="attr.id">
            <!-- 收集 id 到各自对象的 attrIdAndValueId 上 -->
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
                <!-- value 收集 attr 的 id 和 attrvalue 的 id -->
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <!-- 下拉菜单 -->
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
                <!-- value 收集销售属性值id和销售属性id -->
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 图片列表 -->
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList"  @selection-change="handleSelectionChange">
          <!-- 第一列勾选框 -->
          <el-table-column
            type="selection"
            prop="prop"
            width="80px"
          ></el-table-column>
          <!-- 第二列图片 -->
          <el-table-column prop="prop" label="图片" width="width">
            <!-- 作用域插槽 -->
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" style="width:100px;heigth:100px">
            </template>
          </el-table-column>
          <!-- 名称 -->
          <el-table-column
            prop="imgName"
            label="名称"
            width="width"
          ></el-table-column>
          <!-- 操作 -->
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
          <template slot-scope="{row,$index}">
            <el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
            <el-button v-else>默认</el-button>
          </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      // 存储图片信息
      spuImageList: [],
      // 存储销售属性
      spuSaleAttrList: [],
      // 存储平台属性的数据
      attrInfoList: [],
      // 收集 SKU 数据的字段
      skuInfo: {
        // 第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        skuDesc: "",
        // 第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        // 第三类：需要自己书写代码
        // 默认图片
        skuDefaultImg: "",
        // 收集图片的字段
        skuImageList: [
        //   {
        //     id: 0,
        //     imgName: "string",
        //     imgUrl: "string",
        //     isDefault: "string",
        //     skuId: 0,
        //     spuImgId: 0,
        //   },
        ],
        // 平台属性
        skuAttrValueList: [
        //   {
        //     attrId: 0,
        //     valueId: 0,
        //   },
        ],
        // 销售属性
        skuSaleAttrValueList: [
        //   {
        //     id: 0,
        //     saleAttrId: 0,
        //     saleAttrName: "string",
        //     saleAttrValueId: 0,
        //     saleAttrValueName: "string",
        //     skuId: 0,
        //     spuId: 0,
        //   },
        ],
      },
      // 点价添加那一行的SPU数据
      spu: {},
      // 收集图片的数据字段  但是需要注意缺少 isDefault 字段  将来提交给服务器数据的时候  需要整理参数
      imageList:[]
    };
  },
  methods: {
    // 获取SKUform数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件给予的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;

      // 获取图片数据
      let result = await this.$API.spu.reqSpuImageList(spu.id);
      if (result.code == 200) {
        // 为了添加 isDefault 字段  多走两步 z最后
        let list = result.data;
        list.forEach(item => {
          item.isDefault = 0
        });
        this.spuImageList = list
      }
      

      // 获取销售属性的数据
      let result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      // 获取平台的数据
      let result2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    // table 表格复选框按钮事件
    handleSelectionChange(params){
      // 获取到用户选择图片的信息数据，但是当前收集的数据当中缺少 isDefault 字段
      this.imageList = params
    },
    // 点击设置默认的排他操作
    changeDefault(row){
      // 图片列表的数据的 isDefault 字段变为 0  spuImageList 已经在 data 内重新定义获取了
      this.spuImageList.forEach(item=>{
        item.isDefault = 0
      })
      // 点击的那个图片数据变为 1
      row.isDefault = 1
      // 收集一下 skuInfo 内的默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 点击取消按钮的回调
    cancel(){
      // 自定义事件，让父组件切换场景为 0
      this.$emit('changeScenes',0)
      // 清除数据(也就是点击取消返回主界面之后 再点击进来的数据清空)
      Object.assign(this._data,this.$options.data())
    },
    // 保存按钮的事件
    async save(){
      // 整理参数(需要上传给服务器的参数整理到skuInfo)
      // .reduce(起到累加的作用)  括号内的三个参数分别代表： prev：函数传进来的初始值或上一次回调的返回值 
      // current：数组中当前处理的元素值 currentIndex：当前元素索引
      // 返回值就是数组  可以直接赋值给 skuInfo 的 skuAttrValueList

      // 整理各个属性  解构赋值
      const {attrInfoList,skuInfo,spuSaleAttrList,imageList} = this
      // 整理平台属性的方案 2
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
        // 判断是否存在 id
        if(item.attrIdAndValueId){
          // 解构赋值出来的 id 要根据 skuInfo 的具体参数去赋值
          const [attrId,valueId] = item.attrIdAndValueId.split(':')
          prev.push({attrId,valueId})
        }
        // reduce 需要有返回值  当做下一次循环的方法
        return prev
      },[]);

      // 整理 销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({saleAttrId,saleAttrValueId})
        }
        // reduce 需要有返回值  当做下一次循环的方法
        return prev
      },[]);

      // 整理 销售属性  也使用一下map方法
      skuInfo.skuImageList = imageList.map(item=>{
        return{
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id,
        }
      });
      // 发请求
      // console.log(skuInfo);
      this.$emit('changeScenes',0);
      let result3 = await this.$API.spu.reqAddSku(skuInfo);
      // console.log(result3);
      // 请求 reqAddSku 请求会报错   提交不了  之后再改
      if(result3.code == 200){
        this.$message({type:'success',message:'添加SKU成功'})
        // 由于请求错误所以先将跳转回去的按钮放在上面
        // this.$emit('changeScenes',0);
      }



      // 整理平台数据方式 1
      // // 新建数组
      // let arr = []
      // // 把收集到的数据整理一下
      // attrInfoList.forEach(item=>{
      //   // 代表当前平台用户友进行选择(也就是选择了之后才会添加这个属性)
      //   if(item.attrIdAndValueId){
      //     // split 拆分参数并 解构赋值
      //     const [attrId,valueId] = item.attrIdAndValueId.split(':')
      //     // 携带给服务器参数应该是对象
      //     let obj = {attrId,valueId}
      //     // 先把这个数据扔到这个定义的数组里面
      //     arr.push(obj)
      //   }
      // })

      // 将整理好的参数赋值给 skuInfo.skuAttrValueList
      // skuInfo.skuAttrValueList = arr

    },
    
  },
};
</script>

<style scoped>
</style>
