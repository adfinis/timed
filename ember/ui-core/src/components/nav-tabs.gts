import type { TOC } from "@ember/component/template-only";
import { hash } from "@ember/helper";
import { LinkTo } from "@ember/routing";
import type { ComponentLike } from "@glint/template";

interface TabSignature {
  Blocks: {
    default: [];
  };
  Element: HTMLLIElement;
}

interface LinkSignature {
  Args: {
    route: string;
    model?: unknown;
    query?: Record<string, unknown>;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLAnchorElement;
}

export interface NavTabsSignature {
  Blocks: {
    default: [
      { tab: ComponentLike<TabSignature>; link: ComponentLike<LinkSignature> },
    ];
  };
  Element: HTMLUListElement;
}

const Link = <template>
  {{#let
    (if @model (component LinkTo model=@model) (component LinkTo))
    as |LinkComponent|
  }}
    <LinkComponent
      ...attributes
      @activeClass="!border-border !text-foreground-accent !border-b-background !rounded-t"
      @route={{@route}}
      class="group flex items-center transition-[font-size] gap-x-2 py-1.5 px-2.5 lg:px-3 border-background border border-b-transparent bg-background hover:text-foreground-accent/80 group"
    >
      {{yield}}
    </LinkComponent>
  {{/let}}
</template> satisfies TOC<LinkSignature>;

const Tab = <template>
  <li
    class="grid max-sm:border max-sm:first:rounded-t-sm max-sm:last:rounded-b-sm lg:text-[1.01rem]"
    ...attributes
  >
    {{yield}}</li>
</template> satisfies TOC<TabSignature>;

const NavTabs = <template>
  <ul
    class="nav-tabs -mt-px border-b-2 border-b-border/50"
    ...attributes
  >{{yield (hash link=Link tab=Tab)}}</ul>
</template> satisfies TOC<NavTabsSignature>;

export default NavTabs;
