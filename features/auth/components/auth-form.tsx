"use client";

import { useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "../hooks/use-auth";

const switchHref = { login: "/register", register: "/login" };

// Requirements for a new password. Checked in the browser for quick feedback only:
// the rule that actually protects accounts is the password policy set in Firebase Authentication.
const passwordRules = [
  { key: "length", test: (value: string) => value.length >= 8 },
  { key: "upper", test: (value: string) => /\p{Lu}/u.test(value) },
  { key: "lower", test: (value: string) => /\p{Ll}/u.test(value) },
  { key: "number", test: (value: string) => /\d/.test(value) },
  { key: "symbol", test: (value: string) => /[^\p{L}\p{N}\s]/u.test(value) },
] as const;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { handleSignIn, handleEmailSignIn, handleRegister } = useAuth();
  const router = useRouter();
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // The error only appears after a failed attempt to submit, then updates as the user types.
  const [passwordRejected, setPasswordRejected] = useState(false);
  const [pending, setPending] = useState(false);
  const { language, t } = useLanguage();
  const text = t.auth[mode];
  const missingRules = mode === "register" ? passwordRules.filter((rule) => !rule.test(password)).map((rule) => t.auth.passwordRules[rule.key]) : [];
  const passwordError = passwordRejected && missingRules.length > 0;

  // Run a sign-in action, then open the workspace if it succeeded.
  // On failure the fields keep what the user typed.
  async function run(action: () => Promise<boolean>) {
    setPending(true);
    if (await action()) router.replace("/");
    else setPending(false);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (missingRules.length > 0) {
      setPasswordRejected(true);
      return;
    }
    void run(() => mode === "login" ? handleEmailSignIn(email, password) : handleRegister(name, email, password));
  }

  return (
    // "contents" keeps this wrapper out of the layout. It only carries data-language, which
    // hides the prerendered Khmer form from English visitors (see lib/i18n.ts).
    <div data-language={language} className="contents">
      <div className="eyebrow">{text.eyebrow}</div>
      <h1 className="login-title">{text.title}</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        {mode === "register" && <div className="auth-field">
          <label htmlFor={`${id}-name`}>{t.auth.name}</label>
          <Input id={`${id}-name`} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
        </div>}
        <div className="auth-field">
          <label htmlFor={`${id}-email`}>{t.auth.email}</label>
          <Input id={`${id}-email`} type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
        </div>
        <div className="auth-field">
          <label htmlFor={`${id}-password`}>{t.auth.password}</label>
          <div className="auth-password">
            <Input id={`${id}-password`} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "login" ? 6 : undefined} required aria-invalid={passwordError ? true : undefined} aria-describedby={passwordError ? `${id}-error` : undefined} />
            <button type="button" className="auth-password-toggle" aria-label={showPassword ? t.auth.hidePassword : t.auth.showPassword} aria-pressed={showPassword} onClick={() => setShowPassword((shown) => !shown)}>
              {showPassword ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
            </button>
          </div>
          {passwordError && <p id={`${id}-error`} className="auth-error" role="alert">{t.auth.passwordNeeds(new Intl.ListFormat(t.locale, { type: "conjunction" }).format(missingRules))}</p>}
        </div>
        <Button className="login-button" size="lg" type="submit" disabled={pending}>{text.submit}</Button>
      </form>
      <div className="auth-divider" aria-hidden="true">{t.auth.or}</div>
      <Button className="login-button" variant="outline" size="lg" type="button" disabled={pending} onClick={() => void run(handleSignIn)}><GoogleIcon /> {t.auth.continueWithGoogle}</Button>
      <p className="auth-switch">{text.switchText} <Link href={switchHref[mode]}>{text.switchLabel}</Link></p>
    </div>
  );
}

// Lucide has no brand icons, so the Google "G" is drawn inline. Decorative: the button text names the provider.
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3.01h3.88c2.27-2.09 3.58-5.17 3.58-8.82Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3.01c-1.07.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.11A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.28 14.28a7.2 7.2 0 0 1 0-4.56V6.61H1.27a12 12 0 0 0 0 10.78l4.01-3.11Z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4.01 3.11C6.22 6.88 8.87 4.77 12 4.77Z" />
    </svg>
  );
}
