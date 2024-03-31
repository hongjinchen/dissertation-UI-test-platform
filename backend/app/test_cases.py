from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager
from webdriver_manager.microsoft import EdgeChromiumDriverManager
# 因为为了适应不同的服务器下的不同浏览器，所以需要在这里进行修改，增加webdriver_manager去管理浏览器驱动的版本

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

# Catch and handle exceptions for all functions or methods and include exception screenshot functionality
def exception_handler_decorator(func):
    def wrapper(self, driver, *args, **kwargs):
        try:
            return func(self, driver, *args, **kwargs)
        except NoSuchElementException as e:
            screenshot_filename = f"{func.__name__}_screenshot.png"
        except Exception as e: 
            screenshot_filename = f"{func.__name__}_screenshot.png"
            driver.save_screenshot(screenshot_filename)
            logging.error(
                f"Error occurred in function {func.__name__}. Screenshot saved as {screenshot_filename}: {str(e)}")
            raise
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


# Define the functions corresponding to the type of the different modules

# Given
@exception_handler_decorator
def open_website(driver, url):
    driver.get(url)

@exception_handler_decorator
def set_cookie(driver, name, value):
    cookie_dict = {'name': name, 'value': value}
    driver.add_cookie(cookie_dict)



# When
@exception_handler_decorator
def click_button(self, driver, locator_type, locator_value):
    element = driver.find_element(
        getattr(By, locator_type.upper()), locator_value)
    element.click()

@exception_handler_decorator
def user_waits(self, driver, seconds):
    time_to_wait = float(seconds) 

    time.sleep(time_to_wait)
    
@exception_handler_decorator
def enter_text(self, driver, locator_type, locator_value, text):
    element = driver.find_element(
        getattr(By, locator_type.upper()), locator_value)
    element.send_keys(text)
    
@exception_handler_decorator
def scroll_page(driver, direction='to', x_offset=None, y_offset=None, element=None):
    """
    在Selenium中执行页面滚动操作。
    
    :param driver: WebDriver实例。
    :param direction: 滚动的方向或目标（'up', 'down', 'left', 'right', 'to', 'toTop', 'toBottom'）。
    :param x_offset: 水平方向上滚动的像素数（仅在direction为'to'时使用）。
    :param y_offset: 垂直方向上滚动的像素数。
    :param element: 要滚动到的元素（可选，仅在direction为'to'时使用）。
    """
    if direction == 'toTop':
        driver.execute_script("window.scrollTo(0, 0)")
    elif direction == 'toBottom':
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight)")
    elif direction == 'to' and element is not None:
        driver.execute_script("arguments[0].scrollIntoView();", element)
    elif direction in ['up', 'down', 'left', 'right']:
        horizontal, vertical = 0, 0
        if direction == 'up':
            vertical = -abs(y_offset)
        elif direction == 'down':
            vertical = abs(y_offset)
        elif direction == 'left':
            horizontal = -abs(x_offset)
        elif direction == 'right':
            horizontal = abs(x_offset)
        driver.execute_script(f"window.scrollBy({horizontal}, {vertical})")
    elif direction == 'to':
        driver.execute_script(f"window.scrollTo({x_offset}, {y_offset})")

@exception_handler_decorator
def drag_element(driver, element, target=None, direction=None, distance=0, offset=None):
    """
    在Selenium中拖拽元素到指定目标或方向。
    
    :param driver: WebDriver实例
    :param element: 要拖拽的元素
    :param target: 目标元素（仅当执行拖拽到另一个元素时使用）
    :param direction: 拖拽方向（'up', 'down', 'left', 'right'）
    :param distance: 拖拽距离（像素值）
    :param offset: 方向性拖拽的偏移量，形式为(x, y)元组（仅当执行按偏移量拖拽时使用）
    """
    action_chains = ActionChains(driver)
    
    if target is not None:
        # 拖拽到另一个元素
        action_chains.drag_and_drop(element, target).perform()
    elif offset is not None:
        # 按指定的(x, y)偏移量拖拽元素
        action_chains.drag_and_drop_by_offset(element, offset[0], offset[1]).perform()
    elif direction and distance > 0:
        # 根据方向和距离进行拖拽
        x_offset, y_offset = 0, 0
        if direction == 'up':
            y_offset = -distance
        elif direction == 'down':
            y_offset = distance
        elif direction == 'left':
            x_offset = -distance
        elif direction == 'right':
            x_offset = distance
        action_chains.click_and_hold(element).move_by_offset(x_offset, y_offset).release().perform()
    else:
        print("Invalid parameters for drag operation.")
        
@exception_handler_decorator
# Moving to an element: some elements on a page are only displayed when the mouse is moved over them.
def move_to_element(self, driver, locator_type, locator_value):
    element = driver.find_element(
        getattr(By, locator_type.upper()), locator_value)
    ActionChains(driver).move_to_element(element).perform()


