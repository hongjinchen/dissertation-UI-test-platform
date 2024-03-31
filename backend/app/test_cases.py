from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager
# 因为为了适应不同的服务器下的不同浏览器，所以需要在这里进行修改，增加webdriver_manager去管理浏览器驱动的版本
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoAlertPresentException
from selenium.common.exceptions import NoSuchElementException
import requests

import HtmlTestRunner
import functools
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

# Catch and handle exceptions for all functions or methods and include exception screenshot functionality
def exception_handler_decorator(func):
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except AssertionError as e:
            # For assertion errors, re-assert with the same message to ensure it's captured by HtmlTestRunner
            assert False, str(e)
        except Exception as e:
            # For all other exceptions, assert False and include a custom error message
            assert False, f"An unexpected error occurred while executing {func.__name__}: {str(e)}"
    return wrapper


# locator: not only driver.find_element(By.ID, element_id)
def construct_locator(parameters):
    """
    Constructs the locator based on the provided parameters.
    """
    if 'ID' in parameters:
        return ('ID', parameters['ID'])
    elif 'Name' in parameters:
        return ('NAME', parameters['Name'])
    elif 'Class Name' in parameters:
        return ('CLASS_NAME', parameters['Class Name'])
    else:
        raise ValueError(f"Unsupported locator in parameters: {parameters}")
"""  """

# Given
def open_website(driver, url):
    driver.get(url)

# When

@exception_handler_decorator
def set_cookie(self, driver, **kwargs):
    cookie_dict = {'name': kwargs.get('cookieName'), 'value': kwargs.get('cookieValue')}
    driver.add_cookie(cookie_dict)

@exception_handler_decorator
def click_on_text(self, driver, **kwargs):
    text_to_click = kwargs['value']
    xpath_expression = f"//*[contains(text(), '{text_to_click}')]"
    
    try:
        element = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, xpath_expression))
        )
        element.click()
    except Exception as e:
        print(f"Error clicking on text '{text_to_click}': {e}")
    
def user_waits(self, driver, **kwargs):
    time.sleep(float(kwargs.get('value', 1)))

def delete_cookie(self, driver, **kwargs):
    driver.delete_cookie(kwargs.get('value'))

@exception_handler_decorator
def delete_all_cookies(self, driver, **kwargs):
    driver.delete_all_cookies()

@exception_handler_decorator
def drag_and_drop(self, driver, **kwargs):
    source_element = driver.find_element(getattr(By, kwargs.get('sourceLocatorType').upper()), kwargs.get('sourceLocatorValue'))
    target_element = driver.find_element(getattr(By, kwargs.get('targetLocatorType').upper()), kwargs.get('targetLocatorValue'))
    ActionChains(driver).drag_and_drop(source_element, target_element).perform()
    
def click_button(self, driver, **kwargs):
    locator_type = kwargs['type'].replace(" ", "_").upper() 
    locator_value = kwargs['value']
    element = driver.find_element(getattr(By, locator_type), locator_value)
    element.click()


@exception_handler_decorator
# Moving to an element: some elements on a page are only displayed when the mouse is moved over them.
def move_to_element(self, driver, **kwargs):
    locator_type = kwargs['type'].replace(" ", "_").upper() 
    locator_value = kwargs['value']
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    ActionChains(driver).move_to_element(element).perform()


@exception_handler_decorator
# Mouse Actions: Selenium also supports the simulation of right-click, double-click, drag-and-drop and other mouse actions.
def right_click(self, driver, **kwargs):
    locator_type = kwargs['type'].replace(" ", "_").upper() 
    locator_value = kwargs['value']
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    ActionChains(driver).context_click(element).perform()


@exception_handler_decorator
def double_click(self, driver, **kwargs):
    locator_type = kwargs['type'].replace(" ", "_").upper() 
    locator_value = kwargs['value']
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    ActionChains(driver).double_click(element).perform()


# refreshes
@exception_handler_decorator
def refresh_page(self, driver, **kwargs):
    driver.refresh()

# Handling Warning Dialog
@exception_handler_decorator
def accept_alert(self, driver, **kwargs):
    alert = driver.switch_to.alert
    alert.accept()


@exception_handler_decorator
def dismiss_alert(self, driver, **kwargs):
    alert = driver.switch_to.alert
    alert.dismiss()


@exception_handler_decorator
def switch_to_window(self, driver, **kwargs):
    window_handle = kwargs['windowHandle']
    driver.switch_to.window(window_handle)

