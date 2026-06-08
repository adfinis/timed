import FaIcon from "@fortawesome/ember-fontawesome/components/fa-icon";

import Empty from "timed/components/empty";
<template>
  <Empty class="mt-5">
    <FaIcon @icon="ban" @prefix="fas" />
    <h3>You do not have permission to access Timed.</h3>
  </Empty>
</template>
