import { Form, FormItemProps } from 'antd';
import React, { JSX, useMemo } from 'react';

export interface FloatFormItemProps extends FormItemProps {
  children?: JSX.Element;
}

const FloatFormItem = ({ label = '', required, rules, children, ...rest }: FloatFormItemProps) => {
  const isRequired = useMemo(() => {
    if (required) return required;
    return rules?.some((value: any) => value.required !== undefined && value.required !== false);
  }, [required, rules]);

  return (
    <Form.Item required={required} rules={rules} {...rest}>
      {children
        ? React.cloneElement(children, {
            placeholder: label,
            required: isRequired,
          })
        : children}
    </Form.Item>
  );
};

export default FloatFormItem;
