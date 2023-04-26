import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import { API_BASE_URL } from "../config";

const TestReportPage = () => {
    const { id } = useParams();
    const [report, setReport] = useState(null);

    useEffect(() => {
        // TODO: 从服务器获取报告数据并设置为状态
        const fetchReport = async () => {
            const reportID=2
            try {
                const response = await fetch(API_BASE_URL+`/api/test-report/${reportID}`);
                if (response.ok) {
                    const reportData = await response.json();
                    const decodedHtmlReport = atob(reportData.htmlReport);
                    reportData.htmlReport=decodedHtmlReport
                    setReport(reportData);
                } else {
                    console.error('Error fetching report data:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        };
        fetchReport();
    }, [id]);

    if (!report) {
        return <Typography>Loading...</Typography>;
    }

    const {
        name,
        createdAt,
        createdBy,
        testCaseId,
        environment,
        labels,
        state,
        successRate,
        htmlReport,
    } = report;

    return (
        <Container>
            <Box sx={{ boxShadow: 1, p: 2, my: 2 }}>
                <Typography variant="h6">Test Case Detail</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography>Name: {name}</Typography>
                        <Typography>Report ID: {id}</Typography>
                        <Typography>Created at: {createdAt}</Typography>
                        <Typography>Created by: {createdBy}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography>Test case ID: {testCaseId}</Typography>
                        <Typography>Environment: {environment}</Typography>
                        <Typography>Labels: {labels.join(', ')}</Typography>
                        <Typography>Status: {state}</Typography>
                        <Typography>Success rate: {successRate}%</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ p: 2, my: 2 }}>
                <Button variant="contained" color="primary">
                    Go to Test Case
                </Button>
            </Box>
            <Box sx={{ boxShadow: 1, p: 2, my: 2 }}>
                <Typography variant="h6">Test HTML Report</Typography>
                <iframe
                    srcDoc={htmlReport}
                    title="HTML Report"
                    width="100%"
                    height="800"
                    style={{ border: '1px solid #000' }}
                />
            </Box>
        </Container>
    );
};

export default TestReportPage;
