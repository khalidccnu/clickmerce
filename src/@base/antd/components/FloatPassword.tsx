import useValue from '@base/antd/hooks/useValue';
import { Input } from 'antd';
import { PasswordProps } from 'antd/es/input';
import { useCallback } from 'react';
import FloatLabel from './FloatLabel';

export interface FloatPasswordProps extends PasswordProps {
  required?: boolean;
}

const FloatPassword = ({
  placeholder,
  defaultValue,
  value,
  onFocus,
  onBlur,
  onChange,
  required,
  style,
  ...rest
}: FloatPasswordProps) => {
  const { hasValue, handleChangeFn, handleBlurFn, handleFocusFn, isFocus } = useValue({
    id: rest.id,
    defaultValue,
    value,
    onFocus,
    onBlur,
  });

  const changeHandlerFn = useCallback<Exclude<PasswordProps['onChange'], undefined>>(
    (value) => {
      handleChangeFn(value);
      if (onChange) {
        onChange(value);
      }
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
      <Input.Password
        style={{ width: '100%', border: 'none', ...style }}
        variant="borderless"
        {...rest}
        onFocus={handleFocusFn}
        onBlur={handleBlurFn}
        value={value}
        defaultValue={defaultValue}
        onChange={changeHandlerFn}
        rootClassName="ant-float-label-form-input-password"
      />
    </FloatLabel>
  );
};

export default FloatPassword;
