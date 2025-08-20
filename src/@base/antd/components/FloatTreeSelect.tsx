import { TreeSelect, TreeSelectProps } from 'antd';
import { useCallback } from 'react';
import useValue from '../hooks/useValue';
import FloatLabel from './FloatLabel';

export interface FloatTreeSelectProps extends TreeSelectProps {
  required?: boolean;
}

const FloatTreeSelect = ({
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
}: FloatTreeSelectProps) => {
  const { hasValue, handleChangeFn, handleBlurFn, handleFocusFn, isFocus } = useValue({
    id: rest.id?.toString(),
    defaultValue,
    value,
    onFocus,
    onBlur,
  });

  const changeHandlerFn = useCallback(
    (value: any, labelList: React.ReactNode[], extra: any) => {
      handleChangeFn(value);
      if (onChange) onChange(value, labelList, extra);
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
      <TreeSelect
        style={{ width: '100%', border: 'none', ...style }}
        variant="borderless"
        {...rest}
        onFocus={handleFocusFn}
        onBlur={handleBlurFn}
        value={value}
        defaultValue={defaultValue}
        size={size}
        onChange={changeHandlerFn}
        rootClassName="ant-float-label-form-select"
      />
    </FloatLabel>
  );
};

export default FloatTreeSelect;
