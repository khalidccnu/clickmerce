import { TDeepPartial } from '@base/interfaces';
import { cn } from '@lib/utils/cn';
import { Button, Form, FormInstance } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

interface Step {
  label: React.ReactNode;
  content: React.ReactNode;
}

interface IProps<D = any> {
  className?: string;
  formType?: 'create' | 'update';
  form: FormInstance;
  formProps?: Partial<React.ComponentProps<typeof Form>>;
  initialValues?: TDeepPartial<D>;
  showStepCount?: boolean;
  steps: Step[];
  isLoading: boolean;
  onSubmit: (values: D) => void;
  onChangeValues?: (values: TDeepPartial<D>) => void;
}

const MultiStepForm = <D = any,>({
  className,
  formType = 'create',
  form,
  formProps,
  initialValues,
  showStepCount = true,
  steps,
  isLoading,
  onSubmit,
  onChangeValues,
}: IProps<D>) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [persist, setPersist] = useState<TDeepPartial<D>>(initialValues ?? ({} as TDeepPartial<D>));
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handlePersistFn = useCallback(
    (values: TDeepPartial<D>) => {
      setPersist(values);
      onChangeValues?.(values);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handlePrevFn = useCallback(() => {
    if (!isFirstStep) setCurrentStep((prev) => prev - 1);
  }, [isFirstStep]);

  const handleNextFn = useCallback(async () => {
    try {
      const currentValues = await form.validateFields();
      const purifiedValues = { ...persist, ...currentValues };

      handlePersistFn(purifiedValues);
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
      setCurrentStep((prev) => prev + 1);

      form.setFieldsValue(purifiedValues);
    } catch (error) {}
  }, [currentStep, form, handlePersistFn, persist]);

  const handleFinishFn = useCallback(async () => {
    try {
      const lastStepValues = await form.validateFields();
      const purifiedValues = { ...persist, ...lastStepValues };

      setCompletedSteps((prev) => new Set(prev).add(currentStep));

      onSubmit(purifiedValues);
    } catch (error) {}
  }, [currentStep, form, onSubmit, persist]);

  useEffect(() => {
    if (formType === 'update' && initialValues) {
      const completed = new Set<number>();

      for (let i = 0; i < steps.length; i++) {
        completed.add(i);
      }

      setCompletedSteps(completed);
    }
  }, [formType, initialValues, steps.length]);

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex justify-between gap-4 overflow-x-auto md:gap-2">
        {steps.map((step, idx) => {
          const handleStepFn = async () => {
            if (idx === currentStep) return;

            if (completedSteps.has(idx)) {
              if (idx > currentStep) await form.validateFields();

              setCurrentStep(idx);
              form.setFieldsValue(persist);
              return;
            }

            if (idx === currentStep + 1) {
              try {
                const currentValues = await form.validateFields();
                const purifiedValues = { ...persist, ...currentValues };

                handlePersistFn(purifiedValues);
                setCurrentStep(idx);
                form.setFieldsValue(purifiedValues);

                setCompletedSteps((prev) => new Set(prev).add(currentStep));
              } catch (error) {}
            }
          };

          return (
            <div key={idx} className="flex-1 text-center">
              <div
                className={cn('w-fit mx-auto', { 'cursor-pointer': completedSteps.has(idx) && idx !== currentStep })}
                onClick={handleStepFn}
              >
                {showStepCount && (
                  <div
                    className={cn(
                      'mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white',
                      {
                        'bg-[var(--color-primary)]': completedSteps.has(idx) || idx === currentStep,
                        'bg-gray-300': !completedSteps.has(idx) && idx !== currentStep,
                      },
                    )}
                  >
                    {completedSteps.has(idx) && idx !== currentStep ? '✓' : idx + 1}
                  </div>
                )}
                <p
                  className={cn('text-sm text-gray-500', {
                    'font-semibold text-[var(--color-primary)]': idx === currentStep,
                  })}
                >
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <Form
        layout="vertical"
        size="large"
        {...formProps}
        form={form}
        initialValues={initialValues}
        onFinish={handleFinishFn}
      >
        <div>{steps[currentStep].content}</div>
        <div className="mt-4 flex justify-between border-t dark:border-gray-700 pt-4">
          <Button onClick={handlePrevFn} disabled={isFirstStep}>
            Back
          </Button>
          {isLastStep ? (
            <Button key="submit" type="primary" htmlType="submit" loading={isLoading}>
              {formType === 'create' ? 'Submit' : 'Update'}
            </Button>
          ) : (
            <Button key="next" type="primary" onClick={handleNextFn}>
              Next
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default MultiStepForm;
