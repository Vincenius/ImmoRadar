import { useState } from 'react';
import { Checkbox, Group, Text } from '@mantine/core';
import classes from './CheckboxCard.module.css';

function CheckboxCard({ title, description, ...props }) {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox.Card
      className={classes.root}
      radius="md"
      checked={checked}
      onClick={() => setChecked((c) => !c)}
      {...props}
    >
      <Group wrap="nowrap" align="center">
        <Checkbox.Indicator />
        <div>
          <Text className={classes.label}>{title}</Text>
          { description && <Text className={classes.description}>
            {description}
          </Text> }
        </div>
      </Group>
    </Checkbox.Card>
  );
}

export default CheckboxCard