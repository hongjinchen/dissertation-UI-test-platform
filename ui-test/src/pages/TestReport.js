import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';

const TestReportPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    // TODO: 从服务器获取报告数据并设置为状态
    const fetchReport = async () => {
        const response={
            name: '测试报告',
            createdAt: '2021-10-10 10:10:10',
            createdBy: 'admin',
            testCaseId: '1',
            environment: 'Chrome',
            labels: ['label1'],
            state: 'Finished',
            successRate: 100,
            htmlReport: `<!DOCTYPE html>
            <html>
            <head>
                <title>Unittest Results</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
            </head>
            <body>
                <div class="container">
                    <div class="row">
                        <div class="col-xs-12">
                            <h2 class="text-capitalize">Unittest Results</h2>
                            <p class='attribute'><strong>Start Time: </strong>2023-02-26 15:42:31</p>
                            <p class='attribute'><strong>Duration: </strong>0 ms</p>
                            <p class='attribute'><strong>Summary: </strong>Total: 6, Pass: 3, Fail: 1, Error: 1, Skip: 1</p>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xs-12 col-sm-10 col-md-10">
                            <table class='table table-hover table-responsive'>
                                <thead>
                                    <tr>
                                        <th>__main__.TestStringMethods</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class='warning'>
                                        <td class="col-xs-10">test_error</td>
                                        <td class="col-xs-1">
                                            <span class="label label-warning" style="display:block;width:40px;">Error</span>
                                        </td>
                                        <td class="col-xs-1">
                                            <button class="btn btn-default btn-xs">View</button>
                                        </td>
                                    </tr>
                                    <tr style="display:none;">
                                        <td class="col-xs-9" colspan="3"><p style="color:maroon;">ValueError: </p><p style="color:maroon;">Traceback (most recent call last):
              File "d:\final project\HTML_report_test.py", line 24, in test_error
                raise ValueError
            ValueError
            </p>
                                        </td>
                                    </tr>
                                    <tr class='danger'>
                                        <td class="col-xs-10">test_fail</td>
                                        <td class="col-xs-1">
                                            <span class="label label-danger" style="display:block;width:40px;">Fail</span>
                                        </td>
                                        <td class="col-xs-1">
                                            <button class="btn btn-default btn-xs">View</button>
                                        </td>
                                    </tr>
                                    <tr style="display:none;">
                                        <td class="col-xs-9" colspan="3"><p style="color:maroon;">AssertionError: 1 != 2</p><p style="color:maroon;">Traceback (most recent call last):
              File "d:\final project\HTML_report_test.py", line 28, in test_fail
                self.assertEqual(1, 2)
            AssertionError: 1 != 2
            </p>
                                        </td>
                                    </tr>
                                    <tr class='success'>
                                        <td class="col-xs-10">test_isupper</td>
                                        <td class="col-xs-1">
                                            <span class="label label-success" style="display:block;width:40px;">Pass</span>
                                        </td>
                                        <td class="col-xs-1">
                                        </td>
                                    </tr>
                                    <tr class='info'>
                                        <td class="col-xs-10">test_skip</td>
                                        <td class="col-xs-1">
                                            <span class="label label-info" style="display:block;width:40px;">Skip</span>
                                        </td>
                                        <td class="col-xs-1">
                                            <button class="btn btn-default btn-xs">View</button>
                                        </td>
                                    </tr>
                                    <tr style="display:none;">
                                        <td class="col-xs-9" colspan="3"><p style="color:maroon;">This is a skipped test.</p>
                                        </td>
                                    </tr>
                                    <tr class='success'>
                                        <td class="col-xs-10">test_split</td>
                                        <td class="col-xs-1">
                                            <span class="label label-success" style="display:block;width:40px;">Pass</span>
                                        </td>
                                        <td class="col-xs-1">
                                        </td>
                                    </tr>
                                    <tr class='success'>
                                        <td class="col-xs-10">test_upper</td>
                                        <td class="col-xs-1">
                                            <span class="label label-success" style="display:block;width:40px;">Pass</span>
                                        </td>
                                        <td class="col-xs-1">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="3">
                                            Total: 6, Pass: 3, Fail: 1, Error: 1, Skip: 1 -- Duration: 0 ms
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
                <script type="text/javascript">
                    $(document).ready(function(){
                        $('td').on('click', '.btn', function(e){
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            var $this = $(this);
                            var $nextRow = $this.closest('tr').next('tr');
                            $nextRow.slideToggle("fast");
                            $this.text(function(i, text){
                                if (text === 'View') {
                                    return 'Hide';
                                } else {
                                    return 'View';
                                };
                            });
                        });
                    });
                </script>
            </body>
            </html>`,
            // 在JavaScript中，模板字符串是一种新的字符串语法，它使用反引号（`）来定义字符串，允许在字符串中插入变量、表达式和函数调用。使用模板字符串可以更方便地拼接字符串和动态生成HTML、CSS等文本内容。
        }
        setReport(response)
      // ...
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
      <Box>
        <Typography variant="h4">{name}</Typography>
        <Typography>报告 ID: {id}</Typography>
        <Typography>创建时间: {createdAt}</Typography>
        <Typography>创建者: {createdBy}</Typography>
        <Typography>测试用例 ID: {testCaseId}</Typography>
        <Typography>环境: {environment}</Typography>
        <Typography>标签: {labels.join(', ')}</Typography>
        <Typography>状态: {state}</Typography>
        <Typography>成功率: {successRate}%</Typography>
      </Box>
      <Box mt={2}>
        <Button variant="contained" color="primary">
          跳转到测试用例
        </Button>
      </Box>
      <Box mt={2}>
        <Typography variant="h6">测试报告:</Typography>
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
