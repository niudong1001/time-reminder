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
  },
  beforeMount(){
  },
  mounted(){
    // this.$store.dispatch('rmAllTasks')
  }
}
</script>

<style>
</style>