import { Grid, TextField, MenuItem, Switch, FormControlLabel } from '@material-ui/core';
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
        label="Locator Value"
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

const SelectionStatus = React.forwardRef(({onChange, onSeChange, onSelectorChange, locatorType, locatorValue, ExpectedValue }, ref) => (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          label="Expected value"
          onChange={onSeChange}
          value={ExpectedValue}
        />
      </Grid>
      <Grid item xs={8}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          label="Element locator"
          onChange={onChange}
          value={locatorValue}
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
          value={locatorType}
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

SelectionStatus.propTypes = {
  onChange: PropTypes.func.isRequired,
  params: PropTypes.arrayOf(PropTypes.shape({

    locatorType: PropTypes.string,
    locatorValue: PropTypes.string,
    ExpectedValue: PropTypes.string,
  })).isRequired,
};

SelectionStatus.defaultProps = {
  params: [
    { locatorType: '', locatorValue: '', ExpectedValue: '' },
  ],
};

const TwoInputWithSelector = ({ onChange, onSeChange, onSelectorChange, textValue, value, selectorValue }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          label="User Input"
          onChange={onSeChange}
          value={textValue}
        />
      </Grid>
      <Grid item xs={8}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          label="Element locator"
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
  );
};

TwoInputWithSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  params: PropTypes.arrayOf(PropTypes.shape({
    textValue: PropTypes.string,
    value: PropTypes.string,
    type: PropTypes.string,
  })).isRequired,
};

TwoInputWithSelector.defaultProps = {
  params: [
    { textValue: '', value: '', type: '' },
  ],
};



const SetCookieInput = ({ oncookieNameChange, oncookieValueChange, cookieName, cookieValue }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          label="Cookie Name"
          onChange={oncookieNameChange}
          value={cookieName}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          label="Cookie Value"
          onChange={oncookieValueChange}
          value={cookieValue}
        />
      </Grid>
    </Grid>
  );
};

SetCookieInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  params: PropTypes.arrayOf(PropTypes.shape({
    cookieName: PropTypes.string,
    cookieValue: PropTypes.string,
  })).isRequired,
};

SetCookieInput.defaultProps = {
  params: [
    { cookieName: '', cookieValue: '' },
  ],
};


