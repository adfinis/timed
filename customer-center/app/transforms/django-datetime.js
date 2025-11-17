import MomentTransform from "customer-center/transforms/moment";

export default class DjangoDatetimeTransform extends MomentTransform {
  format = "YYYY-MM-DDTHH:mm:ss.SSSSZ";
}
