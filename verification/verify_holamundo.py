from playwright.sync_api import sync_playwright

def verify_hello_world():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto("http://localhost:8000/holamundo.html")

        # Verify content
        content = page.content()
        print(f"Content: {content}")

        # Take screenshot
        page.screenshot(path="verification/holamundo.png")
        browser.close()

if __name__ == "__main__":
    verify_hello_world()
