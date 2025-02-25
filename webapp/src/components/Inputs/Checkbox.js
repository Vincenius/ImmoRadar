import { Checkbox as MantineCheckbox } from '@mantine/core';

const Checkbox = (props) => {
  return (<MantineCheckbox
    styles={{ body: { alignItems: 'center' } }}
    {...props}
  />)
}

export default Checkbox