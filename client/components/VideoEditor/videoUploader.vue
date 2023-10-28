<!--Created using Joseph Zimmerman's Drag-and-Drop File Uploader. More info at https://www.smashingmagazine.com/2022/03/drag-drop-file-uploader-vuejs-3/-->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useToastStore } from "@/stores/toast";

const emit = defineEmits(["files-dropped"]);
const active = ref(false);
let inActiveTimeout: NodeJS.Timeout | null = null;

function setActive() {
  active.value = true;
  if (inActiveTimeout !== null) {
    clearTimeout(inActiveTimeout);
  }
}

function setInactive() {
  inActiveTimeout = setTimeout(() => {
    active.value = false;
  }, 50);
}

function onDrop(e: DragEvent) {
  setInactive();
  const dt = e.dataTransfer;

  if (dt === null) {
    useToastStore().showToast({ message: "Upload Failed. Try again", style: "error" });
    throw Error("Drag Event returned null");
  }
  const file = dt.files[0];

  // Check if file is a video
  if (file.type.match(/video\/*/) !== null) {
    emit("files-dropped", file);
  } else {
    useToastStore().showToast({ message: "Please upload a video file", style: "error" });
  }
}

function preventDefaults(e: Event) {
  e.preventDefault();
}

const events = ["dragenter", "dragover", "dragleave", "drop"];

onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults);
  });
});

onUnmounted(() => {
  events.forEach((eventName) => {
    document.body.removeEventListener(eventName, preventDefaults);
  });
});

function onInputChange(e: Event) {
  if (e.target !== null) {
    const files = (<HTMLInputElement>e.target).files;
    if (files) emit("files-dropped", files[0]);
  }
}
</script>
<template>
  <div :data-active="active" @dragenter.prevent="setActive" @dragover.prevent="setActive" @dragleave.prevent="setInactive" @drop.prevent="onDrop">
    <slot :dropZoneActive="active"><img src="@/assets/images/videoEditorUpload.svg" width="600" /></slot>
  </div>
  <input type="file" accept="video/*" v-on:change="onInputChange" />
</template>
<style></style>
