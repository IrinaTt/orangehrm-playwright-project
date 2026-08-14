import { Locator, Page } from '@playwright/test';

export class AddEmployeePage {
    private readonly page: Page;

    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly saveButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.firstNameInput = page.getByPlaceholder('First Name');
        this.lastNameInput = page.getByPlaceholder('Last Name');

        this.saveButton = page.getByRole('button', {
            name: 'Save',
            exact: true,
        });
    }

    async createEmployee(
        firstName: string,
        lastName: string
    ): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);

        await Promise.all([
            this.page.waitForURL(
                /\/pim\/viewPersonalDetails\/empNumber\/\d+$/
            ),
            this.saveButton.click(),
        ]);
    }
}