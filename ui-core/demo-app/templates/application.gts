import { pageTitle } from 'ember-page-title';
import TaskSelection from '#src/components/task-selection.gts';

const greeting = 'hello';
const thing = console.log;

<template>
  {{pageTitle "Demo Apper"}}
  <div id="things" class="bg-blue-500"><div
      id="things-2"
      class="bg-red-500"
    ></div></div>

  <h1>Welcome to ember!</h1>

  <TaskSelection @onChange={{thing}} />
  jdlksajdkas jdsalkjdlksa jlksadlsak

  {{greeting}}, world!
</template>
