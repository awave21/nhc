import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::store
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:15
* @route '/handbooks/{knowledgeBase}/items'
*/
export const store = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/handbooks/{knowledgeBase}/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::store
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:15
* @route '/handbooks/{knowledgeBase}/items'
*/
store.url = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return store.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::store
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:15
* @route '/handbooks/{knowledgeBase}/items'
*/
store.post = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::store
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:15
* @route '/handbooks/{knowledgeBase}/items'
*/
const storeForm = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::store
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:15
* @route '/handbooks/{knowledgeBase}/items'
*/
storeForm.post = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::update
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:23
* @route '/handbooks/{knowledgeBase}/items/{item}'
*/
export const update = (args: { knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/handbooks/{knowledgeBase}/items/{item}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::update
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:23
* @route '/handbooks/{knowledgeBase}/items/{item}'
*/
update.url = (args: { knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            knowledgeBase: args[0],
            item: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        knowledgeBase: typeof args.knowledgeBase === 'object'
        ? args.knowledgeBase.id
        : args.knowledgeBase,
        item: typeof args.item === 'object'
        ? args.item.id
        : args.item,
    }

    return update.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::update
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:23
* @route '/handbooks/{knowledgeBase}/items/{item}'
*/
update.put = (args: { knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::update
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:23
* @route '/handbooks/{knowledgeBase}/items/{item}'
*/
const updateForm = (args: { knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::update
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:23
* @route '/handbooks/{knowledgeBase}/items/{item}'
*/
updateForm.put = (args: { knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroyBulk
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:45
* @route '/handbooks/{knowledgeBase}/items/bulk'
*/
export const destroyBulk = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyBulk.url(args, options),
    method: 'delete',
})

destroyBulk.definition = {
    methods: ["delete"],
    url: '/handbooks/{knowledgeBase}/items/bulk',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroyBulk
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:45
* @route '/handbooks/{knowledgeBase}/items/bulk'
*/
destroyBulk.url = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return destroyBulk.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroyBulk
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:45
* @route '/handbooks/{knowledgeBase}/items/bulk'
*/
destroyBulk.delete = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyBulk.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroyBulk
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:45
* @route '/handbooks/{knowledgeBase}/items/bulk'
*/
const destroyBulkForm = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyBulk.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroyBulk
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:45
* @route '/handbooks/{knowledgeBase}/items/bulk'
*/
destroyBulkForm.delete = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyBulk.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyBulk.form = destroyBulkForm

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroyAll
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:38
* @route '/handbooks/{knowledgeBase}/items/all'
*/
export const destroyAll = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(args, options),
    method: 'delete',
})

destroyAll.definition = {
    methods: ["delete"],
    url: '/handbooks/{knowledgeBase}/items/all',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroyAll
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:38
* @route '/handbooks/{knowledgeBase}/items/all'
*/
destroyAll.url = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return destroyAll.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroyAll
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:38
* @route '/handbooks/{knowledgeBase}/items/all'
*/
destroyAll.delete = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroyAll
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:38
* @route '/handbooks/{knowledgeBase}/items/all'
*/
const destroyAllForm = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyAll.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroyAll
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:38
* @route '/handbooks/{knowledgeBase}/items/all'
*/
destroyAllForm.delete = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyAll.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyAll.form = destroyAllForm

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroy
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:31
* @route '/handbooks/{knowledgeBase}/items/{item}'
*/
export const destroy = (args: { knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/handbooks/{knowledgeBase}/items/{item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroy
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:31
* @route '/handbooks/{knowledgeBase}/items/{item}'
*/
destroy.url = (args: { knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            knowledgeBase: args[0],
            item: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        knowledgeBase: typeof args.knowledgeBase === 'object'
        ? args.knowledgeBase.id
        : args.knowledgeBase,
        item: typeof args.item === 'object'
        ? args.item.id
        : args.item,
    }

    return destroy.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroy
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:31
* @route '/handbooks/{knowledgeBase}/items/{item}'
*/
destroy.delete = (args: { knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroy
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:31
* @route '/handbooks/{knowledgeBase}/items/{item}'
*/
const destroyForm = (args: { knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemController::destroy
* @see app/Http/Controllers/Handbooks/HandbookItemController.php:31
* @route '/handbooks/{knowledgeBase}/items/{item}'
*/
destroyForm.delete = (args: { knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const HandbookItemController = { store, update, destroyBulk, destroyAll, destroy }

export default HandbookItemController