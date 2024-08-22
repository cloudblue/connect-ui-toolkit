<template>
  <div class="autocomplete">
    <ui-select
      :options="filteredOptions"
      :label="label"
      :modelValue="selected"
      :required="required"
      :propText="propText"
      :propValue="propValue"
      :rules="rules"
      :hint="hint"
      :optionTextFn="optionTextFn"
      :menuProps="menuProps"
      @value-change="updateSelected"
    >
      <div
        slot="search-input"
        class="autocomplete__search"
        :class="{ 'cancel-left-padding': !selected }"
      >
        <ui-textfield
          :value="userInput"
          :noBorders="true"
          :browserAutocomplete="false"
          @input="onUserInput"
        ></ui-textfield>
      </div>
    </ui-select>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Select from '~widgets/select/widget.vue';
import TextField from '~widgets/textfield/widget.vue';

import registerWidget from '~core/registerWidget';

registerWidget('ui-select', Select);
registerWidget('ui-textfield', TextField);

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  propText: {
    type: String,
    default: 'id',
  },
  propValue: {
    type: String,
    default: 'id',
  },
  required: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Array,
    required: true,
  },
  rules: {
    type: Array,
    default: () => [],
  },
  hint: {
    type: String,
    default: '',
  },
  optionTextFn: {
    type: Function,
    default: null,
  },
  menuProps: {
    type: Object,
    default: () => ({
      fullWidth: true,
    }),
  },
});

const emit = defineEmits(['valueChange']);

let userInput = ref('');
let selected = defineModel({
  type: String,
  required: true,
});

const getOptionText = (option) => (typeof option === 'object' ? option[props.propText] : option);

const filteredOptions = computed(() => {
  if (userInput.value === '') {
    return props.options;
  }

  return props.options.filter((option) =>
    getOptionText(option).toLowerCase().includes(userInput.value.toLowerCase()),
  );
});

const onUserInput = (e) => {
  userInput.value = e.detail[0];
};

const updateSelected = (e) => {
  selected.value = e.detail[0];
  userInput.value = '';
  emit('valueChange', selected.value);
};
</script>

<style lang="stylus" scoped>
.autocomplete {

  &__search {
    color: inherit;
    line-height: 20px;
    font-size: 14px;
    border: 1px solid transparent;
    border-left: none;
    outline: none;
    margin: 0;
    background: none;
    box-shadow: none;
    width: 0;
    max-width: 100%;
    flex-grow: 1;
  }

  // there is too much padding coming from select + textfield
  .cancel-left-padding {
    margin-left: -11px;
  }
}
</style>
