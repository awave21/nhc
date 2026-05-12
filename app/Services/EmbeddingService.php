<?php

namespace App\Services;

use GuzzleHttp\Client;
use RuntimeException;

class EmbeddingService
{
    private Client $client;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://api.openai.com',
            'timeout' => 60,
            'connect_timeout' => 10,
        ]);
    }

    /**
     * @return array<float>
     */
    public function embed(string $text): array
    {
        $apiKey = config('services.openai.key');

        if (empty($apiKey)) {
            throw new RuntimeException('OPENAI_API_KEY is not configured.');
        }

        $lastError = null;
        for ($attempt = 1; $attempt <= 3; $attempt++) {
            try {
                $response = $this->client->post('/v1/embeddings', [
                    'headers' => [
                        'Authorization' => 'Bearer '.$apiKey,
                        'Content-Type' => 'application/json',
                    ],
                    'json' => [
                        'input' => $text,
                        'model' => 'text-embedding-3-small',
                    ],
                ]);

                /** @var array{data: array{0: array{embedding: array<float>}}} $body */
                $body = json_decode($response->getBody()->getContents(), true);

                return $body['data'][0]['embedding'];
            } catch (\Throwable $e) {
                $lastError = $e;
                if ($attempt < 3) {
                    sleep($attempt);
                }
            }
        }

        throw new RuntimeException('OpenAI embeddings failed after 3 attempts: '.$lastError->getMessage(), 0, $lastError);
    }
}
