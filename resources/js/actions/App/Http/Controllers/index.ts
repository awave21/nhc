import Api from './Api'
import DashboardController from './DashboardController'
import DialogiController from './DialogiController'
import DialogiMoreController from './DialogiMoreController'
import DialogiClearController from './DialogiClearController'
import DialogiTakeoverController from './DialogiTakeoverController'
import DialogiSendController from './DialogiSendController'
import DialogiMessageDeleteController from './DialogiMessageDeleteController'
import OrderController from './OrderController'
import RetreatsController from './RetreatsController'
import RetreatTariffStatusController from './RetreatTariffStatusController'
import UserProfilesController from './UserProfilesController'
import AppealsController from './AppealsController'
import DocumentationController from './DocumentationController'
import DocumentationUnlockController from './DocumentationUnlockController'
import Handbooks from './Handbooks'
import Settings from './Settings'

const Controllers = {
    Api: Object.assign(Api, Api),
    DashboardController: Object.assign(DashboardController, DashboardController),
    DialogiController: Object.assign(DialogiController, DialogiController),
    DialogiMoreController: Object.assign(DialogiMoreController, DialogiMoreController),
    DialogiClearController: Object.assign(DialogiClearController, DialogiClearController),
    DialogiTakeoverController: Object.assign(DialogiTakeoverController, DialogiTakeoverController),
    DialogiSendController: Object.assign(DialogiSendController, DialogiSendController),
    DialogiMessageDeleteController: Object.assign(DialogiMessageDeleteController, DialogiMessageDeleteController),
    OrderController: Object.assign(OrderController, OrderController),
    RetreatsController: Object.assign(RetreatsController, RetreatsController),
    RetreatTariffStatusController: Object.assign(RetreatTariffStatusController, RetreatTariffStatusController),
    UserProfilesController: Object.assign(UserProfilesController, UserProfilesController),
    AppealsController: Object.assign(AppealsController, AppealsController),
    DocumentationController: Object.assign(DocumentationController, DocumentationController),
    DocumentationUnlockController: Object.assign(DocumentationUnlockController, DocumentationUnlockController),
    Handbooks: Object.assign(Handbooks, Handbooks),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers