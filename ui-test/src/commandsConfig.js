import { TextField } from '@mui/material';

export const commandsConfig = [
  {
    type: 'Given',
    color: 'orange',
    label: 'Given',
    InputComponent: ({ onChange, value }) => (
      <TextField
        size="small"
        fullWidth
        variant="outlined"
        label="Input URL"
        onChange={onChange}
        value={value}
      />
    ),
  },
  {
    type: 'When',
    color: 'green',
    label: 'When',
    InputComponent: ({ onChange, value }) => (
      <TextField
        size="small"
        fullWidth
        variant="outlined"
        label="Button Name"
        onChange={onChange}
        value={value}
      />
    ),
  },
  {
    type: 'Then',
    color: 'blue',
    label: 'Then',
    InputComponent: ({ onChange, value }) => (
      <TextField
        size="small"
        fullWidth
        variant="outlined"
        label="Assertion"
        onChange={onChange}
        value={value}
      />
    ),
  },
  // 添加更多命令配置...
];
