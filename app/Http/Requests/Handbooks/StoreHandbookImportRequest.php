<?php

namespace App\Http\Requests\Handbooks;

use Illuminate\Foundation\Http\FormRequest;

class StoreHandbookImportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1', 'max:2000'],
            'items.*.question' => ['required', 'string', 'max:5000'],
            'items.*.answer' => ['required', 'string', 'max:50000'],
        ];
    }
}
