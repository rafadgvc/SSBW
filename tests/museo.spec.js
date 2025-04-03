import { test, expect } from '@playwright/test';

test('Título de la página', async ({ page }) => {
    await page.goto('http://localhost:8000/');
    await expect(page).toHaveTitle(/SSBW/);
});

test('Busco oro', async ({ page }) => {
    await page.goto('http://localhost:8000/obras/buscar?busqueda=oro');
    await expect(page.getByRole('heading', { name: 'Reproducción de diadema' })).toBeVisible();
});

test('Logging jesus', async ({ page }) => {
    await page.goto('http://localhost:8000/usuarios/login');

    await page.fill("#email", "jesusmartinezgarrido@gmail.com");
    await page.fill("#password", "lakinkona");
    await page.click("#login");
    await expect(page.getByRole('heading', { name: 'Próximamente' })).toBeVisible();
});