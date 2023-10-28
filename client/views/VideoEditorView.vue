<script setup lang="ts">
import VideoPlayer from "@/components/VideoEditor/videoPlayer.vue";
import VideoUploader from "@/components/VideoEditor/videoUploader.vue";
import { ref, computed } from "vue";
import { storage } from "@/utils/firebase.js";
import { ref as fref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { fetchy } from "@/utils/fetchy";

const videoFile = ref();
const videoUploaded = ref(false);
const firebasePending = ref(false);

const videoPath = computed(() => (videoUploaded.value ? URL.createObjectURL(videoFile.value) : ""));

function setVideoFile(f: File) {
  videoFile.value = f;
  videoUploaded.value = true;
}

function resetVideoFile() {
  URL.revokeObjectURL(videoPath.value);
  videoUploaded.value = false;
}

const uploadImage = async (caption: string) => {
  if (videoFile.value === null) return;
  firebasePending.value = true;
  const name = videoFile.value.name + v4();
  const imageRef = fref(storage, name);
  const FB_Promise = uploadBytes(imageRef, videoFile.value);
  const DB_Promise = fetchy("/api/posts", "POST", {
    body: { message: caption, content: name },
  });
  await Promise.all([FB_Promise, DB_Promise]);
  videoUploaded.value = false;
  firebasePending.value = false;
};
</script>

<template>
  <main>
    <section v-if="!videoUploaded">
      <h1 style="margin-top: 0">Video Editor</h1>
      <VideoUploader @files-dropped="setVideoFile" />
    </section>
    <section v-else>
      <section v-if="!firebasePending">
        <VideoPlayer :videoSource="videoPath" @trash="resetVideoFile" @post="(caption) => uploadImage(caption)" />
      </section>
      <section v-else>
        <p>Uploading Jam...</p>
      </section>
    </section>
  </main>
</template>

<style scoped>
* {
  text-align: center;
}
</style>
