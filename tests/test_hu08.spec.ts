import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker'

test.describe.serial("HU08 Massive product Creation", () => {
    const nombreProveedor: string = 'Juan Camilo';
    
    test.beforeEach(async ({ page }) =>{
        const user: string = 'admin@ccp.com';
        const password: string =  'Admin123-';
        await page.goto('http://localhost:4200/');
        await page.screenshot({path: './tests/screenshots/feature_hu07/login/step1.png'})
        await page.locator('[placeholder="Correo electrónico"]').fill(user);
        await page.locator('[placeholder="Contraseña"]').fill(password);
        await page.locator('[placeholder="Contraseña"]').fill(password);
        await page.locator('button', {hasText: 'Ingresar'}).dispatchEvent('click');
        await page.screenshot({path: './tests/screenshots/feature_hu07/login/step2.png'})
        await expect(page.locator('[class="welcome-message"]')).toBeVisible();
        await page.screenshot({path: './tests/screenshots/feature_hu07/login/step3.png'});
        console.log(`----------login successful----------`);

    })

    test('Create required Manufacturer', async ({ page }) => {
        // crear proveedor
        
        const apellido: string = faker.person.lastName();
        const randomNumber: number = faker.number.int({ min: 7, max: 15 });
        const telefono: string = faker.string.numeric(randomNumber);
        const email: string = faker.internet.email();
        await page.locator('div.text-wrapper-2:has-text("Proveedores")').click();
        await page.locator('[formcontrolname="country"]').selectOption({ label: 'Colombia' });
        await page.locator('#name').fill(`${nombreProveedor}`);
        await page.locator('#contact').fill(nombreProveedor);
        await page.locator('#contactLastname').fill(apellido);
        await page.locator('#telephone').fill(telefono);
        await page.locator('#email').fill(email);
        await page.locator('button', {hasText: 'Registrar fabricante'}).dispatchEvent('click');
        const manufacturerAlert = page.locator('div[role="alert"]').first();
        await expect(manufacturerAlert).toBeVisible({ timeout: 5000 });
        const manufacturerAriaLabel = await manufacturerAlert.getAttribute('aria-label');
        expect(manufacturerAriaLabel).toBe('Fabricante registrado exitosamente');
        console.log("----------Manufacturer created successfully----------");
    })

    test('Create one product', async ({ page }) => {
        
        await page.locator('div.text-wrapper-2:has-text("Productos")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu08/creation/step1.png'});
        await page.locator('button', {hasText: 'Registro masivo (Excel)'}).dispatchEvent('click');
        await page.screenshot({path: './tests/screenshots/feature_hu08/creation/step2.png'});
        await page.locator('#fileInput').setInputFiles('./tests/products.xlsx');
        await page.screenshot({path: './tests/screenshots/feature_hu08/creation/step3.png'});
        const productAlert = page.locator('div[role="alert"]').first(); 
        await expect(productAlert).toBeVisible({ timeout: 5000 });
        const productAriaLabel = await productAlert.getAttribute('aria-label');
        expect(productAriaLabel).toBe('Archivo subido con éxito');
        await page.screenshot({ path: './tests/screenshots/feature_hu08/creation/step4.png' });
        console.log("----------Massive products created successfully----------");
    })

    test('Create one product failed', async ({ page }) => {
        
        await page.locator('div.text-wrapper-2:has-text("Productos")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu08/creation/step1.png'});
        await page.locator('button', {hasText: 'Registro masivo (Excel)'}).dispatchEvent('click');
        await page.screenshot({path: './tests/screenshots/feature_hu08/creation/step2.png'});
        await page.locator('#fileInput').setInputFiles('./tests/products_wrong.xlsx');
        await page.screenshot({path: './tests/screenshots/feature_hu08/creation/step3.png'});
        const productAlert = page.locator('div[role="alert"]').first(); 
        await expect(productAlert).toBeVisible({ timeout: 5000 });
        const productAriaLabel = await productAlert.getAttribute('aria-label');
        expect(productAriaLabel).toBe('Ocurrió un error inesperado. Por favor intenta de nuevo.');
        await page.screenshot({ path: './tests/screenshots/feature_hu08/creation/step4.png' });
        console.log("----------Massive products failed successfully----------");
    })

})