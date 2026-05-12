import HandbooksController from './HandbooksController'
import HandbookController from './HandbookController'
import HandbookItemsController from './HandbookItemsController'
import HandbookItemController from './HandbookItemController'
import HandbookExportController from './HandbookExportController'
import HandbookImportController from './HandbookImportController'

const Handbooks = {
    HandbooksController: Object.assign(HandbooksController, HandbooksController),
    HandbookController: Object.assign(HandbookController, HandbookController),
    HandbookItemsController: Object.assign(HandbookItemsController, HandbookItemsController),
    HandbookItemController: Object.assign(HandbookItemController, HandbookItemController),
    HandbookExportController: Object.assign(HandbookExportController, HandbookExportController),
    HandbookImportController: Object.assign(HandbookImportController, HandbookImportController),
}

export default Handbooks