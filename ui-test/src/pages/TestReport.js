import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid, Alert, Chip } from '@mui/material';
import { API_BASE_URL } from "../config";
const BASE_HEIGHT = 300; // 基础高度，例如500px
// const HEIGHT_PER_CHAR = 0.1; // 每个字符增加的高度，这只是一个估算
const TestReportPage = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // 使用useNavigate
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/test-report/${id}`);
                if (response.ok) {
                    const reportData = await response.json();
                    reportData.htmlReports = reportData.htmlReports.map(report => atob(report));
                    setReport(reportData);
                } else if (response.status === 404) {
                    setError('报告不存在');
                } else {
                    console.error('Error fetching report data:', response.status, response.statusText);
                    setError('无法加载报告，请稍后再试');
                }
            } catch (error) {
                console.error('Error fetching report data:', error);
                setError('无法加载报告，请稍后再试');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    const {
        name,
        createdAt,
        createdBy,
        test_event_id,
        environment,
        labels,
        state,
        successRate,
        htmlReports,
    } = report;

    const handleTestCaseRedirect = () => {
        navigate(`/testCase/${test_event_id}`);
    };
    return (
        <Container>
            <Box sx={{ backgroundColor: '#f7f7f7', boxShadow: 1, p: 3, my: 3, borderRadius: '5px' }}>
                <Typography variant="h5" gutterBottom>Test Case Detail</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">Name: <strong>{name}</strong></Typography>
                        <Typography variant="body1">Report ID: <strong>{id}</strong></Typography>
                        <Typography variant="body1">Created at: <strong>{createdAt}</strong></Typography>
                        <Typography variant="body1">Created by: <strong>{createdBy}</strong></Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="body1">Test case ID: <strong>{test_event_id}</strong></Typography>
                        <Typography variant="body1">
                            Environment:
                            {JSON.parse(environment).map((env, index) => (
                                <Chip
                                    key={index}
                                    label={<span style={{ fontWeight: 'bold' }}>{env}</span>}
                                    variant="outlined"
                                    size="small"
                                    style={{ marginLeft: '8px', marginBottom: '4px' }}
                                />
                            ))}
                        </Typography>
                        <Typography variant="body1">Labels: <strong>{labels.join(', ')}</strong></Typography>
                        <Typography variant="body1" color={state === "Passed" ? "green" : "red"}>Status: <strong>{state}</strong></Typography>
                        <Typography variant="body1">Success rate: <strong>{successRate}%</strong></Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ p: 2, my: 2 }}>
                <Button variant="contained" color="primary" onClick={handleTestCaseRedirect}>
                    Go to Test Case
                </Button>
            </Box>
            {htmlReports.map((htmlReport, index) => {
                const dynamicHeight = BASE_HEIGHT;
                return (
                    <Box key={index} sx={{ backgroundColor: '#f7f7f7', boxShadow: 1, p: 3, my: 3, borderRadius: '5px' }}>
                        <Typography variant="h6" gutterBottom>Test HTML Report #{index + 1}</Typography>
                        <iframe
                            srcDoc={htmlReport}
                            title={`HTML Report ${index + 1}`}
                            width="100%"
                            height={dynamicHeight}
                            style={{ border: '1px solid #ddd' }}
                        />
                    </Box>
                );
            })}
        </Container>
    );

};

export default TestReportPage;

