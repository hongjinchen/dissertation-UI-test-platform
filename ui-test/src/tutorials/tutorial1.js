import React from 'react';
import './Tutorial1.css'; // 导入CSS

const htmlExample = `
<html>
<body>

<!-- Inline CSS for styling the input fields -->
<style>
/* Styling class for the text input fields */
.information {
  background-color: white;  /* Setting background color to white */
  color: black;             /* Setting text color to black */
  padding: 10px;            /* Adding padding around the input for spacing */
}
</style>

<!-- Heading for the contact section -->
<h2>Contact Selenium</h2>

<!-- Form that sends data to the /action_page.php when submitted -->
<form action="/action_page.php">

  <!-- Radio buttons for selecting gender -->
  <input type="radio" name="gender" value="m" />Male &nbsp;  <!-- Male option -->
  <input type="radio" name="gender" value="f" />Female <br>   <!-- Female option -->
  <br>

  <!-- Input field for first name with a label -->
  <label for="fname">First name:</label><br>
  <input class="information" type="text" id="fname" name="fname" value="Jane"><br><br>

  <!-- Input field for last name with a label -->
  <label for="lname">Last name:</label><br>
  <input class="information" type="text" id="lname" name="lname" value="Doe"><br><br>

  <!-- Checkbox for subscribing to a newsletter -->
  <label for="newsletter">Newsletter:</label>
  <input type="checkbox" name="newsletter" value="1" /><br><br>

  <!-- Submit button for the form -->
  <input type="submit" value="Submit">
</form> 

<!-- Paragraph with a link to the official Selenium page -->
<p>To know more about Selenium, visit the official page 
<a href ="www.selenium.dev">Selenium Official Page</a> 
</p>

</body>
</html>
`;
function Tutorial1() {
    return (
        <div className="responsive-container">
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
            <p>Parts of the tutorial refer to the official selenium tutorial: https://www.selenium.dev/zh-cn/documentation/webdriver/elements/locators/.</p>
        </div>
    );
}

export default Tutorial1;
