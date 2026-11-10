<?php

namespace App\Mail;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

// 新着コメントを管理者に知らせるメール
class NewCommentMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Comment $comment)
    {
        $this->comment->loadMissing(['article:id,title', 'member:id,name', 'parent:id,body']);
    }

    public function envelope(): Envelope
    {
        $kind = $this->comment->parent_id ? '返信' : 'コメント';

        return new Envelope(
            subject: "新しい{$kind}: {$this->comment->article->title}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.new_comment',
            with: [
                'articleUrl' => url("/articles/details/{$this->comment->article_id}").'#comment',
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
