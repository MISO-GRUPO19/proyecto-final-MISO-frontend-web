import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker'
import { request } from 'http';
import { min } from 'rxjs';

test.describe.serial("HU11 Seller Sales report", () => {
    const randomNumber: number = faker.number.int({ min: 6, max: 20 });
    const id: string = faker.string.numeric(randomNumber);
    const nombre: string = faker.person.firstName();
    test.beforeEach(async ({ page }) =>{
        const user: string = 'admin@ccp.com';
        const password: string =  'Admin123-';
        await page.goto('http://localhost:4200/');
        await page.screenshot({path: './tests/screenshots/feature_hu11/login/step1.png'})
        await page.locator('[placeholder="Correo electrónico"]').fill(user);
        await page.locator('[placeholder="Contraseña"]').fill(password);
        await page.locator('[placeholder="Contraseña"]').fill(password);
        await page.locator('button', {hasText: 'Ingresar'}).dispatchEvent('click');
        await page.screenshot({path: './tests/screenshots/feature_hu11/login/step2.png'})
        await expect(page.locator('[class="welcome-message"]')).toBeVisible();
        await page.screenshot({path: './tests/screenshots/feature_hu11/login/step3.png'});
        console.log(`----------login successful----------`);
    })
    
    test('Create Seller', async ({ page }) => {
        const randomPhone: number = faker.number.int({ min: 7, max: 15 });
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
    
    test('Get Seller Sales successfully', async ({ request, page }) => {
        const loginEndPoint = 'http://127.0.0.1:8080/users/login';
        const loginBody = {
            "email": "admin@ccp.com",
            "password": "Admin123-"
        };
        const loginResponse = await request.post(loginEndPoint, {
            data: loginBody
        });
        
        const loginJson = await loginResponse.json();
        const access_token = await loginJson.access_token;
        
        const endpoint = `http://127.0.0.1:8080/users/sellers/${id}/sales`;
        const headers = {
            "Authorization": `Bearer ${access_token}`
        };

        const reportResponse = await request.get(endpoint, {
            headers: headers
        });

        const reportJson = await reportResponse.json()
        const sellerData = await reportJson[0]
        const statusCode = await reportJson[1]

        const country = sellerData.country;
        const name = sellerData.name;
        const phone = sellerData.phone;
        const email = sellerData.email;
        const months: String[] = []
        const monthsFormatted: string[] = []
        const monthlySummary = sellerData.monthly_summary;
        monthlySummary.forEach((summary: any) => {
            months.push(summary.date)
        });

        months.forEach((month: String) => {
            monthsFormatted.push(month.replace('-', '/'))
        })
        await page.goto('http://localhost:4200/');
        await page.screenshot({path: './tests/screenshots/feature_hu11/validation/step1.png'})
        await page.locator('div.text-wrapper-2:has-text("Reportes")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu11/validation/step2.png'})
        await page.locator('[value="id"]').click()
        await page.locator('#id_vendedor').fill(id)
        await page.locator('#id_vendedor').press('Enter')
        
        const countryTitle = await page.locator(`text=${country}`)
        const nameTitle = await page.locator(`text=${name}`)
        const phoneTitle = await page.locator(`text=${phone}`)
        const emailTitle = await page.locator(`text=${email}`)
        const monthTitle = await page.locator(`text=${monthsFormatted[0]}`)
        await page.screenshot({path: './tests/screenshots/feature_hu11/validation/step3.png'})
        await expect(countryTitle).toBeVisible({ timeout: 5000 });
        await expect(nameTitle).toBeVisible({ timeout: 5000 });
        await expect(phoneTitle).toBeVisible({ timeout: 5000 });
        await expect(emailTitle).toBeVisible({ timeout: 5000 });
        await expect(monthTitle).toBeVisible({ timeout: 5000 });

        console.log('Report has been displayed successfully')

    })

    test('Seller not found', async ({ request, page }) => {
        await page.goto('http://localhost:4200/');
        await page.screenshot({path: './tests/screenshots/feature_hu11/error/step1.png'})
        await page.locator('div.text-wrapper-2:has-text("Reportes")').click();
        await page.screenshot({path: './tests/screenshots/feature_hu11/error/step2.png'})
        await page.locator('[value="id"]').click()
        await page.locator('#id_vendedor').fill(faker.number.int({min:0, max:100000}).toString())
        await page.locator('#id_vendedor').press('Enter')
        const alert = page.locator('div[role="alert"]');
        await expect(alert).toBeVisible({ timeout: 5000 });
        const ariaLabel = await alert.getAttribute('aria-label');
        expect(ariaLabel).toBe('No se encontró el vendedor');

        console.log("Seller does not exist");
    })
})