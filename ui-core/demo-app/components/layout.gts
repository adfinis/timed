import type { TOC } from "@ember/component/template-only";
import Component from "@glimmer/component";
import { HEADER_ID, MAIN_ID } from "../templates/application.gts";

interface ContainerSignature {
  Args: {
    ref: HTMLElement;
  };
  Blocks: {
    default: [];
  };
}

export const Container = <template>
  {{#in-element @ref}}{{yield}}{{/in-element}}
</template> satisfies TOC<ContainerSignature>;

interface LayoutSignature {
  Blocks: {
    main: [];
    header: [];
    footer: [];
  };
}

export default class Layout extends Component<LayoutSignature> {
  get headerRef() {
    return document.getElementById(HEADER_ID)!;
  }

  get mainRef() {
    return document.getElementById(MAIN_ID)!;
  }

  <template>
    <Container @ref={{this.headerRef}}>{{yield to="header"}}</Container>
    <Container @ref={{this.mainRef}}>{{yield to="main"}}</Container>
    {{yield to="footer"}}
  </template>
}
