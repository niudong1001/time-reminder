<template>
  <div id="app">
    <!-- <div v-loading.fullscreen.lock="fullscreenLoading"></div> -->
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  data(){
    return {
      isJudge:false
    }
  },
  beforeMount(){
  },
  methods:{
    getWinSize(){
      let winWidth;
      let winHeight;
      // 获取窗口宽度
      if (window.innerWidth)
      winWidth = window.innerWidth;
      else if ((document.body) && (document.body.clientWidth))
      winWidth = document.body.clientWidth;
      // 获取窗口高度
      if (window.innerHeight)
      winHeight = window.innerHeight;
      else if ((document.body) && (document.body.clientHeight))
      winHeight = document.body.clientHeight;
      // 通过深入 Document 内部对 body 进行检测，获取窗口大小
      if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
      {
      winHeight = document.documentElement.clientHeight;
      winWidth = document.documentElement.clientWidth;
      }
      return {
        width:winWidth,
        height:winHeight
      }
    }
  },
  mounted(){
    let vm = this;
    // this.$store.dispatch('rmAllTasks')
    document.oncontextmenu = function(){  // 拒绝右键点击
    　　return false;
    }
    // 窗口被调节
    window.onresize = function(){
        // let winSize = vm.getWinSize();
        // let adjust = false;
        // if(winSize.width <= 1300){
        //   winSize.width = 1400;
        //   adjust = true;
        // }
        // if(winSize.height <= 600){
        //   winSize.height = 650;
        //   adjust = true;
        // }
        // if(adjust && !this.isJudge) {
        //   window.resizeTo(winSize.width, winSize.height);
        //   this.isJudge = true;
        // }
        // console.log(winSize);
    }
  }
}
</script>