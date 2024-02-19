<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    :class="[
      {'text-field_focused': focused},
      'text-field',
    ]"
    @focusin="setFocus"
    @focusout="removeFocus"
  >
    <label for="textfield">{{ label }}</label>
    <div class="text-field__wrapper">
      <div class="text-field__body">
        <input
          v-model="localValue"
          name="textfield"
          class="text-field__input"
          type="text"
          @input="onInput"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
  },
  emits: ['input'],
  data() {
    return {
      focused: false,
      localValue: '',
    }
  },

  methods: {
    onInput(e) {
      e.stopPropagation();
      this.$emit('input', this.localValue );
    },

    removeFocus() {
      if (this.focused) {
        this.focused = false;
      }
    },

    setFocus() {
      if (this.focused) return;

      this.focused = true;
    },
  },
}
</script>

<style lang="stylus">
@import '../../assets/styles/common.styl';

.text-field {
  font-family: 'Roboto';
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  display: flex;
  flex-flow: column nowrap;
  color: base-text-color;

  label {
    font-weight 500;
    font-size: 14px;
  }

  &___r {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
  }

  &__body {
    flex-grow: 1;

    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    max-height: 44px;
    padding: 11px;
    border: 1px solid #D8D8D8;
    border-radius: 2px;
    background-color: #FBFBFB;
    cursor: pointer;

    .text-field_disabled &,
    [disabled] &,
    :disabled & {
      border-style: dashed;
      cursor: default;
    }

    .text-field_focused & {
      border-color: #4797f2;
      border-width: 2px ;
    }
  }

  &__input {
    flex-grow: 1;
    outline: none;
    border-style: none;
    background-color: transparent;

    &:hover,
    &:focus {
      outline: none;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px  #FBFBFB inset !important;
    }

    &::placeholder {
      color: #707070;
    }

    .text-field_disabled & {
      color: #BDBDBD;
    }
  }
}
</style>

