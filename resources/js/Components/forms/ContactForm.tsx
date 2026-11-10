import React, { useState } from 'react';
import { TextField, Box, Typography, Alert } from '@mui/material';
import BtnCircular from '../feedback/BtnCircular';
import { postSendMail } from '../axios/axiosMail';

function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]); // 送信に失敗したときのメッセージ
  const handleSubmit = (event) => {
    event.preventDefault();
    if (loading) return;
    const form = event.target;
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      title: form.title.value.trim(),
      message: form.message.value.trim(),
    };
    setErrorMessages([]);
    setSuccess(false);
    setLoading(true);
    postSendMail(
      data,
      () => {
        setLoading(false);
        setSuccess(true);
      },
      (err: {
        response?: {
          data?: { message?: string; errors?: Record<string, string[]> };
        };
      }) => {
        // 失敗したら読み込み表示を止め、入力内容は残したまま理由を表示する
        setLoading(false);
        const errors = err.response?.data?.errors;
        setErrorMessages(
          errors
            ? Object.values(errors).flat()
            : [
                err.response?.data?.message ??
                  '送信できませんでした。時間をおいて、もう一度お試しください。',
              ],
        );
      },
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      <Typography variant="h6">お問い合わせフォーム</Typography>
      {errorMessages.length > 0 ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessages.map((m) => (
            <div key={m}>{m}</div>
          ))}
        </Alert>
      ) : null}
      <TextField
        margin="normal"
        required
        fullWidth
        id="name"
        label="お名前"
        name="name"
        autoComplete="name"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="メールアドレス"
        name="email"
        type="email"
        autoComplete="email"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="title"
        label="タイトル"
        name="title"
        autoComplete="title"
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="message"
        label="内容"
        name="message"
        autoComplete="message"
        multiline
        rows={4}
      />
      {/* <Button
        type="submit"
        id="contact-form-btn"
        fullWidth={isMobile ? true : false}
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        送信
      </Button> */}
      <BtnCircular btnText={'送信'} loading={loading} success={success} />
    </Box>
  );
}

export default ContactForm;
