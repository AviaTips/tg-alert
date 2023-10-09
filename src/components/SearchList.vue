<script setup>
import data from '../data.js';
import {
  Cell,
  List,
  Search,
} from 'vant';
import {
  ref,
  watch,
} from 'vue';

const props = defineProps({
  default: {
    type: Array,
    default() {
      return [];
    },
  },
  selected: {
    type: String,
    default: null,
  },
  exclude: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(['select']);

const query = ref('');
const list = ref(props.default);

watch(query, (q) => {
  if (q.length) {
    list.value = data.search(q)
      .filter((item) => item.code !== props.exclude);
  } else {
    list.value = props.default;
  }
});

watch(() => props.default, () => {
  list.value = props.default;
});

function select(value) {
  query.value = '';
  emit('select', value);
}
</script>

<template>
  <Search
    :model-value="query"
    :placeholder="placeholder"
    autofocus
    autocomplete="off"
    autocorrect="off"
    :spellcheck="false"
    @input="event => query = event.target.value"
    @clear="query = ''"
  />
  <List>
    <Cell
      v-for="item in list"
      :key="item.code"
      :title="item.title"
      :value="item.code"
      clickable
      :icon="selected === item.code ? 'success' : null"
      @click="select(item)"
    />
  </List>
</template>
