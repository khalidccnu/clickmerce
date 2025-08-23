import useValue from '@base/antd/hooks/useValue';
import { InputNumber, InputNumberProps } from 'antd';
import { useCallback } from 'react';
import FloatLabel from './FloatLabel';

export interface IProps extends InputNumberProps {
  required?: boolean;
}

const FloatInputNumber: React.FC<IProps> = ({
  placeholder,
  defaultValue,
  value,
  onFocus,
  onBlur,
  onChange,
  required,
  style,
  ...rest
}) => {
  const { hasValue, handleChangeFn, handleBlurFn, handleFocusFn, isFocus } = useValue({
    id: rest.id,
    defaultValue,
    value,
    onFocus,
    onBlur,
  });

  const changeHandlerFn = useCallback<Exclude<InputNumberProps['onChange'], undefined>>(
    (value) => {
      handleChangeFn(value);
      if (onChange) onChange(value);
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
      <InputNumber
        {...rest}
        style={{ boxShadow: 'none', ...style }}
        onFocus={handleFocusFn}
        onBlur={handleBlurFn}
        value={value}
        defaultValue={defaultValue}
        onChange={changeHandlerFn}
      />
    </FloatLabel>
  );
};

export default FloatInputNumber;
