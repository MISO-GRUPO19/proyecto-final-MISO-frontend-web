import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker'
import { request } from 'http';
import { min } from 'rxjs';

test.describe.serial("HU10 Delivery route creation", () => {
    const randomNumber: number = faker.number.int({ min: 6, max: 20 });
    const id: string = faker.string.numeric(randomNumber);
    const nombre: string = faker.person.firstName();
    test.beforeEach(async ({ page }) =>{
        const user: string = 'admin@ccp.com';
        const password: string =  'Admin123-';
        await page.goto('http://localhost:4200/');
        await page.screenshot({path: './tests/screenshots/feature_hu10/login/step1.png'})
        await page.locator('[placeholder="Correo electrónico"]').fill(user);
        await page.locator('[placeholder="Contraseña"]').fill(password);
        await page.locator('[placeholder="Contraseña"]').fill(password);
        await page.locator('button', {hasText: 'Ingresar'}).dispatchEvent('click');
        await page.screenshot({path: './tests/screenshots/feature_hu10/login/step2.png'})
        await expect(page.locator('[class="welcome-message"]')).toBeVisible();
        await page.screenshot({path: './tests/screenshots/feature_hu10/login/step3.png'});
        console.log(`----------login successful----------`);
    })

    test('Create Seller', async ({ page }) => {
        const routeDate = `2025-05-17`;
        await page.locator('div.text-wrapper-2:has-text("Rutas")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu10/routeCreation/step1.png'});
        await page.locator('#date').fill(`${routeDate}`);
        await page.screenshot({path: './tests/screenshots/feature_hu10/routeCreation/step2.png'});
        await page.locator('[type="submit"]').click();
        const alert = page.locator('div[role="alert"]');
        await page.screenshot({path: './tests/screenshots/feature_hu10/routeCreation/step3.png'});
        await expect(alert).toBeVisible({ timeout: 5000 });
        const ariaLabel = await alert.getAttribute('aria-label');
        expect(ariaLabel).toBe('Ruta generada exitosamente');
        await page.screenshot({path: './tests/screenshots/feature_hu10/routeCreation/step4.png'});
        console.log("Route generated successfully");
    })
    
})