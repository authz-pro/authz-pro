<template>
  <div class="mdc-switch-row">
    <label class="combo-label">{{ label }}</label>
    <div class="mdc-switch">
      <input
        type="checkbox"
        class="mdc-switch__native"
        :checked="checked"
        @change="$emit('change', $event.target.checked)"
      />
      <div class="mdc-switch__track"></div>
      <div class="mdc-switch__thumb"></div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {
    label: String,
    checked: Boolean,
  },
  model: {
    prop: "checked",
    event: "change",
  },
});
</script>
