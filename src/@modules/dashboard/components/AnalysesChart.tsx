import { Col, Row } from 'antd';
import React from 'react';
import { DashboardHooks } from '../lib/hooks';
import ProductSalesAmountChart from './ProductSalesAmountChart';
import ProductSalesChart from './ProductSalesChart';

interface IProps {
  className?: string;
}

const AnalysesChart: React.FC<IProps> = ({ className }) => {
  const analysesQuery = DashboardHooks.useFindAnalyses();

  return (
    <div className={className}>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <ProductSalesChart isLoading={analysesQuery.isLoading} data={analysesQuery.data?.data} />
        </Col>
        <Col xs={24} lg={12}>
          <ProductSalesAmountChart isLoading={analysesQuery.isLoading} data={analysesQuery.data?.data} />
        </Col>
      </Row>
    </div>
  );
};

export default AnalysesChart;
