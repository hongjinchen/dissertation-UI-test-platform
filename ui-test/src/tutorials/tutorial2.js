// tutorial2.js

import React from 'react';
import './Tutorial1.css'; // 导入CSS
import { Button } from '@mui/material';
function goBack() {
  window.history.back();
}

const Tutorial2 = () => {
  return (
    <div  className="responsive-container">
      <Button variant="contained" onClick={goBack} color="primary">
        Come back
      </Button>
      <h1>UI Testing Design Module: User Behavior Guide</h1>

      <h2>Given</h2>
      <ul>
        <li><strong>Users open the page:</strong> The user launches and opens a specific web page or application page, ready to start their session or interaction.</li>
      </ul>

      <h2>When</h2>
      <ul>
        <li><strong>User input data:</strong> The user provides or fills in data in an input field, such as text boxes, dropdowns, etc.</li>
        <li><strong>User click the button:</strong> The user clicks on a button on the page, typically to submit a form, open a new page, or trigger some function.</li>
        <li><strong>User double clicks:</strong> The user double-clicks on an element on the page. This is usually used to open an item or initiate a specific part of an application.</li>
        <li><strong>User right clicks:</strong> The user right-clicks on an element on the page. Typically, this opens a context menu offering options related to the selected item.</li>
        <li><strong>User moves to element:</strong> The user moves the mouse cursor over an element on the page without clicking. This is often used to trigger tooltips or other hover effects.</li>
        <li><strong>User refreshes the page:</strong> The user refreshes the current page, typically to load the latest content or fix some error on the page.</li>
        <li><strong>User waits:</strong> The user pauses on the current page for a specified duration, possibly waiting for an animation, load, or other processes to complete.</li>
      </ul>

      <h2>Then</h2>
      <ul>
        <li><strong>The user is now on this page:</strong> Verify if the user has successfully been redirected or navigated to the expected page.</li>
        <li><strong>Check element exists:</strong> Confirm the existence of a specific element on the page to ensure completeness of load or functionality.</li>
        <li><strong>Check element visible:</strong> Verify if a specific element on the page is visible to the user, possibly pertaining to the element's display status or position.</li>
        <li><strong>Check text exists:</strong> Confirm the presence of expected text on the page, usually checking for messages, titles, or other key information.</li>
        <li><strong>Check element selected:</strong> Verify if a specific page element (like a checkbox or radio button) is selected or activated.</li>
      </ul>
    </div>
  );
}

export default Tutorial2;