export const commandsConfig = [
  // Given
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

  // When
  {
    type: 'When',
    subType: 'Users set COOKIE',
    color: 'green',
    label: 'When',
    params: [
      { cookieName: '', cookieValue: '' },
    ],
    InputComponent: SetCookieInput,
  },

  {
    type: 'When',
    subType: 'User input data',
    color: 'green',
    label: 'When',
    params: [
      { textValue: '', value: '', type: '' },
    ],
    InputComponent: TwoInputWithSelector,
  },
  {
    type: 'When',
    subType: 'User clicks on the text',
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
        label="Enter the visible text"
        onChange={onChange}
        value={value}
      />
    )),
  },
  {
    type: 'When',
    subType: 'Page scrolling',
    color: 'blue',
    label: 'When',
    params: [{
      value: '',
      type: '',
    }],
    InputComponent: React.forwardRef(({ onChange, value, onSelectorChange, selectorValue }, ref) => (
      <div>
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <TextField
              size="small"
              fullWidth
              variant="outlined"
              label="Pixels"
              select
              onChange={onSelectorChange}
              value={selectorValue}
            >
              {['up', 'down', 'left', 'right'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={8}>
            <TextField
              ref={ref}
              size="small"
              fullWidth
              variant="outlined"
              label="Direction"
              onChange={onChange}
              value={value}
            />
          </Grid>
        </Grid>
      </div>
    )),
  },
  {
    type: 'When',
    subType: 'User resize the Browser Window',
    color: 'blue',
    label: 'When',
    params: [
      { width: '', height: '' }
    ],
    InputComponent: React.forwardRef(({ onWidthChange, width,onHeightChange,height }, ref) => (
      <div>
        <TextField
          ref={ref}
          size="small"
          margin="normal"
          fullWidth
          variant="outlined"
          label="Width"
          onChange={onWidthChange}
          value={width}
        />
        <TextField
          size="small"
          margin="normal"
          fullWidth
          variant="outlined"
          label="Height"
          onChange={onHeightChange}
          value={height}
        />
      </div>
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
    subType: 'User presses key',
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
        label="Enter the name of key"
        onChange={onChange}
        value={value}
      />
    )),
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
    subType: 'User drags an element',
    color: 'green',
    label: 'When',
    params: [
      { sourcename: '', sourcevalue: '', targetname: '', targetvalue: '' },
    ],
    InputComponent: ({
      onSourceLocatorTypeChange,
      onSourceLocatorValueChange,
      onTargetLocatorTypeChange,
      onTargetLocatorValueChange,
      sourceLocatorType,
      sourceLocatorValue,
      targetLocatorType,
      targetLocatorValue,
    }) => (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            label="Source Element Locator Type"
            select
            onChange={onSourceLocatorTypeChange}
            value={sourceLocatorType}
          >
            {locatorOptions.map(option => (
              <MenuItem key={`source-${option}`} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            label="Source Element Locator Value"
            onChange={onSourceLocatorValueChange}
            value={sourceLocatorValue}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            label="Target Element Locator Type"
            select
            onChange={onTargetLocatorTypeChange}
            value={targetLocatorType}
          >
            {locatorOptions.map(option => (
              <MenuItem key={`target-${option}`} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            label="Target Element Locator Value"
            onChange={onTargetLocatorValueChange}
            value={targetLocatorValue}
          />
        </Grid>
      </Grid>
    ),
  },
  {
    type: 'When',
    subType: 'User deletes a cookie',
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
        label="Enter the name of cookie"
        onChange={onChange}
        value={value}
      />
    )),
  },
  {
    type: 'When',
    subType: 'User deletes all cookies',
    color: 'green',
    label: 'When',
    params: [],
  },

  // Then
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
        label="Input text"
        onChange={onChange}
        value={value}
      />
    )),
  },
  {
    type: 'Then',
    subType: 'Page has a specific StatusCode',
    color: 'blue',
    label: 'Then',
    params: [
      { url: '', statusCode: ''},
    ],
    InputComponent: ({ onUrlChange, onStatusCodeChange, url, statusCode }) => (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="URL"
            variant="outlined"
            size="small"
            value={url}
            onChange={onUrlChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Status Code"
            variant="outlined"
            size="small"
            type="number"
            value={statusCode}
            onChange={onStatusCodeChange}
          />
        </Grid>

      </Grid>
    )
  },
  {
    type: 'Then',
    subType: 'Page does not have a specific StatusCode',
    color: 'blue',
    label: 'Then',
    params: [
      { url: '', statusCode: ''},
    ],
    InputComponent: ({ onUrlChange, onStatusCodeChange, url, statusCode }) => (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="URL"
            variant="outlined"
            size="small"
            value={url}
            onChange={onUrlChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Status Code"
            variant="outlined"
            size="small"
            type="number"
            value={statusCode}
            onChange={onStatusCodeChange}
          />
        </Grid>

      </Grid>
    )
  },
  {
    type: 'Then',
    subType: 'Element\'s value is as expected',
    color: 'blue',
    label: 'Then',
    params: [
      { textValue: '', value: '', type: '' },
    ],
    InputComponent: React.forwardRef(({ onChange, onSeChange, onSelectorChange, textValue, value, selectorValue }, ref) => (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            label="Element ecpected value"
            onChange={onSeChange}
            value={textValue}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            label="Element locator value"
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
    )),
  },
  {
    type: 'Then',
    subType: 'Check the element\'s selection status',
    color: 'blue',
    label: 'Then',
    params: [
      { textValue: '', value: '', type: '' },
    ],
    InputComponent: React.forwardRef(({ onChange, onSeChange, onSelectorChange, textValue, value, selectorValue }, ref) => (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            label="Element ecpected value"
            onChange={onSeChange}
            value={textValue}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            label="Element locator value"
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
    )),
  },
  {
    type: 'Then',
    subType: 'Check element class status',
    color: 'blue',
    label: 'Then',
    params: [
      { textValue: '', value: '', type: '' },
    ],
    InputComponent: React.forwardRef(({ onChange, onSeChange, onSelectorChange, textValue, value, selectorValue }, ref) => (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            label="Element ecpected value"
            onChange={onSeChange}
            value={textValue}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            label="Element locator value"
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
    )),
  },
  {
    type: 'Then',
    subType: 'Verify a cookie exists',
    color: 'blue',
    label: 'Then',
    params: [{
      value: '',
      type: 'cookie',
    },],
    InputComponent: React.forwardRef(({ onChange, value }, ref) => (
      <TextField
        ref={ref}
        size="small"
        fullWidth
        variant="outlined"
        label="Input cookie name"
        onChange={onChange}
        value={value}
      />
    )),
  },
  {
    type: 'Then',
    subType: 'Verify a cookie\'s value',
    color: 'blue',
    label: 'Then',
    params: [
      { cookieName: '', cookieValue: '' },
    ],
    InputComponent: SetCookieInput,
  },
];
