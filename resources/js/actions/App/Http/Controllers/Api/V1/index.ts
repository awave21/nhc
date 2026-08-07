import KnowledgeBaseController from './KnowledgeBaseController'
import KnowledgeBaseItemController from './KnowledgeBaseItemController'
import QueryController from './QueryController'
import AgentChatController from './AgentChatController'
import DialogiIntakeController from './DialogiIntakeController'

const V1 = {
    KnowledgeBaseController: Object.assign(KnowledgeBaseController, KnowledgeBaseController),
    KnowledgeBaseItemController: Object.assign(KnowledgeBaseItemController, KnowledgeBaseItemController),
    QueryController: Object.assign(QueryController, QueryController),
    AgentChatController: Object.assign(AgentChatController, AgentChatController),
    DialogiIntakeController: Object.assign(DialogiIntakeController, DialogiIntakeController),
}

export default V1