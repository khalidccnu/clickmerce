import useValue from '@base/antd/hooks/useValue';
import { AutoComplete, AutoCompleteProps } from 'antd';
import { useCallback } from 'react';
import FloatLabel from './FloatLabel';

export interface FloatAutoCompleteProps extends AutoCompleteProps {
  required?: boolean;
}

const FloatAutoComplete = ({
  required,
  placeholder,
  defaultValue,
  value,
  onFocus,
  onBlur,
  onChange,
  style,
  ...rest
}: FloatAutoCompleteProps) => {
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
        variant="borderless"
        style={{
          width: '100%',
          border: 'none',
          ...style,
        }}
        {...rest}
        onFocus={handleFocusFn}
        onBlur={handleBlurFn}
        value={value}
        defaultValue={defaultValue}
        onChange={changeHandlerFn}
        rootClassName="ant-float-label-form-auto-complete"
      />
    </FloatLabel>
  );
};

export default FloatAutoComplete;
