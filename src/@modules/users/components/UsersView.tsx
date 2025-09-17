import { Toolbox } from '@lib/utils/toolbox';
import { Descriptions, Tag } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { IUser } from '../lib/interfaces';

interface IProps {
  data: IUser;
}

const UsersView: React.FC<IProps> = ({ data }) => {
  return (
    <Descriptions
      bordered
      size="small"
      layout="vertical"
      column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
      labelStyle={{ fontWeight: 600 }}
    >
      <Descriptions.Item label="Name">{data?.name}</Descriptions.Item>
      <Descriptions.Item label="Phone">{data?.phone}</Descriptions.Item>
      <Descriptions.Item label="Email" span={2}>
        {data?.email || 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label="Blood Group">{data?.user_info?.blood_group || 'N/A'}</Descriptions.Item>
      <Descriptions.Item label="Birthday">
        {data?.user_info?.birthday ? dayjs(data?.user_info?.birthday).format('YYYY-MM-DD') : 'N/A'}
      </Descriptions.Item>
      <Descriptions.Item label="Roles" span={2}>
        {Toolbox.isEmpty(data?.user_roles) ? 'N/A' : data?.user_roles?.map((ur) => ur?.role?.name).join(', ')}
      </Descriptions.Item>
      <Descriptions.Item label="Meta" span={2}>
        {data?.is_admin ? <Tag color="blue">Admin</Tag> : <Tag color="green">Customer</Tag>}
      </Descriptions.Item>
    </Descriptions>
  );
};

export default UsersView;
