//  filename            match filename, followed by
//  [^;=\n]*            anything but a ;, a = or a newline
//  =
//  (?<filename>        filename capturing group
//    (?<quote>['"])    either single or double quote, put it in quote group
//    .*?               anything up until the first...
//    \k<quote>         matching quote (single if we found single, double if we find double)
//    |
//    [^;\n]*           anything but a ; or a newline
//  )
const REGEX =
  /filename[^;=\n]*=(?<filename>(?<quote>['"]).*?\k<quote>|[^;\n]*)/;

const parseFileName = (contentDisposition: string) => {
  const { quote, filename } = REGEX.exec(contentDisposition)?.groups ?? {};
  if (!filename) return "Unknown file";
  const _filename = filename.startsWith("utf-8''")
    ? decodeURI(filename.replace("utf-8''", ""))
    : filename;
  return quote ? _filename.slice(1, -1) : _filename;
};

export default parseFileName;
