import useValue from '@base/antd/hooks/useValue';
import { cn } from '@lib/utils/cn';
import { AutoComplete, AutoCompleteProps } from 'antd';
import React, { useCallback } from 'react';
import FloatLabel from './FloatLabel';

export interface IProps extends AutoCompleteProps {
  required?: boolean;
}

const FloatAutoComplete: React.FC<IProps> = ({
  required,
  placeholder,
  defaultValue,
  value,
  onFocus,
  onBlur,
  onChange,
  style,
  className,
  ...rest
}) => {
  const { hasValue, handleChangeFn, handleBlurFn, handleFocusFn, isFocus } = useValue({
    id: rest.id,
    defaultValue,
    value,
    onFocus,
    onBlur,
  });

  const changeHandlerFn = useCallback<Exclude<AutoCompleteProps['onChange'], undefined>>(
    (value, option) => {
      handleChangeFn(value);
      if (onChange) {
        onChange(value, option);
      }
    },
    [onChange, handleChangeFn],
  );

  return (
    <FloatLabel
      label={placeholder}
      required={required}
      focused={isFocus}
      haveValue={hasValue}
      width={style?.width}
      height={style?.height}
      status={rest.status || (rest['aria-invalid'] ? 'error' : undefined)}
    >
      <AutoComplete
        {...rest}
        className={cn('[&_.ant-select-selector]:!shadow-none', className)}
        style={style}
        onFocus={handleFocusFn}
        onBlur={handleBlurFn}
        value={value}
        defaultValue={defaultValue}
        onChange={changeHandlerFn}
      />
    </FloatLabel>
  );
};

export default FloatAutoComplete;
