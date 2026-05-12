import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Handbooks\HandbookImportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookImportController.php:13
* @route '/handbooks/{knowledgeBase}/import'
*/
const HandbookImportController = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: HandbookImportController.url(args, options),
    method: 'post',
})

HandbookImportController.definition = {
    methods: ["post"],
    url: '/handbooks/{knowledgeBase}/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookImportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookImportController.php:13
* @route '/handbooks/{knowledgeBase}/import'
*/
HandbookImportController.url = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return HandbookImportController.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookImportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookImportController.php:13
* @route '/handbooks/{knowledgeBase}/import'
*/
HandbookImportController.post = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: HandbookImportController.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookImportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookImportController.php:13
* @route '/handbooks/{knowledgeBase}/import'
*/
const HandbookImportControllerForm = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: HandbookImportController.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookImportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookImportController.php:13
* @route '/handbooks/{knowledgeBase}/import'
*/
HandbookImportControllerForm.post = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: HandbookImportController.url(args, options),
    method: 'post',
})

HandbookImportController.form = HandbookImportControllerForm

export default HandbookImportController