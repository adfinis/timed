import { LinkTo } from "@ember/routing";

import TimedClock from "timed/components/timed-clock";
<template>
  <div class="login grid place-items-center gap-2 text-center">
    <h1>Welcome to Timed</h1>
    <hr />
    <TimedClock @clockSize={{120}} />
    <br />
    <LinkTo @route="sso-login" class="btn btn-primary">
      Login via SSO
    </LinkTo>
  </div>
</template>
