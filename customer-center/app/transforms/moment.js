import Transform from "@ember-data/serializer/transform";
import moment from "moment";

export default class MomentTransform extends Transform {
  format = moment.defaultFormat;

  deserialize(serialized) {
    return serialized ? moment(serialized, this.format) : null;
  }

  serialize(deserialized) {
    return deserialized && deserialized.isValid()
      ? deserialized.format(this.format)
      : null;
  }
}
