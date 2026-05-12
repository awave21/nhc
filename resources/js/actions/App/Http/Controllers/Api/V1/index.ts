import KnowledgeBaseController from './KnowledgeBaseController'
import KnowledgeBaseItemController from './KnowledgeBaseItemController'
import QueryController from './QueryController'

const V1 = {
    KnowledgeBaseController: Object.assign(KnowledgeBaseController, KnowledgeBaseController),
    KnowledgeBaseItemController: Object.assign(KnowledgeBaseItemController, KnowledgeBaseItemController),
    QueryController: Object.assign(QueryController, QueryController),
}

export default V1