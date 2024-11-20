import Component from "@glimmer/component";

export default class NavTabsAComponent extends Component {
  get class() {
    return "group max-sm:flex max-sm:justify-center sm:flex sm:items-center transition-[font-size] gap-x-1 sm:gap-x-2 py-1.5 px-2.5 lg:px-3 sm:border-background sm:border sm:bg-background sm:-mb-px sm:border-b-border group";
  }

  get activeClass() {
    return "[&.active]:sm:border-border [&.active]:sm:border-b-background [&.active]:max-sm:bg-background-muted [&.active]:sm:rounded-t";
  }
}
