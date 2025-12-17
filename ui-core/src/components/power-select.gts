import Component from '@glimmer/component';
import OriginalPowerSelect, {
  type PowerSelectArgs as OriginalArgs,
  type Select,
} from 'ember-power-select/components/power-select';

type Base = Nullable<unknown[]>;
type Option<T extends Base> = NonNullable<T>[number];
type NullableOption<T extends Base> = Nullable<Option<T>>;

type Wrap<F, T> = F extends (first: unknown, ...args: infer Rest) => infer R
  ? (first: T, ...args: Rest) => R
  : never;

type PowerSelectArgs<T extends Base> = Omit<
  OriginalArgs,
  'onChange' | 'options' | 'scrollTo' | 'selected'
> & {
  options: T;
  selected: NullableOption<T>;
  onChange: Wrap<OriginalArgs['onChange'], NullableOption<T>>;
  scrollTo?: Wrap<OriginalArgs['scrollTo'], NullableOption<T>>;
};

type PowerSelectSignature<T extends Base> = {
  Element: HTMLElement;
  Args: PowerSelectArgs<T>;
  Blocks: {
    default: [option: Option<T>, select: Select];
  };
};

type PowerSelect = new <T extends Base>() => Component<PowerSelectSignature<T>>;

export default OriginalPowerSelect as unknown as PowerSelect;
