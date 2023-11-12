<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog"
      >添加</el-button
    >
    <!--  
      elementUI当中的table组件，展示的数据是以一列一列进行展示数据
      表格组件  data:表格组件将来需要展示的数据
      column属性 
        label:显示标题 
        width:对应列的宽度  
        align: 标题的对其方式  
        prop 对应列内容的字段名
    -->
    <el-table style="width: 100%" border :data="list">
      <!-- 添加 type="index" 可以按顺序展示序号 -->
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <!-- prop 对应列内容的字段名 -->
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <!-- slot插槽  slot-scope="{row,$index}" -->
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="row">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      分页器
      当前第几页  总页数  每一页展示多少条数据  可以每一页展示多少条数据
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"   调用方法点击对应页码之后更改页码重新获取数据渲染

      layout 实现分分页器布局,里面写的先后顺序决定了显示的先后顺序   -> 让右边的属性直接去最右边
      :page-count  设置连续页码数
      pager-count  设置页码按钮的数量
       -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :pager-count="7"
      :page-sizes="[3, 5, 10]"
      @current-change="getPageList"
      @size-change="handleSizeChange"
      layout=" prev, pager, next, jumper, -> , sizes, total"
      style="margin-top: 20px; text-align: center"
    >
    </el-pagination>
    <!-- 点击添加和修改按钮之后弹出的对话框  
        title  左上角标题
        :visible.sync  控制对话框显示与隐藏
        根据是否有id判断显示 修改品牌 还是 添加品牌
        -->
    <!-- 
      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，
      并将 Form-Item 的 prop 属性设置为需校验的字段名即可。校验规则参见 async-validator
      -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <!-- 
        form表单  model属性 的作用是把表单数据收集到哪个对象的身上 表单验证也需要这个属性
        rules 表示校验的规则   而有在 item 上添加 prop 的表示需要校验对应的字段
       -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 
            :on-success="handleAvatarSuccess"  检测图片上传，上传成功执行一次
            :before-upload="beforeAvatarUpload"  图片上传之前执行一次
            这里收集数据，不能使用v-model，因为不是表单元素   action需要额外添加一个 /dev-api
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- 隐藏对话框 dialogFormVisible = false -->
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUPdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    // 设置element表单验证的自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if(value.length<2||value.length>10){
        callback(new Error('品牌名称2-10位'))
      }else{
        callback()
      }
    };
    return {
      // 代表分页器第几页
      page: 1,
      // 当前页数展示数据的条数
      limit: 3,
      // 总共数据的条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 对话框显示与隐藏的控制属性
      dialogFormVisible: false,
      // 上传图片使用的属性(不需要)  使用 tmForm.logoUrl 服务器图片地址
      // imageUrl: "",
      // 收集品牌信息 对象身上的属性不能瞎写
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      // 表单验证规则
      rules: {
        // 品牌名称的验证规则
        // required：代表该字段必须校验(跟前面的五角星有关系)   message：提示信息
        // trigger：根据用户的行为触发 blur(输入) 或者 change(改变) 事件
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // 自定义校验规则
          { validator: validateTmName, trigger: 'change' },
          // min 代表品牌名称的长度
          // {
          //   min: 2,
          //   max: 10,
          //   message: "长度在 2 到 10 个字符",
          //   trigger: "change",
          // },
        ],
        // 品牌logo的验证规则  因为是验证图片而不是表单  所以不需要 trigger
        logoUrl: [{ required: true, message: "请选择品牌图片" }],
      },
    };
  },
  // 组件挂在完毕发请求
  mounted() {
    // 获取列表数据的方法
    this.getPageList();
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList(pager = 1) {
      this.page = pager;
      // 解构出参数
      const { page, limit } = this;
      // 获取品牌列表的接口  向服务器发请求的时候需要参数
      let result = await this.$API.trademark.reqTradeMark(page, limit);
      if (result.code == 200) {
        // 分别是展示数据的总条数与列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    // 当分页器某一页展示数据条数发生变化时触发
    handleSizeChange(limit) {
      // 修改参数
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加品牌的按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true;
      // 清除数据  防止显示上一次的输入数据
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 修改某一个品牌
    updateTradeMark(row) {
      // row 是当前用户选中的品牌信息
      // 显示对话框
      this.dialogFormVisible = true;
      // 将已有的品牌信息赋值给 tmForm 进行展示
      // 如果这样写的话相当于将服务器返回品牌的信息，直接复制给了tmForm进行展示 导致页面数据会直接改变
      // this.tmForm = row.row
      // ... 浅拷贝
      this.tmForm = { ...row.row };
      // 清除数据  防止显示上一次的输入数据
      // this.tmForm = { tmName: "", logoUrl: "" };
    },
    // 图片上传成功的回调   res：上传成功之后返回给前端的数据  file：上传成功之后服务器返回给前端的数据
    handleAvatarSuccess(res, file) {
      // 收集品牌图片数据，因为将来需要带给服务器
      this.tmForm.logoUrl = res.data;
      // this.imageUrl = URL.createObjectURL(file.raw);
    },
    // 图片上传之前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      // 判断是否小于2MB
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加按钮
    addOrUPdateTradeMark() {
      // 当全部验证字段通过 再去书写业务逻辑
      // async 需要放到 await 的就近函数  从 addOrUPdateTradeMark 移动到 success 前面
      this.$refs.ruleForm.validate(async (success) => {
        // 如果全部字段符合条件
        if (success) {
          // 隐藏对话框
          this.dialogFormVisible = false;
          // 发请求(添加品牌|修改品牌)
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            // 弹出信息：添加品牌成功，修改品牌成功
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            // 添加或者修改品牌成功以后，需要再次获取品牌列表进行展示
            // 如果是添加品牌，停留在第一页，而修改品牌应该停留在当前页  根据三元运算符判断
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 删除品牌的操作
    deleteTradeMark(row){
      // 弹框
       this.$confirm(`你确定删除${row.row.tmName}?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // 当用户点击确定按钮的时候触发
          // 向服务器发请求删除
          let result = await this.$API.trademark.reqDeleteTradeMark(row.row.id)
          if(result.code == 200){
            this.$message({
            type: 'success',
            message: '删除成功!'
          });
          // 再次获取品牌列表数据
          // 如果删除后当前页的长度大于1则留在当前页  否则则跳到前一页
          this.getPageList(this.list.length>1?this.page:this.page-1)
          }
        }).catch(() => {
          // 当用户点击取消按钮的时候触发
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
};
</script>

<style>
/* 添加与修改品牌里的上传框样式 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>