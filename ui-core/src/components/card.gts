import type { TOC } from "@ember/component/template-only";
import { hash } from "@ember/helper";
import type { ComponentLike } from "@glint/template";

export interface CardSegmentSignature {
  Blocks: {
    default: [];
  };
  Element: HTMLElement;
}

export interface CardSignature {
  Blocks: {
    default: [
      {
        header: ComponentLike<CardSegmentSignature>;
        block: ComponentLike<CardSegmentSignature>;
        footer: ComponentLike<CardSegmentSignature>;
      },
    ];
  };
  Element: HTMLElement;
}

const CardBlock = <template>
  <div class="p-4" ...attributes>
    {{yield}}
  </div>
</template> satisfies TOC<CardSegmentSignature>;

const CardFooter = <template>
  <div
    class="bg-background dark:bg-background-muted border-border border-t px-4 py-2 last:rounded-b shadow-sm shadow-border/10"
    ...attributes
  >
    {{yield}}
  </div>
</template> satisfies TOC<CardSegmentSignature>;

const CardHeader = <template>
  <div
    class="bg-background dark:bg-background-muted border-border border-b px-4 py-2 first:rounded-t shadow-sm shadow-border/10"
    ...attributes
  >
    {{yield}}
  </div>
</template> satisfies TOC<CardSegmentSignature>;

const Card = <template>
  <div
    class="card bg-background rounded border-border border shadow-sm"
    ...attributes
  >
    {{yield (hash header=CardHeader block=CardBlock footer=CardFooter)}}
  </div>
</template> satisfies TOC<CardSignature>;

export default Card;
export { CardFooter, CardHeader, CardBlock };

