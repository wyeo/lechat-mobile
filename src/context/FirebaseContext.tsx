import auth, {
  getIdToken,
  updateEmail,
  updateProfile,
  FirebaseAuthTypes,
} from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";

import dayjs from "lib/dayjs";
import GoogleSignIn from "lib/firebase/GoogleSignIn";

import {
  USERS_COLLECTION,
  USER_CHAT_SUBCOLLECTION,
  CHAT_MESSAGES_SUBCOLLECTION,
} from "config/firebase/collections";
import { USERS_BUCKET_URL } from "config/firebase/bucket";

import getStorageRefPath from "utils/getStorageRefPath";

import type ChatType from "types/ChatType";
import type ChatMessageType from "types/ChatMessageType";

type GroupedUserChatsType = {
  todayChats: ChatType[];
  yesterdayChats: ChatType[];
  sevenDaysChats: ChatType[];
  thirtyDaysChats: ChatType[];
  olderDaysChats: ChatType[];
};

interface FirebaseContextType {
  currentUser: FirebaseAuthTypes.User | null | undefined;
  initializing: boolean;
  logout: () => Promise<void>;
  createUser: (params: {
    email: string;
    password: string;
    lastname: string | null;
    firstname: string | null;
  }) => Promise<FirebaseAuthTypes.User>;
  deleteAccount: () => Promise<void>;
  getCurrentUserIdToken: () => Promise<string>;
  getUserChats(): Promise<GroupedUserChatsType>;
  createChat: (title: string) => Promise<string>;
  linkUserWithGoogleAccount: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserEmail: (email: string) => Promise<void>;
  linkUserWithMicrosoftAccount: () => Promise<void>;
  updatePhotoUrl: (photoURL: string) => Promise<void>;
  loginWithGoogle: () => Promise<FirebaseAuthTypes.User>;
  updateDisplayName: (displayName: string) => Promise<void>;
  loginWithMicrosoft: () => Promise<FirebaseAuthTypes.User>;
  getChatMessages: (chatId: string) => Promise<ChatMessageType[]>;
  updateChatTitle: (chatId: string, title: string) => Promise<void>;
  login: (email: string, password: string) => Promise<FirebaseAuthTypes.User>;
  addChatMessage: (chatId: string, message: ChatMessageType) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(
  undefined
);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [initializing, setInitializing] = useState(true);
  const [currentUser, setCurrentUser] = useState<
    FirebaseAuthTypes.User | null | undefined
  >(null);

  /**
   * Updates or creates a user document in Firestore with the user's basic information
   *
   * @param uid The user's unique identifier
   * @param email The user's email address
   * @param displayName The user's display name
   */
  async function _updateUserFirestoreDocument({
    uid,
    email,
    displayName,
  }: {
    uid: string;
    email: string | null;
    displayName: string | null;
  }) {
    return firestore()
      .collection(USERS_COLLECTION)
      .doc(uid)
      .set({ email, displayName });
  }

  /**
   * Handles authentication state changes
   *
   * @param user The current Firebase user or null if signed out
   */
  async function _onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    if (user && !currentUser) {
      setCurrentUser(user);
      _updateUserFirestoreDocument(user);
    } else if (!user) {
      setCurrentUser(undefined);
    }

