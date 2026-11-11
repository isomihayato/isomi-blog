<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * ユーザー登録は無効にしている(routes/auth.php に登録のルートがない)ことを確認する
 */
class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_route_is_not_defined(): void
    {
        $this->assertFalse(Route::has('register'));
    }

    public function test_registration_screen_is_not_available(): void
    {
        $response = $this->get('/register');

        $response->assertRedirect(route('fronts.index'));
    }

    public function test_new_users_cannot_register(): void
    {
        $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertGuest();
        $this->assertDatabaseMissing('users', ['email' => 'test@example.com']);
    }
}
