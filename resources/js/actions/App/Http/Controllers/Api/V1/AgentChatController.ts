import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\AgentChatController::__invoke
* @see app/Http/Controllers/Api/V1/AgentChatController.php:15
* @route '/api/v1/agent/chat'
*/
const AgentChatController = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: AgentChatController.url(options),
    method: 'post',
})

AgentChatController.definition = {
    methods: ["post"],
    url: '/api/v1/agent/chat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\AgentChatController::__invoke
* @see app/Http/Controllers/Api/V1/AgentChatController.php:15
* @route '/api/v1/agent/chat'
*/
AgentChatController.url = (options?: RouteQueryOptions) => {
    return AgentChatController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\AgentChatController::__invoke
* @see app/Http/Controllers/Api/V1/AgentChatController.php:15
* @route '/api/v1/agent/chat'
*/
AgentChatController.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: AgentChatController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\AgentChatController::__invoke
* @see app/Http/Controllers/Api/V1/AgentChatController.php:15
* @route '/api/v1/agent/chat'
*/
const AgentChatControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: AgentChatController.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\AgentChatController::__invoke
* @see app/Http/Controllers/Api/V1/AgentChatController.php:15
* @route '/api/v1/agent/chat'
*/
AgentChatControllerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: AgentChatController.url(options),
    method: 'post',
})

AgentChatController.form = AgentChatControllerForm

export default AgentChatController