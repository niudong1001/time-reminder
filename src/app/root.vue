<template>
  <div>
    <div>

    </div>
    <h1 class="todayTasks-title">
      <i class="el-icon-back todayTasks-title-back"></i> 
      <span class="titleColor">For Today</span>  
      <i class="el-icon-circle-plus-outline todayTasks-title-btn" @click="addTask">
        Add Task
      </i>
    </h1>
    <el-row class="todayTasks-list">
      <el-col :span="6" class="todayTasks-list__item" :key="task.id" v-for="task in todayTasks">
        <div class="todayTasks-list__item-title titleColor">{{task.title}}</div>
        <div class="todayTasks-list__item-desc">{{task.desc}}</div>
        <div class="todayTasks-list__item-icons">
          <i class="el-icon-circle-check-outline todayTasks-list__item-icons__item">2</i><i class="el-icon-circle-check todayTasks-list__item-icons__item">1</i>
        </div>
      </el-col>
    </el-row>
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
        <el-button type="primary" @click="ensureAddTask('form')">Add</el-button>
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
          id: 1,
          title:"学习Nengo",
          desc:"今天要学习nengo",
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
  $bg-color:rgb(18, 62, 60);
  $primary-color:rgb(57, 122, 109);
  $font-family:'Courier New', Courier, monospace;
  body {
    font-family: $font-family;
    font-weight: 500;
    background-color: $bg-color;
    color: #999;
  }
  .el-form-item__label {
    color: #000;
  }
  .el-input__inner, .el-textarea__inner {
    font-family: $font-family;
  }
  .titleColor {
    color: rgb(70, 140, 128);
  }
  .todayTasks {
    &-title {
      font-size: 50px;
      &-back {
        color:#aaa;
      }
      &-btn {
         color:rgb(121, 138, 32);
         font-size: 18px;
      }
    }
    &-list {
      margin-top: 10px;
      &__item {
        padding: 0 10px;
        background: rgb(7, 27, 25);
        height: 300px;
        position: relative;
        &-title {
            font-size: 18px;
            margin: 10px 0;
        }
        &-desc {
          font-size: 14px;
        }
        &-icons {
          position: absolute;
          width: 100%;
          bottom: 10px;
          right: 10px;
          font-size: 18px;
          text-align: right;
          &__item {
            margin-left: 5px;
          }
        }
      }
    }
  }
</style>
