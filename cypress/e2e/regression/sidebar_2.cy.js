import * as constants from '../../support/constants'
import * as main from '../pages/main.page'
import * as sideBar from '../pages/sidebar.pages'
import * as ls from '../../support/localstorage_data.js'
import * as assets from '../pages/assets.pages.js'

const newSafeName = 'Added safe 3'
const addedSafe900 = 'Added safe 900'
const staticSafe200 = 'Added safe 200'

describe('Sidebar added sidebar tests', () => {
  beforeEach(() => {
    cy.visit(constants.BALANCE_URL + constants.SEPOLIA_TEST_SAFE_13)
    cy.wait(2000)
    cy.clearLocalStorage()
    main.acceptCookies()
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__addedSafes, ls.addedSafes.set2)
    main.addToLocalStorage(constants.localStorageKeys.SAFE_v2__addressBook, ls.addressBookData.addedSafes)
  })

  it('Verify the safe added are listed in the sidebar', () => {
    sideBar.openSidebar()
    sideBar.verifyAddedSafesExist(sideBar.addedSafesSepolia)
  })

  it('Verify Safes are separated by networks', () => {
    sideBar.openSidebar()
    sideBar.verifySafesByNetwork(constants.networks.ethereum, sideBar.addedSafesEth)
    sideBar.verifySafesByNetwork(constants.networks.sepolia, sideBar.addedSafesSepolia)
  })

  it('Verify a safe can be renamed', () => {
    sideBar.openSidebar()
    sideBar.renameSafeItem(addedSafe900, newSafeName)
    sideBar.clickOnSaveBtn()
    sideBar.verifySafeNameExists(newSafeName)
  })

  it('Verify a safe can be removed', () => {
    sideBar.openSidebar()
    sideBar.removeSafeItem(addedSafe900)
    sideBar.verifySafeRemoved([addedSafe900])
  })

  it('Verify the "Read only" tag if the connected user is not an owner of a safe', () => {
    sideBar.openSidebar()
    sideBar.verifySafeReadOnlyState(addedSafe900)
  })

  it('Verify Fiat currency changes when edited in the assets tab', () => {
    assets.changeCurrency(constants.currencies.cad)
    sideBar.checkCurrencyInHeader(constants.currencies.cad)
  })

  it('Verify "wallet" tag counter if the safe has tx ready for execution', () => {
    sideBar.openSidebar()
    sideBar.verifyMissingSignature(staticSafe200)
  })

  it('Verify "Wallet" tag counter only shows for owners', () => {
    sideBar.openSidebar()
    sideBar.verifyQueuedTx(staticSafe200)
  })
})
