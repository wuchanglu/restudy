<template>
  <h1>{{ text }}</h1>
</template>
<script lang="ts" setup>
import { ref } from "vue";
const text = ref("async component");
</script>
