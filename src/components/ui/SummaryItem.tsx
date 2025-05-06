import { Typography, Spin } from 'antd';

const { Text } = Typography;

interface SummaryItemProps {
  label: string;
  value: string | number;
  isLoading?: boolean;
  isNegative?: boolean;
  strong?: boolean;
}

export function SummaryItem({ 
  label, 
  value, 
  isLoading = false,
  isNegative = false,
  strong = false 
}: SummaryItemProps) {
  const formattedValue = typeof value === 'number' 
    ? `${isNegative ? '-' : ''}$${value.toFixed(2)}` 
    : value;
    
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      marginBottom: 8 
    }}>
      <Text strong={strong}>{label}</Text>
      {isLoading ? (
        <Spin size="small" />
      ) : (
        <Text strong={strong}>{formattedValue}</Text>
      )}
    </div>
  );
}