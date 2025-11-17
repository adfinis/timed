export default function parseError(error) {
  if (!error.errors) {
    return error.message;
  }

  return error.errors.map((error) => error.detail).join(", ");
}
