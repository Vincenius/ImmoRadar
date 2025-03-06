import React from 'react'
import { Button } from '@mantine/core'
import MLButton from './ButtonMultiLine'

function SelectButton({ children, isMultiLine, ...props }) {
  const ButtonComponent = isMultiLine ? MLButton : Button
  return (
    <ButtonComponent
      size="lg"
      styles={{ root: { flexGrow: 1 } }}
      variant="outline"
      {...props}
    >
      {children}
    </ButtonComponent>
  )
}

export default SelectButton