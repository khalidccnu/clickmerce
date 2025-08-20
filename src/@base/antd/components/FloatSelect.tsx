import useValue from '@base/antd/hooks/useValue';
import { Select, SelectProps } from 'antd';
import { useCallback } from 'react';
import FloatLabel from './FloatLabel';

export interface FloatSelectProps extends SelectProps {
  required?: boolean;
}

const FloatSelect = ({
  defaultValue,
  value,
  placeholder,
  onFocus,
  onBlur,
  onChange,
  required,
  mode,
  size,
  style,
  ...rest
}: FloatSelectProps) => {
  const { hasValue, handleChangeFn, handleBlurFn, handleFocusFn, isFocus } = useValue({
    id: rest.id?.toString(),
    defaultValue,
    value,
    onFocus,
    onBlur,
  });

  const changeHandlerFn = useCallback<Exclude<SelectProps['onChange'], undefined>>(
    (value, option) => {
      handleChangeFn(value);
      if (onChange) onChange(value, option);
    },
    [onChange, handleChangeFn],
  );

  return (
    <FloatLabel
      label={placeholder}
      focused={isFocus}
      haveValue={hasValue}
      width={style?.width}
      height={style?.height}
      required={required}
      status={rest.status || (rest['aria-invalid'] ? 'error' : undefined)}
    >
      <Select
        style={{ width: '100%', border: 'none', ...style }}
        variant="borderless"
        {...rest}
        onFocus={handleFocusFn}
        onBlur={handleBlurFn}
        value={value}
        defaultValue={defaultValue}
        size={size}
        onChange={changeHandlerFn}
        mode={mode}
        rootClassName="ant-float-label-form-select"
      />
    </FloatLabel>
  );
};

export default FloatSelect;
