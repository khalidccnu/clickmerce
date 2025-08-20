import useValue from '@base/antd/hooks/useValue';
import { TimePicker, TimePickerProps } from 'antd';
import { useCallback } from 'react';
import FloatLabel from './FloatLabel';

export interface FloatTimePickerProps extends TimePickerProps {
  required?: boolean;
}

const FloatTimePicker = ({
  placeholder,
  defaultValue,
  value,
  onFocus,
  onBlur,
  onChange,
  required,
  mode,
  size,
  style,
  ...rest
}: FloatTimePickerProps) => {
  const { hasValue, handleChangeFn, handleBlurFn, handleFocusFn, isFocus } = useValue({
    id: rest.id?.toString(),
    defaultValue,
    value,
    onFocus,
    onBlur,
  });

  const changeHandlerFn = useCallback<Exclude<TimePickerProps['onChange'], undefined>>(
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
      <TimePicker
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
        placeholder={null}
        rootClassName="ant-float-label-form-select"
      />
    </FloatLabel>
  );
};

export default FloatTimePicker;
