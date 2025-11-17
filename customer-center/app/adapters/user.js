import ApplicationAdapter from "./application";

export default class TimedUserAdapter extends ApplicationAdapter {
  pathForType = () => "users";
}
