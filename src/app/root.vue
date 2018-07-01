<template>
  <div>
    <h1>Today</h1>
    <el-button type="primary" @click="addTask">
      Add Task
    </el-button>
    <div>
      <div>

      </div>
    </div>
    <el-dialog title="Add Task" :visible.sync="dialogVisible">
      <el-form :model="form" :rules="rules" ref="form" label-position="top">
        <el-form-item label="Title" prop="title" :label-width="formLabelWidth">
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="Description" prop="desc" :label-width="formLabelWidth">
          <el-input v-model="form.desc" auto-complete="off" type="textarea"
          :rows="4"></el-input>
        </el-form-item>
        <el-form-item label="Estimate" prop="estimate" :label-width="formLabelWidth">
          <el-slider
            :min="0"
            :max="5"
            v-model="form.estimate"
            :step="1"
            show-stops>
          </el-slider>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="ensureAddTask('form')">Ensure</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  var validatePass = (rule, value, callback) => {
    if(value < 1){
      callback(new Error('The estimate must ranges from 1 to 5'));
    }
    else {
      callback();
    }
  };
  export default {
    data: () => ({
      dialogVisible: false,
      formLabelWidth: '120px',
      todayTasks:[
        {
          title:"学习Nengo",
          desc:"",
          startTime:0,
          basicTimeUnit:45,
          estimate:1
        }
      ],
      form: {
        title: '',
        desc: '',
        estimate: 1
      },
      rules: {
        title: [
          { required: true, message: 'You must input task title', trigger: 'blur' },
        ],
        desc: [
          // { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        estimate: [
          { validator: validatePass, trigger: 'change' },
          { required: true, message: 'You must input task estimate', trigger: 'blur'},
        ],
      }
    }),
    computed: { },
    created () {
      console.log('New tab')
    },
    mounted () { },
    methods: {
      ensureAddTask(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            
          } else {
            return false;
          }
        });
      },
      addTask(){
        this.dialogVisible = true;
      }
    }
  }
</script>
<style lang="scss">
  $font-family:'Courier New', Courier, monospace;
  body {
    font-family: $font-family;
    font-weight: 500;
  }
  .el-form-item__label {
    color: #000;
  }
  .el-input__inner, .el-textarea__inner {
    font-family: $font-family;
  }
</style>
