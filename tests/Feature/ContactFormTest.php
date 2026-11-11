<?php

namespace Tests\Feature;

use App\Mail\ContactFormMail;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

// BLOG-33: お問い合わせの入力検証と、送信に失敗したときの応答
class ContactFormTest extends TestCase
{
    private function validInput(array $override = []): array
    {
        return array_merge([
            'name' => '山田 太郎',
            'email' => 'taro@example.com',
            'title' => '記事について',
            'message' => '質問があります。',
        ], $override);
    }

    public function test_正しい入力ならメールを送る(): void
    {
        Mail::fake();
        config(['mail.from.address' => 'noreply@example.com']);

        $this->postJson('/send_email', $this->validInput())->assertOk();

        Mail::assertSent(ContactFormMail::class, function (ContactFormMail $mail) {
            $envelope = $mail->envelope();

            return $mail->hasTo('listen.risu.blog@gmail.com')
                && $mail->hasReplyTo('taro@example.com')
                // 送信元を Envelope で null に上書きしない(config('mail.from') が使われる)
                && $envelope->from === null
                && $envelope->to === [];
        });
    }

    public function test_空のままでは送れない(): void
    {
        Mail::fake();

        $this->postJson('/send_email', ['name' => '', 'email' => '', 'title' => '  ', 'message' => ''])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'title', 'message'])
            ->assertJsonPath('errors.name.0', 'お名前を入力してください。');

        Mail::assertNothingSent();
    }

    public function test_メールアドレスの形式が正しくなければ送れない(): void
    {
        Mail::fake();

        $this->postJson('/send_email', $this->validInput(['email' => 'not-an-email']))
            ->assertStatus(422)
            ->assertJsonPath('errors.email.0', 'メールアドレスの形式が正しくありません。');

        Mail::assertNothingSent();
    }

    public function test_長すぎる内容は送れない(): void
    {
        Mail::fake();

        $this->postJson('/send_email', $this->validInput(['message' => str_repeat('あ', 5001)]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['message']);
    }

    public function test_メールの送信に失敗したら500とメッセージを返す(): void
    {
        Mail::shouldReceive('to')->andThrow(new \RuntimeException('SMTP エラー'));

        $this->postJson('/send_email', $this->validInput())
            ->assertStatus(500)
            ->assertJsonPath('message', '送信できませんでした。時間をおいて、もう一度お試しください。');
    }
}
