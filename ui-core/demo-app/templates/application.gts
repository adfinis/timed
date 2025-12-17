import { pageTitle } from 'ember-page-title';
import Card from '#src/components/card.gts';

const greeting = 'hello';

<template>
  {{pageTitle "Demo App"}}

  <h1>Welcome to ember!</h1>
  <Card />

  {{greeting}}, world!
</template>
