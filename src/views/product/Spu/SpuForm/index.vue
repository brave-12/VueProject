<template>
  <div>
    <!-- label-width="80px"  让下面的每个item项  宽度为 80  继承该属性 -->
    <el-form ref="form" label-width="80px" :model="spu">
      <!-- 分为6个item -->
      <!-- SPU名称  输入框 -->
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <!-- 品牌  下拉选择器 -->
      <el-form-item label="品牌">
        <!-- v-model 双向绑定收集数据到 spu的 tmid 上 -->
        <el-select tplaceholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- SPU描述  输入文本区  rows 设置行数增加文本区初始高度-->
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <!-- SPU图片  使用的是element-ui的upload里面的照片墙  spuImageList -->
      <el-form-item label="SPU图片">
        <!-- 上传图片：action 图片上传地址  list-type 文件列表的类型  file-list 上传的文件列表 
        :on-preview 对应预览事件   :on-remove 对应删除事件  :on-success 提交成功时的回调 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handlerSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <!-- el-dialog 是点击上传图片之后  可以出现一个显示放大图片的对话框 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <!-- 销售属性 -->
      <el-form-item label="销售属性">
        <!-- 下拉框显示还有几个属性未选择 -->
        <!-- v-model 收集的是下面的 value数据 -->
        <el-select
          :placeholder="`还有${unSeleteAttr.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <!-- :value="`${unselect.id}:${unselect.name}`" 通过模板字符串可以同时收集两个数据 -->
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="(unselect, index) in unSeleteAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <!-- 有 attrId 的情况下才能点击该按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 展示的是当前SPU属于直接的销售属性 -->
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <!-- 表格有四列 -->
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- tag 代表输入完成的结构  用于展示已有属性值列表的数据 -->
              <!-- @close="handleClose(tag)" 代表 x 删除事件   v-for 遍历销售属性的销售属性值 -->
              <!-- 可以直接通过 splice 删除数组中选中的那个元素   不用额外在下面的 mtehods 内写一个删除方法-->
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- input 是点击按钮之后的输入框  向里面输入需要添加的属性值 
                   v-if 和下面的 else 用于切换 input 和 button
                   @keyup.enter.native="handleInputConfirm"   回车按钮点击事件
                   @blur="handleInputConfirm"     失去焦点触发事件
                   -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <!-- button 是点击按钮
                   @click="showInput" 
               -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <!-- 删除按钮 -->
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 保存和取消按钮 -->
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <!-- 点击按钮触发 changeScene 自定义事件-->
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // 存储 SPU 信息属性
      // spu 属性初始化的时候是空对象 修改SPU的时候会向服务器发请求 返回SPU信息(对象) 可以直接根据这个对象上修改提交
      // SPU 添加的时候没有向服务器发请求  数据收集到 SPU   因此 SPU 不能为空
      spu: {
        // 三级分类 id
        category3Id: 0,
        // 描述
        description: "",
        // 收集 SPU 图片信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        // SPU 名称
        spuName: "",
        // 品牌的id
        tmId: '',
        // 品牌属性与属性值的收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      // 存储品牌信息
      tradeMarkList: [],
      // 存储SPU图片数据
      spuImageList: [],
      // 销售属性的数据
      saleAttrList: [],
      // 收集未选择的销售属性的id
      attrIdAndAttrName: "",
    };
  },
  methods: {
    // 照片墙删除某一个图片的时候会触发
    handleRemove(file, fileList) {
      // file：代表的是删除的那个图片    fileList：照片墙删除某一张图片后剩余的图片
      // console.log(file, fileList);

      // 收集照片墙图片的数据
      // 对于已有的图片【照片墙中显示的图片，有name，url字段】 因为照片墙显示数据务必要有这两个元素
      // 但是对于服务器而言  不需要name，url字段  将来对于有的图片在提交给服务器的时候需要处理
      this.spuImageList = fileList;
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      // 将图片地址赋值给 dialogImageUrl  然后在下面的 el-dialog(对话框元素) 中使用
      this.dialogImageUrl = file.url;
      // 对话框显示
      this.dialogVisible = true;
    },
    // 照片墙图片点击上传成功的回调
    handlerSuccess(response, file, fileList) {
      // 收集图片的信息
      this.spuImageList = fileList;
    },
    // SpuForm子组件发请求不能写在mounted里面 因为使用 v-show进行子组件的隐藏与显示  这个子组件并没有被卸载(只是显示或隐藏)
    // 导致mounted只执行一次  而完成的项目应该在每次显示SpuForm的时候都发四个请求

    // 初始化SpuForm数据
    async initSpuData(spu) {
      // 获取Spu信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        // 在修改spu的时候 需要向服务器发请求 把服务器返回的数据(对象)  赋值给spu属性
        this.spu = spuResult.data;
      }
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取SPU图片数据
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listArr = spuImageResult.data;
        // 由于照片墙显示图片的数据需要数组  数组里面的元素需要 name与 url 字段
        // 需要把服务器返回的数据进行修改
        listArr.forEach((item) => {
          // 新增两个字段 name 与 url 并且赋值  是为了照片墙的使用
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        // 把整理好的数据赋值给 spuImageList  也就是相当于多经过这个步骤增加 name 和 url 字段并赋值
        this.spuImageList = listArr;
      }
      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 添加新的销售属性
    addSaleAttr() {
      // 已经收集到了需要添加的销售属性的信息
      // 把收集到的销售属性数据进行分割(例如 2:版本)  解构赋值
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      // 向 spu 对象的 spuSaleAttrList 数组当中添加新的销售属性
      // 当前还没有 spuSaleAttrValueList 先并一个空数组
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      // 添加新的销售属性
      this.spu.spuSaleAttrList.push(newSaleAttr);
      // 添加成功之后清空数据
      this.attrIdAndAttrName = "";
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      // 点击销售属性值当中的添加按钮的时候，需要由 button 变成 input  通过 row 身上的 inputVisible 控制
      // 不能直接添加 true  因为不是响应式  可以通过 $set 添加字段(inputVisible)和属性(true)
      this.$set(row, "inputVisible", true);
      // 在 row 身上添加响应式数据 inputValue 字段收集新增的销售属性值   初始值是一个空串
      this.$set(row, "inputValue", "");
    },
    // el-input 失去焦点事件
    handleInputConfirm(row) {
      // 因为有多个 button 和 input   所以控制属性不能在 data 内定义   需要在这边动态绑定独立的属性
      // 解构出销售属性当中收集的数据
      const { baseSaleAttrId, inputValue } = row;
      // 新增的销售属性值名称不能为空
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      // 属性值不能重复  这里可以用 .every  也可以用 .some(some只要有一个值符合条件就会直接返回)   重复为 false  未重复 true
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      if (!result) return this.$message("属性值不能重复");

      // 新增的销售属性值   k v 一致省略 v
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
      // 新增
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      // 修改 inputVisible 为 false
      row.inputVisible = false;
    },
    // 保存按钮的回调  把新整理的 spuImageList 字段重新赋给 spu.spuImageList
    async addOrUpdateSpu() {
      // 整理参数：需要整理照片墙的数据
      // 携带参数：对于图片，需要携带 imageName 与 imageUrl 字段
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          // 虽然新图片没有这两个字段  但是不管新老图片都有 name   所以可以所有字段重新赋值
          // 新图片可以进行判断有没有 response  如果有的话则用 response.data 的值(response返回的值是201报错不知道为什么)
          // 如果没有 response 则使用原图片的 item.url
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      // 发请求
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (result.code == 200) {
        // 提示
        this.$message({ type: "success", message: "保存spu成功" });
        // 通知父组件回到场景0(scene=0)   根据是否有 id 判断是 修改页面的保存 还是新增页面的保存
        this.$emit("changeScene", {scene:0,flag:this.spu.id?"修改":"添加"});
      }
      // 清除数据
      Object.assign(this._data,this.$options.data())
    },
    // spu首页点击添加 SPU 按钮的时候发请求的函数  通过父组件$refs传过来的方法名称
    // 修改 SPU 发四个请求   新增 SPU 发两个请求(获取品牌信息,获取平台全部的销售属性)
    async addSpuData(category3Id){
      // 添加 SPU 的时候收集三级分类的 id
      this.spu.category3Id = category3Id
      // 获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    // 取消按钮回调
    cancel(){
      // 通知父亲切换场景为0
      this.$emit('changeScene', {scene:0,flag:''})
      // 清理数据   Object.assign:es6新增方法  可以合并对象
      // 组件实例：this._data    当前配置对象：this.$options  data 是上面命名的每个属性 让他们清空
      Object.assign(this._data,this.$options.data())
    }
  },
  computed: {
    // 计算出还未选择的销售属性  总的销售属性一共有三个：颜色  尺寸  版本  ---saleAttrList
    // 以及当前 SPU 自己拥有的销售属性  spu.spuSaleAttrList
    unSeleteAttr() {
      // 通过 数组过滤 选出当前 SPU 没有的销售属性  两次循环
      let result = this.saleAttrList.filter((item) => {
        // item 代表三个销售属性  every() 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。
        return this.spu.spuSaleAttrList.every((item1) => {
          // 判断销售属性是否不等于已经拥有的销售属性 进行匹配  如果没有对应的销售属性则返回 true
          return item.name != item1.saleAttrName;
        });
      });
      // 返回的是过滤之后的为拥有的销售属性的数组数组
      return result;
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
