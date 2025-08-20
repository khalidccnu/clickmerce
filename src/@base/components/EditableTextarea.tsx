import { Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';
import React, { useState } from 'react';

interface IProps extends TextAreaProps {}

const EditableTextarea: React.FC<IProps> = (props) => {
  const [border, setBorder] = useState(false);

  return (
    <Input.TextArea
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

export default EditableTextarea;
