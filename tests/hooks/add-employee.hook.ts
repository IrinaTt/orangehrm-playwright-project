import { test } from '@playwright/test';
import { ScenarioContext } from '../../src/context/scenario-context';
import { AddEmployeePage } from '../../src/pages/add-employee.page';
import { ViewEmployeeListPage } from '../../src/pages/view-employee-list.page';
import { GenerateData } from '../../src/utils/generate-data';

export function registerEmployeeHook(
    scenarioContext: ScenarioContext
): void {
    test.beforeEach(async ({ page }) => {
        const employeeListPage = new ViewEmployeeListPage(page);
        const addEmployeePage = new AddEmployeePage(page);

        const firstName = GenerateData.username('Emp');
        const lastName = 'Test';
        const employeeName = `${firstName} ${lastName}`;

        await employeeListPage.navigateToEmployeeList();
        await employeeListPage.openAddEmployeePage();
        await addEmployeePage.createEmployee(firstName, lastName);

        scenarioContext.set('employeeName', employeeName);
    });
}