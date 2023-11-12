<template>
  <div>
    <el-card style="margin: 20px 0px">
      <!-- 使用封装过的全局组件 -->
      <!-- 为了让子给父传属性使用自定义事件 -->
      <!-- 将 isShowTable 传给子组件  完成成功与隐藏的操作  -->
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>

    <el-card>
      <div v-show="isShowTable">
        <!-- 如果没有 category3Id 的时候禁用按钮  并且点击点击添加按钮之后 isShowTable  设置为  v-show 为 false  表单隐藏 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格：展示平台属性 -->
        <el-table style="width: 100%; margin: 20px 0" border :data="attrList">
          <!-- 4个 el-table-column  代表有4列 -->
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150"
          ></el-table-column>

          <el-table-column prop="prop" label="属性值列表" width="width">
            <!-- v-for 后面使用小括号 -->
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>

          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <!-- 该修改按钮与上面添加按钮隐藏表单同理  设置 v-show 为false -->
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>

              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加属性||修改属性结构  并且显示的时候与表单的显示时候相反 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 点击两个取消可以让 isShowTable 等于 true   可以返回原来的界面    :disabled 内判断如果没有 attrName 则不能添加按钮-->
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <!-- border 给表格添加边框 -->
        <el-table
          style="width: 100%; margin: 20px 0"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80"
          ></el-table-column>

          <el-table-column label="属性值名称" align="center" width="width">
            <!-- slot-scope 作用域插槽   用于获取当前所在元素的数据   row 代表对应数据  $index 代表索引  -->
            <template slot-scope="{ row, $index }">
              <!-- 查看模式和编辑模式 就是让下面这两个 span(查看模式) 和 el-input(编辑模式) 进行来回切换展示 -->
              <!-- @keyup.native.enter  自定义事件点击回车的时候触发  :ref="$index" 为每个input绑定一个ref  -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="width">
            <!-- 作用域插槽添加删除按钮 -->
            <template slot-scope="{ row, $index }">
              <!-- Popconfirm 气泡确认框   当前项目的ele版本是2.13 使用 @onConfirm    新版本使用的是 @confirm -->
              <!-- 删除 对应索引值($index) 的属性值 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}吗?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- :disabled="attrInfo.attrValueList.length<1 代表保存按钮上面的列表长度小于1 一个属性都没有  则禁用该按钮 -->
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>


