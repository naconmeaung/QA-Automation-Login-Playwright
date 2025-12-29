import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { validUser, invalidUser, sqlInjectionUser } from '../test-data/users';

test.describe('Login Feature - Automated Tests', () => {

  test('Login success with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(validUser.username, validUser.password);

    await expect(page).toHaveURL(/secure/);
    await expect(page.locator('#flash')).toContainText('You logged into a secure area');
  });

  test('Login failed with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(invalidUser.username, invalidUser.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Your username is invalid');
  });

  test('Login failed with invalid username and valid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(invalidUser.username, validUser.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Your username is invalid');
  });

  test('Login failed with valid username and invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(validUser.username, invalidUser.password);

    const error = await loginPage.getErrorMessage();
    expect(error).toContain('Your password is invalid');
  });

  test('Login failed when username is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', validUser.password);

    await expect(page.locator('#flash')).toContainText('Your username is invalid');
  });

  test('Login failed when password is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(validUser.username, '');

    await expect(page.locator('#flash')).toContainText('Your password is invalid');
  });

  test('Login failed when username and password is empty', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('', '');

    await expect(page.locator('#flash')).toContainText('Your username is invalid');
  });

  test('bypass with path traversal', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.goto('https://the-internet.herokuapp.com/secure');

    await expect.toContainText('You must login to view the secure area!');
  });

  test('Security: SQL Injection attempt should fail', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(
      sqlInjectionUser.username,
      sqlInjectionUser.password
    );

    await expect(page.locator('#flash')).toContainText('invalid');
  });

});
