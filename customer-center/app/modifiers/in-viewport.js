import { modifier } from "ember-modifier";

export default modifier(function inViewport(
  element,
  _,
  { onEnter = () => {}, onExit = () => {}, root = "#scroll-container" }
) {
  const intersectionObserver = new IntersectionObserver(
    ([{ isIntersecting }]) => (isIntersecting ? onEnter() : onExit()),
    { root: root instanceof Element ? root : document.getElementById(root) }
  );
  intersectionObserver.observe(element);
  return () => intersectionObserver.disconnect();
});