@exception_handler_decorator
# Mouse Actions: Selenium also supports the simulation of right-click, double-click, drag-and-drop and other mouse actions.
def right_click(self, driver, locator_type, locator_value):
    element = driver.find_element(
        getattr(By, locator_type.upper()), locator_value)
    ActionChains(driver).context_click(element).perform()


@exception_handler_decorator
def double_click(self, driver, locator_type, locator_value):
    element = driver.find_element(
        getattr(By, locator_type.upper()), locator_value)
    ActionChains(driver).double_click(element).perform()


@exception_handler_decorator
def drag_and_drop(self, driver, source_locator_type, source_locator_value, target_locator_type, target_locator_value):
    source_element = driver.find_element(
        getattr(By, source_locator_type.upper()), source_locator_value)
    target_element = driver.find_element(
        getattr(By, target_locator_type.upper()), target_locator_value)
    ActionChains(driver).drag_and_drop(
        source_element, target_element).perform()

# refreshes
@exception_handler_decorator
def refresh_page(self, driver, locator_type=None, locator_value=None, **parameters):
    driver.refresh()

# Handling Warning Dialog
@exception_handler_decorator
def accept_alert(self, driver):
    alert = driver.switch_to.alert
    alert.accept()


@exception_handler_decorator
def dismiss_alert(self, driver):
    alert = driver.switch_to.alert
    alert.dismiss()


@exception_handler_decorator
# Switching to a new window or tab
def switch_to_window(self, driver, window_handle):
    driver.switch_to.window(window_handle)

# Then
def check_url_change(self, driver, expected_url):
    WebDriverWait(driver, 10).until(EC.url_to_be(expected_url))
    self.assertEqual(driver.current_url, expected_url)

def check_element_text(self, driver,  expected_text):
    page_source = driver.page_source
    self.assertIn(expected_text, page_source)

@exception_handler_decorator
def check_element_exists(self, driver, locator_type, locator_value):
    try:
        driver.find_element(getattr(By, locator_type.upper()), locator_value)
    except NoSuchElementException:
        self.fail("Expected element does not exist.")


@exception_handler_decorator
def check_element_visible(self, driver, locator_type, locator_value):
    element = driver.find_element(
        getattr(By, locator_type.upper()), locator_value)
    self.assertTrue(element.is_displayed())

@exception_handler_decorator
def check_element_selected(self, driver, locator_type, locator_value):
    element = driver.find_element(
        getattr(By, locator_type.upper()), locator_value)
    self.assertTrue(element.is_selected())

@exception_handler_decorator
def check_element_style(self, driver, locator_type, locator_value, style_name, expected_value):
    element = driver.find_element(
        getattr(By, locator_type.upper()), locator_value)
    self.assertEqual(element.value_of_css_property(style_name), expected_value)

@exception_handler_decorator
def check_alert_present(self, driver):
    try:
        alert = driver.switch_to.alert
        self.assertIsNotNone(alert.text)
    except NoAlertPresentException:
        self.fail("Expected alert does not exist.")


action_mapping = {
    "Given": open_website,
    "Set Cookie": set_cookie,
    "User click the button": click_button,
    "User input data": enter_text,
    "User refreshes the page": refresh_page,
    "User moves to element": move_to_element,
    "User right clicks": right_click,
    "User double clicks": double_click,
    "Check element exists": check_element_exists,
    "Check element visible": check_element_visible,
    "Check element selected": check_element_selected,
    "Check text exists": check_element_text,
    "The user is now on this page": check_url_change,
    "User waits": user_waits,
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
        elif test_case['subtype'] == 'Set Cookie':
            cookie_name = test_case['parameters'][0]['value']
            cookie_value = test_case['parameters'][1]['value']
            set_cookie(self.driver, cookie_name, cookie_value)
            
        # Parse and run test_case_elements.
        for test_case_element in test_case['test_case_elements']:
            action_subtype = test_case_element['subtype']
            parameters = {(param['type'] if param['type'] else 'empty'): param['value']
                          for param in test_case_element['parameters']}
            action_function = action_mapping.get(action_subtype)
            if action_function:
                if action_subtype == "User input data":
                    param_dict = test_case_element['parameters'][0]
                    locator_type, locator_value = construct_locator(
                            parameters)
                    text_value = param_dict.get('textValue')
                    action_function(self, self.driver,
                                    locator_type, locator_value, text_value)

                elif action_subtype == "The user is now on this page" or action_subtype == "Check text exists" or action_subtype == "User waits":
                    expected_url = parameters.get('empty')
                    action_function(self, self.driver, expected_url)

                else:
                    if any(key in parameters for key in ['ID', 'Name', 'Class Name']):
                        locator_type, locator_value = construct_locator(
                            parameters)
                        # Remove the used keys from parameters
                        for key in ['ID', 'Name', 'Class Name']:
                            if key in parameters:
                                del parameters[key]
                        print("action_subtype",action_subtype)
                        action_function(
                            self, self.driver, locator_type, locator_value, **parameters)
                    else:
                        action_function(self, self.driver, **parameters)


def run_tests(environment, test_case_list, report_file):
    TestCases.environment = environment
    TestCases.test_case_list = test_case_list

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
