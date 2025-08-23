import useValue from '@base/antd/hooks/useValue';
import { Input, InputProps } from 'antd';
import { useCallback } from 'react';
import FloatLabel from './FloatLabel';

export interface IProps extends InputProps {
  required?: boolean;
}

const FloatInput: React.FC<IProps> = ({
  placeholder,
  defaultValue,
  value,
  onFocus,
  onBlur,
  onChange,
  required,
  size,
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

  const changeHandlerFn = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      handleChangeFn(e.target.value);
      if (onChange) onChange(e);
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
      <Input
        {...rest}
        style={{ boxShadow: 'none', ...style }}
        onFocus={handleFocusFn}
        onBlur={handleBlurFn}
        value={value}
        defaultValue={defaultValue}
        onChange={changeHandlerFn}
        size={size}
      />
    </FloatLabel>
  );
};

export default FloatInput;
