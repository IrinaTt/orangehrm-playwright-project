import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page';

export function registerLoginHook(): void {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.goTo();
        await loginPage.login('Admin', 'admin123');
    });
}