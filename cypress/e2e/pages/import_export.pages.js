import * as constants from '../../support/constants'
import { format } from 'date-fns'
const path = require('path')

const pinnedAppsStr = 'My pinned apps'
const enablePushNotificationsStr = 'Enable push notifications'
const addressBookBtnStr = 'Address book'
const dataImportModalStr = 'Data import'
const appsBtnStr = 'Apps'
const bookmarkedAppsBtnStr = 'Bookmarked apps'
const settingsBtnStr = 'Settings'
const appearenceTabStr = 'Appearance'
const showMoreTabsBtn = '[data-testid="KeyboardArrowRightIcon"]'
const dataTabStr = 'Data'
const tab = 'div[role="tablist"] a'
export const safeHeaderInfo = '[data-testid="safe-header-info"]'
export const prependChainPrefixStr = 'Prepend chain prefix to addresses'
export const copyAddressStr = 'Copy addresses with chain prefix'
export const darkModeStr = 'Dark mode'

export function verifyImportBtnIsVisible() {
  cy.contains('button', 'Import').should('be.visible')
}
export function clickOnImportBtn() {
  verifyImportBtnIsVisible()
  cy.contains('button', 'Import').click()
}

export function clickOnImportBtnDataImportModal() {
  cy.contains('button', 'Import').click()
}

export function uploadFile(filePath) {
  cy.get('[type="file"]').attachFile(filePath)
}

export function verifyImportModalData() {
  //verifies that the modal says the amount of chains/addressbook values it uploaded for file ../fixtures/data_import.json
  cy.contains('Added Safe Accounts on 4 chains').should('be.visible')
  cy.contains('Address book for 4 chains').should('be.visible')
  cy.contains('Settings').should('be.visible')
  cy.contains('Bookmarked Safe Apps').should('be.visible')
}

export function clickOnImportedSafe(safe) {
  cy.contains(safe).click()
  cy.get(safeHeaderInfo).contains(safe).should('exist')
}

export function clickOnOpenSafeListSidebar() {
  cy.contains('My Safe Accounts').click()
}

export function clickOnClosePushNotificationsBanner() {
  cy.waitForSelector(() => {
    return cy.get('h6').contains(enablePushNotificationsStr).siblings('.MuiButtonBase-root').click({ force: true })
  })
}

export function clickOnAddressBookBtn() {
  cy.contains(addressBookBtnStr).click()
}

export function verifyImportedAddressBookData() {
  //Verifies imported owners in the Address book for file ../fixtures/data_import.json
  cy.get('tbody tr:nth-child(1) td:nth-child(1)').contains(constants.SEPOLIA_CSV_ENTRY.name)
  cy.get('tbody tr:nth-child(1) td:nth-child(2)').contains(constants.SEPOLIA_CSV_ENTRY.address.substring(4))
}

export function clickOnAppsBtn() {
  cy.get('aside').contains('li', appsBtnStr).click()
}

export function clickOnBookmarkedAppsBtn() {
  cy.contains(bookmarkedAppsBtnStr).click()
  //Takes a some time to load the apps page, It waits for bookmark to be lighted up
  cy.waitForSelector(() => {
    return cy
      .get('[aria-selected="true"] p')
      .invoke('html')
      .then((text) => text === 'Bookmarked apps')
  })
}

export function verifyAppsAreVisible(appNames) {
  appNames.forEach((appName) => {
    cy.contains(appName).should('be.visible')
  })
}

export function verifyPinnedApps(pinnedApps) {
  pinnedApps.forEach((appName) => {
    cy.get('p')
      .contains(pinnedAppsStr)
      .within(() => {})
    cy.get('li').contains(appName).should('be.visible')
  })
}

export function clickOnSettingsBtn() {
  cy.contains(settingsBtnStr).click()
}

export function clickOnAppearenceBtn() {
  cy.contains(tab, appearenceTabStr).click()
}

export function clickOnShowMoreTabsBtn() {
  cy.get(showMoreTabsBtn).click()
}

export function verifDataTabBtnIsVisible() {
  cy.contains(tab, dataTabStr).should('be.visible')
}
export function clickOnDataTab() {
  cy.contains(tab, dataTabStr).click()
}

export function verifyCheckboxes(checkboxes, checked = false) {
  checkboxes.forEach((checkbox) => {
    cy.contains('label', checkbox)
      .find('input[type="checkbox"]')
      .should(checked ? 'be.checked' : 'not.be.checked')
  })
}

export function verifyFileDownload() {
  const date = format(new Date(), 'yyyy-MM-dd', { timeZone: 'UTC' })
  const fileName = `safe-${date}.json`
  cy.contains('div', fileName).next().click()
  const downloadsFolder = Cypress.config('downloadsFolder')
  //File reading is failing in the CI. Can be tested locally
  cy.readFile(path.join(downloadsFolder, fileName)).should('exist')
}
