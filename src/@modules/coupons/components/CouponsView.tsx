import { Dayjs } from '@lib/constant/dayjs';
import { Toolbox } from '@lib/utils/toolbox';
import { Descriptions, Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { ICoupon } from '../lib/interfaces';

interface IProps {
  data: ICoupon;
}

const CouponsView: React.FC<IProps> = ({ data }) => {
  return (
    <Descriptions
      bordered
      size="small"
      layout="vertical"
      column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
      labelStyle={{ fontWeight: 600 }}
    >
      <Descriptions.Item label="Code" span={2}>
        {data?.code}
      </Descriptions.Item>
      <Descriptions.Item label="Amount">{Toolbox.withCurrency(data?.amount)}</Descriptions.Item>
      <Descriptions.Item label="Minimum Purchase Amount">
        {Toolbox.withCurrency(data?.min_purchase_amount)}
      </Descriptions.Item>
      <Descriptions.Item label="Maximum Redeemable Amount">
        {data?.max_redeemable_amount ? Toolbox.withCurrency(data?.max_redeemable_amount) : '∞'}
      </Descriptions.Item>
      <Descriptions.Item label="Usage">
        {data?.usage_count}/{data?.usage_limit || '∞'}
      </Descriptions.Item>
      <Descriptions.Item label="Validity Period">
        {dayjs(data?.valid_from).format(Dayjs.date)} - {dayjs(data?.valid_until).format(Dayjs.date)}
      </Descriptions.Item>
      <Descriptions.Item label="Meta">{<Tag color="blue">{data?.type}</Tag>}</Descriptions.Item>
    </Descriptions>
  );
};

export default CouponsView;
