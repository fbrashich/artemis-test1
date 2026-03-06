from playwright.sync_api import sync_playwright, expect

def verify_difficulty_selection():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the local server
        page.goto("http://localhost:8000/tateti/index.html")

        # Take initial screenshot of main menu
        page.screenshot(path="verification/step1_main_menu.png")

        # Click "Player vs. Bot"
        btn_pvb = page.locator("#btn-pvb")
        btn_pvb.click()

        # Verify difficulty selection is visible
        diff_selection = page.locator("#difficulty-selection")
        expect(diff_selection).to_be_visible()

        # Take screenshot of difficulty selection
        page.screenshot(path="verification/step2_difficulty_menu.png")

        # Click "Difícil"
        btn_diff_high = page.locator("#btn-diff-high")
        btn_diff_high.click()

        # Verify game board is visible
        board_container = page.locator("#game-board-container")
        expect(board_container).to_be_visible()

        # Take screenshot of game board
        page.screenshot(path="verification/step3_game_board.png")

        browser.close()

if __name__ == "__main__":
    verify_difficulty_selection()