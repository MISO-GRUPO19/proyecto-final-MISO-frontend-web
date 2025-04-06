
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker'

test.describe.serial("HU01 Manufacturer Creation", () => {
    test.beforeEach(async ({ page }) =>{
        const user: string = 'admin@ccp.com';
        const password: string =  'Admin123-';
        await page.goto('http://localhost:4200/');
        await page.screenshot({path: './tests/screenshots/feature_hu01/login/step1.png'})
        await page.locator('[placeholder="Correo electrónico"]').fill(user);
        await page.locator('[placeholder="Contraseña"]').fill(password);
        await page.locator('[placeholder="Contraseña"]').fill(password);
        await page.locator('button', {hasText: 'Ingresar'}).dispatchEvent('click');
        await page.screenshot({path: './tests/screenshots/feature_hu01/login/step2.png'})
        await expect(page.locator('[class="welcome-message"]')).toBeVisible();
        await page.screenshot({path: './tests/screenshots/feature_hu01/login/step3.png'});
        console.log(`----------login successful----------`);
    })
 
    test('Create a manufacturer successfully', async ({ page }) => {
        const nombre: string = faker.person.firstName();
        const apellido: string = faker.person.lastName();
        const randomNumber: number = faker.number.int({ min: 7, max: 15 });
        const telefono: string = faker.string.numeric(randomNumber);
        const email: string = faker.internet.email();
        await page.locator('div.text-wrapper-2:has-text("Proveedores")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu01/creation/step1.png'});
        await page.locator('[formcontrolname="country"]').selectOption({ label: 'Colombia' });
        await page.screenshot({path: './tests/screenshots/feature_hu01/creation/step2.png'});
        await page.locator('#name').fill(`${nombre} ${apellido}`);
        await page.locator('#contact').fill(nombre);
        await page.locator('#contactLastname').fill(apellido);
        await page.screenshot({path: './tests/screenshots/feature_hu01/creation/step3.png'});
        await page.locator('#telephone').fill(telefono);
        await page.locator('#email').fill(email);
        await page.screenshot({path: './tests/screenshots/feature_hu01/creation/step4.png'});
        await page.locator('button', {hasText: 'Registrar fabricante'}).dispatchEvent('click');
        const alert = page.locator('div[role="alert"]');
        await expect(alert).toBeVisible({ timeout: 5000 });
        const ariaLabel = await alert.getAttribute('aria-label');
        expect(ariaLabel).toBe('Fabricante registrado exitosamente');
        await page.screenshot({ path: './tests/screenshots/feature_hu01/creation/step5.png' });
        console.log("----------Manufacturer created successfully----------");
    })
 
    test('Invalid name', async ({ page }) => {
        const nombre: string = faker.person.firstName();
        const specialCharsPool = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
        const specialChars: string = Array.from({ length: 10 }, () =>
        specialCharsPool.charAt(Math.floor(Math.random() * specialCharsPool.length))
        ).join('');
        const apellido: string = faker.person.lastName();
        const randomNumber: number = faker.number.int({ min: 7, max: 15 });
        const telefono: string = faker.string.numeric(randomNumber);
        const email: string = faker.internet.email();
        await page.locator('div.text-wrapper-2:has-text("Proveedores")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_name/step1.png'});
        await page.locator('[formcontrolname="country"]').selectOption({ label: 'Colombia' });
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_name/step2.png'});
        await page.locator('#name').fill(`${specialChars}`);
        await page.locator('#contact').fill(nombre);
        await page.locator('#contactLastname').fill(apellido);
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_name/step3.png'});
        await page.locator('#telephone').fill(telefono);
        await page.locator('#email').fill(email);
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_name/step4.png'});
        await page.locator('button', {hasText: 'Registrar fabricante'}).dispatchEvent('click');
        const alert = page.locator('div[role="alert"]');
        await expect(alert).toBeVisible({ timeout: 5000 });
        const ariaLabel = await alert.getAttribute('aria-label');
        expect(ariaLabel).toBe("Invalid name value, it should have at least 3 characters and maximun 100. Accepts letters, digits, '-', '.' and spaces.");
        await page.screenshot({ path: './tests/screenshots/feature_hu01/inv_name/step5.png' });
        console.log("----------Manufacturer invalid name successfully----------");
    })
    
    test('Invalid Contact person', async ({ page }) => {
        const nombre: string = faker.person.firstName();
        const specialCharsPool = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
        const specialChars: string = Array.from({ length: 10 }, () =>
        specialCharsPool.charAt(Math.floor(Math.random() * specialCharsPool.length))
        ).join('');
        const apellido: string = faker.person.lastName();
        const randomNumber: number = faker.number.int({ min: 7, max: 15 });
        const telefono: string = faker.string.numeric(randomNumber);
        const email: string = faker.internet.email();
        await page.locator('div.text-wrapper-2:has-text("Proveedores")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_contact/step1.png'});
        await page.locator('[formcontrolname="country"]').selectOption({ label: 'Colombia' });
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_contact/step2.png'});
        await page.locator('#name').fill(`${nombre} ${apellido}`);
        await page.locator('#contact').fill(specialChars);
        await page.locator('#contactLastname').fill(specialChars);
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_contact/step3.png'});
        await page.locator('#telephone').fill(telefono);
        await page.locator('#email').fill(email);
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_contact/step4.png'});
        await page.locator('button', {hasText: 'Registrar fabricante'}).dispatchEvent('click');
        const alert = page.locator('div[role="alert"]');
        await expect(alert).toBeVisible({ timeout: 5000 });
        const ariaLabel = await alert.getAttribute('aria-label');
        expect(ariaLabel).toBe("Invalid contact value, it should have at least 3 characters and maximun 100. Accepts letters and spaces.");
        await page.screenshot({ path: './tests/screenshots/feature_hu01/inv_contact/step5.png' });
        console.log("----------Manufacturer invalid contact person successfully----------");
    })
 
    test('Invalid phone number', async ({ page }) => {
        const nombre: string = faker.person.firstName();
        const apellido: string = faker.person.lastName();
        const randomNumber: number = faker.number.int({ min: 7, max: 15 });
        const telefono: string = faker.phone.number();
        const email: string = faker.internet.email();
        await page.locator('div.text-wrapper-2:has-text("Proveedores")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_phone/step1.png'});
        await page.locator('[formcontrolname="country"]').selectOption({ label: 'Colombia' });
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_phone/step2.png'});
        await page.locator('#name').fill(`${nombre} ${apellido}`);
        await page.locator('#contact').fill(nombre);
        await page.locator('#contactLastname').fill(apellido);
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_phone/step3.png'});
        await page.locator('#telephone').fill(telefono);
        await page.locator('#email').fill(email);
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_phone/step4.png'});
        await page.locator('button', {hasText: 'Registrar fabricante'}).dispatchEvent('click');
        const alert = page.locator('div[role="alert"]');
        await expect(alert).toBeVisible({ timeout: 5000 });
        const ariaLabel = await alert.getAttribute('aria-label');
        expect(ariaLabel).toBe('Invalid telephone, it should have at least 7 digits and 15 maximum. Digits only.');
        await page.screenshot({ path: './tests/screenshots/feature_hu01/inv_phone/step5.png' });
        console.log("----------Manufacturer invalid telephone successfully----------");
    })
 
    test('Invalid email', async ({ page }) => {
        const nombre: string = faker.person.firstName();
        const apellido: string = faker.person.lastName();
        const randomNumber: number = faker.number.int({ min: 7, max: 15 });
        const telefono: string = faker.string.numeric(randomNumber);
        const email: string = faker.internet.email();
        await page.locator('div.text-wrapper-2:has-text("Proveedores")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_email/step1.png'});
        await page.locator('[formcontrolname="country"]').selectOption({ label: 'Colombia' });
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_email/step2.png'});
        await page.locator('#name').fill(`${nombre} ${apellido}`);
        await page.locator('#contact').fill(nombre);
        await page.locator('#contactLastname').fill(apellido);
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_email/step3.png'});
        await page.locator('#telephone').fill(telefono);
        await page.locator('#email').fill(`${nombre}`);
        await page.screenshot({path: './tests/screenshots/feature_hu01/inv_email/step4.png'});
        await page.locator('button', {hasText: 'Registrar fabricante'}).dispatchEvent('click');
        const alert = page.locator('div[role="alert"]');
        await expect(alert).toBeVisible({ timeout: 5000 });
        const ariaLabel = await alert.getAttribute('aria-label');
        expect(ariaLabel).toBe('Formulario inválido');
        await page.screenshot({ path: './tests/screenshots/feature_hu01/inv_email/step5.png' });
        console.log("----------Manufacturer invalid email successfully----------");
    })
})

