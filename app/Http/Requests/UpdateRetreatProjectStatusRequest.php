<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRetreatProjectStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // Активация проекта пишет «В работе», деактивация — inactive.
            // active оставлен для обратной совместимости.
            'status' => ['required', Rule::in(['В работе', 'active', 'inactive'])],
        ];
    }
}
