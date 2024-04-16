import React, { useState } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import BtnCircular from '../feedback/BtnCircular';
import { postSendMail } from '../axios/axiosMail';

function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      title: form.title.value,
      message: form.message.value,
    };
    setLoading(true);
    // 送信後の処理（送信確認メッセージ表示など）もここに追加することができます。
    postSendMail(
      data,
      (res) => {
        if (res.status === 200) {
          setLoading(false);
          setSuccess(true);
        }
        console.log(res);
      },
      (err) => {
        console.log(err);
      },
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h6">お問い合わせフォーム</Typography>
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
