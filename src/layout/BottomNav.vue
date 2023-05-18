<template>
  <div
    class="h-fit absolute bottom-0 left-0 w-screen px-4 py-2 flex flex-grow-1 space-x-4"
  >
    <button
      v-for="button in options"
      @click="onchange(button.id)"
      :class="
        button.id === selected ? activeBtnClass + button.color : defaultBtnClass
      "
    >
      <img :src="button.icon" class="h-4" />
      <b v-if="button.id === selected">{{ button.title }}</b>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps({
  selected: Number,
  options: Array<{
    id: Number;
    title: string;
    icon: string;
    color: string;
  }>,
  onchange: {
    type: Function,
    required: true
  }
});

const defaultBtnClass =
  ' flex items-center space-x-2 px-4 py-2 rounded-full hover:transition-all duration-500 delay-0 ';
const activeBtnClass = defaultBtnClass + ' flex-1 bg-opacity-40 ';
</script>
