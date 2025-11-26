declare module "ember-notify" {
  import Service from "@ember/service";

  type NotifyServiceOptions = Record<string, unknown>;

  declare class NotifyService extends Service {
    info(options: NotifyServiceOptions);
    info(message: string, options?: NotifyServiceOptions): void;

    success(options: NotifyServiceOptions);
    success(message: string, options?: NotifyServiceOptions): void;

    warning(options: NotifyServiceOptions);
    warning(message: string, options?: NotifyServiceOptions): void;

    alert(options: NotifyServiceOptions);
    alert(message: string, options?: NotifyServiceOptions): void;

    error(options: NotifyServiceOptions);
    error(message: string, options?: NotifyServiceOptions): void;
  }

  export default NotifyService;
}
