import { Form } from 'antd';
import { FormContext, FormItemInputContext } from 'antd/es/form/context';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { FloatFormListContext } from '../components/FloatFormList';

interface IProps {
  id?: string;
  defaultValue?: any;
  value?: any;
  onFocus?: (...args: any) => void;
  onBlur?: (...args: any) => void;
}

const useValue = ({ id, defaultValue, value, onFocus, onBlur }: IProps) => {
  const initFlag = useRef(false);
  const [isFocus, setFocus] = useState(false);
  const { form } = useContext(FormContext);
  const { name } = useContext(FormItemInputContext);
  const { name: formListName } = useContext(FloatFormListContext);
  const [inputValue, setInputValue] = useState(defaultValue ?? value);

  const memoName = useMemo(() => {
    if (Array.isArray(name) && formListName) {
      return [formListName, ...name];
    }

    return name;
  }, [name, formListName]);

  const changeValue = Form.useWatch(memoName, form);

  const handleFocusFn = useCallback(
    (...args: any) => {
      setFocus(true);
      if (typeof onFocus === 'function') onFocus(...args);
    },
    [onFocus],
  );

  const handleBlurFn = useCallback(
    (...args: any) => {
      setFocus(false);
      if (typeof onBlur === 'function') onBlur(args);
    },
    [onBlur],
  );

  useEffect(() => {
    if (initFlag.current) setInputValue(value);
    initFlag.current = true;
  }, [value]);

  useEffect(() => {
    if (form && id) setInputValue(changeValue);
  }, [id, changeValue, form]);

  return {
    hasValue: Array.isArray(inputValue) ? inputValue.length > 0 : typeof value === 'number' ? true : !!inputValue,
    handleChangeFn: setInputValue,
    handleFocusFn,
    handleBlurFn,
    isFocus,
  };
};

export default useValue;
