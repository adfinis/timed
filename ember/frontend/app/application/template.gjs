import BasicDropdownWormhole from "ember-basic-dropdown/components/basic-dropdown-wormhole";
import EmberNotify from "ember-notify/components/ember-notify";
import { ModalTarget } from "ui-core/components/ui-modal";

<template>
  <EmberNotify @messageStyle="bootstrap" />
  <ModalTarget class="[&>*]:overflow-x-hidden" />
  <BasicDropdownWormhole />

  <div id="filter-sidebar-target"></div>

  {{outlet}}
</template>
