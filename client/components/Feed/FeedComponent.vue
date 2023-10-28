<script setup lang="ts">
import { ref, onBeforeMount, onBeforeUnmount, reactive } from "vue";
import { fetchy } from "@/utils/fetchy";
import FeedVideoPlayer from "@/components/Feed/FeedVideoPlayer.vue";
import FeedSpeedometer from "./FeedSpeedometer.vue";
import gsap from "gsap";

const MAX_SCROLLS = 10; // Test low value for now. Change to like... 30 in the future
const MAX_TIME = 300; // Test low value for now. Change to like... 900 in the future
const BREAKCHECK_TIME = 10; // Same as above. Prolly should be like 30 in the future

const currentVideoLink = ref("StartLink");
const currentStats = ref({ count: 0, time: 0 });
const breakCheck = ref(false);

const rerenderVideo = ref(0);

let updateTimers: NodeJS.Timeout | null = null;

const timeTween = reactive({
  number: 0,
});

const countTween = reactive({
  number: 0,
});

function tweenVals(time: number, count: number) {
  gsap.to(timeTween, { duration: 6, number: Number(time) || 0 });
  gsap.to(countTween, { duration: 1, number: Number(count) || 0 });
}

const makeFeed = async () => {
  try {
    await fetchy("/api/feed", "POST", {});
  } catch (_) {
    await fetchy("/api/feed/unpause", "PATCH", {});
  }
};

const nextItemInFeed = async () => {
  if (!breakCheck.value) {
    try {
      // console.log("Trying to get an item from the feed...");
      const postID = (await fetchy("/api/feed", "PATCH", {}))._id;
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
        await fetchy("/api/feed/reset", "PATCH", {});
        await nextItemInFeed(); // Eventually get rid of this
      }
    }
  }
  await getFeedStats();
};

const getFeedStats = async () => {
  const stats = await fetchy("/api/feed/stats", "GET", {});
  currentStats.value.count = stats.count;
  currentStats.value.time = stats.time;

  if (currentStats.value.count >= MAX_SCROLLS && currentStats.value.time >= MAX_TIME) {
    if (breakCheck.value) return;
    // BREAK CHECK
    await resetStats();
    await fetchy(`/api/disable`, "POST", {});
    breakCheck.value = true;
  } else {
    if (breakCheck.value) {
      if (currentStats.value.time > BREAKCHECK_TIME) {
        await fetchy(`/api/disable`, "DELETE", {});
        breakCheck.value = false;
        await nextItemInFeed();
        await resetStats;
      }
    }
  }
  if (updateTimers !== null) {
    clearTimeout(updateTimers);
  }
  updateTimers = setTimeout(() => getFeedStats(), 1000);
  tweenVals(stats.time, stats.count);
};

const pauseTimer = async () => {
  if (updateTimers !== null) {
    clearTimeout(updateTimers);
  }
  await fetchy("/api/feed/pause", "PATCH", {});
};

const isLocked = async () => {
  const ls = await fetchy(`/api/disable`, "GET", {});
  breakCheck.value = ls.lockState;
};

const resetStats = async () => {
  await fetchy("/api/feed/stats", "PATCH", {});
};

onBeforeMount(async () => {
  await isLocked();
  await makeFeed();
  await nextItemInFeed();
});

onBeforeUnmount(async () => {
  await pauseTimer();
});

window.onbeforeunload = pauseTimer;
</script>
<template>
  <div v-if="breakCheck">
    <img src="@/assets/images/scrollLocked.svg" width="150" id="scroll" />
  </div>
  <div v-else>
    <img src="@/assets/images/scroll.svg" width="150" @click="nextItemInFeed" id="scroll" />
  </div>
  <section v-if="breakCheck" id="bcdiv">
    <div id="breakcheck">
      <h1>BREAK CHECK</h1>
      <h1>🚗</h1>
      <p>You've scrolled for a while.</p>
      <p>Time to get off?</p>
    </div>
    <p id="timeleft">Continue scrolling in {{ BREAKCHECK_TIME - Math.floor(currentStats.time) }} seconds.</p>
  </section>
  <section class="feed" v-else>
    <div class="speedometer">
      <FeedSpeedometer :current-value="countTween.number.toFixed()" :maximum="MAX_SCROLLS" size="0.45" />
      <div class="stat">
        <img src="@/assets/images/counterIcon.svg" width="30" />
        <p class="dialVal">{{ currentStats.count }}</p>
      </div>
    </div>
    <FeedVideoPlayer v-bind:post="currentVideoLink" :key="rerenderVideo" />
    <div class="speedometer">
      <FeedSpeedometer :current-value="timeTween.number.toFixed()" :maximum="MAX_TIME" size="0.45" />
      <div class="stat">
        <img src="@/assets/images/timerIcon.svg" width="30" />
        <p class="dialVal">{{ Math.floor(currentStats.time / 60) }}:{{ Math.floor((currentStats.time % 60) * 100) / 100 }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.feed {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.feed > * {
  margin: 0;
  padding: 0;
}
.speedometer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 10px;
  margin-right: 10px;
}
.dialVal {
  background: white;
  border-radius: 30px;
  width: 200%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  padding-left: 10px;
  padding-right: 10px;
}
.stat {
  display: flex;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
}
#scroll {
  cursor: pointer;
  margin: 20px;
  margin-top: 0px;
}
#breakcheck {
  background: white;
  border: 5px solid white;
  border-radius: 40px;
  max-width: 20vw;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 25vh;
}
#timeleft {
  background: white;
  border-radius: 20px;
  max-width: 15vw;
  margin-left: auto;
  margin-right: auto;
  padding: 5px;
}
#bcdiv {
  max-width: 20vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
}
</style>
