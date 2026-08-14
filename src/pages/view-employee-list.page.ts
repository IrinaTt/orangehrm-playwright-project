import { Locator, Page } from '@playwright/test';

export class ViewEmployeeListPage {
    private readonly page: Page;
    private readonly addButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addButton = page.getByRole('button', {
            name: 'Add',
        });
    }

    async navigateToEmployeeList(): Promise<void> {
        await this.page.goto('/web/index.php/pim/viewEmployeeList');
    }

    async openAddEmployeePage(): Promise<void> {
        await Promise.all([
            this.page.waitForURL(/\/pim\/addEmployee$/),
            this.addButton.click(),
        ]);
    }
}