<template>
  <div>
    <h1 class="c-title">
      <i class="el-icon-back c-title__back" @click="$router.go(-1)"></i> 
      <span class="c-color--primary">测试</span>  
    </h1>
    <div class="task">
      <el-row>
        <el-col :span="4" class="task-item f-tc">
          <span class="icon-play-circle task-item__icon"></span>
        </el-col>
        <el-col :span="6" class="task-item">
          <span class="task-item__time">33:33</span>  
        </el-col>
        <el-col :span="4" class="task-item">
          <span class="task-item__desc">学习</span>
        </el-col>
        <el-col :span="10" class="task-item"></el-col>
      </el-row>
    </div>
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
  .task {
    margin: 20px;
    background: rgb(7, 27, 25);
    min-height: 250px;
    &-item {
      &__icon {
        font-size: 50px;
        line-height: 240px;
        color:#ccc;
      }
      &__time {
        font-size: 100px;
        line-height: 250px;
        color:#ccc;
      }
      &__desc {
        font-size: 14px;
        display: inline-block;
        margin: 90px 0;
      }
    }
  }
</style>
