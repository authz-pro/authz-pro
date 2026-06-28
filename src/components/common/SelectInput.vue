<template>
  <div class="mdc-select">
    <label class="mdc-select__label">{{ label }}</label>
    <div class="mdc-select__wrapper">
      <select
        class="mdc-select__native"
        :value="value"
        :disabled="disabled"
        @input="$emit('input', $event.target.value)"
        @change="$emit('change')"
      >
        <slot></slot>
      </select>
      <div class="mdc-select__arrow">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: ["label", "value", "disabled"],
});
</script>
