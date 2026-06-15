import { CardBlock } from "ui-core/components/ui-card";

<template>
  <CardBlock
    class="modal-body bg-background max-h-[calc(85dvh-1.5rem)] overflow-y-auto overflow-x-hidden"
    ...attributes
  >
    {{yield}}
  </CardBlock>
</template>
