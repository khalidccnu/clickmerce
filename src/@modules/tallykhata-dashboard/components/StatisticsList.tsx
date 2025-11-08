import {
  BankOutlined,
  FallOutlined,
  LineChartOutlined,
  RiseOutlined,
  SwapOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { TId } from '@base/interfaces';
import { States } from '@lib/constant/states';
import useLocalState from '@lib/hooks/useLocalState';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { Card, Col, Row, Spin } from 'antd';
import React from 'react';
import { TallykhataDashboardHooks } from '../lib/hooks';

interface IStatistic {
  icon: React.ReactNode;
  iconBgColorClassName: string;
  title: string;
  value: number | string;
}

interface IProps {
  className?: string;
  startDate: string;
  endDate: string;
  userId: TId;
}

const StatisticsList: React.FC<IProps> = ({ className, startDate, endDate, userId }) => {
  const [sidebar] = useLocalState(States.sidebar);

  const { isLoading, data } = TallykhataDashboardHooks.useFindStatistic({
    options: {
      start_date: startDate,
      end_date: endDate,
      user_id: userId,
    },
  });

  const statistics: IStatistic[] = [
    {
      icon: <SwapOutlined className="text-2xl" style={{ color: '#fff' }} />,
      iconBgColorClassName: 'bg-indigo-500',
      title: 'Total Transactions',
      value: data?.data?.total_transactions || 0,
    },
    {
      icon: <RiseOutlined className="text-2xl" style={{ color: '#fff' }} />,
      iconBgColorClassName: 'bg-green-600',
      title: 'Credit Transactions',
      value: data?.data?.credit_transactions || 0,
    },
    {
      icon: <FallOutlined className="text-2xl" style={{ color: '#fff' }} />,
      iconBgColorClassName: 'bg-red-600',
      title: 'Debit Transactions',
      value: data?.data?.debit_transactions || 0,
    },
    {
      icon: <WalletOutlined className="text-2xl" style={{ color: '#fff' }} />,
      iconBgColorClassName: 'bg-blue-600',
      title: 'Total Credit Amount',
      value: Toolbox.withCurrency(data?.data?.total_credit_amount || 0),
    },
    {
      icon: <BankOutlined className="text-2xl" style={{ color: '#fff' }} />,
      iconBgColorClassName: 'bg-orange-600',
      title: 'Total Debit Amount',
      value: Toolbox.withCurrency(data?.data?.total_debit_amount || 0),
    },
    {
      icon: <LineChartOutlined className="text-2xl" style={{ color: '#fff' }} />,
      iconBgColorClassName: 'bg-emerald-600',
      title: 'Net Balance',
      value: Toolbox.withCurrency(data?.data?.net_balance || 0),
    },
  ];

  return (
    <div className={className}>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spin />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {statistics.map((statistic, idx) => (
            <Col
              xs={24}
              md={sidebar.isCollapsed ? 12 : 24}
              lg={sidebar.isCollapsed ? 8 : 12}
              xl={sidebar.isCollapsed ? 6 : 8}
              xxl={6}
              key={idx}
            >
              <Card
                styles={{
                  body: {
                    padding: 20,
                  },
                }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-gray-500 dark:text-gray-300 text-sm block mb-1">{statistic.title}</p>
                    <p className="text-gray-900 dark:text-white text-2xl font-bold">{statistic.value}</p>
                  </div>
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
                      statistic.iconBgColorClassName,
                    )}
                  >
                    {statistic.icon}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default StatisticsList;
