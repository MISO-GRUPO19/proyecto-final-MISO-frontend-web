
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker'

test.describe.serial("HU07 individual product Creation", () => {
    const rawNombreProveedor: string = faker.person.firstName();
    const nombreProveedor: string = rawNombreProveedor.replace(/[^a-zA-Z ]/g, '');
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
        const nombreProducto: string = faker.person.firstName();
        const codigo: string =  faker.string.numeric(13);
        const peso: number = faker.number.int({ min: 3, max: 20 });
        const precio: number = faker.number.int({ min: 3, max: 50 });
        const lote: string = faker.string.alphanumeric(10).toUpperCase();
        const cantidad: number = faker.number.int({ min: 3, max: 50 });
        const descripcion: string = faker.commerce.productDescription();
        const day = faker.number.int({ min: 1, max: 28 }).toString().padStart(2, '0'); // Ensure 2 digits
        const month = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0'); // Ensure 2 digits
        const year = faker.number.int({ min: 2000, max: 2025 }).toString();
        const fechaVencimiento = `2025-04-20`;
        await page.locator('div.text-wrapper-2:has-text("Productos")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu07/creation/step1.png'});
        await page.locator('button', {hasText: 'Registro Individual'}).dispatchEvent('click');
        await page.screenshot({path: './tests/screenshots/feature_hu07/creation/step2.png'});
        await page.locator('#name').fill(nombreProducto);
        await page.locator('#barcode').fill(codigo);
        await page.locator('[formcontrolname="category"]').selectOption({ label: 'Bebidas' });
        await page.locator('[formcontrolname="provider_id"]').selectOption({ label: `${nombreProveedor}` });
        await page.locator('#weight').fill(peso.toString());
        await page.locator('#price').fill(precio.toString());
        await page.locator('#batch').fill(lote.toString());
        await page.locator('#quantity').fill(cantidad.toString());
        await page.locator('#description').fill(descripcion);
        await page.locator('#best_before').fill(fechaVencimiento);
        await page.screenshot({path: './tests/screenshots/feature_hu07/creation/step3.png'});
        await page.locator('button', {hasText: 'Registrar producto'}).dispatchEvent('click');
        const productAlert = page.locator('div[role="alert"]').first(); 
        await expect(productAlert).toBeVisible({ timeout: 5000 });
        const productAriaLabel = await productAlert.getAttribute('aria-label');
        expect(productAriaLabel).toBe('Producto registrado exitosamente');
        await page.screenshot({ path: './tests/screenshots/feature_hu07/creation/step4.png' });
        console.log("----------Product created successfully----------");
    })

    test('Invalid name', async ({ page }) => {
        const specialCharsPool = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
        const specialChars: string = Array.from({ length: 10 }, () =>
        specialCharsPool.charAt(Math.floor(Math.random() * specialCharsPool.length))
        ).join('');
        const codigo: string =  faker.string.numeric(13);
        const peso: number = faker.number.int({ min: 3, max: 20 });
        const precio: number = faker.number.int({ min: 3, max: 50 });
        const lote: string = faker.string.alphanumeric(10).toUpperCase();
        const cantidad: number = faker.number.int({ min: 3, max: 50 });
        const descripcion: string = faker.commerce.productDescription();
        const day = faker.number.int({ min: 1, max: 28 }).toString().padStart(2, '0'); // Ensure 2 digits
        const month = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0'); // Ensure 2 digits
        const year = faker.number.int({ min: 2000, max: 2025 }).toString();
        const fechaVencimiento = `2025-04-20`;
        await page.locator('div.text-wrapper-2:has-text("Productos")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu07/inv_name/step1.png'});
        await page.locator('button', {hasText: 'Registro Individual'}).dispatchEvent('click');
        await page.screenshot({path: './tests/screenshots/feature_hu07/inv_name/step2.png'});
        await page.locator('#name').fill(specialChars);
        await page.locator('#barcode').fill(codigo);
        await page.locator('[formcontrolname="category"]').selectOption({ label: 'Bebidas' });
        await page.locator('[formcontrolname="provider_id"]').selectOption({ label: `${nombreProveedor}` });
        await page.locator('#weight').fill(peso.toString());
        await page.locator('#price').fill(precio.toString());
        await page.locator('#batch').fill(lote.toString());
        await page.locator('#quantity').fill(cantidad.toString());
        await page.locator('#description').fill(descripcion);
        await page.locator('#best_before').fill(fechaVencimiento);
        await page.screenshot({path: './tests/screenshots/feature_hu07/inv_name/step3.png'});
        await page.locator('button', {hasText: 'Registrar producto'}).dispatchEvent('click');
        const productAlert = page.locator('div[role="alert"]').first(); 
        await expect(productAlert).toBeVisible({ timeout: 5000 });
        const productAriaLabel = await productAlert.getAttribute('aria-label');
        expect(productAriaLabel).toBe('Error al registrar el producto');
        await page.screenshot({ path: './tests/screenshots/feature_hu07/inv_name/step4.png' });
        console.log("----------Product invalid name successfully----------");
    })

    test('Invalid weight', async ({ page }) => {
        const nombreProducto: string = faker.person.firstName();
        const codigo: string =  faker.string.numeric(13);
        const peso: string = faker.person.firstName();
        const precio: number = faker.number.int({ min: 3, max: 50 });
        const lote: string = faker.string.alphanumeric(10).toUpperCase();
        const cantidad: number = faker.number.int({ min: 3, max: 50 });
        const descripcion: string = faker.commerce.productDescription();
        const day = faker.number.int({ min: 1, max: 28 }).toString().padStart(2, '0'); // Ensure 2 digits
        const month = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0'); // Ensure 2 digits
        const year = faker.number.int({ min: 2000, max: 2025 }).toString();
        const fechaVencimiento = `2025-06-20`;
        await page.locator('div.text-wrapper-2:has-text("Productos")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu07/inv_weight/step1.png'});
        await page.locator('button', {hasText: 'Registro Individual'}).dispatchEvent('click');
        await page.screenshot({path: './tests/screenshots/feature_hu07/inv_weight/step2.png'});
        await page.locator('#name').fill(nombreProducto);
        await page.locator('#barcode').fill(codigo);
        await page.locator('[formcontrolname="category"]').selectOption({ label: 'Bebidas' });
        await page.locator('[formcontrolname="provider_id"]').selectOption({ label: `${nombreProveedor}` });
        await page.locator('#weight').fill(peso);
        await page.locator('#price').fill(precio.toString());
        await page.locator('#batch').fill(lote.toString());
        await page.locator('#quantity').fill(cantidad.toString());
        await page.locator('#description').fill(descripcion);
        await page.locator('#best_before').fill(fechaVencimiento);
        await page.screenshot({path: './tests/screenshots/feature_hu07/inv_weight/step3.png'});
        await page.locator('button', {hasText: 'Registrar producto'}).dispatchEvent('click');
        const productAlert = page.locator('div[role="alert"]').first(); 
        await expect(productAlert).toBeVisible({ timeout: 5000 });
        const productAriaLabel = await productAlert.getAttribute('aria-label');
        expect(productAriaLabel).toBe('Error al registrar el producto');
        await page.screenshot({ path: './tests/screenshots/feature_hu07/inv_weight/step4.png' });
        console.log("----------Product invalid weight successfully----------");
    })

    test('Invalid price', async ({ page }) => {
        const nombreProducto: string = faker.person.firstName();
        const codigo: string =  faker.string.numeric(13);
        const peso: number = faker.number.int({ min: 3, max: 20 });
        const precio: string = faker.person.firstName();
        const lote: string = faker.string.alphanumeric(10).toUpperCase();
        const cantidad: number = faker.number.int({ min: 3, max: 50 });
        const descripcion: string = faker.commerce.productDescription();
        const day = faker.number.int({ min: 1, max: 28 }).toString().padStart(2, '0'); // Ensure 2 digits
        const month = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0'); // Ensure 2 digits
        const year = faker.number.int({ min: 2000, max: 2025 }).toString();
        const fechaVencimiento = `2025-06-20`;
        await page.locator('div.text-wrapper-2:has-text("Productos")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu07/inv_price/step1.png'});
        await page.locator('button', {hasText: 'Registro Individual'}).dispatchEvent('click');
        await page.screenshot({path: './tests/screenshots/feature_hu07/inv_price/step2.png'});
        await page.locator('#name').fill(nombreProducto);
        await page.locator('#barcode').fill(codigo);
        await page.locator('[formcontrolname="category"]').selectOption({ label: 'Bebidas' });
        await page.locator('[formcontrolname="provider_id"]').selectOption({ label: `${nombreProveedor}` });
        await page.locator('#weight').fill(peso.toString());
        await page.locator('#price').fill(precio);
        await page.locator('#batch').fill(lote.toString());
        await page.locator('#quantity').fill(cantidad.toString());
        await page.locator('#description').fill(descripcion);
        await page.locator('#best_before').fill(fechaVencimiento);
        await page.screenshot({path: './tests/screenshots/feature_hu07/inv_price/step3.png'});
        await page.locator('button', {hasText: 'Registrar producto'}).dispatchEvent('click');
        const productAlert = page.locator('div[role="alert"]').first(); 
        await expect(productAlert).toBeVisible({ timeout: 5000 });
        const productAriaLabel = await productAlert.getAttribute('aria-label');
        expect(productAriaLabel).toBe('Error al registrar el producto');
        await page.screenshot({ path: './tests/screenshots/feature_hu07/inv_price/step4.png' });
        console.log("----------Product invalid price successfully----------");
    })

    test('Invalid description', async ({ page }) => {
        const nombreProducto: string = faker.person.firstName();
        const specialCharsPool = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
        const specialChars: string = Array.from({ length: 10 }, () =>
        specialCharsPool.charAt(Math.floor(Math.random() * specialCharsPool.length))
        ).join('');
        const codigo: string =  faker.string.numeric(13);
        const peso: number = faker.number.int({ min: 3, max: 20 });
        const precio: number = faker.number.int({ min: 3, max: 50 });
        const lote: string = faker.string.alphanumeric(10).toUpperCase();
        const cantidad: number = faker.number.int({ min: 3, max: 50 });
        const descripcion: string = faker.commerce.productDescription();
        const day = faker.number.int({ min: 1, max: 28 }).toString().padStart(2, '0'); // Ensure 2 digits
        const month = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0'); // Ensure 2 digits
        const year = faker.number.int({ min: 2000, max: 2025 }).toString();
        const fechaVencimiento = `2025-04-20`;
        await page.locator('div.text-wrapper-2:has-text("Productos")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu07/inv_desc/step1.png'});
        await page.locator('button', {hasText: 'Registro Individual'}).dispatchEvent('click');
        await page.screenshot({path: './tests/screenshots/feature_hu07/inv_desc/step2.png'});
        await page.locator('#name').fill(nombreProducto);
        await page.locator('#barcode').fill(codigo);
        await page.locator('[formcontrolname="category"]').selectOption({ label: 'Bebidas' });
        await page.locator('[formcontrolname="provider_id"]').selectOption({ label: `${nombreProveedor}` });
        await page.locator('#weight').fill(peso.toString());
        await page.locator('#price').fill(precio.toString());
        await page.locator('#batch').fill(lote.toString());
        await page.locator('#quantity').fill(cantidad.toString());
        await page.locator('#description').fill(specialChars);
        await page.locator('#best_before').fill(fechaVencimiento);
        await page.screenshot({path: './tests/screenshots/feature_hu07/inv_desc/step3.png'});
        await page.locator('button', {hasText: 'Registrar producto'}).dispatchEvent('click');
        const productAlert = page.locator('div[role="alert"]').first(); 
        await expect(productAlert).toBeVisible({ timeout: 5000 });
        const productAriaLabel = await productAlert.getAttribute('aria-label');
        expect(productAriaLabel).toBe('Error al registrar el producto');
        await page.screenshot({ path: './tests/screenshots/feature_hu07/inv_desc/step4.png' });
        console.log("----------Product invalid description successfully----------");
    })

    test('Invalid best before', async ({ page }) => {
        const nombreProducto: string = faker.person.firstName();
        const codigo: string =  faker.string.numeric(13);
        const peso: number = faker.number.int({ min: 3, max: 20 });
        const precio: number = faker.number.int({ min: 3, max: 50 });
        const lote: string = faker.string.alphanumeric(10).toUpperCase();
        const cantidad: number = faker.number.int({ min: 3, max: 50 });
        const descripcion: string = faker.commerce.productDescription();
        const day = faker.number.int({ min: 1, max: 28 }).toString().padStart(2, '0'); // Ensure 2 digits
        const month = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0'); // Ensure 2 digits
        const year = faker.number.int({ min: 2000, max: 2025 }).toString();
        const fechaVencimiento = `2025-03-20`;
        await page.locator('div.text-wrapper-2:has-text("Productos")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu07/creation/step1.png'});
        await page.locator('button', {hasText: 'Registro Individual'}).dispatchEvent('click');
        await page.screenshot({path: './tests/screenshots/feature_hu07/creation/step2.png'});
        await page.locator('#name').fill(nombreProducto);
        await page.locator('#barcode').fill(codigo);
        await page.locator('[formcontrolname="category"]').selectOption({ label: 'Bebidas' });
        await page.locator('[formcontrolname="provider_id"]').selectOption({ label: `${nombreProveedor}` });
        await page.locator('#weight').fill(peso.toString());
        await page.locator('#price').fill(precio.toString());
        await page.locator('#batch').fill(lote.toString());
        await page.locator('#quantity').fill(cantidad.toString());
        await page.locator('#description').fill(descripcion);
        await page.locator('#best_before').fill(fechaVencimiento);
        await page.screenshot({path: './tests/screenshots/feature_hu07/creation/step3.png'});
        await page.locator('button', {hasText: 'Registrar producto'}).dispatchEvent('click');
        const productAlert = page.locator('div[role="alert"]').first(); 
        await expect(productAlert).toBeVisible({ timeout: 5000 });
        const productAriaLabel = await productAlert.getAttribute('aria-label');
        expect(productAriaLabel).toBe('Error al registrar el producto');
        await page.screenshot({ path: './tests/screenshots/feature_hu07/creation/step4.png' });
        console.log("----------Product invalid best before successfully----------");
    })
})
