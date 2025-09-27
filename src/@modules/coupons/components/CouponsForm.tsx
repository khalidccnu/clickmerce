import FloatDatePicker from '@base/antd/components/FloatDatePicker';
import FloatInput from '@base/antd/components/FloatInput';
import FloatInputNumber from '@base/antd/components/FloatInputNumber';
import { Toolbox } from '@lib/utils/toolbox';
import { Button, Col, Form, FormInstance, Radio, Row } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import { IoCalendar } from 'react-icons/io5';
import { couponTypes } from '../lib/enums';
import { ICouponCreate } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<ICouponCreate>;
  onFinish: (values: ICouponCreate) => void;
}

const CouponsForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const formValues = Form.useWatch([], form);

  useEffect(() => {
    form.resetFields();
  }, [form, initialValues]);

  return (
    <Form
      autoComplete="off"
      size="large"
      layout="vertical"
      form={form}
      initialValues={{
        ...initialValues,
        valid_from: initialValues?.valid_from ? dayjs(initialValues?.valid_from) : null,
        valid_until: initialValues?.valid_until ? dayjs(initialValues?.valid_until) : null,
      }}
      onFinish={onFinish}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Form.Item
            name="code"
            rules={[
              {
                required: true,
                message: 'Code is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInput placeholder="Code" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="type" className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              {couponTypes.map((couponType) => (
                <Radio.Button key={couponType} className="w-1/2" value={couponType}>
                  {Toolbox.toPrettyText(couponType)}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="amount"
            rules={[
              {
                required: true,
                message: 'Amount is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInputNumber placeholder="Amount" className="w-full" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="min_purchase_amount"
            help={
              <small>
                Enter <b>0</b> if no minimum purchase is required
              </small>
            }
            rules={[
              {
                required: true,
                message: 'Min purchase amount is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInputNumber placeholder="Min Purchase Amount" className="w-full" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="max_redeemable_amount"
            help={
              <small>
                Enter <b>0</b> if there is no maximum redemption limit
              </small>
            }
            rules={[
              {
                required: true,
                message: 'Max redeemable amount is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInputNumber placeholder="Max Redeemable Amount" className="w-full" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="usage_limit"
            help={
              <small>
                Enter <b>0</b> for unlimited usage
              </small>
            }
            rules={[
              {
                required: true,
                message: 'Usage limit is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatInputNumber placeholder="Usage Limit" className="w-full" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="valid_from"
            rules={[
              {
                required: true,
                message: 'Valid from is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatDatePicker
              placeholder="Valid From"
              format="YYYY-MM-DD"
              suffixIcon={<IoCalendar />}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              defaultPickerValue={formValues?.valid_from ? dayjs(formValues?.valid_from) : dayjs().startOf('day')}
              className="w-full"
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="valid_until"
            rules={[
              {
                required: true,
                message: 'Valid until is required!',
              },
            ]}
            className="!mb-0"
          >
            <FloatDatePicker
              placeholder="Valid Until"
              format="YYYY-MM-DD"
              suffixIcon={<IoCalendar />}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              defaultPickerValue={formValues?.valid_until ? dayjs(formValues?.valid_until) : dayjs().startOf('day')}
              className="w-full"
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

export default CouponsForm;
