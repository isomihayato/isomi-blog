import React, { useState } from 'react';
import { TextField, Box, Typography, Alert, Link, Button } from '@mui/material';
import { useBreakpointUp } from '@/Components/common/useBreakpoint';
import BtnCircular from '../feedback/BtnCircular';
import { postSendMail } from '../axios/axiosMail';

type Field = 'name' | 'email' | 'title' | 'message';
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const FIELDS: Field[] = ['name', 'email', 'title', 'message'];
const EMPTY: Values = { name: '', email: '', title: '', message: '' };
const ALL_TOUCHED: Record<Field, boolean> = {
  name: true,
  email: true,
  title: true,
  message: true,
};

// サーバー(FrontController::sendEmail)の検証と同じ条件・文言で、項目ごとにエラーを出す
const RULES: Record<Field, { label: string; max: number }> = {
  name: { label: 'お名前', max: 100 },
  email: { label: 'メールアドレス', max: 255 },
  title: { label: 'タイトル', max: 200 },
  message: { label: '内容', max: 5000 },
};
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+$/;

function validate(values: Values): Errors {
  const errors: Errors = {};
  FIELDS.forEach((field) => {
    const value = values[field].trim();
    const { label, max } = RULES[field];
    if (value === '') {
      errors[field] = `${label}を入力してください。`;
    } else if (value.length > max) {
      errors[field] = `${label}は${max}文字以内で入力してください。`;
    } else if (field === 'email' && !EMAIL_PATTERN.test(value)) {
      errors[field] = 'メールアドレスの形式が正しくありません。';
    }
  });
  return errors;
}

function ContactForm() {
  const isDesktop = useBreakpointUp('md');
  const [values, setValues] = useState<Values>(EMPTY);
  // 入力し終えた(フォーカスを外した)項目だけエラーを出す。開いた直後は赤くしない
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);

  const clientErrors = validate(values);
  const hasEmpty = FIELDS.some((field) => values[field].trim() === '');
  const errorOf = (field: Field): string | undefined =>
    serverErrors[field] ?? (touched[field] ? clientErrors[field] : undefined);

  const handleChange =
    (field: Field) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setValues((prev) => ({ ...prev, [field]: value }));
      // 書き直したら、その項目のサーバーのエラーは消す
      setServerErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleBlur = (field: Field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    if (Object.keys(clientErrors).length > 0) {
      setTouched(ALL_TOUCHED);
      return;
    }
    const data = {
      name: values.name.trim(),
      email: values.email.trim(),
      title: values.title.trim(),
      message: values.message.trim(),
    };
    setFailureMessage(null);
    setServerErrors({});
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
        if (errors) {
          const byField: Errors = {};
          FIELDS.forEach((field) => {
            if (errors[field]?.length) byField[field] = errors[field][0];
          });
          setServerErrors(byField);
          setTouched(ALL_TOUCHED);
          setFailureMessage('送信できませんでした。入力内容をご確認ください。');
        } else {
          setFailureMessage(
            err.response?.data?.message ??
              '送信できませんでした。時間をおいて、もう一度お試しください。',
          );
        }
      },
    );
  };

  const handleReset = () => {
    setValues(EMPTY);
    setTouched({});
    setServerErrors({});
    setFailureMessage(null);
    setSuccess(false);
  };

  if (success) {
    return (
      <Box sx={{ mt: 1 }} role="status">
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography fontWeight="bold">
            お問い合わせを送信しました。
          </Typography>
          お問い合わせいただき、ありがとうございます。内容を確認のうえ、必要に応じてご入力いただいたメールアドレスへご連絡します。
        </Alert>
        <Button variant="outlined" onClick={handleReset}>
          別のお問い合わせをする
        </Button>
      </Box>
    );
  }

  const fieldProps = (field: Field) => ({
    margin: 'normal' as const,
    required: true,
    fullWidth: true,
    id: field,
    name: field,
    label: RULES[field].label,
    value: values[field],
    onChange: handleChange(field),
    onBlur: handleBlur(field),
    error: errorOf(field) !== undefined,
    helperText: errorOf(field) ?? ' ',
    disabled: loading,
  });

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h6">お問い合わせフォーム</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        すべての項目を入力して送信してください。いただいた個人情報は、
        <Link href="/privacy_policy">プライバシーポリシー</Link>
        に従って取り扱います。
      </Typography>
      {failureMessage !== null ? (
        <Alert severity="error" sx={{ mt: 2 }} role="alert">
          {failureMessage}
        </Alert>
      ) : null}
      <TextField
        {...fieldProps('name')}
        autoComplete="name"
        // スマホ幅では開いた直後にキーボードが出て説明が隠れるため、自動でフォーカスしない
        autoFocus={isDesktop}
      />
      <TextField {...fieldProps('email')} type="email" autoComplete="email" />
      <TextField {...fieldProps('title')} autoComplete="off" />
      <TextField
        {...fieldProps('message')}
        autoComplete="off"
        multiline
        rows={4}
      />
      <BtnCircular
        btnText={'送信'}
        loading={loading}
        success={false}
        disabled={hasEmpty}
      />
      {hasEmpty ? (
        <Typography variant="caption" color="text.secondary">
          未入力の項目があるため、まだ送信できません。
        </Typography>
      ) : null}
    </Box>
  );
}

export default ContactForm;
