import { InputNumber, type InputNumberProps } from 'antd';
import React, { useState } from 'react';

interface IProps extends InputNumberProps {}

const EditableInputNumber: React.FC<IProps> = (props) => {
  const [border, setBorder] = useState(false);

  return (
    <InputNumber
      {...props}
      variant={border ? 'outlined' : 'borderless'}
      onFocus={() => setBorder(true)}
      onBlur={(e) => {
        props.onBlur?.(e);
        setBorder(false);
      }}
    />
  );
};

export default EditableInputNumber;
