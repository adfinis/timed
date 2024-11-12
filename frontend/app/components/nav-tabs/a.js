import Component from "@glimmer/component";

export default class NavTabsAComponent extends Component {
  get class() {
    return "group max-sm:flex max-sm:justify-center sm:flex sm:items-center lg:text-lg transition-[font-size] gap-x-1 md:gap-x-2 py-2 px-4 sm:border-background sm:border sm:bg-background sm:-mb-px sm:border-b-border group text-sm md:text-base";
  }

  get activeClass() {
    return "[&.active]:sm:border-border [&.active]:sm:border-b-background [&.active]:max-sm:bg-background-muted [&.active]:sm:rounded-t";
  }
}
