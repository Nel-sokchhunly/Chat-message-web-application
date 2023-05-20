<template>
  <div
    class="fixed bottom-0 h-20 bg-white w-screen flex justify-center items-center"
  >
    <div
      class="w-screen md:w-1/2 p-4 flex flex-grow-1 justify-center items-center space-x-4"
    >
      <button
        v-for="button in options"
        @click="onchange(button.id)"
        :class="
          button.id === selected
            ? activeBtnClass + button.bgColor
            : defaultBtnClass
        "
      >
        <img :src="button.icon" class="h-4" />
        <b
          v-if="button.id === selected"
          :class="button.textColor + ' font-bold text-opacity-100'"
          >{{ button.title }}</b
        >
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  selected: Number,
  options: Array<{
    id: Number;
    title: string;
    icon: string;
    bgColor: string;
    textColor: string;
  }>,
  onchange: {
    type: Function,
    required: true
  }
});

const defaultBtnClass =
  ' flex items-center space-x-2 px-4 py-2 rounded-full hover:transition-all duration-500 delay-0 ';
const activeBtnClass = defaultBtnClass + ' flex-1 bg-opacity-60 ';
</script>
