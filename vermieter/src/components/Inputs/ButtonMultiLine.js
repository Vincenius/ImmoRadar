import React from 'react';
import { Button as MantineButton } from '@mantine/core';

function Button({ children, styles, ...props }) {
  return (
     <MantineButton
      styles={{ label: { whiteSpace: 'initial', lineHeight: '1.2em' }, root: { height: 'auto', padding: '10px' } }}
      {...props}
    >
      {children}
     </MantineButton>
  )
}

export default Button;
