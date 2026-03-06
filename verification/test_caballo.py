import time
from playwright.sync_api import sync_playwright

def verify_caballo_game():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Cargar el juego
        page.goto("http://localhost:8000/artemis-test1/caballo/index.html")
        time.sleep(1) # Esperar a que renderice

        # Tomar captura inicial
        page.screenshot(path="verification/caballo_inicio.png")

        # Hacer clic en la celda (4,4) para empezar
        page.click("div.cell[data-row='4'][data-col='4']")
        time.sleep(0.5)

        # Tomar captura tras el primer clic (debería mostrar movimientos posibles)
        page.screenshot(path="verification/caballo_primer_clic.png")

        # Hacer clic en una celda válida (2,3)
        page.click("div.cell[data-row='2'][data-col='3']")
        time.sleep(0.5)

        # Tomar captura tras el segundo clic
        page.screenshot(path="verification/caballo_segundo_clic.png")

        # Deshacer el movimiento
        page.click("button#btn-undo")
        time.sleep(0.5)

        # Tomar captura tras deshacer (debería volver al estado del primer clic)
        page.screenshot(path="verification/caballo_deshacer.png")

        browser.close()
        print("Verificación de capturas de pantalla completada.")

if __name__ == "__main__":
    verify_caballo_game()
