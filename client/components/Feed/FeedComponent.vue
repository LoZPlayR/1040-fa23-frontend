<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "@/utils/fetchy";
import FeedVideoPlayer from "@/components/Feed/FeedVideoPlayer.vue";

console.log(FeedVideoPlayer.test);

const currentVideoLink = ref("StartLink");
const currentStats = ref({ count: 0, time: 0 });

const makeFeed = async () => {
  try {
    await fetchy("/api/feed", "POST", {});
  } catch (_) {
    return;
  }
};

const nextItemInFeed = async () => {
  try {
    // console.log("Trying to get an item from the feed...");
    const postID = (await fetchy("/api/feed", "PATCH", {}))._id;
    console.log(`/api/posts:${postID}`);
    currentVideoLink.value = (await fetchy(`/api/posts/:${postID}`, "GET", {}))[0];
  } catch (_) {
    try {
      // console.log("Failed to get an item! Refilling feed..");
      await fetchy("/api/feed/queue/:3", "PATCH", {});
      // console.log("Trying to get an item from the feed again...");
      const postID = (await fetchy("/api/feed", "PATCH", {}))._id;
      currentVideoLink.value = (await fetchy(`/api/posts/:${postID}`, "GET", {}))[0];
    } catch (_) {
      // console.log("No content found! Feed is empty");
      currentVideoLink.value = "FEED_IS_EMPTY";
    }
  }
};

const getFeedStats = async () => {
  const stats = await fetchy("/api/feed/stats", "GET", {});
  currentStats.value.count = stats.count;
  currentStats.value.time = stats.time;
};
</script>

<template>
  <div>
    <button @click="makeFeed">Start Feed</button>
  </div>
  <div>
    <button @click="nextItemInFeed">Generate Next Item</button>
  </div>
  <div>
    <button @click="getFeedStats">Generate stats</button>
  </div>
  <!-- <div>
    <button @click="getImgur">👀</button>
  </div> -->
  <FeedVideoPlayer v-bind:test="currentVideoLink" />
  <div>TIME = {{ currentStats.time }} COUNT = {{ currentStats.count }}</div>
</template>

<style scoped></style>
