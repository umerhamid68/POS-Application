// import { List, Typography, Tag, Space, Divider } from 'antd';
// import { CartItem } from 'context/CartContext';

// const { Text } = Typography;

// interface OrderDetailsProps {
//   items: CartItem[];
// }

// export function OrderDetails({ items }: OrderDetailsProps) {
//   return (
//     <div className="order-details" style={{ width: '100%' }}>
//       <Divider orientation="center">Order Items</Divider>
//       <List
//         dataSource={items}
//         renderItem={(item) => {
//           const itemTotal = item.price * item.quantity;
          
//           return (
//             <List.Item
//               key={`${item.id}-${item.selectedVariation?.id || 'default'}`}
//               extra={<Text>${itemTotal.toFixed(2)}</Text>}
//             >
//               <List.Item.Meta
//                 title={
//                   <Space>
//                     <Text>{item.name}</Text>
//                     {item.selectedVariation && (
//                       <Text type="secondary">- {item.selectedVariation.name}</Text>
//                     )}
//                     <Tag color="blue">{item.quantity}x</Tag>
//                   </Space>
//                 }
//                 description={
//                   <>
//                     {item.selectedModifiers && item.selectedModifiers.length > 0 && (
//                       <div className="modifiers">
//                         <Text type="secondary">
//                           {item.selectedModifiers.map(mod => mod.name).join(', ')}
//                         </Text>
//                       </div>
//                     )}
//                     <Text type="secondary">${item.price.toFixed(2)} each</Text>
//                   </>
//                 }
//               />
//             </List.Item>
//           );
//         }}
//       />
//     </div>
//   );
// }

import { OrderDetailsContainer } from 'containers/checkout/OrderDetailsContainer';

// Re-export the container component
export { OrderDetailsContainer as OrderDetails };