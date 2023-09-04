import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GroupContext from "./GroupContext";
import { useParams } from 'react-router-dom';


import Dashboard from "./pages/GroupSpace";
import IssueManagement from "./pages/IssueManagement";
import UserCenter from "./pages/UserCenter";
import GroupPage from "./pages/GroupPage";
import ScriptManagement from "./pages/ScriptManagement";
import TeamManagement from './pages/TeamManagement';

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPasswordFlow from "./pages/ForgotPasswordFlow";
import TestReport from "./pages/TestReport";
import TestCase from "./pages/TestCase";
import NotFound404 from './ErrorPages/NotFound404';
import Tutorial1 from './tutorials/tutorial1';
import Tutorial2 from './tutorials/tutorial2';
import Tutorial3 from './tutorials/tutorial3';
import Tutorial4 from './tutorials/tutorial4';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/issue/:id" element={<IssueManagement />} />
        <Route exact path="/script/:id" element={<ScriptManagement />} />
        <Route exact path="/team/:id" element={<TeamManagement />} />
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
        {/* tutorial页面 */}
        <Route exact path="/tutorial1" element={<Tutorial1 />} />
        <Route exact path="/tutorial2" element={<Tutorial2 />} />
        <Route exact path="/tutorial3" element={<Tutorial3 />} />
        <Route exact path="/tutorial4" element={<Tutorial4 />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
