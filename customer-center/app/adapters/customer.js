import ApplicationAdapter from "./application";

export default class TimedCustomerAdapter extends ApplicationAdapter {
  pathForType = () => "customers";
}
