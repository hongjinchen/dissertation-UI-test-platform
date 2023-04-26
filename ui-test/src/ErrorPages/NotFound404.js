import React from 'react';
import { Typography, Container } from '@mui/material';

const NotFound404 = () => {
    return (
        <Container>
            <Typography variant="h2" gutterBottom>
                404
            </Typography>
            <Typography variant="h5">
                Sorry, the page you are looking for does not exist.
            </Typography>
        </Container>
    );
};

export default NotFound404;
