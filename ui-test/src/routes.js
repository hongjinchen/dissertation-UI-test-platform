import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GroupContext from "./GroupContext";
import { useParams } from 'react-router-dom';


import Dashboard from "./pages/GroupSpace";
import IssueManagement from "./pages/IssueManagement";
import UserCenter from "./pages/UserCenter";
import GroupPage from "./pages/GroupPage";
import ScriptManagement from "./pages/ScriptManagement";
import Login from "./pages/Login";
import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordFlow from "./pages/ForgotPasswordFlow";
import TestReport from "./pages/TestReport";
import TestCase from "./pages/TestCase";
import NotFound404 from './ErrorPages/NotFound404';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/issue/:id" element={<IssueManagement />} />
        <Route exact path="/script/:id" element={<ScriptManagement />} />
        {/* <Route exact path="/userCenter/:id" element={<UserCenter />}/> */}
        <Route exact path="/userCenter/:id" element={<UserCenter />} />
        <Route exact path="/group/:id" element={
          <GroupContext.Provider value={useParams().id}>
            <GroupPage />
          </GroupContext.Provider>
        } />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/forgotPassword" element={<ForgotPasswordFlow />} />
        <Route exact path="/testReport/:id" element={<TestReport />} />
        <Route exact path="/testCase/:id/:testCaseId?" element={<TestCase />} />
        {/* 404错误页面 */}
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
