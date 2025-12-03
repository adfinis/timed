import type { TOC } from "@ember/component/template-only";

export interface PageHeadingSignature {
  Blocks: {
    default: [];
  };
  Element: HTMLHeadingElement;
}

const PageHeading = <template>
  <h1 class="mb-2" ...attributes>{{yield}}</h1>
</template> satisfies TOC<PageHeadingSignature>;

export default PageHeading;
