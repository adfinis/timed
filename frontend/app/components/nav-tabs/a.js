import Component from "@glimmer/component";

export default class NavTabsAComponent extends Component {
  get class() {
    return "group max-md:flex max-md:justify-center md:flex md:items-center gap-x-2 py-2 px-4 md:border-background md:border md:bg-background md:-mb-px md:border-b-border";
  }

  get activeClass() {
    return "[&.active]:md:border-border [&.active]:md:border-b-background [&.active]:max-md:bg-background-muted [&.active]:md:rounded-t";
  }
}
