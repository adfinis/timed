import Topnav from "timed/components/topnav";
import WelcomeModal from "timed/components/welcome-modal";
<template>
  <main class="page-main relative">
    {{#if @controller.loading}}<span class="loader"></span>{{/if}}
    <div
      class="page-content--scroll flex h-screen min-h-screen flex-col overflow-auto px-2 py-2.5 lg:px-3.5 lg:py-4 xl:px-4 xl:py-5"
    >
      <Topnav @onLogout={{@controller.logoutSession}} />
      <div class="mt-16" />
      {{outlet}}
    </div>
  </main>

  <WelcomeModal
    @visible={{@controller.visible}}
    @onNever={{@controller.neverTour}}
    @onLater={{@controller.laterTour}}
    @onStart={{@controller.startTour}}
  />
</template>
