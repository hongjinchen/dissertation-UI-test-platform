// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Container, Typography, Button, Box, Grid, Alert } from '@mui/material';
// import { API_BASE_URL } from "../config";

// const TestReportPage = () => {
//     const { id } = useParams();
//     const [report, setReport] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchReport = async () => {
//             try {
//                 const response = await fetch(`${API_BASE_URL}/test-report/${id}`);
//                 if (response.ok) {
//                     const reportData = await response.json();
//                     const decodedHtmlReport = atob(reportData.htmlReport);
//                     reportData.htmlReport = decodedHtmlReport;
//                     setReport(reportData);
//                 } else if (response.status === 404) {
//                     setError('报告不存在');
//                 } else {
//                     console.error('Error fetching report data:', response.status, response.statusText);
//                     setError('无法加载报告，请稍后再试');
//                 }
//             } catch (error) {
//                 console.error('Error fetching report data:', error);
//                 setError('无法加载报告，请稍后再试');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchReport();
//     }, [id]);

//     if (loading) {
//         return <Typography>Loading...</Typography>;
//     }

//     if (error) {
//         return <Alert severity="error">{error}</Alert>;
//     }

//     const {
//         name,
//         createdAt,
//         createdBy,
//         test_event_id,
//         environment,
//         labels,
//         state,
//         successRate,
//         htmlReport,
//     } = report;

//     return (
//         <Container>
//             <Box sx={{ boxShadow: 1, p: 2, my: 2 }}>
//                 <Typography variant="h6">Test Case Detail</Typography>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} sm={6}>
//                         <Typography>Name: {name}</Typography>
//                         <Typography>Report ID: {id}</Typography>
//                         <Typography>Created at: {createdAt}</Typography>
//                         <Typography>Created by: {createdBy}</Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={6}>
//                         <Typography>Test case ID: {test_event_id}</Typography>
//                         <Typography>Environment: {environment}</Typography>
//                         <Typography>Labels: {labels.join(', ')}</Typography>
//                         <Typography>Status: {state}</Typography>
//                         <Typography>Success rate: {successRate}%</Typography>
//                     </Grid>
//                 </Grid>
//             </Box>
//             <Box sx={{ p: 2, my: 2 }}>
//                 <Button variant="contained" color="primary">
//                     Go to Test Case
//                 </Button>
//             </Box>
//             <Box sx={{ boxShadow: 1, p: 2, my: 2 }}>
//                 <Typography variant="h6">Test HTML Report</Typography>
//                 <iframe
//                     srcDoc={htmlReport}
//                     title="HTML Report"
//                     width="100%"
//                     height="800"
//                     style={{ border: '1px solid #000' }}
//                 />
//             </Box>
//         </Container>
//     );
// };

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { Container, Typography, Button, Box, Grid, Alert } from '@mui/material';
import { API_BASE_URL } from "../config";

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
                        <Typography>Test case ID: {test_event_id}</Typography>
                        <Typography>Environment: {environment}</Typography>
                        <Typography>Labels: {labels.join(', ')}</Typography>
                        <Typography>Status: {state}</Typography>
                        <Typography>Success rate: {successRate}%</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Box sx={{ p: 2, my: 2 }}>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={handleTestCaseRedirect}
                >
                    Go to Test Case
                </Button>
            </Box>
            {htmlReports.map((htmlReport, index) => (
                <Box key={index} sx={{ boxShadow: 1, p: 2, my: 2 }}>
                    <Typography variant="h6">Test HTML Report #{index + 1}</Typography>
                    <iframe
                        srcDoc={htmlReport}
                        title={`HTML Report ${index + 1}`}
                        width="100%"
                        height="800"
                        style={{ border: '1px solid #000' }}
                    />
                </Box>
            ))}
        </Container>
    );
};

export default TestReportPage;

