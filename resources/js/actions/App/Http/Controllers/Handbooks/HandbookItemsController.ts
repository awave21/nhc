import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Handbooks\HandbookItemsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookItemsController.php:14
* @route '/handbooks/{knowledgeBase}'
*/
const HandbookItemsController = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HandbookItemsController.url(args, options),
    method: 'get',
})

HandbookItemsController.definition = {
    methods: ["get","head"],
    url: '/handbooks/{knowledgeBase}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookItemsController.php:14
* @route '/handbooks/{knowledgeBase}'
*/
HandbookItemsController.url = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return HandbookItemsController.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookItemsController.php:14
* @route '/handbooks/{knowledgeBase}'
*/
HandbookItemsController.get = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: HandbookItemsController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookItemsController.php:14
* @route '/handbooks/{knowledgeBase}'
*/
HandbookItemsController.head = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: HandbookItemsController.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookItemsController.php:14
* @route '/handbooks/{knowledgeBase}'
*/
const HandbookItemsControllerForm = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HandbookItemsController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookItemsController.php:14
* @route '/handbooks/{knowledgeBase}'
*/
HandbookItemsControllerForm.get = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HandbookItemsController.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookItemsController.php:14
* @route '/handbooks/{knowledgeBase}'
*/
HandbookItemsControllerForm.head = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: HandbookItemsController.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

HandbookItemsController.form = HandbookItemsControllerForm

export default HandbookItemsController