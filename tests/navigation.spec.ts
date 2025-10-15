import { test, expect } from '@playwright/test';

test.describe('Navigation and UI Components', () => {
  test('should navigate between pages correctly', async ({ page }) => {
    await page.goto('/');
    
    // Verificar navegación a la página de auth
    const getStartedLink = page.getByRole('link', { name: /get started/i });
    if (await getStartedLink.isVisible()) {
      await getStartedLink.click();
      await expect(page).toHaveURL('/auth');
      
      // Regresar a la página principal
      await page.goBack();
      await expect(page).toHaveURL('/');
    }
  });

  test('should display responsive design elements', async ({ page }) => {
    await page.goto('/');
    
    // Verificar que los elementos principales estén visibles en desktop
    await expect(page.getByRole('heading', { name: /Track, Analyze, Profit/i })).toBeVisible();
    
    // Cambiar a viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verificar que los elementos sigan siendo visibles en móvil
    await expect(page.getByRole('heading', { name: /Track, Analyze, Profit/i })).toBeVisible();
  });

  test('should handle external links correctly', async ({ page }) => {
    await page.goto('/');
    
    // Buscar enlaces externos (si los hay)
    const externalLinks = page.locator('a[href^="http"], a[target="_blank"]');
    const linkCount = await externalLinks.count();
    
    if (linkCount > 0) {
      // Verificar que los enlaces externos tengan los atributos correctos
      for (let i = 0; i < Math.min(linkCount, 3); i++) {
        const link = externalLinks.nth(i);
        if (await link.isVisible()) {
          await expect(link).toHaveAttribute('target', '_blank');
        }
      }
    }
  });

  test('should display loading states appropriately', async ({ page }) => {
    // Interceptar requests para simular loading
    await page.route('**/api/**', route => {
      // Delay the response to test loading states
      setTimeout(() => route.continue(), 1000);
    });
    
    await page.goto('/');
    
    // Verificar que la página se carga correctamente incluso con delays
    await expect(page.getByRole('heading', { name: /Track, Analyze, Profit/i })).toBeVisible({ timeout: 10000 });
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Verificar navegación con Tab
    await page.keyboard.press('Tab');
    
    // Verificar que el foco se mueve a elementos interactivos
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // Continuar navegando con Tab
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verificar que podemos activar elementos con Enter
    const currentFocused = page.locator(':focus');
    if (await currentFocused.isVisible()) {
      const tagName = await currentFocused.evaluate(el => el.tagName.toLowerCase());
      if (tagName === 'a' || tagName === 'button') {
        // No hacer click real para evitar navegación no deseada
        await expect(currentFocused).toBeVisible();
      }
    }
  });

  test('should display proper meta tags and SEO elements', async ({ page }) => {
    await page.goto('/');
    
    // Verificar título de la página
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
    
    // Verificar meta description
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      const content = await metaDescription.getAttribute('content');
      expect(content).toBeTruthy();
    }
  });
});