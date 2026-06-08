import EmberNotify from "ember-notify/_app_/components/ember-notify.js";
import ModalTarget from "timed/components/modal-target";
import BasicDropdownWormhole from "ember-basic-dropdown/components/basic-dropdown-wormhole";
<template><EmberNotify @messageStyle="bootstrap" />
<ModalTarget />
<BasicDropdownWormhole />

<div id="filter-sidebar-target"></div>

{{outlet}}</template>