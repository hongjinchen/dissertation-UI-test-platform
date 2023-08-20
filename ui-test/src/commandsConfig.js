import { TextField, MenuItem, Grid } from '@material-ui/core';
import React from "react";
const locatorOptions = ["ID", "Name", "Class Name"];
const InputWithSelector = React.forwardRef(({ onChange, value, onSelectorChange, selectorValue }, ref) => (
  <Grid container spacing={1}>
    <Grid item xs={8}>
      <TextField
        ref={ref}
        size="small"
        fullWidth
        variant="outlined"
        label="Button Name"
        onChange={onChange}
        value={value}
      />
    </Grid>
    <Grid item xs={4}>
      <TextField
        size="small"
        fullWidth
        variant="outlined"
        label="Type"
        select
        onChange={onSelectorChange}
        value={selectorValue}
      >
        {locatorOptions.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
    </Grid>
  </Grid>
));
export const commandsConfig = [
  {
    type: 'Given',
    subType: 'Users open the page',
    color: 'orange',
    label: 'Given',
    params: [{
      value: '',
      type: 'URL',
    },],
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
    subType: 'User click the button',
    color: 'green',
    label: 'When',
    params: [{
      value: '',
      type: '',
    },],
    InputComponent: InputWithSelector,
  },
  {
    type: 'When',
    subType: 'User input data',
    color: 'green',
    label: 'When',
    params: [{
      value: '',
      type: '',
    },],
    InputComponent: InputWithSelector,
  },
  {
    type: 'When',
    subType: 'User refreshes the page',
    color: 'green',
    label: 'When',
    params: [],
  },
  {
    type: 'When',
    subType: 'User moves to element',
    color: 'green',
    label: 'When',
    params: [{
      value: '',
      type: '',
    },],
    InputComponent: InputWithSelector,
  },
  {
    type: 'When',
    subType: 'User right clicks',
    color: 'green',
    label: 'When',
    params: [{
      value: '',
      type: '',
    },],
    InputComponent: InputWithSelector,
  },
  {
    type: 'When',
    subType: 'User double clicks',
    color: 'green',
    label: 'When',
    params: [{
      value: '',
      type: '',
    },],
    InputComponent: InputWithSelector,
  },

  {
    type: 'Then',
    subType: 'Check element exists',
    color: 'blue',
    label: 'Then',
    params: [{
      value: '',
      type: '',
    },],
    InputComponent: InputWithSelector,
  },
  {
    type: 'Then',
    subType: 'Check element visible',
    color: 'blue',
    label: 'Then',
    params: [{
      value: '',
      type: '',
    },],
    InputComponent: InputWithSelector,
  },
  {
    type: 'Then',
    subType: 'Check text exists',
    color: 'blue',
    label: 'Then',
    params: [{
      value: '',
      type: '',
    },],
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
    type: 'Then',
    subType: 'Check element selected',
    color: 'blue',
    label: 'Then',
    params: [{
      value: '',
      type: '',
    },],
    InputComponent: InputWithSelector,
  },

];
