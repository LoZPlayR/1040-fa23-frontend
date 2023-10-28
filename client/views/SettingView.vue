<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";
import { fetchy } from "../utils/fetchy";
import PostListComponent from "../components/Post/PostListComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}

async function deleteFeed_() {
  await fetchy("/api/feed/reset", "PATCH");
}
</script>

<template>
  <main class="column">
    <h1>Settings for {{ currentUsername }}</h1>
    <button @click="logout">Logout</button>
    <button id="delete" @click="delete_">Delete User</button>
    <UpdateUserForm />
    <button @click="deleteFeed_">Reset Feed</button>
    <PostListComponent />
  </main>
</template>
<style>
button {
  background-color: white;
  font-weight: bold;
  border-radius: 25px;
  border: 5px white solid;
  margin-left: 15px;
  text-align: center;
}
button:hover {
  background-color: lightgray;
  border-color: lightgray;
}
#delete {
  background-color: rgb(253, 69, 69);
  font-weight: bold;
  border: 5px rgb(253, 69, 69) solid;
  text-align: center;
  color: white;
  border-radius: 0;
}
#delete:hover {
  background-color: red;
  border-color: red;
}
</style>
