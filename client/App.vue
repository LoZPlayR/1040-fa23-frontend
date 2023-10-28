<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref, computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

const widthloc = computed(() => Math.random() * 100 + "%");
const heightloc = computed(() => Math.random() * 100 + "%");

const menuOpen = ref(false);

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <div id="fullbg">
    <section v-if="menuOpen">
      <img src="@/assets/images/menuClose.svg" @click="menuOpen = false" />
      <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }">
        <img src="@/assets/images/myWay.svg" />
      </RouterLink>
      <RouterLink :to="{ name: 'VideoEditor' }" :class="{ underline: currentRouteName == 'VideoEditor' }">
        <img src="@/assets/images/jam.svg" />
      </RouterLink>
      <RouterLink :to="{ name: 'Dashboard' }" :class="{ underline: currentRouteName == 'Dashboard' }">
        <img src="@/assets/images/cog.png" />
      </RouterLink>
    </section>
    <section v-else>
      <img src="@/assets/images/menuOpen.svg" @click="menuOpen = true" />
    </section>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
    <RouterView />
  </div>
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 1em 2em;
  background-color: lightgray;
  display: flex;
  align-items: center;
}

h1 {
  font-size: 2em;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  max-height: 60px;
  max-width: 60px;
  height: 60px;
}
.underline {
  text-decoration: underline;
}

#fullbg {
  background: radial-gradient(at v-bind(widthloc) v-bind(heightloc), rgba(184, 29, 19, 1) 12%, rgba(235, 247, 0, 1) 53%, rgba(0, 132, 80, 1) 82%);
  background-size: 100%;
  min-width: 100vw;
  min-height: 100vh;
}
section {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 30px;
  padding-right: 10px;
  padding-top: 10px;
}
</style>
