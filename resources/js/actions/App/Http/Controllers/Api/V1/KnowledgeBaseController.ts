import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseController::index
* @see app/Http/Controllers/Api/V1/KnowledgeBaseController.php:12
* @route '/api/v1/knowledge-bases'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/knowledge-bases',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseController::index
* @see app/Http/Controllers/Api/V1/KnowledgeBaseController.php:12
* @route '/api/v1/knowledge-bases'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseController::index
* @see app/Http/Controllers/Api/V1/KnowledgeBaseController.php:12
* @route '/api/v1/knowledge-bases'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseController::index
* @see app/Http/Controllers/Api/V1/KnowledgeBaseController.php:12
* @route '/api/v1/knowledge-bases'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseController::index
* @see app/Http/Controllers/Api/V1/KnowledgeBaseController.php:12
* @route '/api/v1/knowledge-bases'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseController::index
* @see app/Http/Controllers/Api/V1/KnowledgeBaseController.php:12
* @route '/api/v1/knowledge-bases'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseController::index
* @see app/Http/Controllers/Api/V1/KnowledgeBaseController.php:12
* @route '/api/v1/knowledge-bases'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseController::status
* @see app/Http/Controllers/Api/V1/KnowledgeBaseController.php:19
* @route '/api/v1/knowledge-bases/{knowledgeBase}/status'
*/
export const status = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/api/v1/knowledge-bases/{knowledgeBase}/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseController::status
* @see app/Http/Controllers/Api/V1/KnowledgeBaseController.php:19
* @route '/api/v1/knowledge-bases/{knowledgeBase}/status'
*/
status.url = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { knowledgeBase: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { knowledgeBase: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            knowledgeBase: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        knowledgeBase: typeof args.knowledgeBase === 'object'
        ? args.knowledgeBase.id
        : args.knowledgeBase,
    }

    return status.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseController::status
* @see app/Http/Controllers/Api/V1/KnowledgeBaseController.php:19
* @route '/api/v1/knowledge-bases/{knowledgeBase}/status'
*/
status.get = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseController::status
* @see app/Http/Controllers/Api/V1/KnowledgeBaseController.php:19
* @route '/api/v1/knowledge-bases/{knowledgeBase}/status'
*/
status.head = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseController::status
* @see app/Http/Controllers/Api/V1/KnowledgeBaseController.php:19
* @route '/api/v1/knowledge-bases/{knowledgeBase}/status'
*/
const statusForm = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseController::status
* @see app/Http/Controllers/Api/V1/KnowledgeBaseController.php:19
* @route '/api/v1/knowledge-bases/{knowledgeBase}/status'
*/
statusForm.get = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseController::status
* @see app/Http/Controllers/Api/V1/KnowledgeBaseController.php:19
* @route '/api/v1/knowledge-bases/{knowledgeBase}/status'
*/
statusForm.head = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

status.form = statusForm

const KnowledgeBaseController = { index, status }

export default KnowledgeBaseController