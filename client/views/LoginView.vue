<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

const { isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main class="column" v-if="!isLoggedIn">
    <LoginForm />
    <RegisterForm />
    <h1>Log In or Create an Account</h1>
  </main>
  <main v-else>
    <h1>Welcome to TrafficJam!</h1>
    <RouterLink :to="{ name: 'Home' }">
      <button>Continue to MyWay</button>
    </RouterLink>
  </main>
</template>
<style>
button {
  background-color: white;
  font-weight: bold;
  border-radius: 25px;
  border: 5px white solid;
  margin-left: 15px;
}
</style>
