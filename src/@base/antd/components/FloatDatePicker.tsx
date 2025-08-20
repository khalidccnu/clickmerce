import useValue from '@base/antd/hooks/useValue';
import { DatePicker, DatePickerProps } from 'antd';
import { useCallback } from 'react';
import FloatLabel from './FloatLabel';

export interface FloatDatePickerProps extends DatePickerProps {
  required?: boolean;
}

const FloatDatePicker = ({
  required,
  placeholder,
  defaultValue,
  value,
  onFocus,
  onBlur,
  onChange,
  style,
  ...rest
}: FloatDatePickerProps) => {
  const { hasValue, handleChangeFn, handleBlurFn, handleFocusFn, isFocus } = useValue({
    id: rest.id,
    defaultValue,
    value,
    onFocus,
    onBlur,
  });

  const changeHandlerFn = useCallback<Exclude<DatePickerProps['onChange'], undefined>>(
    (value, dateString) => {
      handleChangeFn(value);
      if (onChange) onChange(value, dateString);
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
      status={rest.status || (rest['aria-invalid'] ? 'error' : undefined)}
      required={required}
    >
      <DatePicker
        style={{ width: '100%', border: 'none', ...style }}
        variant="borderless"
        {...rest}
        onFocus={handleFocusFn}
        onBlur={handleBlurFn}
        value={value}
        defaultValue={defaultValue}
        onChange={changeHandlerFn}
        placeholder={null}
        rootClassName="ant-float-label-form-picker"
      />
    </FloatLabel>
  );
};

export default FloatDatePicker;
