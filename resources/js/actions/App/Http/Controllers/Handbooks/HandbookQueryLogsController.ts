import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Handbooks\HandbookQueryLogsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookQueryLogsController.php:13
* @route '/handbooks/{knowledgeBase}/query-logs'
*/
const HandbookQueryLogsController = (args: { knowledgeBase: number | { id: number } } | [knowledgeBase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HandbookQueryLogsController.url(args, options),
    method: 'get',
})

HandbookQueryLogsController.definition = {
    methods: ["get","head"],
    url: '/handbooks/{knowledgeBase}/query-logs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookQueryLogsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookQueryLogsController.php:13
* @route '/handbooks/{knowledgeBase}/query-logs'
*/
HandbookQueryLogsController.url = (args: { knowledgeBase: number | { id: number } } | [knowledgeBase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return HandbookQueryLogsController.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookQueryLogsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookQueryLogsController.php:13
* @route '/handbooks/{knowledgeBase}/query-logs'
*/
HandbookQueryLogsController.get = (args: { knowledgeBase: number | { id: number } } | [knowledgeBase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HandbookQueryLogsController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookQueryLogsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookQueryLogsController.php:13
* @route '/handbooks/{knowledgeBase}/query-logs'
*/
HandbookQueryLogsController.head = (args: { knowledgeBase: number | { id: number } } | [knowledgeBase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: HandbookQueryLogsController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookQueryLogsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookQueryLogsController.php:13
* @route '/handbooks/{knowledgeBase}/query-logs'
*/
const HandbookQueryLogsControllerForm = (args: { knowledgeBase: number | { id: number } } | [knowledgeBase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HandbookQueryLogsController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookQueryLogsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookQueryLogsController.php:13
* @route '/handbooks/{knowledgeBase}/query-logs'
*/
HandbookQueryLogsControllerForm.get = (args: { knowledgeBase: number | { id: number } } | [knowledgeBase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HandbookQueryLogsController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookQueryLogsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookQueryLogsController.php:13
* @route '/handbooks/{knowledgeBase}/query-logs'
*/
HandbookQueryLogsControllerForm.head = (args: { knowledgeBase: number | { id: number } } | [knowledgeBase: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HandbookQueryLogsController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

HandbookQueryLogsController.form = HandbookQueryLogsControllerForm

export default HandbookQueryLogsController