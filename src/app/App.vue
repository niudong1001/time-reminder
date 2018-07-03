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
      
    }
  },
  beforeMount(){
  },
  mounted(){
    // this.$store.dispatch('rmAllTasks')
    document.oncontextmenu = function(){  // 拒绝右键点击
    　　return false;
    }
  }
}
</script>

<style>
</style>