def resize_browser_window(self, driver, **kwargs):
    driver.set_window_size(kwargs['width'], kwargs['height'])
    

def scroll_page(self, driver, **kwargs):
    direction = kwargs['type']
    pixels = kwargs['value']
    if direction == 'up':
        script = f"window.scrollBy(0, -{pixels});"
    elif direction == 'down':
        script = f"window.scrollBy(0, {pixels});"
    elif direction == 'left':
        script = f"window.scrollBy(-{pixels}, 0);"
    elif direction == 'right':
        script = f"window.scrollBy({pixels}, 0);"
    else:
        raise ValueError("Invalid direction. Choose from 'up', 'down', 'left', 'right'.")

    driver.execute_script(script)
 
def press_key_on_page(self, driver, **kwargs):
    key_name=kwargs['value']
    selenium_key = getattr(Keys, key_name.upper(), None)
    if not selenium_key:
        print(f"Unsupported key: {key_name}")
        return
    try:
        ActionChains(driver).send_keys(selenium_key).perform()
        print(f"Pressed key '{key_name}' on page.")
    except Exception as e:
        print(f"Error pressing key '{key_name}' on page: {e}")   


# Then

@exception_handler_decorator
def verify_current_url(self, driver, **kwargs):
    expected_url = kwargs['value']
    current_url = driver.current_url
    assert current_url == expected_url, f"Current URL {current_url} does not match expected URL {expected_url}."

@exception_handler_decorator
def verify_page_status_code(self,driver, **kwargs):
    url = kwargs['url']
    expected_status_code = int(kwargs['statusCode'])
    response = requests.get(url)
    print(f"Page status code: {response.status_code}")
    assert response.status_code == expected_status_code, f"Page status code {response.status_code} does not match expected {expected_status_code}."

@exception_handler_decorator
def verify_page_not_status_code(self,driver, **kwargs):
    url = kwargs['url']
    unexpected_status_code = int(kwargs['statusCode'])
    response = requests.get(url)
    assert response.status_code != unexpected_status_code, f"Page status code {response.status_code} should not be {unexpected_status_code}."

    
def enter_text(self, driver, **kwargs):
    element = driver.find_element(getattr(By, kwargs['type'].replace(" ", "_").upper()), kwargs['value'])
    element.send_keys(kwargs['textValue'])

def verify_element_value(self, driver, **kwargs):
    locator_type = kwargs['type'].replace(" ", "_").upper() 
    locator_value = kwargs['value']
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    assert element.get_attribute('value') == kwargs['textValue'], "Element value does not match expected value."

def verify_number_of_elements(self, driver, **kwargs):
    locator_type = kwargs['locatorType']
    locator_value = kwargs['locatorValue']
    elements = driver.find_elements(getattr(By, locator_type.upper()), locator_value)
    assert len(elements) == int(kwargs['expectedNumber']), "Number of elements does not match expected number."

def verify_element_class(self, driver, **kwargs):
    locator_type = kwargs['locatorType']
    locator_value = kwargs['locatorValue']
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    classes = element.get_attribute('class').split()
    assert kwargs['expectedClass'] in classes, "Expected class not found in element's classes."



@exception_handler_decorator
def verify_cookie_exists(self, driver, **kwargs):
    cookie_name = kwargs['value']
    cookie = driver.get_cookie(cookie_name)
    assert cookie is not None, f"Cookie {cookie_name} does not exist."

@exception_handler_decorator
def verify_cookie_value(self, driver, **kwargs):
    cookie_name = kwargs['cookieName']
    expected_value = kwargs['cookieValue']
    cookie = driver.get_cookie(cookie_name)
    assert cookie and cookie['value'] == expected_value, f"Cookie {cookie_name} value does not match expected value."

def check_element_text(self, driver, **kwargs):
    expected_text = kwargs['value']
    page_source = driver.page_source
    assert expected_text in page_source, f"Expected text '{expected_text}' not found in page source."


@exception_handler_decorator
def check_element_exists(self, driver, **kwargs):
    locator_type = kwargs['type'].replace(" ", "_").upper() 
    locator_value = kwargs['value']
    try:
        driver.find_element(getattr(By, locator_type.upper()), locator_value)
    except NoSuchElementException:
        assert False, "Expected element does not exist."


@exception_handler_decorator
def check_element_visible(self, driver, **kwargs):
    locator_type = kwargs['type'].replace(" ", "_").upper() 
    locator_value = kwargs['value']
    element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
    assert element.is_displayed(), "Expected element is not visible."


