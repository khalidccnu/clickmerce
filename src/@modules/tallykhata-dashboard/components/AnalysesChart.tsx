import { Col, Row } from 'antd';
import React from 'react';
import { TallykhataDashboardHooks } from '../lib/hooks';
import TransactionsAmountChart from './TransactionsAmountChart';
import TransactionsChart from './TransactionsChart';

interface IProps {
  className?: string;
}

const AnalysesChart: React.FC<IProps> = ({ className }) => {
  const analysesQuery = TallykhataDashboardHooks.useFindAnalyses();

  return (
    <div className={className}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <TransactionsChart isLoading={analysesQuery.isLoading} data={analysesQuery.data?.data} />
        </Col>
        <Col xs={24} lg={12}>
          <TransactionsAmountChart isLoading={analysesQuery.isLoading} data={analysesQuery.data?.data} />
        </Col>
      </Row>
    </div>
  );
};

export default AnalysesChart;
