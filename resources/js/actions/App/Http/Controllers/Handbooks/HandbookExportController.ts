import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Handbooks\HandbookExportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookExportController.php:12
* @route '/handbooks/{knowledgeBase}/export'
*/
const HandbookExportController = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HandbookExportController.url(args, options),
    method: 'get',
})

HandbookExportController.definition = {
    methods: ["get","head"],
    url: '/handbooks/{knowledgeBase}/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookExportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookExportController.php:12
* @route '/handbooks/{knowledgeBase}/export'
*/
HandbookExportController.url = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return HandbookExportController.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookExportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookExportController.php:12
* @route '/handbooks/{knowledgeBase}/export'
*/
HandbookExportController.get = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HandbookExportController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookExportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookExportController.php:12
* @route '/handbooks/{knowledgeBase}/export'
*/
HandbookExportController.head = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: HandbookExportController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookExportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookExportController.php:12
* @route '/handbooks/{knowledgeBase}/export'
*/
const HandbookExportControllerForm = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HandbookExportController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookExportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookExportController.php:12
* @route '/handbooks/{knowledgeBase}/export'
*/
HandbookExportControllerForm.get = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HandbookExportController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookExportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookExportController.php:12
* @route '/handbooks/{knowledgeBase}/export'
*/
HandbookExportControllerForm.head = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HandbookExportController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

HandbookExportController.form = HandbookExportControllerForm

export default HandbookExportController