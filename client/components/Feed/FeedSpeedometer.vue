<script setup lang="ts">
import { computed } from "vue";
const props = defineProps(["currentValue", "maximum", "size"]);

const offset = Math.PI / 6;
const top = computed(() => 55 * props.size + "px");
const left = computed(() => 55 * props.size + "px");
const dialSize = computed(() => 440 * props.size + "px");
const needleSize = computed(() => 330 * props.size + "px");
const maxSize = computed(() => 440 * props.size + "px");

const rotation = computed(() => ({ transform: "rotate(" + ((Math.min(props.currentValue / props.maximum, 1) * (4 * Math.PI)) / 3 - offset) + "rad)" }));
</script>
<template>
  <main>
    <img src="@/assets/images/dial.png" id="dial" />
    <img src="@/assets/images/Needle.png" :style="rotation" id="needle" />
  </main>
</template>
<style scoped>
main {
  position: relative;
  max-width: v-bind(maxSize);
  max-height: v-bind(maxSize);
  margin-left: auto;
  margin-right: auto;
}
#dial {
  margin: 0;
  position: relative;
  width: v-bind(dialSize);
  height: v-bind(dialSize);
}
#needle {
  margin: 0;
  position: absolute;
  top: v-bind(top);
  left: v-bind(left);
  width: v-bind(needleSize);
  height: v-bind(needleSize);
}
</style>
