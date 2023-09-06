import React from 'react';
import {
  Typography,
  Box,
  Paper,
  Divider,
  Link,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    margin: '20px',
  },
  code: {
    backgroundColor: '#f7f7f7',
    padding: theme.spacing(2),
    borderRadius: 4,
    display: 'block',
    whiteSpace: 'pre',
  },
}));

function UIliciousTutorial() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography variant="h4" gutterBottom>
        UI-licious Tutorial
      </Typography>

      <Typography variant="h6" gutterBottom>
        What is UIlicious?
      </Typography>
      <Typography paragraph>
        UI-licious is a simple and robust tool for automating interactions with modern web applications.
      </Typography>
      <Typography paragraph>
        Use it to test your web applications to make sure that your users aren't running into unexpected errors in critical user flows like when they are registering for an account or checking out their order.
      </Typography>

      <Divider />

      <Typography variant="h6" gutterBottom>
        Do I need to know how to code?
      </Typography>
      <Typography paragraph>
        No, not at all! If you know how to use SUM in a spreadsheet application, then you already are good to go.
      </Typography>
      <Typography paragraph>
        Don't worry about the wizardry that goes on underneath your web pages. Just write your tests as if you are telling your dad how to log into Facebook over the phone.
      </Typography>

      <Box mt={2} mb={2}>
        <code className={classes.code}>
          {`
I.goTo("https://facebook.com");
I.fill("Email", "peter@example.com");
I.fill("Password", "mysupersecretpassword");
I.click("Login");
I.see("Peter");
          `}
        </code>
      </Box>

      <Divider />

      <Typography variant="h6" gutterBottom>
        But it can be a powerful tool if you can code
      </Typography>
      <Typography paragraph>
        UI-licious runs JavaScript underneath, this lets you do things like this:
      </Typography>

      <Box mt={2} mb={2}>
        <code className={classes.code}>
          {`
var email = "peter@example.com";

function getPassword(){
    return ["my", "super", "secret", "password"].join('');
}

I.goTo("https://facebook.com");
I.fill("Email", email);
I.fill("Password", getPassword());
I.click("Login");
I.see("Peter");
          `}
        </code>
      </Box>

      <Divider />

      <Typography variant="h6" gutterBottom>
        Can I use it for &lt;insert front-end framework&gt;?
      </Typography>
      <Typography paragraph>
        Yes. ReactJS, AngularJS, VueJS, Polymer, VanillaJS, you name it!
      </Typography>

      <Typography paragraph>
        <Link href="https://uilicious.com" target="_blank" rel="noopener noreferrer">
          Learn more about UI-licious
        </Link>
      </Typography>
    </Paper>
  );
}

export default UIliciousTutorial;
