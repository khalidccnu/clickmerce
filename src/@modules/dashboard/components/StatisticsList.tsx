import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  ShoppingCartOutlined,
  SyncOutlined,
  TrophyOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import { cn } from '@lib/utils/cn';
import { Toolbox } from '@lib/utils/toolbox';
import { Card, Col, Row, Spin, Typography } from 'antd';
import React from 'react';
import { DashboardHooks } from '../lib/hooks';
const { Text, Title } = Typography;

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
      icon: <DollarCircleOutlined className="text-2xl text-white" />,
      iconBgColorClassName: 'bg-red-500',
      title: 'Total Costs Amount',
      value: Toolbox.withCurrency(data?.data?.total_costs_amount || 0),
    },
    {
      icon: <ShoppingCartOutlined className="text-2xl text-white" />,
      iconBgColorClassName: 'bg-purple-500',
      title: 'Total Sales Amount',
      value: Toolbox.withCurrency(data?.data?.total_sales_amount || 0),
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
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {statistics.map((statistic, idx) => (
            <Col xs={24} md={12} lg={6} key={idx}>
              <Card
                styles={{
                  body: {
                    padding: 20,
                  },
                }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <Text className="text-gray-500 dark:text-gray-300 text-sm block" style={{ marginBottom: 4 }}>
                      {statistic.title}
                    </Text>
                    <Title level={2} className="text-gray-900 dark:text-white text-3xl font-bold" style={{ margin: 0 }}>
                      {statistic.value}
                    </Title>
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
