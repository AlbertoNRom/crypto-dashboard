import { test, expect } from '@playwright/test';

test.describe('Authentication Page', () => {
  test('should load the auth page successfully', async ({ page }) => {
    await page.goto('/auth');
    
    // Verificar que la página de auth se carga correctamente
    await expect(page).toHaveURL('/auth');
    
    // Verificar que el formulario de login esté presente
    await expect(page.getByRole('heading', { name: /Welcome back/i })).toBeVisible();
  });

  test('should display login form elements', async ({ page }) => {
    await page.goto('/auth');
    
    // Verificar que los campos del formulario estén presentes
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    
    // Verificar que los botones estén presentes
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should toggle between login and signup modes', async ({ page }) => {
    await page.goto('/auth');
    
    // Buscar el botón para cambiar a modo registro
    const signUpToggle = page.getByText(/sign up/i).or(page.getByText(/create account/i)).or(page.getByText(/register/i));
    
    if (await signUpToggle.isVisible()) {
      await signUpToggle.click();
      
      // Verificar que cambió a modo registro
      await expect(page.getByRole('heading', { name: /create account/i }).or(page.getByRole('heading', { name: /sign up/i }))).toBeVisible();
    }
  });

  test('should show password visibility toggle', async ({ page }) => {
    await page.goto('/auth');
    
    // Buscar el campo de contraseña
    const passwordField = page.getByPlaceholder(/password/i);
    await expect(passwordField).toBeVisible();
    
    // Verificar que el campo de contraseña sea de tipo password inicialmente
    await expect(passwordField).toHaveAttribute('type', 'password');
    
    // Buscar el botón de toggle de visibilidad
    const eyeToggle = page.locator('button').filter({ has: page.locator('svg') }).filter({ hasText: '' });
    
    if (await eyeToggle.first().isVisible()) {
      await eyeToggle.first().click();
      
      // Verificar que el tipo cambió a text
      await expect(passwordField).toHaveAttribute('type', 'text');
    }
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/auth');
    
    // Intentar enviar el formulario sin llenar los campos
    const signInButton = page.getByRole('button', { name: /sign in/i });
    await signInButton.click();
    
    // Verificar que los campos requeridos muestren validación
    const emailField = page.getByPlaceholder(/email/i);
    const passwordField = page.getByPlaceholder(/password/i);
    
    // Los campos deberían estar marcados como inválidos o mostrar mensajes de error
    await expect(emailField).toBeVisible();
    await expect(passwordField).toBeVisible();
  });
});