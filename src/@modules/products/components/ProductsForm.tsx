import FloatDatePicker from '@base/antd/components/FloatDatePicker';
import FloatFormList from '@base/antd/components/FloatFormList';
import FloatInput from '@base/antd/components/FloatInput';
import FloatInputNumber from '@base/antd/components/FloatInputNumber';
import FloatSelect from '@base/antd/components/FloatSelect';
import BaseModalWithoutClicker from '@base/components/BaseModalWithoutClicker';
import CustomUploader from '@base/components/CustomUploader';
import InfiniteScrollSelect from '@base/components/InfiniteScrollSelect';
import { Messages } from '@lib/constant/messages';
import { Toolbox } from '@lib/utils/toolbox';
import DosageFormsForm from '@modules/dosage-forms/components/DosageFormsForm';
import { DosageFormsHooks } from '@modules/dosage-forms/lib/hooks';
import { IDosageForm } from '@modules/dosage-forms/lib/interfaces';
import GenericsForm from '@modules/generics/components/GenericsForm';
import { GenericsHooks } from '@modules/generics/lib/hooks';
import { IGeneric } from '@modules/generics/lib/interfaces';
import SuppliersForm from '@modules/suppliers/components/SuppliersForm';
import { SuppliersHooks } from '@modules/suppliers/lib/hooks';
import { ISupplier } from '@modules/suppliers/lib/interfaces';
import {
  Button,
  Col,
  Divider,
  Form,
  FormInstance,
  FormListFieldData,
  InputNumberProps,
  message,
  Radio,
  Row,
  Segmented,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { IoCalendar } from 'react-icons/io5';
import {
  ENUM_PRODUCTS_DURABILITIES,
  ENUM_PRODUCTS_TYPES,
  productsDurabilities,
  productsMedicinesTypes,
  productsTypes,
} from '../lib/enums';
import { IProductCreate } from '../lib/interfaces';

interface IProps {
  isLoading: boolean;
  form: FormInstance;
  formType?: 'create' | 'update';
  initialValues?: Partial<IProductCreate>;
  onFinish: (values: IProductCreate) => void;
}

const ProductsForm: React.FC<IProps> = ({ isLoading, form, formType = 'create', initialValues, onFinish }) => {
  const [messageApi, messageHolder] = message.useMessage();
  const formValues = Form.useWatch([], form);
  const [dfFormInstance] = Form.useForm();
  const [suppliersFormInstance] = Form.useForm();
  const [genericsFormInstance] = Form.useForm();
  const [durability, setDurability] = useState(initialValues?.durability || ENUM_PRODUCTS_DURABILITIES.NON_PERISHABLE);
  const [isDFModalOpen, setDFModalOpen] = useState(false);
  const [isGenericsModalOpen, setGenericsModalOpen] = useState(false);
  const [isSuppliersModalOpen, setSuppliersModalOpen] = useState(false);
  const [dosageFormsSearchTerm, setDosageFormsSearchTerm] = useState(null);
  const [genericsSearchTerm, setGenericsSearchTerm] = useState(null);
  const [suppliersSearchTerm, setSuppliersSearchTerm] = useState(null);

  const handleFinishFn = (values) => {
    const currentSanitizedVariations = values?.variations?.map((variation) => {
      const quantities = variation?.quantities?.flatMap((quantity) => Object.values(quantity));
      const quantity = quantities?.reduce((acc, current) => acc * current, 1);

      delete variation?.quantities;

      return {
        ...variation,
        quantity,
      };
    });

    const sanitizedVariations = Toolbox.computeArrayDiffs(initialValues?.variations, currentSanitizedVariations, 'id');

    const purifiedValues = {
      ...values,
      durability:
        formValues?.type === ENUM_PRODUCTS_TYPES.MEDICINE ? ENUM_PRODUCTS_DURABILITIES.PERISHABLE : durability,
      variations: sanitizedVariations,
    };

    onFinish(purifiedValues);
  };

  const dosageFormQuery = DosageFormsHooks.useFindById({
    id: formValues?.dosage_form_id,
    config: {
      queryKey: [],
      enabled: !!formValues?.dosage_form_id,
    },
  });

  const dosageFormsQuery = DosageFormsHooks.useFindInfinite({
    config: {
      queryKey: [],
      enabled: formValues?.type === ENUM_PRODUCTS_TYPES.MEDICINE,
    },
    options: {
      limit: '20',
      search_term: dosageFormsSearchTerm,
    },
  });

  const genericQuery = GenericsHooks.useFindById({
    id: formValues?.generic_id,
    config: {
      queryKey: [],
      enabled: !!formValues?.generic_id,
    },
  });

  const genericsQuery = GenericsHooks.useFindInfinite({
    config: {
      queryKey: [],
      enabled: formValues?.type === ENUM_PRODUCTS_TYPES.MEDICINE,
    },
    options: {
      limit: '20',
      search_term: genericsSearchTerm,
    },
  });

  const supplierQuery = SuppliersHooks.useFindById({
    id: formValues?.supplier_id,
    config: {
      queryKey: [],
      enabled: !!formValues?.supplier_id,
    },
  });

  const suppliersQuery = SuppliersHooks.useFindInfinite({
    options: {
      limit: '20',
      search_term: suppliersSearchTerm,
    },
  });

  const dosageFormCreateFn = DosageFormsHooks.useCreate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        setDFModalOpen(false);
        dfFormInstance.resetFields();
        messageApi.success(Messages.create);
      },
    },
  });

  const genericCreateFn = GenericsHooks.useCreate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        setGenericsModalOpen(false);
        genericsFormInstance.resetFields();
        messageApi.success(Messages.create);
      },
    },
  });

  const supplierCreateFn = SuppliersHooks.useCreate({
    config: {
      onSuccess: (res) => {
        if (!res.success) {
          messageApi.error(res.message);
          return;
        }

        setSuppliersModalOpen(false);
        suppliersFormInstance.resetFields();
        messageApi.success(Messages.create);
      },
    },
  });

  useEffect(() => {
    form.resetFields();
  }, [form, initialValues]);

  return (
    <React.Fragment>
      {messageHolder}
      <Form
        autoComplete="off"
        size="large"
        layout="vertical"
        form={form}
        initialValues={{
          ...initialValues,
          variations: Toolbox.isNotEmpty(initialValues?.variations)
            ? initialValues?.variations?.map((variation) => {
                return {
                  ...variation,
                  mfg: variation?.mfg ? dayjs(variation?.mfg) : null,
                  exp: variation?.exp ? dayjs(variation?.exp) : null,
                  quantities: [{ q1: variation?.quantity }],
                };
              })
            : [{}],
        }}
        onFinish={handleFinishFn}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item name="type" className="!mb-0">
              <Radio.Group buttonStyle="solid" className="w-full text-center">
                {productsTypes.map((productsType) => (
                  <Radio.Button key={productsType} className="w-1/2" value={productsType}>
                    {Toolbox.toPrettyText(productsType)}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <FloatFormList name="images">
              {(fields, { add, remove }) => {
                return (
                  <React.Fragment>
                    {fields.map(({ key, name, ...rest }) => (
                      <div
                        key={key}
                        className="relative p-4 border border-dashed border-[var(--color-primary)] rounded-md pt-8"
                      >
                        <Row gutter={[16, 16]}>
                          <p className="absolute top-0 left-4 -translate-y-1/2 bg-[var(--color-primary)] px-1.5 py-0.5 text-xs text-white rounded-md">
                            Image {fields.length > 1 ? name + 1 : ''}
                          </p>
                          <Col xs={24}>
                            <Form.Item
                              {...rest}
                              name={[name, 'url']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Image URL is required!',
                                },
                              ]}
                              className="!mb-0"
                            >
                              <CustomUploader
                                isCrop
                                makePublic
                                listType="picture-card"
                                initialValues={[formValues?.images?.[name]?.url]}
                                onChange={(urls) => form.setFieldValue(['images', name, 'url'], urls[0])}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24}>
                            <Form.Item
                              {...rest}
                              name={[name, 'is_featured']}
                              rules={[
                                {
                                  required: true,
                                  message: 'Featured is required!',
                                },
                              ]}
                              className="!mb-0"
                            >
                              <Radio.Group buttonStyle="solid" className="w-full text-center">
                                <Radio.Button className="w-1/2" value={true}>
                                  Featured
                                </Radio.Button>
                                <Radio.Button className="w-1/2" value={false}>
                                  Not Featured
                                </Radio.Button>
                              </Radio.Group>
                            </Form.Item>
                          </Col>
                        </Row>
                        <div className="flex justify-center gap-4 mt-8">
                          <Button
                            size="small"
                            type="primary"
                            ghost
                            onClick={() => add({ is_featured: false })}
                            disabled={name + 1 !== fields.length}
                          >
                            Add More
                          </Button>
                          <Button size="small" type="dashed" onClick={() => remove(name)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    {!fields.length && (
                      <Button type="dashed" loading={isLoading} onClick={() => add({ is_featured: false })} block>
                        Add Image
                      </Button>
                    )}
                  </React.Fragment>
                );
              }}
            </FloatFormList>
          </Col>
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
              <FloatInput
                placeholder="Name"
                onBlur={() => form.setFieldValue('slug', Toolbox.generateSlug(form.getFieldValue('name')))}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="slug"
              rules={[
                {
                  required: true,
                  message: 'Slug is required!',
                },
              ]}
              className="!mb-0"
            >
              <FloatInput placeholder="Slug" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="strength"
              rules={[
                {
                  required: formValues?.type === ENUM_PRODUCTS_TYPES.MEDICINE,
                  message: 'Strength is required!',
                },
              ]}
              className="!mb-0"
            >
              <FloatInput placeholder="Strength" />
            </Form.Item>
          </Col>
          {formValues?.type === ENUM_PRODUCTS_TYPES.GENERAL || (
            <Col xs={24}>
              <Form.Item
                name="medicine_type"
                rules={[
                  {
                    required: true,
                    message: 'Medicine type is required!',
                  },
                ]}
                className="!mb-0"
              >
                <FloatSelect
                  allowClear
                  showSearch
                  virtual={false}
                  placeholder="Type"
                  filterOption={(input, option) =>
                    Toolbox.toLowerText(option?.title)?.includes(Toolbox.toLowerText(input))
                  }
                  options={productsMedicinesTypes.map((type) => ({
                    title: Toolbox.toPrettyText(type),
                    label: Toolbox.toPrettyText(type),
                    value: type,
                  }))}
                />
              </Form.Item>
            </Col>
          )}
          <Col xs={24}>
            <Form.Item name="rack" className="!mb-0">
              <FloatInput placeholder="Rack" />
            </Form.Item>
          </Col>
          {formValues?.type === ENUM_PRODUCTS_TYPES.GENERAL || (
            <React.Fragment>
              <Col xs={24}>
                <Form.Item
                  name="dosage_form_id"
                  rules={[
                    {
                      required: true,
                      message: 'Dosage form is required!',
                    },
                  ]}
                  className="!mb-0"
                >
                  <InfiniteScrollSelect<IDosageForm>
                    isFloat
                    allowClear
                    showSearch
                    virtual={false}
                    placeholder="Dosage Form"
                    initialOptions={dosageFormQuery.data?.data?.id ? [dosageFormQuery.data?.data] : []}
                    option={({ item: dosageForm }) => ({
                      key: dosageForm?.id,
                      label: dosageForm?.name,
                      value: dosageForm?.id,
                    })}
                    onChangeSearchTerm={setDosageFormsSearchTerm}
                    query={dosageFormsQuery}
                    popupRender={(options) => (
                      <React.Fragment>
                        {options}
                        <Divider style={{ marginBlock: '8px' }} />
                        <Button type="text" block onClick={() => setDFModalOpen(true)}>
                          Add New
                        </Button>
                      </React.Fragment>
                    )}
                  />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="generic_id"
                  rules={[
                    {
                      required: true,
                      message: 'Generic is required!',
                    },
                  ]}
                  className="!mb-0"
                >
                  <InfiniteScrollSelect<IGeneric>
                    isFloat
                    allowClear
                    showSearch
                    virtual={false}
                    placeholder="Generic"
                    initialOptions={genericQuery.data?.data?.id ? [genericQuery.data?.data] : []}
                    option={({ item: generic }) => ({
                      key: generic?.id,
                      label: generic?.name,
                      value: generic?.id,
                    })}
                    onChangeSearchTerm={setGenericsSearchTerm}
                    query={genericsQuery}
                    popupRender={(options) => (
                      <React.Fragment>
                        {options}
                        <Divider style={{ marginBlock: '8px' }} />
                        <Button type="text" block onClick={() => setGenericsModalOpen(true)}>
                          Add New
                        </Button>
                      </React.Fragment>
                    )}
                  />
                </Form.Item>
              </Col>
            </React.Fragment>
          )}
          <Col xs={24}>
            <Form.Item
              name="supplier_id"
              rules={[
                {
                  required: true,
                  message: 'Supplier is required!',
                },
              ]}
              className="!mb-0"
            >
              <InfiniteScrollSelect<ISupplier>
                isFloat
                allowClear
                showSearch
                virtual={false}
                placeholder="Supplier"
                initialOptions={supplierQuery.data?.data?.id ? [supplierQuery.data?.data] : []}
                option={({ item: supplier }) => ({
                  key: supplier?.id,
                  label: supplier?.name,
                  value: supplier?.id,
                })}
                onChangeSearchTerm={setSuppliersSearchTerm}
                query={suppliersQuery}
                popupRender={(options) => (
                  <React.Fragment>
                    {options}
                    <Divider style={{ marginBlock: '8px' }} />
                    <Button type="text" block onClick={() => setSuppliersModalOpen(true)}>
                      Add New
                    </Button>
                  </React.Fragment>
                )}
              />
            </Form.Item>
          </Col>
          {formValues?.type === ENUM_PRODUCTS_TYPES.MEDICINE || (
            <Col xs={24} className="text-center">
              <Segmented
                options={productsDurabilities.map((productsDurability) => ({
                  key: productsDurability,
                  label: Toolbox.toPrettyText(productsDurability),
                  value: productsDurability,
                }))}
                value={durability}
                onChange={setDurability}
              />
            </Col>
          )}
          <FloatFormList name="variations" initialValue={[{}]}>
            {(fields, { add, remove }) => {
              return (
                <React.Fragment>
                  {fields.map(({ key, name, ...rest }) => (
                    <div
                      key={key}
                      className="relative p-4 border border-dashed border-[var(--color-primary)] rounded-md pt-8"
                    >
                      <Row gutter={[16, 16]}>
                        <p className="absolute top-0 left-4 -translate-y-1/2 bg-[var(--color-primary)] px-1.5 py-0.5 text-xs text-white rounded-md">
                          Variation {fields.length > 1 ? name + 1 : ''}
                        </p>
                        <Col xs={24} md={12}>
                          <Form.Item
                            {...rest}
                            name={[name, 'cost_price']}
                            rules={[
                              {
                                required: true,
                                message: 'Cost price is required!',
                              },
                            ]}
                            className="!mb-0"
                          >
                            <FloatInputNumber placeholder="Cost Price" className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            {...rest}
                            name={[name, 'sale_price']}
                            rules={[
                              {
                                required: true,
                                message: 'Sale price is required!',
                              },
                            ]}
                            className="!mb-0"
                          >
                            <FloatInputNumber placeholder="Sale Price" className="w-full" />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            {...rest}
                            name={[name, 'mfg']}
                            rules={[
                              {
                                required:
                                  durability === ENUM_PRODUCTS_DURABILITIES.PERISHABLE ||
                                  formValues?.type === ENUM_PRODUCTS_TYPES.MEDICINE,
                                message: 'Manufacturing date is required!',
                              },
                            ]}
                            className="!mb-0"
                          >
                            <FloatDatePicker
                              placeholder="Manufacturing Date"
                              format="YYYY-MM-DD"
                              suffixIcon={<IoCalendar />}
                              disabledDate={(current) => current && dayjs(current).isAfter(dayjs(), 'day')}
                              className="w-full"
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                          <Form.Item
                            {...rest}
                            name={[name, 'exp']}
                            rules={[
                              {
                                required:
                                  durability === ENUM_PRODUCTS_DURABILITIES.PERISHABLE ||
                                  formValues?.type === ENUM_PRODUCTS_TYPES.MEDICINE,
                                message: 'Expire date is required!',
                              },
                            ]}
                            className="!mb-0"
                          >
                            <FloatDatePicker
                              placeholder="Expire Date"
                              format="YYYY-MM-DD"
                              suffixIcon={<IoCalendar />}
                              disabledDate={(current) => current && dayjs(current).isBefore(dayjs(), 'day')}
                              className="w-full"
                            />
                          </Form.Item>
                        </Col>
                        <FloatFormList {...rest} name={[name, 'quantities']} initialValue={[{}]}>
                          {(nestedFields, { add: nestedAdd, remove: nestedRemove }) => {
                            return (
                              <React.Fragment>
                                {nestedFields.map(({ key: nestedKey, name: nestedName, ...nestedRest }) => {
                                  const isFullColumn = nestedName === nestedFields.length - 1 && nestedName % 2 === 0;

                                  return (
                                    <Col key={nestedKey} xs={24} md={isFullColumn ? 24 : 12}>
                                      <Form.Item
                                        {...nestedRest}
                                        name={[nestedName, `q${nestedName + 1}`]}
                                        rules={[
                                          {
                                            required: true,
                                            message: 'Quantity is required!',
                                          },
                                        ]}
                                        className="!mb-0"
                                      >
                                        <QuantityInput
                                          nestedName={nestedName}
                                          nestedFields={nestedFields}
                                          nestedAdd={() => nestedAdd()}
                                          nestedRemove={() => nestedRemove(nestedName)}
                                          placeholder={`Quantity ${nestedFields.length > 1 ? nestedName + 1 : ''}`}
                                          className="w-full"
                                          style={{ zIndex: 0 }}
                                        />
                                      </Form.Item>
                                    </Col>
                                  );
                                })}
                              </React.Fragment>
                            );
                          }}
                        </FloatFormList>
                      </Row>
                      <div className="flex justify-center gap-4 mt-8">
                        <Button
                          size="small"
                          type="primary"
                          ghost
                          onClick={() => add()}
                          disabled={name + 1 !== fields.length}
                        >
                          Add More
                        </Button>
                        <Button size="small" type="dashed" onClick={() => remove(name)} disabled={fields.length < 2}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              );
            }}
          </FloatFormList>
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
      <BaseModalWithoutClicker
        destroyOnHidden
        width={540}
        title="Create a new dosage form"
        footer={null}
        open={isDFModalOpen}
        onCancel={() => setDFModalOpen(false)}
      >
        <DosageFormsForm
          form={dfFormInstance}
          isLoading={dosageFormCreateFn.isPending}
          initialValues={{ is_active: 'true' }}
          onFinish={(values) => dosageFormCreateFn.mutate(values)}
        />
      </BaseModalWithoutClicker>
      <BaseModalWithoutClicker
        destroyOnHidden
        width={540}
        title="Create a new generic"
        footer={null}
        open={isGenericsModalOpen}
        onCancel={() => setGenericsModalOpen(false)}
      >
        <GenericsForm
          form={genericsFormInstance}
          isLoading={genericCreateFn.isPending}
          initialValues={{ is_active: 'true' }}
          onFinish={(values) => genericCreateFn.mutate(values)}
        />
      </BaseModalWithoutClicker>
      <BaseModalWithoutClicker
        destroyOnHidden
        width={540}
        title="Create a new supplier"
        footer={null}
        open={isSuppliersModalOpen}
        onCancel={() => setSuppliersModalOpen(false)}
      >
        <SuppliersForm
          form={suppliersFormInstance}
          isLoading={supplierCreateFn.isPending}
          initialValues={{ is_active: 'true' }}
          onFinish={(values) => supplierCreateFn.mutate(values)}
        />
      </BaseModalWithoutClicker>
    </React.Fragment>
  );
};

export default ProductsForm;

interface QuantityInputProps extends InputNumberProps {
  nestedName: number;
  nestedFields: FormListFieldData[];
  nestedAdd: () => void;
  nestedRemove: () => void;
  placeholder?: string;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  nestedName,
  nestedFields,
  nestedAdd,
  nestedRemove,
  placeholder = 'Quantity',
  ...rest
}) => {
  return (
    <Space.Compact style={{ display: 'flex' }}>
      <FloatInputNumber placeholder={placeholder} {...rest} />
      <Button disabled={nestedFields.length < 2} onClick={nestedRemove}>
        <FaMinusCircle />
      </Button>
      <Button disabled={nestedName + 1 !== nestedFields.length} onClick={nestedAdd}>
        <FaPlusCircle />
      </Button>
    </Space.Compact>
  );
};
