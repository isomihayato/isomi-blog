<?php

namespace Tests\Unit;

use App\Services\Firebase\InvalidFirebaseToken;
use App\Services\Firebase\KreaitFirebaseTokenVerifier;
use Beste\Clock\SystemClock;
use DateTimeImmutable;
use Kreait\Firebase\JWT\Action\FetchGooglePublicKeys;
use Kreait\Firebase\JWT\Action\FetchGooglePublicKeys\Handler as KeysHandler;
use Kreait\Firebase\JWT\Action\VerifyIdToken\WithLcobucciJWT;
use Kreait\Firebase\JWT\Contract\Keys;
use Kreait\Firebase\JWT\GooglePublicKeys;
use Kreait\Firebase\JWT\IdTokenVerifier;
use Kreait\Firebase\JWT\Keys\StaticKeys;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Key\InMemory;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Tests\TestCase;

/**
 * Firebase の IDトークンの検証を、テスト用の鍵で署名したトークンで確かめる(Google への通信はしない)。
 */
class KreaitFirebaseTokenVerifierTest extends TestCase
{
    private const PROJECT_ID = 'test-project';

    private const KEY_ID = 'test-key';

    private string $privateKey;

    private KreaitFirebaseTokenVerifier $verifier;

    protected function setUp(): void
    {
        parent::setUp();

        [$this->privateKey, $publicKey] = $this->createKeyPair();

        // Google の公開鍵の代わりに、テスト用の公開鍵を返す
        $keysHandler = new class($publicKey) implements KeysHandler
        {
            public function __construct(private readonly string $publicKey)
            {
            }

            public function handle(FetchGooglePublicKeys $action): Keys
            {
                return StaticKeys::withValues([KreaitFirebaseTokenVerifierTest::keyId() => $this->publicKey]);
            }
        };
        $clock = SystemClock::create();
        $handler = new WithLcobucciJWT(self::PROJECT_ID, new GooglePublicKeys($keysHandler, $clock), $clock);

        $this->verifier = new KreaitFirebaseTokenVerifier(new IdTokenVerifier($handler));
    }

    public static function keyId(): string
    {
        return self::KEY_ID;
    }

    public function test_returns_uid_for_valid_token(): void
    {
        $this->assertSame('uid-1', $this->verifier->verify($this->makeToken()));
    }

    public function test_rejects_token_signed_with_another_key(): void
    {
        [$otherPrivateKey] = $this->createKeyPair();

        $this->expectException(InvalidFirebaseToken::class);
        $this->verifier->verify($this->makeToken(privateKey: $otherPrivateKey));
    }

    public function test_rejects_token_for_another_project(): void
    {
        $this->expectException(InvalidFirebaseToken::class);
        $this->verifier->verify($this->makeToken(projectId: 'other-project'));
    }

    public function test_rejects_expired_token(): void
    {
        $this->expectException(InvalidFirebaseToken::class);
        $this->verifier->verify($this->makeToken(issuedAt: new DateTimeImmutable('-2 hours')));
    }

    public function test_rejects_malformed_token(): void
    {
        $this->expectException(InvalidFirebaseToken::class);
        $this->verifier->verify('not-a-jwt');
    }

    public function test_rejects_empty_token(): void
    {
        $this->expectException(InvalidFirebaseToken::class);
        $this->verifier->verify('');
    }

    /**
     * @return array{0: string, 1: string} [秘密鍵, 公開鍵]
     */
    private function createKeyPair(): array
    {
        $resource = openssl_pkey_new(['private_key_bits' => 2048, 'private_key_type' => OPENSSL_KEYTYPE_RSA]);
        openssl_pkey_export($resource, $privateKey);
        $publicKey = openssl_pkey_get_details($resource)['key'];

        return [$privateKey, $publicKey];
    }

    private function makeToken(
        ?string $privateKey = null,
        string $projectId = self::PROJECT_ID,
        DateTimeImmutable $issuedAt = new DateTimeImmutable('-1 minute'),
        string $uid = 'uid-1',
    ): string {
        $config = Configuration::forAsymmetricSigner(
            new Sha256(),
            InMemory::plainText($privateKey ?? $this->privateKey),
            InMemory::plainText('unused'),
        );

        return $config->builder()
            ->withHeader('kid', self::KEY_ID)
            ->issuedBy('https://securetoken.google.com/'.$projectId)
            ->permittedFor($projectId)
            ->relatedTo($uid)
            ->issuedAt($issuedAt)
            ->expiresAt($issuedAt->modify('+1 hour'))
            ->withClaim('auth_time', $issuedAt->getTimestamp())
            ->getToken($config->signer(), $config->signingKey())
            ->toString();
    }
}
