import Card from "ui-core/components/card";

const thing = Array(3).fill(0);

<template>
  <h2>Card</h2>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-2 grid-rows-min">
    {{#each thing}}
      <Card as |c|>
        <c.header>
          <h4>Hello</h4>
        </c.header>
        <c.block>
          There
        </c.block>
        <c.footer />
      </Card>
    {{/each}}
  </div>
</template>
