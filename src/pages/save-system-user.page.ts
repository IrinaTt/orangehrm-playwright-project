import { Locator, Page } from '@playwright/test';

export class SaveSystemUserPage {
    private readonly page: Page;

    private readonly addButton: Locator;
    private readonly userRoleDropdown: Locator;
    private readonly employeeNameInput: Locator;
    private readonly statusDropdown: Locator;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly confirmPasswordInput: Locator;
    private readonly saveButton: Locator;

    private readonly editUserButton: (username: string) => Locator;
    private readonly editUserTitle: Locator;
    private readonly successToast: Locator;

    constructor(page: Page) {
        this.page = page;

        this.addButton = page.getByRole('button', { name: 'Add' });

        this.userRoleDropdown = page
            .locator('.oxd-input-group')
            .filter({ hasText: 'User Role' })
            .locator('.oxd-select-text');

        this.employeeNameInput = page
            .locator('.oxd-input-group')
            .filter({ hasText: 'Employee Name' })
            .locator('input');

        this.statusDropdown = page
            .locator('.oxd-input-group')
            .filter({ hasText: 'Status' })
            .locator('.oxd-select-text');

        this.usernameInput = page
            .locator('.oxd-input-group')
            .filter({ hasText: 'Username' })
            .locator('input');

        this.passwordInput = page
            .locator('.oxd-input-group')
            .filter({ hasText: 'Password' })
            .locator('input[type="password"]')
            .first();

        this.confirmPasswordInput = page
            .locator('.oxd-input-group')
            .filter({ hasText: 'Confirm Password' })
            .locator('input[type="password"]');

        this.saveButton = page.getByRole('button', {
            name: 'Save',
            exact: true,
        });

        this.editUserButton = (username: string) =>
            page
                .locator('.oxd-table-card')
                .filter({ hasText: username })
                .locator('button:has(i.bi-pencil-fill)');

        this.editUserTitle = page.getByText('Edit User', {
            exact: true,
        });

        this.successToast = this.page.locator('.oxd-toast--success');
    }

    private async waitForInputValue(
        locator: Locator,
        expectedValue: string,
        timeout = 15_000
    ): Promise<void> {
        const startedAt = Date.now();

        while (Date.now() - startedAt < timeout) {
            const actualValue = await locator.inputValue();
            if (actualValue === expectedValue) {
                return;
            }
            await this.page.waitForTimeout(100);
        }
        throw new Error(
            `The field did not receive the expected value "${expectedValue}" within ${timeout} ms`
        );
    }

    async createNewUser(
        role: string,
        employeeName: string,
        status: string,
        username: string,
        password: string
    ): Promise<void> {
        await this.addButton.click();

        await this.userRoleDropdown.click();

        await this.page
            .getByRole('option', {
                name: role,
                exact: true,
            })
            .click();

        await this.employeeNameInput.fill(employeeName);

        await this.page
            .getByRole('listbox')
            .getByText(employeeName, { exact: true })
            .first()
            .click();

        await this.statusDropdown.click();

        await this.page
            .locator('.oxd-select-dropdown .oxd-select-option')
            .filter({ hasText: status })
            .click();

        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);

        await this.saveButton.click();
    }

    async editUser(
        currentUsername: string,
        editedUsername: string
    ): Promise<void> {
        await this.editUserButton(currentUsername).click();
        await this.waitForInputValue(this.usernameInput, currentUsername);
        await this.usernameInput.fill(editedUsername);
        await Promise.all([
            this.page.waitForURL(/viewSystemUsers/),
            this.saveButton.click(),
        ]);
    }
}
