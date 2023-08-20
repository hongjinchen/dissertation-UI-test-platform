import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoAlertPresentException
from selenium.common.exceptions import NoSuchElementException
import HtmlTestRunner

import unittest
import logging
import re
import time

# 配置 logging 模块
logging.basicConfig(filename='test.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

# Verify if it is a url
def is_valid_url(url):
    url_pattern = re.compile(
        r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
    )
    return bool(url_pattern.match(url))


def construct_locator(locator_type, parameters):
    if locator_type == 'XPATH':
        return f'//button[contains(text(), "{parameters}")]'
    # You can add additional cases for other locator types if needed.
    return parameters

# locator: not only driver.find_element(By.ID, element_id)
# Define the functions corresponding to the type of the different modules

# Given
def open_website(driver, url):
    driver.get(url)
    
# When
def click_button(driver, locator_type, locator_value):
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    element.click()

def enter_text(driver, locator_type, locator_value, text):
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    element.send_keys(text)

def upload_file(driver, locator_type, locator_value, file_path):
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    element.send_keys(file_path)

# Moving to an element: some elements on a page are only displayed when the mouse is moved over them.
def move_to_element(driver, locator_type, locator_value):
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    ActionChains(driver).move_to_element(element).perform()

# Mouse Actions: Selenium also supports the simulation of right-click, double-click, drag-and-drop and other mouse actions.
def right_click(driver, locator_type, locator_value):
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    ActionChains(driver).context_click(element).perform()

def double_click(driver, locator_type, locator_value):
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    ActionChains(driver).double_click(element).perform()

def drag_and_drop(driver, source_locator_type, source_locator_value, target_locator_type, target_locator_value):
    source_element = driver.find_element(getattr(By, source_locator_type.upper()), source_locator_value)
    target_element = driver.find_element(getattr(By, target_locator_type.upper()), target_locator_value)
    ActionChains(driver).drag_and_drop(source_element, target_element).perform()

# refreshes 
def refresh_page(driver):
    driver.refresh()
# Handling Warning Dialog
def accept_alert(driver):
    alert = driver.switch_to.alert
    alert.accept()

def dismiss_alert(driver):
    alert = driver.switch_to.alert
    alert.dismiss()

# Switching to a new window or tab
def switch_to_window(driver, window_handle):
    driver.switch_to.window(window_handle)

# Then
def check_url_change(self, driver, old_url, expected_url):
    WebDriverWait(driver, 10).until(EC.url_changes(old_url))
    self.assertEqual(driver.current_url, expected_url)

def check_element_text(self, driver, locator_type, locator_value, expected_text):
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    self.assertEqual(element.text, expected_text)

# Element Presence Assertion: This assertion is used to verify that an element exists on the page.
def check_element_exists(self, driver, locator_type, locator_value):
    try:
        driver.find_element(getattr(By, locator_type.upper()), locator_value)
    except NoSuchElementException:
        self.fail("Expected element does not exist.")

# Element visibility assertion: This assertion is used to verify that an element is visible
def check_element_visible(self, driver, locator_type, locator_value):
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    self.assertTrue(element.is_displayed())

# Element state assertion: This assertion is used to verify the state of an element, for example whether the element is selected or not.
def check_element_selected(self, driver, locator_type, locator_value):
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    self.assertTrue(element.is_selected())

# Element style assertion: This assertion is used to verify that an element's style is as expected
def check_element_style(self, driver, locator_type, locator_value, style_name, expected_value):
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    self.assertEqual(element.value_of_css_property(style_name), expected_value)

# Alert Presence Assertion: This assertion is used to verify that a pop-up window is present.
def check_alert_present(self, driver):
    try:
        alert = driver.switch_to.alert
        self.assertIsNotNone(alert.text)
    except NoAlertPresentException:
        self.fail("Expected alert does not exist.")


action_mapping = {
    "Given": open_website,
    "User click the button": click_button, 
    "User input data": enter_text, 
    "User refreshes the page": refresh_page, 
    "User upload file": upload_file, 
    "User moves to element": move_to_element, 
    "User right clicks": right_click, 
    "User double clicks": double_click,  
    "Check element exists": check_element_exists, 
    "Check element visible": check_element_visible, 
    "Check element selected": check_element_selected, 
    "User refreshes the page": refresh_page, 
    "Check text exists": check_element_text,

    # 下面是原来的函数，如果你的前端没有对应的subtype，你可以保留这部分
    "accept_alert": accept_alert,
    "dismiss_alert": dismiss_alert,
    "switch_to_window": switch_to_window,
    
    "check_url_change": check_url_change,
    "check_element_style": check_element_style,
    "check_alert_present": check_alert_present,
}
# webdriver
def get_webdriver(env):
    if env == "chrome":
        return webdriver.Chrome()
    elif env == "firefox":
        return webdriver.Firefox()
    elif env == "safari":
        return webdriver.Safari()
    elif env == "edge":
        return webdriver.Edge()
    else:
        raise ValueError(f"Unsupported environment: {env}")


def create_test_method(test_case):
    def test_method(self):
        self.run_test_case(test_case)
    return test_method

class TestCases(unittest.TestCase):
    test_case_list = []
    environment = 'chrome'

    def setUp(self):
        self.driver = get_webdriver(self.environment)

    def tearDown(self):
        if self.driver:
            self.driver.quit()

    def run_test_case(self, test_case):
        if self.driver is None:
            return

        # Handling the "Given" step first
        if test_case['type'] == 'Given' and test_case['subtype'] == 'Users open the page':
            parameters = test_case['parameters']
            for param in parameters:
                if param['type'] == 'URL':
                    open_website(self.driver, param['value'])

        # Parse and run test_case_elements.
        for test_case_element in test_case['test_case_elements']:
            action_type = test_case_element['type']
            action_subtype = test_case_element['subtype']
            
            parameters = {param['type']: param['value'] for param in test_case_element['parameters']}
            
            action_function = action_mapping.get(action_subtype)
            
            if action_function:
                if 'locator_type' in parameters:
                    locator_value = parameters.get('locator_type')
                    locator = construct_locator(locator_value, parameters.get('Name') or parameters.get('Class Name'))
                    action_function(self.driver, locator_value, locator)
                else:
                    # For functions that don't need locators
                    action_function(self.driver, **parameters)


def run_tests(environment, test_case_list, report_file):
    TestCases.environment = environment
    TestCases.test_case_list = test_case_list

    for i, test_case in enumerate(test_case_list):
        test_method = create_test_method(test_case)
        setattr(TestCases, f'test_case{i}', test_method)

    test_suite = unittest.TestSuite()
    test_loader = unittest.TestLoader()
    test_suite.addTest(test_loader.loadTestsFromTestCase(TestCases))

    runner = HtmlTestRunner.HTMLTestRunner(output=report_file, combine_reports=True)
    test_result = runner.run(test_suite)

    return test_result