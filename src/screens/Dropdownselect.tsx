import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

const MyComponent = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null); // Single select
  const [items, setItems] = useState([
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ]);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      style={{ height: 50, width: '100%' }}
    />
  );
};