import { TextField } from '@mui/material';
import React from "react";

export const commandsConfig = [
  {
    type: 'Given',
    color: 'orange',
    label: 'Given',
    InputComponent: React.forwardRef(({ onChange, value }, ref) => (
      <TextField
        ref={ref}
        size="small"
        fullWidth
        variant="outlined"
        label="Input URL"
        onChange={onChange}
        value={value}
      />
    )),
  },
  {
    type: 'When',
    color: 'green',
    label: 'When',
    InputComponent: React.forwardRef(({ onChange, value }, ref) => (
      <TextField
        ref={ref}
        size="small"
        fullWidth
        variant="outlined"
        label="Button Name"
        onChange={onChange}
        value={value}
      />
    )),
  },
  {
    type: 'Then',
    color: 'blue',
    label: 'Then',
    InputComponent: React.forwardRef(({ onChange, value }, ref) => (
      <TextField
        ref={ref}
        size="small"
        fullWidth
        variant="outlined"
        label="Assertion"
        onChange={onChange}
        value={value}
      />
    )),
  },
  // 添加更多命令配置...
];
