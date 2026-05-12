import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import items from './items'
/**
* @see \App\Http\Controllers\Handbooks\HandbooksController::__invoke
* @see app/Http/Controllers/Handbooks/HandbooksController.php:13
* @route '/handbooks'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/handbooks',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbooksController::__invoke
* @see app/Http/Controllers/Handbooks/HandbooksController.php:13
* @route '/handbooks'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbooksController::__invoke
* @see app/Http/Controllers/Handbooks/HandbooksController.php:13
* @route '/handbooks'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbooksController::__invoke
* @see app/Http/Controllers/Handbooks/HandbooksController.php:13
* @route '/handbooks'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbooksController::__invoke
* @see app/Http/Controllers/Handbooks/HandbooksController.php:13
* @route '/handbooks'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbooksController::__invoke
* @see app/Http/Controllers/Handbooks/HandbooksController.php:13
* @route '/handbooks'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbooksController::__invoke
* @see app/Http/Controllers/Handbooks/HandbooksController.php:13
* @route '/handbooks'
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

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookItemsController.php:14
* @route '/handbooks/{knowledgeBase}'
*/
export const show = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/handbooks/{knowledgeBase}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookItemsController.php:14
* @route '/handbooks/{knowledgeBase}'
*/
show.url = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookItemsController.php:14
* @route '/handbooks/{knowledgeBase}'
*/
show.get = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookItemsController.php:14
* @route '/handbooks/{knowledgeBase}'
*/
show.head = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookItemsController.php:14
* @route '/handbooks/{knowledgeBase}'
*/
const showForm = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookItemsController.php:14
* @route '/handbooks/{knowledgeBase}'
*/
showForm.get = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookItemsController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookItemsController.php:14
* @route '/handbooks/{knowledgeBase}'
*/
showForm.head = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Handbooks\HandbookExportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookExportController.php:12
* @route '/handbooks/{knowledgeBase}/export'
*/
export const exportMethod = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/handbooks/{knowledgeBase}/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookExportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookExportController.php:12
* @route '/handbooks/{knowledgeBase}/export'
*/
exportMethod.url = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return exportMethod.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookExportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookExportController.php:12
* @route '/handbooks/{knowledgeBase}/export'
*/
exportMethod.get = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookExportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookExportController.php:12
* @route '/handbooks/{knowledgeBase}/export'
*/
exportMethod.head = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookExportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookExportController.php:12
* @route '/handbooks/{knowledgeBase}/export'
*/
const exportMethodForm = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookExportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookExportController.php:12
* @route '/handbooks/{knowledgeBase}/export'
*/
exportMethodForm.get = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookExportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookExportController.php:12
* @route '/handbooks/{knowledgeBase}/export'
*/
exportMethodForm.head = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

/**
* @see \App\Http\Controllers\Handbooks\HandbookImportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookImportController.php:13
* @route '/handbooks/{knowledgeBase}/import'
*/
export const importMethod = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(args, options),
    method: 'post',
})

importMethod.definition = {
    methods: ["post"],
    url: '/handbooks/{knowledgeBase}/import',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Handbooks\HandbookImportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookImportController.php:13
* @route '/handbooks/{knowledgeBase}/import'
*/
importMethod.url = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return importMethod.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Handbooks\HandbookImportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookImportController.php:13
* @route '/handbooks/{knowledgeBase}/import'
*/
importMethod.post = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookImportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookImportController.php:13
* @route '/handbooks/{knowledgeBase}/import'
*/
const importMethodForm = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: importMethod.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Handbooks\HandbookImportController::__invoke
* @see app/Http/Controllers/Handbooks/HandbookImportController.php:13
* @route '/handbooks/{knowledgeBase}/import'
*/
importMethodForm.post = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: importMethod.url(args, options),
    method: 'post',
})

importMethod.form = importMethodForm

const handbooks = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
    show: Object.assign(show, show),
    items: Object.assign(items, items),
    export: Object.assign(exportMethod, exportMethod),
    import: Object.assign(importMethod, importMethod),
}

export default handbooks