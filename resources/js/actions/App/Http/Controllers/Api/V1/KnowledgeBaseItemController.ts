import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::index
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:15
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items'
*/
export const index = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/v1/knowledge-bases/{knowledgeBase}/items',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::index
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:15
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items'
*/
index.url = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return index.definition.url
            .replace('{knowledgeBase}', parsedArgs.knowledgeBase.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::index
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:15
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items'
*/
index.get = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::index
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:15
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items'
*/
index.head = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::index
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:15
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items'
*/
const indexForm = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::index
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:15
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items'
*/
indexForm.get = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::index
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:15
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items'
*/
indexForm.head = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::store
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:24
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items'
*/
export const store = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/v1/knowledge-bases/{knowledgeBase}/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::store
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:24
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items'
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
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::store
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:24
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items'
*/
store.post = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::store
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:24
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items'
*/
const storeForm = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::store
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:24
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items'
*/
storeForm.post = (args: { knowledgeBase: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::update
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:37
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items/{item}'
*/
export const update = (args: { knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/v1/knowledge-bases/{knowledgeBase}/items/{item}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::update
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:37
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items/{item}'
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
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::update
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:37
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items/{item}'
*/
update.put = (args: { knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::update
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:37
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items/{item}'
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
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::update
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:37
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items/{item}'
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
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::destroy
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:50
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items/{item}'
*/
export const destroy = (args: { knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/v1/knowledge-bases/{knowledgeBase}/items/{item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::destroy
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:50
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items/{item}'
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
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::destroy
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:50
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items/{item}'
*/
destroy.delete = (args: { knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } } | [knowledgeBase: string | number | { id: string | number }, item: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::destroy
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:50
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items/{item}'
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
* @see \App\Http\Controllers\Api\V1\KnowledgeBaseItemController::destroy
* @see app/Http/Controllers/Api/V1/KnowledgeBaseItemController.php:50
* @route '/api/v1/knowledge-bases/{knowledgeBase}/items/{item}'
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

const KnowledgeBaseItemController = { index, store, update, destroy }

export default KnowledgeBaseItemController