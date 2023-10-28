<script setup lang="ts">
import { ref, computed, watch, on } from "vue";
import { storage } from "@/utils/firebase";
import { ref as fref, getDownloadURL } from "firebase/storage";

const props = defineProps(["post"]);

const videoLink = computed(() => props.post?.content);
const videoCaption = computed(() => props.post?.message);
const srcLink = ref("");
const videoRef = ref();
const muted = ref(true);

watch(videoLink, async () => {
  const vidPromise = getDownloadURL(fref(storage, videoLink.value));
  srcLink.value = await vidPromise;
});

function unmute() {
  videoRef.value.muted = false;
  muted.value = false;
}
</script>

<template>
  <div class="videoplayer">
    <button v-if="muted" @click="unmute">UNMUTE</button>
    <video ref="videoRef" :key="srcLink" autoplay :muted="muted" loop><source :src="srcLink" type="video/mp4" /></video>
    <p id="caption">{{ videoCaption }}</p>
  </div>
</template>

<style>
.videoplayer {
  position: relative;
  height: 80vh;
  aspect-ratio: 9 / 16;
  align-self: center;
  margin-left: auto;
  margin-right: auto;
  background-color: black;
  border-radius: 15px;
  border: 10px black solid;
  padding: 5px;
}
.videoplayer video {
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  border-radius: 15px;
}
#caption {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: left;
  height: 10%;
  max-height: 15%;
  margin-bottom: 0;
}
* {
  text-align: center;
}
button {
  background-color: white;
  font-weight: bold;
  border-radius: 25px;
  border: 5px white solid;
  margin-left: 15px;
  position: absolute;
  text-align: center;
  width: 100px;
  left: 35%;
  cursor: pointer;
  z-index: 10;
}
</style>
