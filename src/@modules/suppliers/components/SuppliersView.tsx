import { Descriptions } from 'antd';
import React from 'react';
import { ISupplier } from '../lib/interfaces';

interface IProps {
  data: ISupplier;
}

const SuppliersView: React.FC<IProps> = ({ data }) => {
  return (
    <Descriptions
      bordered
      size="small"
      layout="vertical"
      column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
      labelStyle={{ fontWeight: 600 }}
    >
      <Descriptions.Item label="Name">{data?.name}</Descriptions.Item>
      <Descriptions.Item label="Phone">{data?.phone || 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Email" span={2}>
        {data?.email || 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label="Address" span={2}>
        {data?.address || 'N/A'}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default SuppliersView;
