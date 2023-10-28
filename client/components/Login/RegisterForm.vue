<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { createUser, loginUser, updateSession } = useUserStore();

const regOpen = ref(false);

async function register() {
  await createUser(username.value, password.value);
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <div v-if="regOpen">
    <form class="pure-form pure-form-aligned" @submit.prevent="register">
      <h3>Register User</h3>
      <fieldset>
        <div class="pure-control-group">
          <label for="aligned-name">Username</label>
          <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
        </div>
        <div class="pure-control-group">
          <label for="aligned-password">Password</label>
          <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
        </div>
        <div class="pure-controls">
          <button type="submit">Register</button>
        </div>
      </fieldset>
    </form>
  </div>
  <div v-else>
    <h2 @click="regOpen = true">Sign Up</h2>
  </div>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}
h2 {
  background: white;
  border: white 50px solid;
  border-radius: 100px;
  width: 200px;
  cursor: pointer;
}
h2:hover {
  background: lightgray;
  border-color: lightgray;
}
button {
  background-color: white;
  font-weight: bold;
  border-radius: 25px;
  border: 5px white solid;
  margin-left: 15px;
}
</style>
