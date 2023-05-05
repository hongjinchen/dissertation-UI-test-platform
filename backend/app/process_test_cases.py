import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest

# Verify if it is a url
def is_valid_url(url):
    url_pattern = re.compile(
        r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
    )
    return bool(url_pattern.match(url))

# Define the functions corresponding to the type of the different modules
def click_button(driver, element_id):
    element = driver.find_element(By.ID, element_id)
    element.click()

def enter_text(driver, element_id, text):
    element = driver.find_element(By.ID, element_id)
    element.send_keys(text)

def check_url_change(driver, old_url):
    WebDriverWait(driver, 10).until(EC.url_changes(old_url))

# Map the operation type to the corresponding function
action_mapping = {
    "click_button": click_button,
    "enter_text": enter_text,
    "check_url_change": check_url_change,
}


class TestCases(unittest.TestCase):

    def setUp(self):
        self.driver = None

    def tearDown(self):
        if self.driver:
            self.driver.quit()

    def run_test_case(self, test_case):
        if self.driver is None:
            return

        if test_case["type"] == "Given":
            url = test_case["parameters"]
            if is_valid_url(url):
                self.driver.get(url)
            else:
                print(f"Invalid URL: {url}")
                return

        for element in test_case["test_case_elements"]:
            action_type = element["type"]
            parameters = element["parameters"]
            action_function = action_mapping[action_type]
            action_function(self.driver, *parameters)

    def test_cases(self):
        data = ... # JSON data fetched from the front end
        test_cases = data["test_cases"]
        environments = data["test_event"]["environment"]

        for env in environments:
            if env == "chrome":
                self.driver = webdriver.Chrome()
            elif env == "firefox":
                self.driver = webdriver.Firefox()

            for test_case in test_cases:
                self.run_test_case(test_case)

            self.tearDown()