    if (initializing) {
      setInitializing(false);
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(_onAuthStateChanged);
    return () => subscriber();
  }, [currentUser]);

  /**
   * Sign in a user with email and password.
   *
   * @param email The user's email address
   * @param password The user's password
   *
   * @returns A Promise that resolves with the UserCredential when signed in successfully
   * @throws {FirebaseAuthTypes.NativeFirebaseAuthError} If sign in fails
   */
  function login(email: string, password: string) {
    return auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => user);
  }

  /**
   * Sign in a user with Google authentication.
   *
   * @returns A Promise that resolves with the Firebase User object when signed in successfully
   * @throws {Error} If no ID token is found in the Google sign in result
   * @throws {FirebaseAuthTypes.NativeFirebaseAuthError} If sign in fails
   */
  async function loginWithGoogle() {
    await GoogleSignIn.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const signInResult = await GoogleSignIn.signIn();

    if (!signInResult.data?.idToken) {
      throw new Error("No ID token found");
    }

    return auth()
      .signInWithCredential(
        auth.GoogleAuthProvider.credential(signInResult.data?.idToken || "")
      )
      .then(({ user }) => user);
  }

  /**
   * Sign in a user with Microsoft authentication.
   *
   * @returns A Promise that resolves with the Firebase User object when signed in successfully
   * @throws {FirebaseAuthTypes.NativeFirebaseAuthError} If sign in fails
   */
  async function loginWithMicrosoft() {
    const provider = new auth.OAuthProvider("microsoft.com");
    provider.addScope("offline_access");
    provider.setCustomParameters({ prompt: "consent" });

    return auth()
      .signInWithPopup(provider)
      .then(({ user }) => user);
  }

  /**
   * Links the current user's account with a Microsoft account.
   *
   * @returns A Promise that resolves when the accounts are linked successfully
   * @throws {Error} If no current user exists
   * @throws {FirebaseAuthTypes.NativeFirebaseAuthError} If linking fails
   */
  async function linkUserWithMicrosoftAccount() {
    if (!currentUser) {
      return Promise.reject(`Current user is not logged in`);
    }

    const provider = new auth.OAuthProvider("microsoft.com");
    provider.addScope("offline_access");
    provider.setCustomParameters({ prompt: "consent" });

    await currentUser.linkWithPopup(provider);
  }

  /**
   * Links the current user's account with a Google account.
   *
   * @returns A Promise that resolves when the accounts are linked successfully
   * @throws {Error} If no current user exists or if no ID token is found
   * @throws {FirebaseAuthTypes.NativeFirebaseAuthError} If linking fails
   */
  async function linkUserWithGoogleAccount() {
    if (!currentUser) {
      return Promise.reject(`Current user is not logged in`);
    }

    await GoogleSignIn.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const result = await GoogleSignIn.signIn();

    if (!result.data?.idToken) {
      throw new Error("No ID token found");
    }

    const googleCredential = auth.GoogleAuthProvider.credential(
      result.data?.idToken || ""
    );

    await currentUser?.linkWithCredential(googleCredential);
  }

  /**
   * Create a new user account with email and password, and set their profile info.
   *
   * @param email The email address for the new account
   * @param password The password for the new account
   * @param firstname The user's first name
   * @param lastname The user's last name
   *
   * @returns A Promise that resolves with the created User
   * @throws {FirebaseAuthTypes.NativeFirebaseAuthError} If account creation fails
   */
  function createUser({
    email,
    password,
    lastname,
    firstname,
  }: {
    email: string;
    password: string;
    lastname: string | null;
    firstname: string | null;
  }) {
    return auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async ({ user }) => {
        await _updateUserFirestoreDocument({
          ...user,
          displayName:
            lastname || firstname ? `${lastname} ${firstname}`.trim() : null,
        });
        return user;
      });
  }

  /**
   * Send a password reset email to the specified email address.
   *
   * @param email The email address to send the password reset link to
   *
   * @returns A Promise that resolves when the reset email is sent
   * @throws {FirebaseAuthTypes.NativeFirebaseAuthError} If sending reset email fails
   */
  function resetPassword(email: string) {
    return auth().sendPasswordResetEmail(email);
  }

  /**
   * Update user photo url
   *
   * @param photoURL The URL of the user's new profile photo
   *
   * @returns A Promise that resolves when the photo URL is updated, or rejects if no user is logged in
   */
  function updatePhotoUrl(photoURL: string) {
    if (!currentUser) {
      return Promise.reject(`Current user is not logged in`);
    }

    return updateProfile(currentUser, { photoURL });
  }

  /**
   * Update user display name.
   *
   * @param displayName The new display name for the user
   *
   * @returns A Promise that resolves when the display name is updated, or rejects if no user is logged in
   */
  function updateDisplayName(displayName: string) {
    if (!currentUser) {
      return Promise.reject(`Current user is not logged in`);
    }

    return updateProfile(currentUser, { displayName });
  }

  /**
   * Update user email address.
   *
   * @param email The new email address for the user
   *
   * @returns A Promise that resolves when the email is updated, or rejects if no user is logged in
   */
  function updateUserEmail(email: string) {
    if (!currentUser) {
      return Promise.reject(`Current user is not logged in`);
    }

    return updateEmail(currentUser, email);
  }

  /**
   * Retrieves the current user's ID token.
   *
   * @returns A Promise that resolves with the ID token string or rejects if no user is logged in
   */
  function getCurrentUserIdToken() {
    if (!currentUser) {
      return Promise.reject(`Current user is not logged in`);
    }

    return getIdToken(currentUser);
  }

  /**
   * Signs out the current user.
   *
   * @returns A Promise that resolves when the user is signed out
   */
  function logout() {
    return auth().signOut();
  }

  /**
   * Deletes the current user's account.
   *
   * @returns A Promise that resolves when the account is deleted, or rejects if no user is logged in
   */
  function deleteAccount() {
    if (!currentUser) {
      return Promise.reject(`Current user is not logged in`);
    }

    return currentUser.delete();
  }

  /**
   * Creates a new chat for the current user with the specified title.
   *
   * @param title The title to give the new chat
   * @returns A Promise that resolves with the new chat ID, or rejects if no user is logged in
   */
  async function createChat(title: string) {
    if (!currentUser) {
      return Promise.reject("Current user is not logged in");
    }

    const chatRef = await firestore()
      .collection(USERS_COLLECTION)
      .doc(currentUser.uid)
      .collection(USER_CHAT_SUBCOLLECTION)
      .add({
        title,
        createdAt: firestore.FieldValue.serverTimestamp(),
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      });

    return chatRef.id;
  }

  /**
   * Updates the title of an existing chat.
   *
   * @param chatId The ID of the chat to update
   * @param title The new title for the chat
   * @returns A Promise that resolves when the title is updated, or rejects if no user is logged in
   */
  async function updateChatTitle(chatId: string, title: string) {
    if (!currentUser) {
      return Promise.reject("Current user is not logged in");
    }

    await firestore()
      .collection(USERS_COLLECTION)
      .doc(currentUser.uid)
      .collection(USER_CHAT_SUBCOLLECTION)
      .doc(chatId)
      .update({ title });

    return Promise.resolve();
  }

  /**
   * Adds a message to an existing chat.
   *
   * @param chatId The ID of the chat to add the message to
   * @param message The message object to add
   * @returns A Promise that resolves when the message is added, or rejects if no user is logged in
   */
  async function addChatMessage(chatId: string, message: ChatMessageType) {
    if (!currentUser) {
      return Promise.reject("Current user is not logged in");
    }

    const { attachments, ...messageValue } = message;

    const processedAttachments = attachments
      ? await Promise.all(
          attachments.map(async ({ name, url, contentType }) => {
            try {
              const ref = getStorageRefPath(
                USERS_BUCKET_URL,
                currentUser.uid,
                USER_CHAT_SUBCOLLECTION,
                chatId,
                name || `file-${Date.now()}`
              );

              await storage().ref(ref).putFile(url);

              return { name, url: ref, contentType };
            } catch (error) {
              console.error(`Failed to upload attachment ${name}:`, error);
              throw error;
            }
          })
        )
      : [];

    const userChatDoc = firestore()
      .collection(USERS_COLLECTION)
      .doc(currentUser.uid)
      .collection(USER_CHAT_SUBCOLLECTION)
      .doc(chatId);

    return firestore().runTransaction(async (transaction) => {
      const chatDoc = await transaction.get(userChatDoc);

      if (!chatDoc.exists) {
        throw new Error(`Chat ${chatId} does not exist`);
      }

      transaction.update(userChatDoc, {
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      });

      const messageRef = userChatDoc
        .collection(CHAT_MESSAGES_SUBCOLLECTION)
        .doc();

      transaction.set(messageRef, {
        ...messageValue,
        chatId,
        attachments: processedAttachments,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
    });
  }

  /**
   * Retrieves all messages from a specific chat.
   *
   * @param chatId The ID of the chat to get messages from
   * @returns A Promise that resolves with an array of chat messages, or rejects if no user is logged in
   */
  async function getChatMessages(chatId: string) {
    if (!currentUser) {
      return Promise.reject("Current user is not logged in");
    }

    const chatDoc = await firestore()
      .collection(USERS_COLLECTION)
      .doc(currentUser.uid)
      .collection(USER_CHAT_SUBCOLLECTION)
      .doc(chatId)
      .get();

    if (!chatDoc.exists) {
      throw new Error(`Chat ${chatId} not found`);
    }

    const messagesSnapshot = await firestore()
      .collection(USERS_COLLECTION)
      .doc(currentUser.uid)
      .collection(USER_CHAT_SUBCOLLECTION)
      .doc(chatId)
      .collection(CHAT_MESSAGES_SUBCOLLECTION)
      .orderBy("createdAt", "asc")
      .get();

    return await Promise.all(
      messagesSnapshot.docs.map(async (doc) => {
        try {
          const data = doc.data() as ChatMessageType;

          const attachments = data?.attachments
            ? await Promise.all(
                data.attachments.map(async ({ url, ...values }) => {
                  const downloadUrl = await storage().ref(url).getDownloadURL();

                  return { ...values, url: downloadUrl };
                })
              )
            : [];

          return { ...data, id: doc.id, attachments } as ChatMessageType;
        } catch (error) {
          console.error(`Error processing message ${doc.id}:`, error);
          throw error;
        }
      })
    );
  }

  /**
   * Retrieves all chats for the current user, grouped by time period (yesterday, last 7 days, last 30 days, older).
   *
   * @returns A Promise that resolves with an object containing chat arrays sorted by lastUpdated in descending order:
   * - todayChats: Chats of the current day
   * - yesterdayChats: Chats from yesterday
   * - sevenDaysChats: Chats from 1-7 days ago
   * - thirtyDaysChats: Chats from 7-30 days ago
   * - olderDaysChats: Chats older than 30 days
   * Each chat object includes the chat data and document ID.
   * Rejects if no user is logged in.
   */
  async function getUserChats() {
    if (!currentUser) {
      return Promise.reject("Current user is not logged in");
    }

    const userChatsCollection = firestore()
      .collection(USERS_COLLECTION)
      .doc(currentUser.uid)
      .collection(USER_CHAT_SUBCOLLECTION)
      .orderBy("lastUpdated", "desc");

    const today = dayjs().startOf("day").toDate();
    const yesterday = dayjs(today).subtract(1, "day").toDate();
    const sevenDaysAgo = dayjs(today).subtract(7, "day").toDate();
    const thirtyDaysAgo = dayjs(today).subtract(30, "day").toDate();

    const [
      todaySnapshot,
      yesterdaySnapshot,
      sevenDaysSnapshot,
      thirtyDaysSnapshot,
      olderSnapshot,
    ] = await Promise.all([
      userChatsCollection.where("lastUpdated", ">=", today).get(),
      userChatsCollection
        .where("lastUpdated", "<", today)
        .where("lastUpdated", ">=", yesterday)
        .get(),
      userChatsCollection
        .where("lastUpdated", "<", yesterday)
        .where("lastUpdated", ">=", sevenDaysAgo)
        .get(),
      userChatsCollection
        .where("lastUpdated", "<", sevenDaysAgo)
        .where("lastUpdated", ">=", thirtyDaysAgo)
        .get(),
      userChatsCollection.where("lastUpdated", "<", thirtyDaysAgo).get(),
    ]);

    return {
      todayChats: todaySnapshot.docs.map((doc) => ({
        ...(doc.data() as ChatType),
        id: doc.id,
      })),
      yesterdayChats: yesterdaySnapshot.docs.map((doc) => ({
        ...(doc.data() as ChatType),
        id: doc.id,
      })),
      sevenDaysChats: sevenDaysSnapshot.docs.map((doc) => ({
        ...(doc.data() as ChatType),
        id: doc.id,
      })),
      thirtyDaysChats: thirtyDaysSnapshot.docs.map((doc) => ({
        ...(doc.data() as ChatType),
        id: doc.id,
      })),
      olderDaysChats: olderSnapshot.docs.map((doc) => ({
        ...(doc.data() as ChatType),
        id: doc.id,
      })),
    };
  }

  const value = {
    currentUser,
    initializing,
    login,
    logout,
    createUser,
    resetPassword,
    deleteAccount,
    updatePhotoUrl,
    updateUserEmail,
    loginWithGoogle,
    updateDisplayName,
    createChat,
    getUserChats,
    addChatMessage,
    updateChatTitle,
    getChatMessages,
    loginWithMicrosoft,
    getCurrentUserIdToken,
    linkUserWithGoogleAccount,
    linkUserWithMicrosoftAccount,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

/**
 * Hook that provides access to authentication context.
 * Must be used within an AuthProvider component.
 *
 * @returns The authentication context containing all auth-related methods and state
 * @throws {Error} If used outside of AuthProvider
 */
export function useFirebase() {
  const context = useContext(FirebaseContext);

  if (typeof context === "undefined") {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
