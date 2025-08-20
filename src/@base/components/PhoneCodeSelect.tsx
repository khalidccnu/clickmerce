import { phoneCodes } from '@lib/data/phoneCodes';
import { Toolbox } from '@lib/utils/toolbox';
import { Select, type SelectProps } from 'antd';
import React from 'react';

interface IProps extends SelectProps {
  code: string;
  onSelectCode: (code: string) => void;
}

const PhoneCodeSelect: React.FC<IProps> = ({ placeholder, code, onSelectCode, ...rest }) => {
  return (
    <Select
      {...rest}
      virtual={false}
      placeholder={placeholder || 'Code'}
      options={phoneCodes.map((phoneCode) => ({
        key: phoneCode.identifier,
        label: `${phoneCode.identifier} ${phoneCode.code}`,
        value: phoneCode.code,
      }))}
      filterOption={(input, option: any) => Toolbox.toLowerText(option?.label)?.includes(Toolbox.toLowerText(input))}
      onChange={(value) => onSelectCode(value)}
      value={code}
    />
  );
};

export default PhoneCodeSelect;