<script>
// 按需引入lodash当中的深拷贝  不需要全部引入
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 接收平台属性的字段
      attrList: [],
      // 这个属性控制添加属性下面的table表格显示与隐藏
      isShowTable: true,
      // 收集新增属性|修改属性
      attrInfo: {
        attrName: "", // 属性名
        attrValueList: [
          // 属性名中的数字，因为属性值可以是多个，所以需要的是数组，每个属性都需要 attrId 和 valueName
          // {
          //   attrId: 0, // 属性 id
          //   valueName: "",
          // },
        ],
        // 别在 data 中收集三级分类 id    this.category3Id
        categoryId: 0, // category3Id
        categoryLevel: 3, // 服务器需要区分是几级 id  默认三级
      },
    };
  },
  methods: {
    // 自定义事件的回调  level 是为了确定是几级 id     categoryId 是获取 id
    getCategoryId({ categoryId, level }) {
      // 区分三级分类相应的id，以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId;
        // 与子组件同理将二三级分类的id置空
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        // 代表三级分类的id有了  需要发请求获取对应数据进行展示
        this.category3Id = categoryId;
        // 发请求
        this.getAttrList();
      }
    },
    // 获取平台属性的数据请求  当用户确定三级分类的数据的时候，可以向服务器发请求获取平台数据进行展示
    async getAttrList() {
      // 获取分类的id
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data;
      }
    },
    // 添加属性值回调
    addAttrValue() {
      // 向 attrValueList 属性值数组里添加元素   attrId 是相应属性 id   valueName 相应的属性值
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 对于修改某一个属性的时候，可以在已有的属性值基础上新增新的属性值(新增属性的时候，需要把已有的属性的id带上)
        valueName: "",
        // 独立地给每一个都添加一个 flag 标记  用于判断查看模式和切换模式
        flag: "true",
      });
      // 点击添加属性获取自动聚焦   下标为列表的长度减 1
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性按钮的回调
    addAttr() {
      // 切换table显示与隐藏
      this.isShowTable = false;
      // 清除来回跳转的时候留下的数据
      this.attrInfo = {
        attrName: "", // 属性名
        attrValueList: [],
        // 可以在这边收集三级分类的 id   不能在data中收集
        categoryId: this.category3Id, // category3Id
        categoryLevel: 3, // 服务器需要区分是几级 id
      };
    },
    // 修改某一个属性   row 代表需要修改的那一行的数据
    updateAttr(row) {
      // 切换table显示与隐藏
      this.isShowTable = false;
      // console.log(row);
      // 将选择的属性赋值给 attrInfo
      // 由于数据结构当中存在对象里面套数组，数组里面又套对象，因此需要深拷贝解决问题  {...row}浅拷贝不能解决问题
      // 因此使用 lodash 的 cloneDeep 深拷贝
      this.attrInfo = cloneDeep(row);
      // 在修改某一个属性的时候  将相应的属性值元素添加上flag这个标记   遍历 attrValueList
      this.attrInfo.attrValueList.forEach((item) => {
        // 这样写可以添加flag字段  但是不是响应式数据   因为 Vue 无法探测普通的新增 property
        // item.flag = false
        // 需要用 this.$set() 的写法  三个参数分别是：对象  添加新的响应式属性  新的属性的属性值
        this.$set(item, "flag", false);
      });
    },
    // 失去焦点的事件---切换为查看模式
    toLook(row) {
      // row：当前用户添加的最新的属性值
      // row.flag = false
      // 如果属性为空不能作为新的属性值，需要给用户提示，让他输入一个其他的值
      if (row.valueName.trim() == "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      // 新增的属性值不能与已有的属性值重复  .some() 遍历数组
      let isRepat = this.attrInfo.attrValueList.some((item) => {
        // row 代表最后一个输入的数据   item 代表前面的每一个数据
        // 需要将 row 从数组里面判断的时候去除   也就是 item 不是 row 的时候才执行下面的语句
        if (row !== item) {
          // 判断 valueName 是否相同返回布尔值
          return row.valueName == item.valueName;
        }
      });
      // 如果有 row 和 item 里面的值相同则判断为真
      if (isRepat) return;
      row.flag = false;
    },
    // 点击span的回调  变回编辑模式   并且顺便把对应 $index 传回来
    toEdit(row, index) {
      row.flag = true;
      // 获取 input 实现自动聚焦  点击 span 切换为input编辑模式  但是对于浏览器页面重绘和重派需要耗费时间  不可能一点击span立马获取到input
      // $nextTick 当节点渲染完毕会执行一次
      this.$nextTick(() => {
        // 获取相应的input表单元素 实现聚焦(.focus())
        this.$refs[index].focus();
      });
    },
    // 气泡确认框确定按钮回调
    deleteAttrValue(index) {
      // 因为是 新增|修改 内的删除操作所以不用发请求直接删除对应行
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 保存按钮：进行添加属性或者修改属性的操作
    async addOrUpdateAttr() {
      // 整理参数：如果用户添加了很多属性值但是为空  则不应该提交给服务器
      // 提交给服务器的数据不需要 flag 字段   .filter() 对数据进行过滤
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          // 过滤掉属性值不是空的
          if (item.valueName != "") {
            // 删除 flag 属性
            delete item.flag;
            return true;
          }
        }
      );
      try {
        // 发请求
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        // 保存之后跳回展示平台属性的列表
        this.isShowTable = true
        // 提示成功
        this.$message({type:'success',message:'保存成功'})
        // 保存成功以后需要再次获取平台属性进行展示
        this.getAttrList()
      } catch (error) {
        this.$message('保存失败')
      }
    },
  },
};
</script>

<style>
</style>