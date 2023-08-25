import React from 'react';
const htmlExample = `
<html>
<body>
<style>
.information {
  background-color: white;
  color: black;
  padding: 10px;
}
</style>
<h2>Contact Selenium</h2>

<form action="/action_page.php">
  <input type="radio" name="gender" value="m" />Male &nbsp;
  <input type="radio" name="gender" value="f" />Female <br>
  <br>
  <label for="fname">First name:</label><br>
  <input class="information" type="text" id="fname" name="fname" value="Jane"><br><br>
  <label for="lname">Last name:</label><br>
  <input class="information" type="text" id="lname" name="lname" value="Doe"><br><br>
  <label for="newsletter">Newsletter:</label>
  <input type="checkbox" name="newsletter" value="1" /><br><br>
  <input type="submit" value="Submit">
</form> 

<p>To know more about Selenium, visit the official page 
<a href ="www.selenium.dev">Selenium Official Page</a> 
</p>

</body>
</html>
  `;
function Tutorial1() {
    return (
        <div style={{ margin: '40px' }}>
            <h1>Locator Selection</h1>
            <p>In web automation testing, correctly locating page elements is crucial. This not only ensures that your scripts can interact with the correct elements but also ensures the stability and reliability of the test. Here are some suggestions and steps to help you efficiently locate elements using Selenium.</p>
            <h2>Use Browser's Developer Tools:</h2>
            <p>Almost all modern browsers come with powerful developer tools that allow you to view and interact with the HTML structure of a page. This is the first step in locating page elements.</p>
            <h2>Understanding Locators:</h2>
            <p>This project is based on Selenium, which provides several locators for you to choose from. This project supports class name, id, and name. If a button has id="submit-button", then it is the locator element we need to use.</p>
            <table border="1" cellpadding="10">
                <thead>
                    <tr>
                        <th>Locator</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>class name</td>
                        <td>Locate elements whose class attribute matches the search value (compound class names are not allowed)</td>
                    </tr>
                    <tr>
                        <td>id</td>
                        <td>Locate elements whose id attribute matches the search value</td>
                    </tr>
                    <tr>
                        <td>name</td>
                        <td>Locate elements whose name attribute matches the search value</td>
                    </tr>
                </tbody>
            </table>
            <h2>Example</h2>
            <p>Below is an example to help you understand what locators are and where you can find them:</p>
            <pre>
                <code>
                    {htmlExample}
                </code>
            </pre>
            <p>To understand and create a locator, we will use the following HTML snippet.</p>
            <p>The HTML page web element can have an attribute class. We can see an example in the above-shown HTML snippet. For instance, 'information' is one of the class names.</p>
            <p>We can use the ID attribute available with an element on a web page to locate it. For example, 'lname'.</p>
            <p>We can use the NAME attribute available with an element on a web page to locate it. For example, 'newsletter'.</p>
            {/* <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
            </svg> */}
            <p>Parts of the tutorial refer to the official selenium tutorial: https://www.selenium.dev/zh-cn/documentation/webdriver/elements/locators/.</p>
        </div>
    );
}

export default Tutorial1;