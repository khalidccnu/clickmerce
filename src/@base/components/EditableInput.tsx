import { Input, type InputProps } from 'antd';
import React, { useState } from 'react';

interface IProps extends InputProps {}

const EditableInput: React.FC<IProps> = (props) => {
  const [border, setBorder] = useState(false);

  return (
    <Input
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

export default EditableInput;
