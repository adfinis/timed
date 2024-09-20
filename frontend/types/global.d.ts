// Types for compiled templates
declare module "timed/templates/*" {
  import { TemplateFactory } from "ember-cli-htmlbars";

  const tmpl: TemplateFactory;
  export default tmpl;
}
