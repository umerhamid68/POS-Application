'use client'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';

//this is needed for Ant Design styles to work properly with App Router
export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
    const cache = createCache();
    
    return (
      <StyleProvider cache={cache}>
        {children}
        <style id="antd-styles" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
      </StyleProvider>
    );
  }