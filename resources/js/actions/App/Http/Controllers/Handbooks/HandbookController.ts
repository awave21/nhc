import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Handbooks\HandbookController::store
* @see app/Http/Controllers/Handbooks/HandbookController.php:13
* @route '/handbooks'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/handbooks',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookController::store
* @see app/Http/Controllers/Handbooks/HandbookController.php:13
* @route '/handbooks'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookController::store
* @see app/Http/Controllers/Handbooks/HandbookController.php:13
* @route '/handbooks'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookController::store
* @see app/Http/Controllers/Handbooks/HandbookController.php:13
* @route '/handbooks'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookController::store
* @see app/Http/Controllers/Handbooks/HandbookController.php:13
* @route '/handbooks'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Handbooks\HandbookController::update
* @see app/Http/Controllers/Handbooks/HandbookController.php:20
* @route '/handbooks/{knowledgeBase}'
*/
export const update = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/handbooks/{knowledgeBase}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookController::update
* @see app/Http/Controllers/Handbooks/HandbookController.php:20
* @route '/handbooks/{knowledgeBase}'
*/
update.url = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookController::update
* @see app/Http/Controllers/Handbooks/HandbookController.php:20
* @route '/handbooks/{knowledgeBase}'
*/
update.put = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookController::update
* @see app/Http/Controllers/Handbooks/HandbookController.php:20
* @route '/handbooks/{knowledgeBase}'
*/
const updateForm = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookController::update
* @see app/Http/Controllers/Handbooks/HandbookController.php:20
* @route '/handbooks/{knowledgeBase}'
*/
updateForm.put = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Handbooks\HandbookController::destroy
* @see app/Http/Controllers/Handbooks/HandbookController.php:27
* @route '/handbooks/{knowledgeBase}'
*/
export const destroy = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/handbooks/{knowledgeBase}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookController::destroy
* @see app/Http/Controllers/Handbooks/HandbookController.php:27
* @route '/handbooks/{knowledgeBase}'
*/
destroy.url = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookController::destroy
* @see app/Http/Controllers/Handbooks/HandbookController.php:27
* @route '/handbooks/{knowledgeBase}'
*/
destroy.delete = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookController::destroy
* @see app/Http/Controllers/Handbooks/HandbookController.php:27
* @route '/handbooks/{knowledgeBase}'
*/
const destroyForm = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookController::destroy
* @see app/Http/Controllers/Handbooks/HandbookController.php:27
* @route '/handbooks/{knowledgeBase}'
*/
destroyForm.delete = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const HandbookController = { store, update, destroy }

export default HandbookController