import { Typography, Switch, Space } from 'antd';
import React from 'react';

const { Text } = Typography;

interface ToggleOptionProps {
  label?: React.ReactNode; // Optional label, can be string or JSX
  checked: boolean;
  onChange: (checked: boolean) => void;
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'default';
  labelPosition?: 'left' | 'right'; // Where to place the label relative to the switch
  children?: React.ReactNode; // For more complex content
  style?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
  labelType?: 'secondary' | 'success' | 'warning' | 'danger' | undefined; // <-- Add this line
}

export function ToggleOption({
  label,
  checked,
  onChange,
  loading = false,
  disabled = false,
  size = 'default',
  labelPosition = 'left',
  children,
  style,
  labelStyle,
  labelType, // <-- Add this line
}: ToggleOptionProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent:"center", marginBottom: 8 }}>
      <Space style={{width:'100%', display:'flex', justifyContent:'space-between', ...style}}>
        {labelPosition === 'left' && label && (
          <Text style={labelStyle} type={labelType}>{label}</Text>
        )}
        <Switch
          checked={checked}
          onChange={onChange}
          loading={loading}
          disabled={disabled}
          size={size}
        />
        {labelPosition === 'right' && label && (
          <Text style={labelStyle} type={labelType}>{label}</Text>
        )}
        {children}
      </Space>
    </div>
  );
}