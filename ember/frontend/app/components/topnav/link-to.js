import Component from "@glimmer/component";

export default class TopnavLinkToComponent extends Component {
  get class() {
    return "gap-1 grid grid-cols-[auto,minmax(0,1fr)] h-full hover:[&:not(.active)]:bg-primary-light hover:text-foreground-primary items-center lg:gap-1.5 md:place-items-center md:self-center [&:not(.active,:hover)]:text-tertiary py-2 px-2.5  transition-[font-size] w-full";
  }

  get activeClass() {
    return "active text-foreground-primary visited:text-foreground-primary bg-primary-dark hover:bg-primary";
  }
}
