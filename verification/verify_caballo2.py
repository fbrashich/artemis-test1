from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('http://localhost:8000/atermis-caballo2/index.html')
    time.sleep(1)
    page.screenshot(path='verification/atermis-caballo2-level1.png')

    page.select_option('#level-select', '8')
    time.sleep(0.5)
    page.screenshot(path='verification/atermis-caballo2-level3.png')

    browser.close()
