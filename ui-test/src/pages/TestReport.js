import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid, Alert, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem } from '@mui/material';
import { API_BASE_URL } from "../config";
import { fetchMembers } from "../api";
const BASE_HEIGHT = 300; // 基础高度，例如500px
// const HEIGHT_PER_CHAR = 0.1; // 每个字符增加的高度，这只是一个估算
const TestReportPage = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // 使用useNavigate
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false); // 控制Dialog的状态
    const [members, setMembers] = useState([]); // 保存团队成员的状态
    const [selectedMemberIds, setSelectedMemberIds] = useState([]);

    useEffect(() => {
        const fetchMembersList = async () => {
            if (report && report.team_id) {
                const response = await fetchMembers(report.team_id);
                console.log("fetchMembers", response);
                setMembers(response.data.members);
            }
        };
        fetchMembersList();
    }, [report]);


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
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
        team_id
    } = report;

    const handleTestCaseRedirect = () => {
        navigate(`/testCase/${test_event_id}`);
    };
    const handleMemberSelect = (event, memberId) => {
        // 如果复选框被选中
        if (event.target.checked) {
            // 将memberId添加到selectedMemberIds数组中
            setSelectedMemberIds(prevIds => [...prevIds, memberId]);
        } else {
            // 如果复选框被取消选中，从selectedMemberIds数组中移除memberId
            setSelectedMemberIds(prevIds => prevIds.filter(id => id !== memberId));
        }
    };
    
    const handleShareReport = async () => {
        try {
            // 获取email地址或user_ids来发送报告
            const emailAddresses = members
                .filter(member => selectedMemberIds.includes(member.user_id))
                .map(member => member.email);
    
            const response = await fetch(`${API_BASE_URL}/send-report`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailAddresses,
                    user_ids: selectedMemberIds,
                    test_event_id: test_event_id // 从report中获取test_event_id
                })
            });
    
            const result = await response.json();
            if (response.ok) {
                alert(result.message); // 或使用其他方式通知用户报告已发送
            } else {
                alert("Error: " + result.message); // 或使用其他方式通知用户发生错误
            }
    
        } catch (error) {
            console.error("Error sharing the report:", error);
            alert("Error sharing the report. Please try again later."); // 或使用其他方式通知用户
        }
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
                <Box sx={{ p: 2, my: 2 }}>
                    <Button variant="contained" color="primary" onClick={handleOpen}>
                        Share
                    </Button>
                </Box>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Share Report</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="share"
                            label="Share Link"
                            type="text"
                            fullWidth
                        />
                        <Typography variant="h6" style={{ marginTop: '20px' }}>Team Members:</Typography>
                        <List>
                            {members.map((member, index) => (
                                <ListItem key={index}>
                                    <input
                                        type="checkbox"
                                        value={member.user_id}
                                        onChange={(e) => handleMemberSelect(e, member.user_id)}
                                    />
                                    {member.username} ({member.email})
                                </ListItem>
                            ))}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleShareReport} color="primary">
                            Share
                        </Button>
                    </DialogActions>
                </Dialog>
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

