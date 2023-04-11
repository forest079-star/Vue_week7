<template>
  <div>
    <h1 class="">
      Hello world!
    </h1>
    <button type="button" class="btn btn-primary" @click="count++">count is {{ count }}</button>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        count: 0
      }
    }
  }
</script>

<style scoped>

</style>