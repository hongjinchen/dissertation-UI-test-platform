import { TextField, MenuItem, Grid } from '@material-ui/core';
import React from "react";
import PropTypes from 'prop-types';


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

const TwoInputWithSelector = ({ onChange, params }) => {
  if (!params || !Array.isArray(params) || params.length < 2) {
    console.error("Invalid params provided to TwoInputWithSelector component");
    return null; // or render a default/error state
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          label="User Input"
          onChange={(e) => onChange(0, 'value', e.target.value)}
          value={params[0].value}
        />
      </Grid>
      <Grid item xs={8}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          label="Element locator"
          onChange={(e) => onChange(1, 'value', e.target.value)}
          value={params[1].value}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          label="Type"
          select
          onChange={(e) => onChange(1, 'type', e.target.value)}
          value={params[1].type}
        >
          {locatorOptions.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};

TwoInputWithSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  params: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    type: PropTypes.string,
  })).isRequired,
};

TwoInputWithSelector.defaultProps = {
  params: [
    { value: 'value', type: 'text' },
    { value: 'value', type: 'type' },
  ],
};


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
    },{
      value: '',
      type: '',
    },],
    InputComponent: TwoInputWithSelector,
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
    subType: 'User waits',
    color: 'green',
    label: 'When',
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
        label="Enter the number of seconds"
        onChange={onChange}
        value={value}
      />
    )),
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
    subType: 'The user is now on this page',
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
