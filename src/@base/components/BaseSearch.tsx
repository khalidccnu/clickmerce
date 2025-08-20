import { Toolbox } from '@lib/utils/toolbox';
import { Form, Input } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

interface IProps {
  name?: string;
}

const BaseSearch: React.FC<IProps> = ({ name = 'search_term' }) => {
  const router = useRouter();
  const [formInstance] = Form.useForm();

  const handleChangeFn = (value: any) => {
    router.push({
      query: Toolbox.toCleanObject({
        ...router.query,
        [name]: value,
      }),
    });
  };

  const debounceSearchFn = Toolbox.debounce(handleChangeFn, 1000);

  useEffect(() => {
    formInstance.setFieldValue(name, router.query?.[name]);
  }, [name, formInstance, router]);

  return (
    <Form form={formInstance}>
      <Form.Item name={name} className="!mb-0">
        <Input
          allowClear
          prefix={<AiOutlineSearch />}
          placeholder="Search"
          onChange={(e) => debounceSearchFn(e.target.value)}
        />
      </Form.Item>
    </Form>
  );
};

export default BaseSearch;
