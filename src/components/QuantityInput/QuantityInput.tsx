import React from "react";
import { InputNumber } from "antd";
import { AppButton } from "components/Button/CommonButton";

interface QuantityInputProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: "small" | "middle" | "large";
  style?: React.CSSProperties;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
  size = "small",
  style
}) => {
  return (
    <InputNumber
      min={min}
      max={max}
      value={value}
      onChange={v => onChange(Number(v))}
      addonBefore={
        <AppButton
          variant="minus"
          size={size}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          style={{padding:0}}
        />
      }
      addonAfter={
        <AppButton
          variant="plus"
          size={size}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          style={{padding:0}}
          
        />
      }
      controls={false}
      style={{ width: 160, ...style }}
      inputMode="numeric"
    />
  );
};