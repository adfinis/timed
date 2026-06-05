import Empty from "timed/components/empty";
import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";
<template>
  <Empty>
    <FaIcon @icon="hand" />
    <h3>Halt!</h3>
    <p>
      You are not supposed to be here...<br />
      Please leave and do not talk about it,
      <strong>ever</strong>!
    </p>
  </Empty>
</template>
