import BasicDropdownWormhole from "ember-basic-dropdown/components/basic-dropdown-wormhole";
import EmberNotify from "ember-notify/components/ember-notify";

import ModalTarget from "timed/components/modal-target";
<template>
  <EmberNotify @messageStyle="bootstrap" />
  <ModalTarget />
  <BasicDropdownWormhole />

  <div id="filter-sidebar-target"></div>

  {{outlet}}
</template>
