import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FundOutlined,
  ShoppingCartOutlined,
  StopOutlined,
  SyncOutlined,
  TrophyOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import { States } from '@lib/constant/states';
import useLocalState from '@lib/hooks/useLocalState';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { Card, Col, Row, Spin } from 'antd';
import React from 'react';
import { DashboardHooks } from '../lib/hooks';

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
}

const StatisticsList: React.FC<IProps> = ({ className, startDate, endDate }) => {
  const [sidebar] = useLocalState(States.sidebar);

  const { isLoading, data } = DashboardHooks.useFindStatistic({
    options: {
      start_date: startDate,
      end_date: endDate,
    },
  });

  const statistics: IStatistic[] = [
    {
      icon: <ClockCircleOutlined className="text-2xl text-white" />,
      iconBgColorClassName: 'bg-orange-500',
      title: 'Pending Orders',
      value: data?.data?.pending_orders || 0,
    },
    {
      icon: <SyncOutlined className="text-2xl text-white" />,
      iconBgColorClassName: 'bg-yellow-500',
      title: 'Processing Orders',
      value: data?.data?.processing_orders || 0,
    },
    {
      icon: <TruckOutlined className="text-2xl text-white" />,
      iconBgColorClassName: 'bg-blue-500',
      title: 'Shipped Orders',
      value: data?.data?.shipped_orders || 0,
    },
    {
      icon: <CheckCircleOutlined className="text-2xl text-white" />,
      iconBgColorClassName: 'bg-green-500',
      title: 'Delivered Orders',
      value: data?.data?.delivered_orders || 0,
    },
    {
      icon: <StopOutlined className="text-2xl text-white" />,
      iconBgColorClassName: 'bg-gray-500',
      title: 'Cancelled Orders',
      value: data?.data?.cancelled_orders || 0,
    },
    {
      icon: <ShoppingCartOutlined className="text-2xl text-white" />,
      iconBgColorClassName: 'bg-purple-500',
      title: 'Total Sales Amount',
      value: Toolbox.withCurrency(data?.data?.total_sales_amount || 0),
    },
    {
      icon: <FundOutlined className="text-2xl text-white" />,
      iconBgColorClassName: 'bg-teal-500',
      title: 'Total Due Amount',
      value: Toolbox.withCurrency(data?.data?.total_due_amount || 0),
    },
    {
      icon: <TrophyOutlined className="text-2xl text-white" />,
      iconBgColorClassName: 'bg-emerald-500',
      title: 'Total Profit Amount',
      value: Toolbox.withCurrency(data?.data?.total_profit_amount || 0),
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
