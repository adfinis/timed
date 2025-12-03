import Card from "ui-core/components/card";
import PageHeading from "../components/page-heading";

const thing = Array(3).fill(0);

<template>
  <PageHeading>Card</PageHeading>
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
