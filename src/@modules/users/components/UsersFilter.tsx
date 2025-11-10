import FloatRangePicker from '@base/antd/components/FloatRangePicker';
import FloatSelect from '@base/antd/components/FloatSelect';
import { bloodGroups } from '@lib/data/bloodGroups';
import { Toolbox } from '@lib/utils/toolbox';
import { Button, Drawer, Form, Radio, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { MdClear } from 'react-icons/md';
import { IUsersFilter } from '../lib/interfaces';

interface IProps {
  initialValues: IUsersFilter;
  onChange: (values: IUsersFilter) => void;
}

const UsersFilter: React.FC<IProps> = ({ initialValues, onChange }) => {
  const router = useRouter();
  const [formInstance] = Form.useForm();
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    formInstance.resetFields();

    const values = {
      is_admin: '',
      is_verified: '',
      is_active: '',
      sort_order: '',
      date_range: [],
      ...initialValues,
    };

    if (values?.start_date && values?.end_date) {
      values.date_range.push(dayjs(values.start_date));
      values.date_range.push(dayjs(values.end_date));

      delete values.start_date;
      delete values.end_date;
    }

    formInstance.setFieldsValue(values);
  }, [formInstance, initialValues]);

  return (
    <div className="flex flex-wrap gap-3 justify-end mb-4">
      <Button type="primary" icon={<FaFilter />} onClick={() => setDrawerOpen(true)} ghost>
        Filter
      </Button>
      <Drawer width={380} title="Filter" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
        <Form
          form={formInstance}
          onFinish={Toolbox.debounce((values) => {
            values.start_date = values?.date_range?.length
              ? dayjs(values?.date_range?.[0]).startOf('day').toISOString()
              : null;
            values.end_date = values?.date_range?.length
              ? dayjs(values?.date_range?.[1]).endOf('day').toISOString()
              : null;

            delete values.date_range;
            onChange(values);
            setDrawerOpen(false);
          }, 1000)}
          className="flex flex-col gap-3"
        >
          <Form.Item name="blood_group" className="!mb-0">
            <FloatSelect
              allowClear
              showSearch
              virtual={false}
              placeholder="Blood Group"
              filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
              options={bloodGroups.map((bloodGroup) => ({
                key: bloodGroup.key,
                label: bloodGroup.label,
                value: bloodGroup.value,
              }))}
            />
          </Form.Item>
          <Form.Item name="is_admin" className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              <Radio.Button className="w-1/3" value="">
                All
              </Radio.Button>
              <Radio.Button className="w-1/3" value="true">
                Admin
              </Radio.Button>
              <Radio.Button className="w-1/3" value="false">
                Customer
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="is_default_customer" className="!mb-0">
            <FloatSelect
              allowClear
              showSearch
              virtual={false}
              placeholder="Customer Type"
              filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
            >
              <Select.Option value="true">Default Customer</Select.Option>
              <Select.Option value="false">Optional Customer</Select.Option>
            </FloatSelect>
          </Form.Item>
          <Form.Item name="is_system_generated" className="!mb-0">
            <FloatSelect
              allowClear
              showSearch
              virtual={false}
              placeholder="Account Type"
              filterOption={(input, option: any) => option.label.toLowerCase().includes(input.toLowerCase())}
            >
              <Select.Option value="true">System Generated</Select.Option>
              <Select.Option value="false">User Provided</Select.Option>
            </FloatSelect>
          </Form.Item>
          <Form.Item name="is_verified" className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              <Radio.Button className="w-1/2" value="true">
                Verified
              </Radio.Button>
              <Radio.Button className="w-1/2" value="false">
                Unverified
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="date_range" className="!mb-0">
            <FloatRangePicker placeholder={['Start Date', 'End Date']} className="w-full" />
          </Form.Item>
          <Form.Item name="is_active" className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              <Radio.Button className="w-1/3" value="">
                All
              </Radio.Button>
              <Radio.Button className="w-1/3" value="true">
                Active
              </Radio.Button>
              <Radio.Button className="w-1/3" value="false">
                Inactive
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="sort_order" className="!mb-0">
            <Radio.Group buttonStyle="solid" className="w-full text-center">
              <Radio.Button className="w-1/2" value="">
                ASC
              </Radio.Button>
              <Radio.Button className="w-1/2" value="DESC">
                DESC
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item className="!mb-0">
            <Space.Compact>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button
                type="primary"
                icon={<MdClear />}
                onClick={() => {
                  setDrawerOpen(false);
                  formInstance.resetFields();

                  router.push({
                    query: Toolbox.toCleanObject({
                      ...router.query,
                      ...formInstance.getFieldsValue(),
                      start_date: null,
                      end_date: null,
                    }),
                  });
                }}
                danger
                ghost
              >
                Clear
              </Button>
            </Space.Compact>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default UsersFilter;
