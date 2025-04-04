import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker'

test.describe.serial("HU03 Seller Creation", () => {
    test.beforeEach(async ({ page }) =>{
        const user: string = 'admin@ccp.com';
        const password: string =  'Admin123-';
        await page.goto('http://localhost:4200/');
        await page.screenshot({path: './tests/screenshots/feature_hu03/login/step1.png'})
        await page.locator('[placeholder="Correo electrónico"]').fill(user);
        await page.locator('[placeholder="Contraseña"]').fill(password);
        await page.locator('[placeholder="Contraseña"]').fill(password);
        await page.locator('button', {hasText: 'Ingresar'}).dispatchEvent('click');
        await page.screenshot({path: './tests/screenshots/feature_hu03/login/step2.png'})
        await expect(page.locator('[class="welcome-message"]')).toBeVisible();
        await page.screenshot({path: './tests/screenshots/feature_hu03/login/step3.png'});
        console.log(`----------login successful----------`);
    })

    test('Create a manufacturer successfully', async ({ page }) => {
        const randomNumber: number = faker.number.int({ min: 6, max: 20 });
        const randomPhone: number = faker.number.int({ min: 7, max: 15 });
        const id: string = faker.string.numeric(randomNumber);
        const nombre: string = faker.person.firstName();
        const apellido: string = faker.person.lastName();
        const telefono: string = faker.string.numeric(randomPhone);
        const email: string = faker.internet.email();
        const direccion: string = faker.location.streetAddress(true);
        await page.locator('div.text-wrapper-2:has-text("Vendedores")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu03/creation/step1.png'});
        await page.locator('#identification').fill(id);
        await page.locator('#name').fill(`${nombre} ${apellido}`);
        await page.locator('#lastname').fill(apellido);
        await page.locator('[formcontrolname="country"]').selectOption({ label: 'Colombia' });
        await page.locator('#address').fill(direccion);
        await page.locator('#telephone').fill(telefono);
        await page.locator('#email').fill(email);
        await page.screenshot({path: './tests/screenshots/feature_hu03/creation/step2.png'});
        await page.locator('button', {hasText: 'Registrar vendedor'}).dispatchEvent('click');
        const alert = page.locator('div[role="alert"]');
        await expect(alert).toBeVisible({ timeout: 5000 });
        const ariaLabel = await alert.getAttribute('aria-label');
        expect(ariaLabel).toBe('Vendedor registrado exitosamente');
        await page.screenshot({ path: './tests/screenshots/feature_hu03/creation/step5.png' });
        console.log("----------Seller created successfully----------");
    })

    test('Invalid id', async ({ page }) => {
        const randomNumber: number = faker.number.int({ min: 1, max: 5 });
        const randomPhone: number = faker.number.int({ min: 7, max: 15 });
        const id: string = faker.string.numeric(randomNumber);
        const nombre: string = faker.person.firstName();
        const apellido: string = faker.person.lastName();
        const telefono: string = faker.string.numeric(randomPhone);
        const email: string = faker.internet.email();
        const direccion: string = faker.location.streetAddress(true);
        await page.locator('div.text-wrapper-2:has-text("Vendedores")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu03/inv_id/step1.png'});
        await page.locator('#identification').fill(id);
        await page.locator('#name').fill(`${nombre} ${apellido}`);
        await page.locator('#lastname').fill(apellido);
        await page.locator('[formcontrolname="country"]').selectOption({ label: 'Colombia' });
        await page.locator('#address').fill(direccion);
        await page.locator('#telephone').fill(telefono);
        await page.locator('#email').fill(email);
        await page.screenshot({path: './tests/screenshots/feature_hu03/inv_id/step2.png'});
        await page.locator('button', {hasText: 'Registrar vendedor'}).dispatchEvent('click');
        const alert = page.locator('div[role="alert"]');
        await expect(alert).toBeVisible({ timeout: 5000 });
        const ariaLabel = await alert.getAttribute('aria-label');
        expect(ariaLabel).toBe('Invalid identification value, It should have at least 6 characters and maximum 20, alphanumeric characters only.');
        await page.screenshot({ path: './tests/screenshots/feature_hu03/inv_id/step5.png' });
        console.log("----------Seller invalid id successfully----------");
    })
    
    test('Invalid name', async ({ page }) => {
        const randomNumber: number = faker.number.int({ min: 6, max: 15 });
        const randomPhone: number = faker.number.int({ min: 7, max: 15 });
        const id: string = faker.string.numeric(randomNumber);
        const nombre: string = faker.person.firstName();
        const apellido: string = faker.person.lastName();
        const telefono: string = faker.string.numeric(randomPhone);
        const email: string = faker.internet.email();
        const direccion: string = faker.location.streetAddress(true);
        const specialCharsPool = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
        const specialChars: string = Array.from({ length: 10 }, () =>
            specialCharsPool.charAt(Math.floor(Math.random() * specialCharsPool.length))
            ).join('');
        await page.locator('div.text-wrapper-2:has-text("Vendedores")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu03/inv_name/step1.png'});
        await page.locator('#identification').fill(id);
        await page.locator('#name').fill(specialChars);
        await page.locator('#lastname').fill(specialChars);
        await page.locator('[formcontrolname="country"]').selectOption({ label: 'Colombia' });
        await page.locator('#address').fill(direccion);
        await page.locator('#telephone').fill(telefono);
        await page.locator('#email').fill(email);
        await page.screenshot({path: './tests/screenshots/feature_hu03/inv_name/step2.png'});
        await page.locator('button', {hasText: 'Registrar vendedor'}).dispatchEvent('click');
        const alert = page.locator('div[role="alert"]');
        await expect(alert).toBeVisible({ timeout: 5000 });
        const ariaLabel = await alert.getAttribute('aria-label');
        expect(ariaLabel).toBe('Invalid name value, It should have at least 3 characters and maximum 100, letters and spaces only.');
        await page.screenshot({ path: './tests/screenshots/feature_hu03/inv_name/step5.png' });
        console.log("----------Seller invalid name successfully----------");
    })
    
    test('Invalid address', async ({ page }) => {
        const randomNumber: number = faker.number.int({ min: 6, max: 15 });
        const randomPhone: number = faker.number.int({ min: 7, max: 15 });
        const id: string = faker.string.numeric(randomNumber);
        const nombre: string = faker.person.firstName();
        const apellido: string = faker.person.lastName();
        const telefono: string = faker.string.numeric(randomPhone);
        const email: string = faker.internet.email();
        const direccion: string = faker.location.streetAddress(true);
        const specialCharsPool = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
        const specialChars: string = Array.from({ length: 9 }, () =>
            specialCharsPool.charAt(Math.floor(Math.random() * specialCharsPool.length))
            ).join('');
        await page.locator('div.text-wrapper-2:has-text("Vendedores")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu03/inv_add/step1.png'});
        await page.locator('#identification').fill(id);
        await page.locator('#name').fill(`${nombre} ${apellido}`);
        await page.locator('#lastname').fill(apellido);
        await page.locator('[formcontrolname="country"]').selectOption({ label: 'Colombia' });
        await page.locator('#address').fill(specialChars);
        await page.locator('#telephone').fill(telefono);
        await page.locator('#email').fill(email);
        await page.screenshot({path: './tests/screenshots/feature_hu03/inv_add/step2.png'});
        await page.locator('button', {hasText: 'Registrar vendedor'}).dispatchEvent('click');
        const alert = page.locator('div[role="alert"]');
        await expect(alert).toBeVisible({ timeout: 5000 });
        const ariaLabel = await alert.getAttribute('aria-label');
        expect(ariaLabel).toBe('Invalid address, it should have at least 10 characteres and maximum 200.');
        await page.screenshot({ path: './tests/screenshots/feature_hu03/inv_add/step5.png' });
        console.log("----------Seller invalid address successfully----------");
    })

    test('Invalid phone', async ({ page }) => {
        const randomNumber: number = faker.number.int({ min: 6, max: 15 });
        const randomPhone: number = faker.number.int({ min: 1, max: 6 });
        const id: string = faker.string.numeric(randomNumber);
        const nombre: string = faker.person.firstName();
        const apellido: string = faker.person.lastName();
        const telefono: string = faker.string.numeric(randomPhone);
        const email: string = faker.internet.email();
        const direccion: string = faker.location.streetAddress(true);
        await page.locator('div.text-wrapper-2:has-text("Vendedores")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu03/inv_phone/step1.png'});
        await page.locator('#identification').fill(id);
        await page.locator('#name').fill(`${nombre} ${apellido}`);
        await page.locator('#lastname').fill(apellido);
        await page.locator('[formcontrolname="country"]').selectOption({ label: 'Colombia' });
        await page.locator('#address').fill(direccion);
        await page.locator('#telephone').fill(telefono);
        await page.locator('#email').fill(email);
        await page.screenshot({path: './tests/screenshots/feature_hu03/inv_phone/step2.png'});
        await page.locator('button', {hasText: 'Registrar vendedor'}).dispatchEvent('click');
        const alert = page.locator('div[role="alert"]');
        await expect(alert).toBeVisible({ timeout: 5000 });
        const ariaLabel = await alert.getAttribute('aria-label');
        expect(ariaLabel).toBe('Invalid telephone, it should have at least 7 digits and 15 maximum. Digits only.');
        await page.screenshot({ path: './tests/screenshots/feature_hu03/inv_phone/step5.png' });
        console.log("----------Seller invalid phone successfully----------");
    })

    test('Invalid email', async ({ page }) => {
        const randomNumber: number = faker.number.int({ min: 6, max: 15 });
        const randomPhone: number = faker.number.int({ min: 1, max: 6 });
        const id: string = faker.string.numeric(randomNumber);
        const nombre: string = faker.person.firstName();
        const apellido: string = faker.person.lastName();
        const telefono: string = faker.string.numeric(randomPhone);
        const email: string = faker.internet.email();
        const direccion: string = faker.location.streetAddress(true);
        await page.locator('div.text-wrapper-2:has-text("Vendedores")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu03/inv_email/step1.png'});
        await page.locator('#identification').fill(id);
        await page.locator('#name').fill(`${nombre} ${apellido}`);
        await page.locator('#lastname').fill(apellido);
        await page.locator('[formcontrolname="country"]').selectOption({ label: 'Colombia' });
        await page.locator('#address').fill(direccion);
        await page.locator('#telephone').fill(telefono);
        await page.locator('#email').fill(nombre);
        await page.screenshot({path: './tests/screenshots/feature_hu03/inv_email/step2.png'});
        await page.locator('button', {hasText: 'Registrar vendedor'}).dispatchEvent('click');
        const alert = page.locator('div[role="alert"]');
        await expect(alert).toBeVisible({ timeout: 5000 });
        const ariaLabel = await alert.getAttribute('aria-label');
        expect(ariaLabel).toBe('Formulario inválido');
        await page.screenshot({ path: './tests/screenshots/feature_hu03/inv_email/step5.png' });
        console.log("----------Seller invalid email successfully----------");
    })


})