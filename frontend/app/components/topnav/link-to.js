import Component from "@glimmer/component";

export default class TopnavLinkToComponent extends Component {
  get class() {
    return "md:self-center p-2.5 w-full h-full grid items-center md:place-items-center grid-cols-[auto,minmax(0,1fr)] gap-1 hover:text-foreground-primary hover:[&:not(.active)]:bg-primary/70 [&:not(.active,:hover)]:text-primary dark:[&:not(.active,:hover)]:text-foreground";
  }

  get activeClass() {
    return "active text-foreground-primary visited:text-foreground-primary bg-primary hover:bg-opacity-60";
  }
}
