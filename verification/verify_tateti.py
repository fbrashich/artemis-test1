from playwright.sync_api import Page, expect, sync_playwright

def verify_tateti(page: Page):
    """
    Verifica que el juego Ta-Te-Ti se cargue correctamente, que se pueda jugar
    y que los estilos vibrantes se apliquen visualmente.
    """
    # 1. Cargar la página
    page.goto("http://localhost:8000/tateti/index.html")

    # 2. Verificar el título y la pantalla de selección de modo
    expect(page).to_have_title("Ta-Te-Ti Vibrante")
    expect(page.locator("h1.title")).to_be_visible()
    expect(page.locator("#mode-selection")).to_be_visible()
    expect(page.locator("#game-board-container")).to_be_hidden()

    # Tomar captura de pantalla de la selección de modo
    page.screenshot(path="verification/tateti_modo.png")

    # 3. Seleccionar modo Player vs Player
    page.locator("#btn-pvp").click()

    # Verificar que el tablero ahora es visible y la selección está oculta
    expect(page.locator("#mode-selection")).to_be_hidden()
    expect(page.locator("#game-board-container")).to_be_visible()
    expect(page.locator("#status")).to_contain_text("Turno de X")

    # 4. Realizar algunas jugadas simuladas
    cells = page.locator(".cell")

    # Jugador X juega en el centro (índice 4)
    cells.nth(4).click()
    expect(cells.nth(4)).to_have_text("X")
    expect(page.locator("#status")).to_contain_text("Turno de O")

    # Jugador O juega en la esquina superior izquierda (índice 0)
    cells.nth(0).click()
    expect(cells.nth(0)).to_have_text("O")

    # Jugador X juega en la esquina superior derecha (índice 2)
    cells.nth(2).click()
    expect(cells.nth(2)).to_have_text("X")

    # 5. Tomar captura de pantalla del estado intermedio del juego
    page.screenshot(path="verification/tateti_juego.png")

    # 6. Terminar el juego (X gana)
    cells.nth(1).click() # O
    cells.nth(6).click() # X

    # Verificar victoria de X (4, 2, 6 -> diagonal no, vamos a hacer que X gane en otra linea)
    # Mejor resetear y hacer una victoria clara
    page.locator("#reset-btn").click()
    expect(page.locator("#status")).to_contain_text("Turno de X")

    # X gana en la fila superior
    cells.nth(0).click() # X
    cells.nth(3).click() # O
    cells.nth(1).click() # X
    cells.nth(4).click() # O
    cells.nth(2).click() # X gana

    expect(page.locator("#status")).to_contain_text("ha ganado!")

    # Tomar captura de pantalla de la victoria en pvp
    page.screenshot(path="verification/tateti_victoria.png")

    # 7. Verificar modo Player vs Bot
    page.locator("#change-mode-btn").click()
    expect(page.locator("#mode-selection")).to_be_visible()
    page.locator("#btn-pvb").click()

    expect(page.locator("#game-board-container")).to_be_visible()
    expect(page.locator("#status")).to_contain_text("Turno de X")

    # X juega
    cells.nth(0).click()
    # Esperamos que el bot juegue (como O)
    expect(page.locator(".cell.o").first).to_be_visible()

    # Capturar la pantalla del juego contra bot
    page.screenshot(path="verification/tateti_bot_juego.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_tateti(page)
        finally:
            browser.close()
