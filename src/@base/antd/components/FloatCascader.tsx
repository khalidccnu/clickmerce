import useValue from '@base/antd/hooks/useValue';
import { cn } from '@lib/utils/cn';
import { Cascader, CascaderProps } from 'antd';
import React, { useCallback } from 'react';
import FloatLabel from './FloatLabel';

export interface IProps extends CascaderProps {
  required?: boolean;
  defaultValue?: any;
  value?: any;
  multiple?: boolean;
}

const FloatCascader: React.FC<IProps> = ({
  required,
  placeholder,
  defaultValue,
  value,
  onFocus,
  onBlur,
  onChange,
  multiple = true,
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

  const changeHandlerFn = useCallback(
    (value: any, selectedOptions: any) => {
      handleChangeFn(value);
      if (onChange) onChange(value, selectedOptions);
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
      <Cascader
        {...rest}
        className={cn('[&_.ant-select-selector]:!shadow-none', className)}
        style={style}
        multiple={multiple}
        onFocus={handleFocusFn}
        onBlur={handleBlurFn}
        value={value}
        defaultValue={defaultValue}
        onChange={changeHandlerFn}
      />
    </FloatLabel>
  );
};

export default FloatCascader;
