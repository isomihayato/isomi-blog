import { FirebaseError, initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GithubAuthProvider,
} from 'firebase/auth';

import { setStorage } from '@/Components/common/functions';
import 'firebase/auth';
import postMember from '@/Components/axios/axiosMember';
const firebaseConfig = {
  apiKey: 'AIzaSyCYeWqXbNz5kvbPymgWTWHSgZFYHfiIkwY',
  authDomain: 'info-box-eea0c.firebaseapp.com',
  projectId: 'info-box-eea0c',
  storageBucket: 'info-box-eea0c.appspot.com',
  messagingSenderId: '968801419268',
  appId: '1:968801419268:web:9de0cd22b035d24b537551',
  measurementId: 'G-S5HP2QHWW3',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export class FBClient {
  async passwordSignIn(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
  }
  async googlePopup() {
    const provider = new GoogleAuthProvider();
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, provider);
      console.log({ fb_uid: result.user.uid, photo_url: result.user.photoURL });
      postMember(
        { fb_uid: result.user.uid, photo_url: result.user.photoURL },
        (res: any) => {
          console.log(res.data);
        },
        (err: any) => {
          console.log(err);
        },
      );
      setStorage('photoUrl', result.user.photoURL);
      setStorage('user', { uid: result.user.uid });
      return 'success';
    } catch (error: FirebaseError) {
      console.log(error);

      if (error.code === 'auth/account-exists-with-different-credential') {
        alert(
          `${error.email}は他のSNSアカウントによるログインで登録済みです。`,
        );
        return error.code;
      }
    }
  }

  async githubPopup() {
    const provider = new GithubAuthProvider();
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      postMember(
        { fb_uid: result.user.uid },
        (res: any) => {
          console.log(res.data);
        },
        (err: any) => {
          console.log(err);
        },
      );
      setStorage('user', { uid: result.user.uid });
      return 'success';
    } catch (error: any) {
      console.log(error);

      if (error.code === 'auth/account-exists-with-different-credential') {
        alert(
          `${error.email}は他のSNSアカウントによるログインで登録済みです。`,
        );
        return error.code;
      }
    }
  }

  async mailAndPassword(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log(result);
      setStorage('user', { uid: result.user.uid });
      return 'signin';
    } catch (error: any) {
      if (error.code === 'auth/account-exists-with-different-credential') {
        alert(
          `${error.email}は他のSNSアカウントによるログインで登録済みです。`,
        );
        return 'error:auth/account-exists-with-different-credential';
      } else {
        try {
          const createResult = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          setStorage('user', { uid: createResult.user.uid });

          postMember(
            { fb_uid: createResult.user.uid },
            (res: any) => {
              console.log(res.data);
            },
            (err: any) => {
              console.log(err);
            },
          );
          return 'create';
        } catch (e) {
          if (e instanceof FirebaseError) {
            return e.code;
          }
        }
      }
    }
  }

  async emailSignUp(email: string, pwd: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pwd,
      );
      // await sendEmailVerification(userCredential.user);
      return userCredential.user.uid;
    } catch (e) {
      if (e instanceof FirebaseError) {
        console.log(e);
      }
    }
    return '';
  }
}
