<template>
  <colgroup>
    {{#each @columns as |column|}}
      <col class={{column.widthClass}} />
    {{/each}}
  </colgroup>
</template>
