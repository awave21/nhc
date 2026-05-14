import Api from './Api'
import DashboardController from './DashboardController'
import DialogiController from './DialogiController'
import DialogiMoreController from './DialogiMoreController'
import DialogiClearController from './DialogiClearController'
import OrderController from './OrderController'
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
    OrderController: Object.assign(OrderController, OrderController),
    UserProfilesController: Object.assign(UserProfilesController, UserProfilesController),
    AppealsController: Object.assign(AppealsController, AppealsController),
    DocumentationController: Object.assign(DocumentationController, DocumentationController),
    DocumentationUnlockController: Object.assign(DocumentationUnlockController, DocumentationUnlockController),
    Handbooks: Object.assign(Handbooks, Handbooks),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers