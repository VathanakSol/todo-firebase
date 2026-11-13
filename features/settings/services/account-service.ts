import { EmailAuthProvider, GoogleAuthProvider, deleteUser, reauthenticateWithCredential, reauthenticateWithPopup, updateProfile, type User } from "firebase/auth";
import { removeTodos } from "@/features/todos/services/todo-service";

// True for accounts created with email and password; the others sign in with Google.
export function usesPassword(user: User) {
  return user.providerData.some((provider) => provider.providerId === "password");
}

export function updateDisplayName(user: User, name: string) {
  return updateProfile(user, { displayName: name });
}

// Deletes the user's tasks and then the account itself.
// Firebase only deletes an account shortly after a sign-in, so the user first proves who
// they are again (password, or the Google popup). Doing that first also means the tasks
// are never deleted for an account that then turns out not to be deletable. The tasks go
// before the account because, once the account is gone, nobody is allowed to delete them.
export async function deleteAccount(user: User, password: string) {
  if (usesPassword(user)) await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email ?? "", password));
  else await reauthenticateWithPopup(user, new GoogleAuthProvider());
  await removeTodos(user.uid, false);
  await deleteUser(user);
}
