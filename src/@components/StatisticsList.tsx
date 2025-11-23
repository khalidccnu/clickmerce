import { CheckCircleOutlined, ClockCircleOutlined, StopOutlined, SyncOutlined } from '@ant-design/icons';
import { cn } from '@lib/utils/cn';
import { DashboardHooks } from '@modules/dashboard/lib/hooks';
import { Card, Col, Row, Skeleton } from 'antd';
import React from 'react';

interface IStatistic {
  icon: React.ReactNode;
  iconBgColorClassName: string;
  title: string;
  value: number | string;
}

interface IProps {
  className?: string;
}

const StatisticsList: React.FC<IProps> = ({ className }) => {
  const { isLoading, data } = DashboardHooks.useFindQuickStatistic();

  const statistics: IStatistic[] = [
    {
      icon: <ClockCircleOutlined className="text-2xl" style={{ color: '#fff' }} />,
      iconBgColorClassName: 'bg-orange-500',
      title: 'Pending Orders',
      value: data?.data?.pending_orders || 0,
    },
    {
      icon: <SyncOutlined className="text-2xl" style={{ color: '#fff' }} />,
      iconBgColorClassName: 'bg-yellow-500',
      title: 'Processing Orders',
      value: data?.data?.processing_orders || 0,
    },
    {
      icon: <CheckCircleOutlined className="text-2xl" style={{ color: '#fff' }} />,
      iconBgColorClassName: 'bg-green-500',
      title: 'Delivered Orders',
      value: data?.data?.delivered_orders || 0,
    },
    {
      icon: <StopOutlined className="text-2xl" style={{ color: '#fff' }} />,
      iconBgColorClassName: 'bg-gray-500',
      title: 'Cancelled Orders',
      value: data?.data?.cancelled_orders || 0,
    },
  ];

  return (
    <div className={className}>
      <Row gutter={[16, 16]}>
        {isLoading
          ? [...Array(4)].map((_, idx) => (
              <Col key={idx} xs={24} md={12}>
                <Skeleton active paragraph={{ rows: 2 }} />
              </Col>
            ))
          : statistics.map((statistic, idx) => (
              <Col xs={24} md={12} key={idx}>
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
    </div>
  );
};

export default StatisticsList;
