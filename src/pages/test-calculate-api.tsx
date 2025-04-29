import { useState } from 'react';
import { Button, Card, Space, Typography } from 'antd';

const { Text, Title } = Typography;
//code to test calculate order api
export default function TestCalculateAPI() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/checkout/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId: 'LSF7Z57T16P1E',
          lineItems: [
            {
              quantity: '2',
              catalogObjectId: 'HMYEJLPGRLCK5GFXMEOQ5E66'
            },
            {
              quantity: '2',
              catalogObjectId: 'XQHAAFRMBDBBJ4BJR7NZCPNN'
            }
          ],
          autoApplyTaxes: true
        }),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Error testing API:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>Test Calculate Order API</Title>
      
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button 
          type="primary" 
          onClick={testAPI} 
          loading={loading}
        >
          Test API Call
        </Button>
        
        {error && (
          <Card title="Error" style={{ marginTop: '1rem' }}>
            <Text type="danger">{error}</Text>
          </Card>
        )}
        
        {result && (
          <Card title="API Response" style={{ marginTop: '1rem' }}>
            <pre style={{ overflow: 'auto', maxHeight: '500px' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        )}
      </Space>
    </div>
  );
}