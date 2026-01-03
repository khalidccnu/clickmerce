import { Toolbox } from '@lib/utils/toolbox';
import { Card, Col, Descriptions, Row, Statistic, Tag } from 'antd';
import React from 'react';
import { IUserCourierHealth } from '../lib/interfaces';

interface IProps {
  data: IUserCourierHealth;
}

const UserCourierHealthView: React.FC<IProps> = ({ data }) => {
  const purifiedData = data?.couriers
    ? Object.fromEntries(Object.entries(data.couriers).filter(([_, courierData]) => !courierData.error))
    : {};

  return (
    <React.Fragment>
      <Card title="Summary" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={12} md={6} lg={6} xl={6}>
            <Statistic title="Total Orders" value={data?.summary?.total || 0} />
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} xl={6}>
            <Statistic title="Delivered" value={data?.summary?.delivered || 0} valueStyle={{ color: '#3f8600' }} />
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} xl={6}>
            <Statistic title="Failed" value={data?.summary?.failed || 0} valueStyle={{ color: '#cf1322' }} />
          </Col>
          <Col xs={12} sm={12} md={6} lg={6} xl={6}>
            <Statistic
              title="Success Rate"
              value={data?.summary?.success_rate || 0}
              suffix="%"
              precision={2}
              valueStyle={{ color: data?.summary?.success_rate >= 70 ? '#3f8600' : '#cf1322' }}
            />
          </Col>
        </Row>
      </Card>
      <Card title="Courier Details" size="small">
        {Toolbox.isEmpty(purifiedData) ? (
          <p>No courier data available</p>
        ) : (
          Object.entries(purifiedData).map(([courierName, courierData]) => (
            <Card
              key={courierName}
              type="inner"
              title={Toolbox.toPrettyText(courierName)}
              size="small"
              style={{ marginBottom: 12 }}
            >
              <Descriptions
                bordered
                size="small"
                layout="vertical"
                column={{ xs: 2, sm: 2, md: 3, lg: 5, xl: 5, xxl: 5 }}
              >
                <Descriptions.Item label="Total">{courierData?.total || 0}</Descriptions.Item>
                <Descriptions.Item label="Delivered">
                  <span style={{ color: '#3f8600' }}>{courierData?.delivered || 0}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Failed">
                  <span style={{ color: '#cf1322' }}>{courierData?.failed || 0}</span>
                </Descriptions.Item>
                <Descriptions.Item label="Success Rate">
                  <span style={{ color: courierData?.success_rate >= 70 ? '#3f8600' : '#cf1322' }}>
                    {courierData?.success_rate || 0}%
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Rating">
                  {courierData?.rating ? <Tag color="gold">{Toolbox.toPrettyText(courierData.rating)}</Tag> : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Status" span={2}>
                  {courierData?.status ? (
                    <Tag color={courierData.status === 'active' ? 'green' : 'red'}>
                      {Toolbox.toPrettyText(courierData.status)}
                    </Tag>
                  ) : (
                    'N/A'
                  )}
                </Descriptions.Item>
                {courierData?.error && (
                  <Descriptions.Item label="Error" span={3}>
                    <span style={{ color: '#cf1322' }}>{courierData.error}</span>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          ))
        )}
      </Card>
    </React.Fragment>
  );
};

export default UserCourierHealthView;
