import { on } from "@ember/modifier";
import { CardHeader } from "ui-core/components/ui-card";

<template>
  <CardHeader
    ...attributes
    class="modal-header grid grid-cols-[minmax(0,1fr),auto]"
  >
    <div>{{yield}}</div>
    <button
      type="button"
      class="close"
      aria-label="Close"
      {{on "click" @close}}
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </CardHeader>
</template>