def check_element_selected(self, driver, **kwargs):
    locator_type = kwargs['type'].replace(" ", "_").upper() 
    locator_value = kwargs['value']
    expected_selection_state = kwargs.get('textValue', 'false').lower() == 'true'

    try:
        element = driver.find_element(getattr(By, locator_type.upper()), locator_value)
        actual_selection_state = element.is_selected()
        assert actual_selection_state == expected_selection_state, f"Expected element with {locator_type}='{locator_value}' to be {'selected' if expected_selection_state else 'not selected'}, but it was {'not ' if not actual_selection_state else ''}selected."
        print(f"Element selection state is as expected: {'selected' if actual_selection_state else 'not selected'}.")
    except NoSuchElementException:
        print(f"Element not found with {locator_type} = '{locator_value}'")
    except AssertionError as e:
        print(e)

# @exception_handler_decorator
# def check_element_style(self, driver, locator_type, locator_value, style_name, expected_value):
#     element = driver.find_element(
#         getattr(By, locator_type.upper()), locator_value)
#     self.assertEqual(element.value_of_css_property(style_name), expected_value)

# @exception_handler_decorator
# def check_alert_present(self, driver):
#     try:
#         alert = driver.switch_to.alert
#         self.assertIsNotNone(alert.text)
#     except NoAlertPresentException:
#         self.fail("Expected alert does not exist.")


action_mapping = {
    "Given": open_website,
    
    "Users set COOKIE": set_cookie,
    "User click the button": click_button,
    "User clicks on the text": click_on_text,
    "User input data": enter_text,
    "User refreshes the page": refresh_page,
    "User moves to element": move_to_element,
    "User right clicks": right_click,
    "User double clicks": double_click,
    "User sets a cookie": set_cookie,
    "User deletes a cookie": delete_cookie,
    "User deletes all cookies": delete_all_cookies,
    "User drags an element": drag_and_drop,
    "User waits": user_waits,
    "User resize the Browser Window":resize_browser_window,
    "Page scrolling":scroll_page,
    "User presses key":press_key_on_page,
        
    "Check element exists": check_element_exists,
    "Check element visible": check_element_visible,
    "Check the element's selection status": check_element_selected,
    "Element's value is as expected":verify_element_value,
    "Check element class status": verify_element_class,
    "Check text exists": check_element_text,
    "The user is now on this page": verify_current_url,
    "Verify number of elements": verify_number_of_elements,
    "Verify a cookie exists": verify_cookie_exists,
    "Verify a cookie's value": verify_cookie_value,
    "Page has a specific StatusCode": verify_page_status_code,
    "Page does not have a specific StatusCode": verify_page_not_status_code,
}

# webdriver
def get_webdriver(env):
    if env == "chrome":
        return webdriver.Chrome(ChromeDriverManager().install())
    elif env == "firefox":
        return webdriver.Firefox(GeckoDriverManager().install())
    elif env == "safari":
        return webdriver.Safari() 
    elif env == "edge":
        return webdriver.Edge(EdgeChromiumDriverManager().install())
    else:
        raise ValueError(f"Unsupported environment: {env}")


def create_test_method(test_case):
    def test_method(self):
        self.run_test_case(test_case)
    return test_method

def extract_parameters(params):
    extracted_params = {}
    for param in params:
        extracted_params.update(param)
    return extracted_params


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

        # Handling the "Given" step
        if test_case['type'] == 'Given' and test_case['subtype'] == 'Users open the page':
            parameters = {param['type']: param['value']
                          for param in test_case['parameters']}
            open_website(self.driver, parameters.get('URL'))

        # Parse and run test_case_elements.
        for test_case_element in test_case['test_case_elements']:
            action_subtype = test_case_element['subtype']
            parameters = extract_parameters(test_case_element['parameters'])
            action_function = action_mapping.get(action_subtype)

            if action_function:
                action_function(self, self.driver, **parameters)
                


def run_tests(environment, test_case_list, report_file):
    TestCases.environment = environment
    TestCases.test_case_list = test_case_list
    print("TestCases.test_case_list",TestCases.test_case_list)
    for i, test_case in enumerate(test_case_list):
        test_method = create_test_method(test_case)
        setattr(TestCases, f'test_case{i}', test_method)

    test_suite = unittest.TestSuite()
    test_loader = unittest.TestLoader()
    test_suite.addTest(test_loader.loadTestsFromTestCase(TestCases))

    runner = HtmlTestRunner.HTMLTestRunner(
        output=report_file, combine_reports=True)
    test_result = runner.run(test_suite)

    return test_result
