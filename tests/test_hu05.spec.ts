import { test, expect, selectors } from '@playwright/test';
import { faker } from '@faker-js/faker'

test.describe.serial("HU05 Sale plan creation", () => {

    test.beforeEach(async ({ page }) =>{
        const user: string = 'admin@ccp.com';
        const password: string =  'Admin123-';
        await page.goto('http://localhost:4200/');
        await page.screenshot({path: './tests/screenshots/feature_hu05/login/step1.png'})
        await page.locator('[placeholder="Correo electrónico"]').fill(user);
        await page.locator('[placeholder="Contraseña"]').fill(password);
        await page.locator('[placeholder="Contraseña"]').fill(password);
        await page.locator('button', {hasText: 'Ingresar'}).dispatchEvent('click');
        await page.screenshot({path: './tests/screenshots/feature_hu05/login/step2.png'})
        await expect(page.locator('[class="welcome-message"]')).toBeVisible();
        await page.screenshot({path: './tests/screenshots/feature_hu05/login/step3.png'});
        console.log(`----------login successful----------`);
    })

    test('Sale plan creation ', async ({ page }) => {
        const sellerName: string = 'Seller five';
        const product_one : string = 'Productó aaa';
        const product_two : string = 'Productó bbb';
        const product_one_quantity: string = faker.string.numeric(2);
        const product_two_quantity: string = faker.string.numeric(2);
        await page.locator('div.text-wrapper-2:has-text("Metas")').click();
        await page.locator('[formcontrolname="vendedor"]').selectOption({ label: `${sellerName}` });
        await page.locator('[formcontrolname="product_barcode"]').selectOption({ label: `${product_one}` });
        await page.locator('[formcontrolname="quantity"]').fill(product_one_quantity);
        await page.screenshot({path: './tests/screenshots/feature_hu05/sale_plan_creation/step1.png'})
        await page.locator('.add-button').click()
        await page.screenshot({path: './tests/screenshots/feature_hu05/sale_plan_creation/step2.png'})
        await page.locator('[formcontrolname="product_barcode"]').last().selectOption({ label: `${product_two}` });
        await page.locator('[formcontrolname="quantity"]').last().fill(product_two_quantity)
        await page.screenshot({path: './tests/screenshots/feature_hu05/sale_plan_creation/step3.png'})
        await page.locator('.submit-button').click()
        await page.waitForTimeout(1000);
        await page.screenshot({path: './tests/screenshots/feature_hu05/sale_plan_creation/step4.png'})
        const salePlanAlert = page.locator('div[role="alert"]').first();
        await expect(salePlanAlert).toBeVisible({ timeout: 5000 });
        const salePlanAriaLabel = await salePlanAlert.getAttribute('aria-label');
        expect(salePlanAriaLabel).toBe('Plan de metas creado exitosamente');
        console.log("----------sale plan created successfully----------");
    })

})