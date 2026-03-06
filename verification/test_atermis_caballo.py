"""
Script para verificar visualmente el juego de Salto del Caballo (Atermis-Caballo).
"""
import time
from playwright.sync_api import sync_playwright

def test_atermis_caballo():
    """Ejecuta una prueba visual del juego Salto del Caballo."""
    with sync_playwright() as p:
        # Launch browser
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to the local game URL
        page.goto('http://localhost:8000/atermis-caballo/index.html')

        # Wait for the board to render
        page.wait_for_selector('.board .cell')

        # Take initial screenshot
        page.screenshot(path='verification/atermis_caballo_initial.png')

        # Click on an available move
        # Possible moves will have the 'possible' class
        possible_cells = page.locator('.cell.possible')
        if possible_cells.count() > 0:
            # Click the first possible move
            possible_cells.first.click()
            time.sleep(0.5)

            # Take screenshot after one move
            page.screenshot(path='verification/atermis_caballo_move1.png')

            # Click undo
            undo_btn = page.locator('#btn-undo')
            if not undo_btn.is_disabled():
                undo_btn.click()
                time.sleep(0.5)
                # Take screenshot after undo
                page.screenshot(path='verification/atermis_caballo_undo.png')

        # Find a way to lose the game by making bad moves (simulated for screenshot)
        # We'll just take screenshots of the mechanics for now.

        browser.close()
        print("Test de Atermis-Caballo completado. Capturas de pantalla guardadas.")

if __name__ == "__main__":
    test_atermis_caballo()
