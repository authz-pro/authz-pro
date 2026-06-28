<template>
  <div class="mdc-text-field">
    <input
      :type="type ? type : 'text'"
      class="mdc-text-field__input"
      :value="value"
      :id="inputId"
      :placeholder="label"
      @input="$emit('input', $event.target.value)"
      @keyup.enter="$emit('enter')"
      ref="textInput"
      autocomplete="off"
    />
    <label class="mdc-floating-label" :for="inputId">{{ label }}</label>
    <div class="mdc-line-ripple"></div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

let idCounter = 0;

export default Vue.extend({
  props: ["label", "value", "type", "autofocus"],
  data() {
    return {
      inputId: "mdc-input-" + ++idCounter,
    };
  },
  mounted() {
    if (!this.$props.autofocus) {
      return;
    }
    const textInput = this.$refs.textInput;
    if (textInput instanceof HTMLInputElement) {
      textInput.focus();
    }
  },
});
</script>
