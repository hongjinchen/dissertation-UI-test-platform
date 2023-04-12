from selenium.webdriver.common.action_chains import ActionChains

def drag_and_drop(source_element, target_element):
    action_chains = ActionChains(driver)
    action_chains.move_to_element(source_element).drag_and_drop(source_element, target_element).perform()

def element_moving():
    driver.get("https://jqueryui.com/droppable/")
    driver.switch_to.frame(0)
    drag_and_drop(driver.find_element_by_id("draggable"), driver.find_element_by_id("droppable"))