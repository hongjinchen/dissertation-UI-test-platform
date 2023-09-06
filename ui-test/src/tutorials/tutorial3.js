
import React from 'react';
import './Tutorial1.css';
import { Button } from '@mui/material';

const htmlExample = `<html>
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
</html>`;
function goBack() {
    window.history.back();
}
function Tutorial3() {
    return (
        <div className="responsive-container">
            <Button variant="contained" onClick={goBack} color="primary">
                Come back
            </Button>
            <h1>Discover the Mysteries of HTML!</h1>

            <p>
                Imagine every time we admire a beautifully designed webpage, behind the scenes there's a programming language named HTML diligently presenting all that content to us. Its mechanics are akin to crafting a multi-layered cake: each layer, every decorative candy, every spoon of jam corresponds to the texts, images, and buttons we see on the webpage.
            </p>

            <ul>
                <li><strong>Tags</strong>: These are like the layers of the cake, instructing the browser on how to display web content. For instance, all web content is enveloped within the &lt;html&gt; tag, while what the users actually see lies within the &lt;body&gt; tag.</li>
                <li><strong>Attributes</strong>: Ever been captivated by the delicate candy decorations on a cake? In HTML, these candies equate to attributes, which provide extra details for elements, guiding the browser on how exactly to portray them.</li>
                <li><strong>Content</strong>: It's the jam or cream of the cake, bringing substantive information to the webpage. In HTML, this primarily refers to visual materials like texts and images.</li>
                <li><strong>Elements</strong>: When tags, attributes, and content come together, much like the perfect blend of cake, decorations, and jam, we get what's termed an "element".</li>
            </ul>

            <h2>Example Code:</h2>
            <pre>
                <code>
                    {htmlExample}
                </code>
            </pre>

            <p>
                <ol>
                    <li>&lt;html&gt; and &lt;/html&gt;: These denote the beginning and end of the HTML document, ensuring all tags nest within them.</li>
                    <li>&lt;body&gt; and &lt;/body&gt;: These define the main body of the webpage, i.e., what the users actually see in their browser.</li>
                    <li>&lt;!-- ... --&gt;: A comment tag, used for leaving notes or remarks for developers, but its content won't be displayed in the browser.</li>
                    <li>&lt;style&gt; and &lt;/style&gt;: Inline CSS styling tags. For instance, here, a style class named .information is defined.</li>
                    <li>&lt;h2&gt; and &lt;/h2&gt;: Heading tags, where &lt;h1&gt; is the largest and &lt;h6&gt; the smallest. In this case, "Contact Selenium" is a title presented using the &lt;h2&gt; tag.</li>
                    <li>&lt;form&gt;: A form tag, used to gather user inputs. Its action attribute specifies the URL to which the data will be sent upon form submission.</li>
                    <li>&lt;input&gt;: An input tag that serves various input purposes, such as text fields, radio buttons, or checkboxes.</li>
                    <li>&lt;label&gt;: Provides a descriptive label for the &lt;input&gt; element, as in "First name:" in this example.</li>
                    <li>&lt;p&gt; and &lt;/p&gt;: Paragraph tags, wrapping regular text content.</li>
                    <li>&lt;a&gt;: A link tag, where the href attribute points to the target address of the link.</li>
                </ol>
            </p>
        </div>
    );
}

export default Tutorial3;