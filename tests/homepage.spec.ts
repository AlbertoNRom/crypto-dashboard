import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que el título de la página sea correcto
    await expect(page).toHaveTitle(/Crypto Dashboard/);
    
    // Verificar que el heading principal esté presente
    await expect(page.getByRole('heading', { name: /Track, Analyze, Profit/i })).toBeVisible();
  });

  test('should display the new feature badge', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que el badge "New Integration" esté presente
    const badge = page.locator('text=New Integration');
    await expect(badge).toBeVisible();
    
    // Verificar que el badge tenga el estilo correcto (fondo negro en modo claro)
    const badgeElement = page.locator('[class*="bg-black"]').filter({ hasText: 'New Integration' });
    await expect(badgeElement).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que el botón "Get Started" esté presente y sea clickeable
    const getStartedButton = page.getByRole('link', { name: /Get Started/i });
    await expect(getStartedButton).toBeVisible();
    await expect(getStartedButton).toHaveAttribute('href', '/auth');
  });

  test('should display feature cards', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que las tarjetas de características estén presentes
    await expect(page.getByText('Real-time Market Data')).toBeVisible();
    await expect(page.getByText('Portfolio Tracking')).toBeVisible();
    await expect(page.getByText('Advanced Analytics')).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');
    
    // Buscar el botón de toggle de tema (puede estar en la navbar)
    const themeToggle = page.locator('[data-testid="theme-toggle"], button[aria-label*="theme"], button[aria-label*="dark"]').first();
    
    if (await themeToggle.isVisible()) {
      // Hacer click en el toggle
      await themeToggle.click();
      
      // Verificar que el tema cambió (el html debería tener la clase 'dark')
      const htmlElement = page.locator('html');
      await expect(htmlElement).toHaveClass(/dark/);
    }
  });
});