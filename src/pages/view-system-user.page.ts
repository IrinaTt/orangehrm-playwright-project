import { Locator, Page } from '@playwright/test';

export class ViewSystemUserPage {
    private readonly page: Page;

    readonly systemUsersTitle: Locator;
    readonly usersTable: Locator;

    private readonly filterArea: Locator;
    private readonly usernameSearchInput: Locator;
    private readonly searchButton: Locator;

    private readonly deleteUserButton: (username: string) => Locator;
    private readonly successToast: Locator;

    constructor(page: Page) {
        this.page = page;

        this.systemUsersTitle = page.getByText('System Users', {
            exact: true,
        });

        this.usersTable = page.getByRole('table');

        this.filterArea = page.locator('.oxd-table-filter-area');

        this.usernameSearchInput = this.filterArea
            .locator('.oxd-input-group')
            .filter({ hasText: 'Username' })
            .locator('input');

        this.searchButton = this.filterArea.getByRole('button', {
            name: 'Search',
            exact: true,
        });

        this.deleteUserButton = (username: string) =>
            page
                .locator('.oxd-table-card')
                .filter({ hasText: username })
                .locator('button:has(i.bi-trash)');

        this.successToast = this.page.locator('.oxd-toast--success');
    }

    async navigateToSystemUsersPage(): Promise<void> {
        await this.page.goto('/web/index.php/admin/viewSystemUsers');
    }

    async searchUser(username: string): Promise<void> {
        await this.filterArea.waitFor({ state: 'visible' });
        await this.usernameSearchInput.waitFor({ state: 'visible' });
        await this.usernameSearchInput.fill(username);
        await this.searchButton.click();
        await this.userRow(username).waitFor({ state: 'visible' });
    }

    userRow(username: string): Locator {
        return this.page
            .locator('.oxd-table-card')
            .filter({ hasText: username });
    }

    async deleteUser(username: string): Promise<void> {
        await this.deleteUserButton(username).click();
        const deleteModal = this.page.getByRole('dialog');
        await deleteModal.waitFor({
            state: 'visible',
        });
        const confirmDeleteButton = deleteModal.locator(
            'button.oxd-button--label-danger'
        );
        await confirmDeleteButton.click();
        await this.successToast.waitFor({
            state: 'visible',
        });
    }
}