import type { TOC } from "@ember/component/template-only";
import { hash } from "@ember/helper";
import { LinkTo } from "@ember/routing";
import type { ComponentLike } from "@glint/template";

export interface TopnavLinkSignature {
  Args: {
    route: string;
    model?: unknown;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLAnchorElement;
}

export interface TopnavHeaderSignature {
  Blocks: {
    default: [];
  };
  Element: HTMLElement;
}

export interface TopnavListItemSignature {
  Blocks: {
    default: [];
  };
  Element: HTMLLIElement;
}

export interface TopnavListSignature {
  Blocks: {
    default: [{ item: ComponentLike<TopnavListItemSignature> }];
  };
  Element: HTMLUListElement;
}

export interface TopnavSignature {
  Blocks: {
    default: [
      {
        list: ComponentLike<TopnavListSignature>;
        link: ComponentLike<TopnavLinkSignature>;
      },
    ];
    header: [ComponentLike<TopnavHeaderSignature>];
  };

  Element: null;
}

const linkClass =
  "gap-1 grid grid-cols-[auto,minmax(0,1fr)] h-full hover:[&:not(.active)]:bg-primary-light hover:text-foreground-primary items-center lg:gap-1.5 md:place-items-center md:self-center [&:not(.active,:hover)]:text-tertiary py-2 px-2.5 transition-[font-size] w-full text-xl rounded";
const linkActiveClass =
  "active text-foreground-primary visited:text-foreground-primary bg-primary-dark hover:bg-primary";

const TopnavLink = <template>
  {{#if @model}}
    <LinkTo
      @route={{@route}}
      @model={{@route}}
      class={{linkClass}}
      @activeClass={{linkActiveClass}}
      ...attributes
    >
      {{yield}}
    </LinkTo>
  {{else}}
    <LinkTo
      @route={{@route}}
      class={{linkClass}}
      @activeClass={{linkActiveClass}}
      ...attributes
    >
      {{yield}}
    </LinkTo>
  {{/if}}
</template> satisfies TOC<TopnavLinkSignature>;

const TopnavHeader = <template>
  <header class="flex justify-between" ...attributes>
    {{yield}}
  </header>
</template> satisfies TOC<TopnavHeaderSignature>;

const TopnavListItem = <template>
  <li
    class="text-sm max-md:w-full lg:text-[0.9rem]"
    ...attributes
  >{{yield}}</li>
</template> satisfies TOC<TopnavListItemSignature>;

const TopnavList = <template>
  <ul class="flex h-full flex-col md:flex-row gap-x-1 py-0.5" ...attributes>
    {{yield (hash item=TopnavListItem)}}
  </ul>
</template> satisfies TOC<TopnavListSignature>;

const Topnav = <template>
  <div class="fixed left-0 top-0 z-40 w-full">
    <nav
      class="bg-background dark:bg-background-muted flex w-full flex-col px-2 py-1.5 shadow-md transition-all md:flex-row lg:px-3.5 lg:py-1 xl:px-4 xl:py-0.5"
    >
      {{yield (component TopnavHeader) to="header"}}
      <section class="flex max-h-full w-auto flex-grow flex-row">
        {{yield (hash list=TopnavList link=TopnavLink)}}
      </section>
    </nav>
  </div>
</template> satisfies TOC<TopnavSignature>;

export default Topnav;
