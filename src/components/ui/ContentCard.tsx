'use client'
import { Card } from "antd";
import { ReactNode } from "react";

interface ContentCardProps {
  children: ReactNode;
  maxWidth?: number | string;
}

export function ContentCard({ children, maxWidth = '800px' }: ContentCardProps) {
  return (
    <Card style={{ maxWidth, width: '100%' }}>
      {children}
    </Card>
  );
}