import React from "react";
import { Button } from "antd";
import type { ButtonProps } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

type Variant = "default" | "primary" | "destructive" | "text" | "block" | "plus" | "minus";
type AppButtonSize = "small" | "middle" | "large";

interface AppButtonProps extends Omit<ButtonProps, "variant" | "type" | "size" | "icon" > {
  variant?: Variant;
  size?: AppButtonSize;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const AppButton: React.FC<AppButtonProps> = ({
  variant = "default",
  size = "middle",
  children,
  danger,
  icon,
  ...rest
}) => {
  //map our variants to AntD props
  let type: ButtonProps["type"] = "default";
  let block = false;

  if (variant === "primary") {
    type = "primary";
  } else if (variant === "destructive") {
    type = "primary";
    danger = true; 
  } else if (variant === "text") {
    type = "text";
  } else if (variant === "block") {
    type = "primary";
    block = true;
  } else if (variant === "plus") {
    icon= <PlusOutlined />;
  } else if (variant === "minus") {
    icon= <MinusOutlined />;
  }

  return (
    <Button
      type={type}
      danger={danger}
      size={size}
      block={block}
      icon={icon}
      style={{marginTop: 16, ...rest.style}}
      {...rest}
    >
      {children}
    </Button>
  );
};