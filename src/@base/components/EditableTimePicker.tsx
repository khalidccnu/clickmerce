import { TimePicker, type TimePickerProps } from 'antd';
import React, { useState } from 'react';

interface IProps extends TimePickerProps {}

const EditableTimePicker: React.FC<IProps> = (props) => {
  const [border, setBorder] = useState(false);

  return (
    <TimePicker
      {...props}
      variant={border ? 'outlined' : 'borderless'}
      minuteStep={props.minuteStep || 30}
      format="hh:mm A"
      onFocus={() => setBorder(true)}
      onBlur={(e, info) => {
        props.onBlur?.(e, info);
        setBorder(false);
      }}
    />
  );
};

export default EditableTimePicker;
