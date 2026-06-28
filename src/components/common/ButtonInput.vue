<template>
  <button
    :class="[
      type === 'small' ? 'button-small' : 'button',
      { 'mdc-button--outlined': outlined, 'mdc-button--raised': raised },
    ]"
    v-on="$listeners"
  >
    <slot></slot>
  </button>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    type: String,
    outlined: Boolean,
    raised: Boolean,
  },
});
</script>
