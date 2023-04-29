import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Avatar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(4),
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const EditUserInfo = () => {
  const classes = useStyles();
  const [username, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showEdit, setShowEdit] = useState(false);

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  };

  const handleAvatarChange = (event) => {
    setAvatar(URL.createObjectURL(event.target.files[0]));
  };

  const handleSave = () => {
    console.log('User information updated');
    setShowEdit(!showEdit);
  };

  return (
      <Card className={classes.card}>
        
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">username</Typography>
              <TextField
                fullWidth
                value={username}
                onChange={handleNicknameChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Avatar</Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                type="file"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-upload">
                <Button component="span" color="primary">
                  Upload
                </Button>
              </label>
              <Box mt={2}>
                <Avatar src={avatar} className={classes.avatar} />
              </Box>
            </Grid>
          </Grid>
          <Box mt={4}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleSave}
            >
              Save
            </Button>
          </Box>
        </CardContent>
      </Card>
  );
};

export default EditUserInfo;
