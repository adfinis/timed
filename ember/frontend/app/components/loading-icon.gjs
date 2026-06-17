const range = (n) => Array(n).fill(0);

<template>
  <div class="loading-icon grid h-40 w-40 grid-cols-3 gap-0.5">
    {{#each (range 9)}}
      <div
        data-test-loading-dot
        class="odd:bg-primary even:bg-tertiary-dark rounded-xl odd:animate-[loading_2s_ease-in-out_infinite] even:animate-[loading_1.5s_ease-in-out_infinite]"
      />
    {{/each}}
  </div>
</template>
