import { countryCurrencies } from '@lib/data/countryCurrencies';
import { Toolbox } from '@lib/utils/toolbox';
import { Select, type SelectProps } from 'antd';
import React from 'react';

interface IProps extends SelectProps {
  currency: string;
  onSelectCurrency: (currency: string) => void;
}

const CountryCurrencySelect: React.FC<IProps> = ({ placeholder, currency, onSelectCurrency, ...rest }) => {
  return (
    <Select
      {...rest}
      virtual={false}
      placeholder={placeholder || 'Currency'}
      options={countryCurrencies.map((countryCurrency) => ({
        key: countryCurrency.identifier,
        label: `${countryCurrency.identifier} ${countryCurrency.symbol}`,
        value: `${countryCurrency.identifier}_${countryCurrency.symbol}`,
      }))}
      filterOption={(input, option: any) => Toolbox.toLowerText(option?.label)?.includes(Toolbox.toLowerText(input))}
      onChange={(value) => onSelectCurrency(value)}
      value={currency}
    />
  );
};

export default CountryCurrencySelect;
