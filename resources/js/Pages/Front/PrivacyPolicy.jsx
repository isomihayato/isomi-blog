import React from 'react';
import PropTypes from 'prop-types';
import Front from '@/Components/header/Front';
import MainFront from '@/Components/main/Front';
import FrontFooter from '@/Components/footer/FrontFooter';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { Helmet } from 'react-helmet';
import { Head } from '@inertiajs/react';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';

export default function InfomationList() {
  return (
    <>
      <Helmet>
        <meta
          name="keywords"
          content={'INFO BOX,INFO BOX about,INFO BOX 概要'}
        />
        <meta
          name="description"
          content={
            '当ブログサイト、INFO BOXは、管理主、りっすんのプログラミングや技術系の情報を発信するためのブログサイトです。'
          }
        />
        <meta property="og:type" content="article" />
      </Helmet>
      <Head title={`プライバシーポリシー`} />
      <Front />
      <Breadcrumbs aria-label="breadcrumb" style={{ margin: '10px 15px' }}>
        <Link underline="hover" color="inherit" href="/">
          <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          Top 記事一覧
        </Link>
        <Typography color="text.primary">
          <PrivacyTipIcon sx={{ mr: 0.5 }} fontSize="inherit" />
          プライバシーポリシー
        </Typography>
      </Breadcrumbs>
      <MainFront
        element={
          <>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight={'bold'}
            >
              プライバシーポリシー
            </Typography>
            <Box>
              <p>
                本プライバシーポリシーは、INFO
                BOX（以下「当サイト」という）が提供するサービスにおける、ユーザーの個人情報の取り扱いについて説明しています。
              </p>

              <h2>1. 個人情報の収集について</h2>
              <p>
                当サイトでは、コメントの投稿、お問い合わせ時、ニュースレターの登録、その他ユーザー登録を行う際に、名前、メールアドレス、サイトURLなどの個人情報を収集することがあります。
                <br />
                これらの情報は、サービス提供及び改善、ユーザーからの問い合わせに対する回答、またはその他の明確に通知された目的のためにのみ使用されます。
              </p>

              <h2>2. 個人情報の利用目的</h2>
              <p>収集した個人情報は以下の目的のために使用されます。</p>
              <ul>
                <li>サービスの提供・運営のため</li>
                <li>ユーザーからのお問い合わせに対する対応のため</li>
                <li>必要に応じた法律の遵守</li>
                <li>
                  当サイトの改善や新サービスの開発など、その他業務遂行上必要な目的
                </li>
              </ul>

              <h2>3. 個人情報の第三者への開示・提供の禁止</h2>
              <p>
                当サイトは、ユーザーの同意を得ずに、個人情報を第三者に開示・提供することはありません。ただし、法令に基づく場合や人の生命、身体または財産の保護のために必要がある場合に限り、個人情報を開示することがあります。
              </p>

              <h2>4. 個人情報の安全管理</h2>
              <p>
                当サイトは、収集した個人情報の漏洩、紛失、または損害の防止とその他の個人情報の安全管理のための必要な措置を講じます。
              </p>

              <h2>5. プライバシーポリシーの変更</h2>
              <p>
                当サイトは、必要に応じて、プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、当サイトに掲載されたものをもって発効するものとします。
              </p>

              <h2>6. お問い合わせ</h2>
              <p>
                プライバシーポリシーに関するお問い合わせは、以下の連絡先までお願い致します。
              </p>
              <p>listen.risu.blog@gmail.com</p>
            </Box>
          </>
        }
      />
      <FrontFooter />
    </>
  );
}

InfomationList.propTypes = {
  infomations_pagenation: PropTypes.object.isRequired,
};
