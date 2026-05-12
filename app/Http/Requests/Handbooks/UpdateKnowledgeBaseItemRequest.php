<?php

namespace App\Http\Requests\Handbooks;

use Illuminate\Foundation\Http\FormRequest;

class UpdateKnowledgeBaseItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'question' => ['required', 'string'],
            'answer' => ['required', 'string'],
        ];
    }
}
