import { Dayjs } from '@lib/constant/dayjs';
import { Toolbox } from '@lib/utils/toolbox';
import { Card, Descriptions } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import { ITransaction } from '../lib/interfaces';

interface IProps {
  transaction: ITransaction;
}

const TransactionsView: React.FC<IProps> = ({ transaction }) => {
  return (
    <div className="space-y-4">
      <Card title="Transaction Information" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Code">
            <span className="text-[var(--color-primary)]">{transaction?.code}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            {dayjs(transaction?.created_at).format(Dayjs.dateTimeSecondsWithAmPm)}
          </Descriptions.Item>
          <Descriptions.Item label="Type">{Toolbox.toPrettyText(transaction?.type)}</Descriptions.Item>
          <Descriptions.Item label="Amount">{Toolbox.withCurrency(transaction?.amount)}</Descriptions.Item>
          <Descriptions.Item label="Note" span={2}>
            {transaction?.note || 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="User Information" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 4, xxl: 4 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Name" span={2}>
            {transaction?.user?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Phone" span={2}>
            {transaction?.user?.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={4}>
            {transaction?.user?.email || 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="Meta" size="small">
        <Descriptions
          bordered
          size="small"
          layout="vertical"
          column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
          labelStyle={{ fontWeight: 600 }}
        >
          <Descriptions.Item label="Created By" span={2}>
            <span>{transaction?.created_by?.name || 'N/A'}</span>
            <br />
            <span className="text-xs text-gray-500">
              {dayjs(transaction?.created_at).format(Dayjs.dateTimeSecondsWithAmPm)}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default TransactionsView;
