import React from 'react';
import { Card, Select, Slider, Typography, Space, Divider } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import type { SliderSingleProps } from 'antd';

const { Title } = Typography;

export interface FilterOptions {
  categoryId?: string;
  priceRange?: [number, number];
}

interface CategoryOption {
  id: string;
  name: string;
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  categories: CategoryOption[];
  maxPrice: number;
}

export function FilterPanel({ 
  filters, 
  onFilterChange, 
  categories, 
  maxPrice 
}: FilterPanelProps) {
  const handleCategoryChange = (categoryId: string | undefined) => {
    onFilterChange({ ...filters, categoryId });
  };

  const handlePriceChange = (priceRange: [number, number]) => {
    onFilterChange({ ...filters, priceRange });
  };

  const marks:SliderSingleProps['marks'] = {
    0: '$0',
    [maxPrice]: `$${maxPrice}`
  };

  return (
    <Card 
      title={
        <Space>
          <FilterOutlined />
          <span>Filters</span>
        </Space>
      }
      size="small"
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Title level={5}>Category</Title>
          <Select
            placeholder="Select a category"
            style={{ width: '100%' }}
            value={filters.categoryId}
            onChange={handleCategoryChange}
            allowClear
            options={categories.map(category => ({
              value: category.id,
              label: category.name
            }))}
          />
        </div>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <div>
          <Title level={5}>Price Range</Title>
          <Slider
            range
            min={0}
            max={maxPrice}
            value={filters.priceRange || [0, maxPrice]}
            marks={marks}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={handlePriceChange as any}
            tooltip={{formatter: value => `$${value}`}}
          />
          
        </div>
      </Space>
    </Card>
  );
}