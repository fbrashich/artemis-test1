const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:8000/atermis-caballo2/index.html');

  // Wait a bit to ensure it loads completely
  await page.waitForTimeout(1000);

  // Capture the initial state
  await page.screenshot({ path: 'verification/atermis-caballo2-level1.png' });

  // Change level to 8x8
  await page.selectOption('#level-select', '8');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'verification/atermis-caballo2-level3.png' });

  await browser.close();
})();
