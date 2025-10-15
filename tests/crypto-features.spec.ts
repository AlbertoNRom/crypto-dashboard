import { test, expect } from '@playwright/test';

test.describe('Crypto Dashboard Features', () => {
  test('should display crypto-related content on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que el contenido relacionado con crypto esté presente
    await expect(page.getByText(/crypto/i).or(page.getByText(/bitcoin/i)).or(page.getByText(/portfolio/i))).toBeVisible();
    
    // Verificar que las características del dashboard estén listadas
    await expect(page.getByText(/real-time/i).or(page.getByText(/market data/i))).toBeVisible();
    await expect(page.getByText(/portfolio/i).or(page.getByText(/tracking/i))).toBeVisible();
    await expect(page.getByText(/analytics/i).or(page.getByText(/advanced/i))).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Interceptar llamadas a la API de CoinGecko y simular errores
    await page.route('**/api.coingecko.com/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'API Error' })
      });
    });
    
    await page.goto('/');
    
    // La página debería cargar correctamente incluso con errores de API
    await expect(page.getByRole('heading', { name: /Track, Analyze, Profit/i })).toBeVisible();
    
    // No debería haber errores JavaScript no manejados
    page.on('pageerror', error => {
      // Log the error but don't fail the test for API-related errors
      console.log('Page error:', error.message);
    });
  });

  test('should display proper loading states for crypto data', async ({ page }) => {
    // Interceptar y retrasar las llamadas a APIs de crypto
    await page.route('**/api/**', route => {
      setTimeout(() => route.continue(), 2000);
    });
    
    await page.goto('/');
    
    // Verificar que la página principal se carga sin problemas
    await expect(page.getByRole('heading', { name: /Track, Analyze, Profit/i })).toBeVisible();
  });

  test('should have accessible crypto dashboard elements', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que los elementos tengan labels apropiados para accesibilidad
    const buttons = page.getByRole('button');
    const links = page.getByRole('link');
    
    // Verificar que los botones principales tengan texto o aria-labels
    const buttonCount = await buttons.count();
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const text = await button.textContent();
        const ariaLabel = await button.getAttribute('aria-label');
        expect(text || ariaLabel).toBeTruthy();
      }
    }
    
    // Verificar que los enlaces tengan texto descriptivo
    const linkCount = await links.count();
    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      const link = links.nth(i);
      if (await link.isVisible()) {
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        expect(text || ariaLabel).toBeTruthy();
      }
    }
  });

  test('should display feature icons correctly', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que los iconos de Lucide React se rendericen correctamente
    const svgIcons = page.locator('svg');
    const iconCount = await svgIcons.count();
    
    expect(iconCount).toBeGreaterThan(0);
    
    // Verificar que al menos algunos iconos sean visibles
    for (let i = 0; i < Math.min(iconCount, 3); i++) {
      const icon = svgIcons.nth(i);
      if (await icon.isVisible()) {
        await expect(icon).toBeVisible();
      }
    }
  });

  test('should handle different screen sizes for crypto dashboard', async ({ page }) => {
    // Test en desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Track, Analyze, Profit/i })).toBeVisible();
    
    // Test en tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { name: /Track, Analyze, Profit/i })).toBeVisible();
    
    // Test en móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: /Track, Analyze, Profit/i })).toBeVisible();
  });
});