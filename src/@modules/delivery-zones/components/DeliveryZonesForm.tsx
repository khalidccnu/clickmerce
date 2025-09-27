import FloatInput from '@base/antd/components/FloatInput';
import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import { DeliveryServiceTypesHooks } from '@modules/delivery-service-types/lib/hooks';
import { IDeliveryServiceType } from '@modules/delivery-service-types/lib/interfaces';
import { Button, Col, Form, FormInstance, Radio, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { IDeliveryZoneCreate } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<IDeliveryZoneCreate>;
  onFinish: (values: IDeliveryZoneCreate) => void;
}

const DeliveryZonesForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const [deliveryServiceTypeSearchTerm, setDeliveryServiceTypeSearchTerm] = useState(null);

  const deliveryServiceTypeQuery = DeliveryServiceTypesHooks.useFindById({
    id: initialValues?.delivery_service_type_id,
    config: {
      queryKey: [],
      enabled: !!initialValues?.delivery_service_type_id,
    },
  });

  const deliveryServiceTypesQuery = DeliveryServiceTypesHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: deliveryServiceTypeSearchTerm,
      search_field: 'name',
      is_active: 'true',
    },
  });

  useEffect(() => {
    form.resetFields();
  }, [form, initialValues]);

  return (
    <Form
      autoComplete="off"
      size="large"
      layout="vertical"
      form={form}
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: 'Name is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInput placeholder="Name" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="delivery_service_type_id"
            rules={[
              {
                required: true,
                message: 'Type is required!',
              },
            ]}
            className="!mb-0"
          >
            <InfiniteScrollSelect<IDeliveryServiceType>
              isFloat
              allowClear
              showSearch
              virtual={false}
              placeholder="Type"
              initialOptions={deliveryServiceTypeQuery.data?.data?.id ? [deliveryServiceTypeQuery.data?.data] : []}
              option={({ item: deliveryServiceType }) => ({
                key: deliveryServiceType?.id,
                label: deliveryServiceType?.name,
                value: deliveryServiceType?.id,
              })}
              onChangeSearchTerm={setDeliveryServiceTypeSearchTerm}
              query={deliveryServiceTypesQuery}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="is_active" className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              <Radio.Button className="w-1/2" value="true">
                Active
              </Radio.Button>
              <Radio.Button className="w-1/2" value="false">
                Inactive
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item className="text-right !mb-0">
            <Button loading={isLoading} type="primary" htmlType="submit">
              {formType === 'create' ? 'Submit' : 'Update'}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default DeliveryZonesForm;
