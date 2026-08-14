import {expect, test} from '@playwright/test';
import {registerLoginHook} from './hooks/login.hook';
import {registerEmployeeHook} from './hooks/add-employee.hook';
import {ViewSystemUserPage} from '../src/pages/view-system-user.page';
import {SaveSystemUserPage} from '../src/pages/save-system-user.page';
import {GenerateData} from '../src/utils/generate-data';
import {ScenarioContext} from '../src/context/scenario-context';

test.setTimeout(90_000);

test.describe('System user management', () => {
    const scenarioContext = new ScenarioContext();

    registerLoginHook();
    registerEmployeeHook(scenarioContext);

    test(
        'Admin can create, search, edit and delete a system user @smoke',
        async ({page}) => {
            /**
             * NOTE: Shared demo instance
             * This test runs against a public shared OrangeHRM demo.
             * Risk: concurrent test runs may interfere with each other if not careful.
             * Mitigation: unique usernames (timestamp + random) ensure no collisions.
             * Cleanup: CRITICAL — must delete created user at end to keep demo clean.
             */
            const userRole = 'Admin';
            const employeeName = scenarioContext.get<string>('employeeName');
            const status = 'Enabled';
            const userPassword = 'password123';

            // Unique usernames prevent collisions in shared demo
            const newUsername = GenerateData.username('TestUser');
            const editedUsername = GenerateData.username('UpdatedUser');

            const viewUsersPage = new ViewSystemUserPage(page);
            const saveUsersPage = new SaveSystemUserPage(page);

            await test.step('Create a new system user', async () => {
                await viewUsersPage.navigateToSystemUsersPage();
                await expect(viewUsersPage.systemUsersTitle).toBeVisible();
                await expect(viewUsersPage.usersTable).toBeVisible();
                await saveUsersPage.createNewUser(
                    userRole,
                    employeeName,
                    status,
                    newUsername,
                    userPassword
                );
                await expect(viewUsersPage.systemUsersTitle).toBeVisible();
            });

            await test.step('Search created user', async () => {
                await viewUsersPage.searchUser(newUsername);
                await expect(viewUsersPage.userRow(newUsername)).toHaveCount(1);
            });

            await test.step('Edit user', async () => {
                await saveUsersPage.editUser(newUsername, editedUsername);
                await expect(viewUsersPage.systemUsersTitle).toBeVisible();
            });

            await test.step('Search edited user', async () => {
                await viewUsersPage.searchUser(editedUsername);
                await expect(viewUsersPage.userRow(editedUsername)).toHaveCount(1);
            });

            await test.step('Delete edited user', async () => {
                // Cleanup is critical to avoid polluting the shared demo instance
                await viewUsersPage.deleteUser(editedUsername);
                await expect(viewUsersPage.systemUsersTitle).toBeVisible();
                await expect(viewUsersPage.userRow(editedUsername)).toHaveCount(0);
            });
        }
    );
});