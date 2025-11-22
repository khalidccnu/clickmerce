import { Toolbox } from '@lib/utils/toolbox';
import { Descriptions, Tag } from 'antd';
import React from 'react';
import { IProduct } from '../lib/interfaces';

interface IProps {
  data: IProduct;
}

const ProductsView: React.FC<IProps> = ({ data }) => {
  return (
    <Descriptions
      bordered
      size="small"
      layout="vertical"
      column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
      labelStyle={{ fontWeight: 600 }}
    >
      <Descriptions.Item label="Name" span={2}>
        {data?.name}
      </Descriptions.Item>
      <Descriptions.Item label="Specification">{data?.specification || 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Rack">{data?.rack || 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Categories" span={2}>
        {Toolbox.isEmpty(data?.categories)
          ? 'N/A'
          : data?.categories.map((category) => (
              <Tag key={category.id} color="cyan">
                {Toolbox.toPrettyText(category?.category?.name)}
              </Tag>
            ))}
      </Descriptions.Item>
      <Descriptions.Item label="Dosage Form">{data?.dosage_form?.name || 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Generic">{data?.generic?.name || 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Supplier">{data?.supplier?.name}</Descriptions.Item>
      <Descriptions.Item label="Quantity">{data?.quantity}</Descriptions.Item>
      <Descriptions.Item label="Meta" span={2}>
        <Tag color="blue">{Toolbox.toPrettyText(data?.type)}</Tag>
        {data?.medicine_type && <Tag color="green">{Toolbox.toPrettyText(data?.medicine_type)}</Tag>}
        <Tag color="purple">{Toolbox.toPrettyText(data?.durability)}</Tag>
        {data?.is_recommend ? <Tag color="gold">Recommend</Tag> : <Tag>Not Recommend</Tag>}
        {data?.is_active ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default ProductsView;
