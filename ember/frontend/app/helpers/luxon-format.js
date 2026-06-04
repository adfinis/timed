export default function luxonFormat(luxonThing, ...rest) {
  if (!luxonThing.toFormat) return "";
  return luxonThing.toFormat(...rest);
}
