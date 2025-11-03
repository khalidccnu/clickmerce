import useValue from '@base/antd/hooks/useValue';
import { cn } from '@lib/utils/cn';
import { DatePicker, Grid } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import { useCallback, useMemo } from 'react';
import FloatLabel from './FloatLabel';

export interface IProps extends RangePickerProps {
  required?: boolean;
}

const FloatRangePicker: React.FC<IProps> = ({
  placeholder,
  defaultValue,
  value,
  onFocus,
  onBlur,
  onChange,
  required,
  style,
  className,
  classNames,
  getPopupContainer,
  ...rest
}) => {
  const screens = Grid.useBreakpoint();
  const {
    hasValue,
    handleChangeFn,
    handleBlurFn,
    handleFocusFn,
    handleMouseEnterFn,
    handleMouseLeaveFn,
    isFocus,
    isHover,
  } = useValue({
    id: rest.id?.toString(),
    defaultValue,
    value,
    onFocus,
    onBlur,
  });

  const changeHandlerFn = useCallback<Exclude<RangePickerProps['onChange'], undefined>>(
    (value, dateString) => {
      handleChangeFn(value);
      if (onChange) onChange(value, dateString);
    },
    [onChange, handleChangeFn],
  );

  const haveValue = useMemo(() => {
    return isFocus || hasValue;
  }, [hasValue, isFocus]);

  return (
    <FloatLabel
      label={haveValue && placeholder ? placeholder.join(' - ') : null}
      focused={isFocus}
      hovered={isHover}
      hasValue={haveValue}
      width={style?.width}
      height={style?.height}
      required={required}
      status={rest.status || (rest['aria-invalid'] ? 'error' : undefined)}
    >
      <DatePicker.RangePicker
        {...rest}
        className={className}
        classNames={{
          ...classNames,
          popup: {
            root: cn(classNames?.popup?.root, '[&_.ant-picker-panels]:flex-col md:[&_.ant-picker-panels]:flex-row'),
          },
        }}
        style={style}
        onFocus={handleFocusFn}
        onBlur={handleBlurFn}
        onMouseEnter={handleMouseEnterFn}
        onMouseLeave={handleMouseLeaveFn}
        value={value}
        defaultValue={defaultValue}
        onChange={changeHandlerFn}
        placeholder={haveValue && placeholder ? null : placeholder}
        getPopupContainer={(trigger) => {
          if (getPopupContainer) return getPopupContainer(trigger);
          return screens.md ? document.body : trigger.parentElement;
        }}
      />
    </FloatLabel>
  );
};

export default FloatRangePicker;
