import useValue from '@base/antd/hooks/useValue';
import { Cascader, CascaderProps } from 'antd';
import { useCallback } from 'react';
import FloatLabel from './FloatLabel';

export interface FloatCascaderProps extends CascaderProps {
  required?: boolean;
  defaultValue?: any;
  value?: any;
  multiple?: boolean;
}

const FloatCascader = ({
  required,
  placeholder,
  defaultValue,
  value,
  onFocus,
  onBlur,
  onChange,
  multiple = true,
  style,
  ...rest
}: FloatCascaderProps) => {
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
        style={{ width: '100%', border: 'none', ...style }}
        variant="borderless"
        {...rest}
        multiple={multiple}
        onFocus={handleFocusFn}
        onBlur={handleBlurFn}
        value={value}
        defaultValue={defaultValue}
        onChange={changeHandlerFn}
        rootClassName="ant-float-label-form-select"
      />
    </FloatLabel>
  );
};

export default FloatCascader;
