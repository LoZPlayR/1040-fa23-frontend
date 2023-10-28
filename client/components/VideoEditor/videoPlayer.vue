<script setup lang="ts">
import { ref, computed } from "vue";
import { useToastStore } from "@/stores/toast";

const videoPlayer = ref();
const vSlider = ref();
const props = defineProps(["videoSource"]);
const emit = defineEmits(["trash", "post"]);

const currCaption = ref("");
const currCaptionLength = computed(() => currCaption.value.length);

let prevVolume = 1;
const isPlaying = ref(true);
const isMuted = ref(false);
const addCaption = ref(false);

function playPauseVideo() {
  if (isPlaying.value) {
    videoPlayer.value.pause();
  } else {
    videoPlayer.value.play();
  }
  isPlaying.value = !isPlaying.value;
}

function muteVideo() {
  const video = videoPlayer.value;
  if (!isMuted.value) {
    prevVolume = video.volume;
    video.volume = 0;
    isMuted.value = true;
  } else {
    video.volume = prevVolume;
    isMuted.value = false;
  }
}

function setVol(e: Event) {
  isMuted.value = false;
  if (e.target === null) return;
  const et: HTMLInputElement = e.target;
  videoPlayer.value.volume = et.value / 100;
}

function notImplemented() {
  useToastStore().showToast({ message: "This feature is not implemented", style: "error" });
}

function handleCaption() {
  addCaption.value = true;
}
function cancelCaption() {
  currCaption.value = "";
  addCaption.value = false;
}
</script>
<template>
  <div id="videoEditorDiv">
    <div id="volumeControl">
      <img @click="playPauseVideo" src="@/assets/images/pause.svg" width="50" v-if="isPlaying" />
      <img @click="playPauseVideo" src="@/assets/images/play.svg" width="50" v-else />
      <img @click="muteVideo" src="@/assets/images/soundOff.svg" width="60" v-if="isMuted" />
      <img @click="muteVideo" src="@/assets/images/soundOn.svg" width="60" v-else />
      <input type="range" min="0" max="100" value="100" ref="vSlider" @input="setVol" id="volumeSlider" />
    </div>
    <div id="videoSection">
      <video :key="videoSource" id="my-player" ref="videoPlayer" loop autoplay @playing="() => console.log('playing')" @mounted="() => console.log('mounted')">
        <source :src="videoSource" />
      </video>
    </div>
    <div id="editorOptions">
      <img src="@/assets/images/Send.png" @click="handleCaption" />
      <img src="@/assets/images/Download.png" @click="notImplemented" />
      <img src="@/assets/images/Upload doc.png" @click="notImplemented" />
      <img src="@/assets/images/Trash.png" @click="emit('trash')" />
    </div>
  </div>
  <div class="addCaption" :hidden="!addCaption">
    <button @click="cancelCaption">Nvm</button>
    <h3>Add Caption</h3>
    <textarea v-model="currCaption" maxlength="140" style="height: 25vh; resize: none"></textarea>
    <p style="margin: 0">Chars Remaining: {{ 140 - currCaptionLength }}</p>
    <button @click="emit('post', currCaption)" :hidden="currCaptionLength === 0">SUBMIT</button>
  </div>
</template>
<style>
#videoEditorDiv {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  max-height: 80vh;
  max-width: 50vw;
}
.videoSection {
  max-height: 80vh;
  aspect-ratio: 9 / 16;
  background: black;
  display: inline-block;
  margin: 0;
}
#videoSection video {
  max-width: 100%;
  max-height: 80vh;
}
#editor-options * {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  cursor: pointer;
}
#editorOptions {
  display: flex;
  flex-direction: column;
  background: white;
  border: 20px solid white;
  border-radius: 25px;
  gap: 40px;
  margin-left: 10px;
}
#volumeControl {
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  width: 100px;
  padding-top: 20px;
  padding-bottom: 80px;
  background: white;
  border-radius: 25px;
}
.addCaption {
  position: absolute;
  min-width: 200px;
  width: 2%;
  height: 40vh;
  background: white;
  top: calc(50% - 20vh);
  left: calc(50% - 10vw);
  border-radius: 25px;
  margin-left: auto;
  margin-right: auto;
}
#volumeSlider {
  transform: rotate(270deg);
  background-color: black;
  margin-top: 60px;
}
</style>
