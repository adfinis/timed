import { buildRegistry } from "ember-strict-application-resolver/build-registry";

export default buildRegistry({
  ...import.meta.glob("./services/*.{js,ts}", { eager: true }),
  ...import.meta.glob("./components/*.{gjs,gts}", { eager: true }),
  ...import.meta.glob("./utils/*.{js,ts}", { eager: true }),
});
