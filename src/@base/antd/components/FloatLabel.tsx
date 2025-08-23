import { cn } from '@lib/utils/cn';
import { theme } from 'antd';
import { InputStatus } from 'antd/es/_util/statusUtils';
import { useMemo } from 'react';

export interface IProps {
  focused?: boolean;
  haveValue?: boolean;
  label?: React.ReactNode;
  children?: React.ReactNode;
  width?: string | number;
  height?: string | number;
  status?: InputStatus;
  required?: boolean;
}

const FloatLabel: React.FC<IProps> = ({ focused, haveValue, label, children, width, height, status, required }) => {
  const { token } = theme.useToken();

  const statusColor = useMemo(() => {
    const colors = {
      textColor: token.colorTextTertiary,
      textColorActive: token.colorPrimary,
    };

    if (status === 'warning') {
      colors.textColor = token.colorWarningText;
      colors.textColorActive = token.colorWarningTextActive;
    } else if (status === 'error') {
      colors.textColor = token.colorErrorText;
      colors.textColorActive = token.colorErrorTextActive;
    }

    return colors;
  }, [status, token]);

  return (
    <div
      className="relative"
      style={{
        width: width ?? '100%',
        height,
      }}
    >
      {children}
      <label
        className={cn(
          "pointer-events-none absolute left-0 top-0 flex h-full origin-top-left items-center overflow-hidden text-ellipsis whitespace-nowrap transition-all ease-in-out text-base before:content-[''] before:absolute before:left-0 before:-top-1/2 before:-translate-y-1/2 before:w-full before:h-12 before:-z-10",
          { 'before:bg-[var(--bg-before)]': focused || haveValue },
        )}
        style={{
          color: focused ? statusColor.textColorActive : statusColor.textColor,
          height: focused || haveValue ? 'auto' : '100%',
          paddingInline: focused || haveValue ? 4 : 0,
          borderRadius: focused || haveValue ? 4 : 0,
          transform: focused || haveValue ? 'translate(11px, -8px) scale(0.75)' : `translate(1em, 0px) scale(1)`,
          ...({
            '--bg-before': token.colorBgContainer,
          } as React.CSSProperties),
        }}
      >
        {required ? (
          <div style={{ display: 'flex', gap: '0.2em', alignItems: 'center' }}>
            <span>{label}</span>
            <span>*</span>
          </div>
        ) : (
          label
        )}
      </label>
    </div>
  );
};

export default FloatLabel;
