<script setup lang="ts">
import FeedComponent from "@/components/Feed/FeedComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <FeedComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-top: 0;
}
</style>
