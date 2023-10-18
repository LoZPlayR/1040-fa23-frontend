<script setup lang="ts">
import { computed } from "vue";

const props = defineProps(["test"]);

const videoLink = computed(() => props.test?.content);
const videoCaption = computed(() => props.test?.message);
const srcLink = computed(() => `https://i.imgur.com/${videoLink?.value}.mp4`);
</script>

<template>
  <div>Video goes here. Let's just do the link for now. Then we go crazier. INPUT: {{ test }}</div>
  Here's what I'm getting on the child: LINK: {{ videoLink }}, CAPTION: {{ videoCaption }}. SRC: {{ srcLink }}
  <div>
    <vue-plyr>
      <video><source size="1080" src="" type="video/mp4" /></video>
    </vue-plyr>
  </div>
</template>

<style></style>
