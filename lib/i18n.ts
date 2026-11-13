"use client";

import { useSyncExternalStore } from "react";

export type Language = "km" | "en";
export const DEFAULT_LANGUAGE: Language = "km";
const en = {
  locale: "en-US",
  common: {
    siteName: "Kot Tuk",
    brandLabel: "YOUR SPACE",
    footer: "A LITTLE PROGRESS, EVERY DAY",
    switchLanguage: "ប្តូរទៅភាសាខ្មែរ",
    otherLanguage: "ខ្មែរ",
    dismissNotification: "Dismiss notification",
  },
  hero: {
    eyebrow: "YOUR PERSONAL WORKSPACE",
    titleLead: "Make space for",
    titleAccent: "what matters.",
    tagline: "A little progress goes a long way.",
    intro: "Hello there. Sign in to start your list — a little progress goes a long way.",
  },
  orb: {
    label: "3D notebook. Drag or use arrow keys to rotate.",
    pageLabel: "Notebook page. Type to write on the open book.",
    open: "Open book",
    close: "Close book",
    typing: "Typing on the page…",
    clickToType: "Click the page and type to write",
    placeholder: "Click to write…",
  },
  features: {
    title: "WHAT YOU CAN DO",
    items: {
      priority: { title: "Set priorities", text: "Mark tasks low, medium or high so the important ones stand out." },
      progress: { title: "See your progress", text: "Watch the ring fill as you complete your tasks." },
      reorder: { title: "Reorder freely", text: "Drag tasks into the order that suits your day." },
    },
  },
  howItWorks: {
    title: "HOW IT WORKS",
    step: (number: number) => `STEP ${number}`,
    items: [
      { title: "Create your account", text: "Sign up with your email or continue with Google." },
      { title: "Add your tasks", text: "Write down what you want to get done and give each task a priority." },
      { title: "Check them off", text: "Complete tasks one by one and watch your progress grow." },
    ],
  },
  cta: {
    create: "Create an account",
    title: "Ready to make some space?",
    text: "Create your account and start your list today.",
  },
  auth: {
    checking: "Opening your book...",
    signIn: "Sign in",
    signOut: "Sign out",
    login: { eyebrow: "WELCOME BACK", title: "Sign in to your space", submit: "Sign in", switchText: "New here?", switchLabel: "Create an account" },
    register: { eyebrow: "GET STARTED", title: "Create your space", submit: "Create account", switchText: "Already have an account?", switchLabel: "Sign in" },
    name: "Name",
    email: "Email",
    password: "Password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    or: "or",
    continueWithGoogle: "Continue with Google",
    passwordRules: { length: "at least 8 characters", upper: "an uppercase letter", lower: "a lowercase letter", number: "a number", symbol: "a symbol (such as ! @ # ?)" },
    passwordNeeds: (missing: string) => `Password needs ${missing}.`,
    signedIn: "Signed in successfully.",
    signInFailed: "Could not sign in. Please try again.",
    accountCreated: "Account created.",
    registerFailed: "Could not create your account. Please try again.",
    signedOut: "Signed out successfully.",
    signOutFailed: "Could not sign out. Please try again.",
    wrongCredentials: "Email or password is incorrect.",
    emailInUse: "An account with this email already exists. Try signing in.",
    weakPassword: "That password is not strong enough. Please choose a stronger one.",
    invalidEmail: "Please enter a valid email address.",
    tooManyAttempts: "Too many attempts. Please wait a moment and try again.",
    emailSignInDisabled: "Email sign-in is not enabled for this app yet.",
  },
  todos: {
    greeting: { morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening" },
    progressRegion: "Progress",
    placeholder: "What would you like to get done?",
    newTask: "New task",
    addTask: "Add task",
    filterTasks: "Filter tasks",
    filters: { all: "All", active: "Active", completed: "Completed" },
    empty: "No tasks here yet. Make a little space for your next idea.",
    move: (task: string) => `Move ${task}. Drag or use the up and down arrow keys.`,
    markComplete: (task: string) => `Mark ${task} complete`,
    editName: "Edit task name",
    save: "Save task",
    cancel: "Cancel editing",
    edit: (task: string) => `Edit ${task}`,
    remove: (task: string) => `Delete ${task}`,
    priority: { low: "Low", medium: "Medium", high: "High" },
    priorityDescription: { low: "Can wait for later", medium: "Keep it on your radar", high: "Needs your attention" },
    priorityOf: (priority: string) => `${priority} priority`,
    taskPriority: "Task priority",
    setPriority: "SET PRIORITY",
    yourProgress: "YOUR PROGRESS",
    progressSummary: (completed: number, total: number, percent: number) => `${completed} of ${total} tasks completed, ${percent} percent`,
    done: "done",
    captionBefore: "",
    captionAfter: (total: number) => ` of ${total} tasks completed`,
    byPriority: "BY PRIORITY",
    priorityProgress: (priority: string, done: number, total: number) => `${priority}: ${done} of ${total} completed`,
    completedSuffix: " completed",
    loadFailed: "Could not load your tasks. Please try again.",
    enterTask: "Enter a task first.",
    added: "Task added.",
    addFailed: "Could not add the task. Please try again.",
    markedActive: "Task marked active.",
    completed: "Task completed.",
    updateFailed: "Could not update the task. Please try again.",
    deleted: "Task deleted.",
    deleteFailed: "Could not delete the task. Please try again.",
    updated: "Task updated.",
    saveFailed: "Could not save the task. Please try again.",
    orderFailed: "Could not save task order. Please try again.",
  },
  settings: {
    title: "Settings",
    eyebrow: "YOUR ACCOUNT",
    open: "Settings",
    back: "Back to tasks",
    cancel: "Cancel",
    profile: {
      title: "Profile",
      text: "Your name appears in the greeting on your tasks page.",
      name: "Name",
      email: "Email",
      save: "Save name",
      saved: "Name saved.",
      saveFailed: "Could not save your name. Please try again.",
      nameRequired: "Enter a name first.",
    },
    data: {
      title: "Your tasks",
      summary: (total: number, completed: number) => `You have ${total} tasks, ${completed} of them completed.`,
      exportText: "You can download a copy of all your tasks as a JSON file, or delete tasks you no longer need.",
      export: "Download tasks",
      exported: "Tasks downloaded.",
      exportFailed: "Could not download your tasks. Please try again.",
      nothingToExport: "You have no tasks to download.",
      deleteCompleted: "Delete completed tasks",
      deleteAll: "Delete all tasks",
      confirmCompleted: (count: number) => `Delete ${count} completed tasks? This cannot be undone.`,
      confirmAll: (count: number) => `Delete all ${count} tasks? This cannot be undone.`,
      confirm: "Yes, delete",
      deleted: (count: number) => `${count} tasks deleted.`,
      deleteFailed: "Could not delete the tasks. Please try again.",
    },
    account: {
      title: "Delete account",
      text: "Permanently delete your account and all of your tasks.",
      delete: "Delete my account",
      confirmText: "This deletes your account and every task in it. This cannot be undone.",
      passwordHint: "Enter your password to confirm.",
      googleHint: "You will be asked to sign in with Google again to confirm.",
      confirm: "Delete account permanently",
      deleted: "Your account was deleted.",
      deleteFailed: "Could not delete your account. Please try again.",
      wrongPassword: "That password is incorrect.",
    },
  },
};

export type Dictionary = typeof en;

// Typed as Dictionary, so TypeScript reports any text that is missing a Khmer translation.
const km: Dictionary = {
  locale: "km-KH",
  common: {
    siteName: "កត់ទុក",
    brandLabel: "កន្លែងរបស់អ្នក",
    footer: "រីកចម្រើនបន្តិចម្តងៗ ជារៀងរាល់ថ្ងៃ",
    switchLanguage: "Switch to English",
    otherLanguage: "English",
    dismissNotification: "បិទការជូនដំណឹង",
  },
  hero: {
    eyebrow: "កន្លែងធ្វើការផ្ទាល់ខ្លួនរបស់អ្នក",
    titleLead: "ទុកកន្លែងសម្រាប់",
    titleAccent: "អ្វីដែលសំខាន់។",
    tagline: "រីកចម្រើនបន្តិចម្តងៗ ក៏នាំទៅឆ្ងាយបាន។",
    intro: "សួស្តី។ សូមចូលគណនីដើម្បីចាប់ផ្តើមបញ្ជីរបស់អ្នក — រីកចម្រើនបន្តិចម្តងៗ ក៏នាំទៅឆ្ងាយបាន។",
  },
  orb: {
    label: "សៀវភៅកត់ត្រា 3D។ អូស ឬប្រើគ្រាប់ចុចព្រួញដើម្បីបង្វិល។",
    pageLabel: "ទំព័រសៀវភៅ។ វាយអក្សរដើម្បីសរសេរលើសៀវភៅដែលបើក។",
    open: "បើកសៀវភៅ",
    close: "បិទសៀវភៅ",
    typing: "កំពុងសរសេរលើទំព័រ…",
    clickToType: "ចុចលើទំព័រ រួចវាយអក្សរដើម្បីសរសេរ",
    placeholder: "ចុចដើម្បីសរសេរ…",
  },
  features: {
    title: "អ្វីដែលអ្នកអាចធ្វើបាន",
    items: {
      priority: { title: "កំណត់អាទិភាព", text: "សម្គាល់កិច្ចការថាទាប មធ្យម ឬខ្ពស់ ដើម្បីឱ្យកិច្ចការសំខាន់លេចធ្លោ។" },
      progress: { title: "មើលវឌ្ឍនភាពរបស់អ្នក", text: "មើលរង្វង់កើនឡើង នៅពេលអ្នកបញ្ចប់កិច្ចការ។" },
      reorder: { title: "រៀបលំដាប់តាមចិត្ត", text: "អូសកិច្ចការទៅតាមលំដាប់ដែលសមនឹងថ្ងៃរបស់អ្នក។" },
    },
  },
  howItWorks: {
    title: "របៀបប្រើប្រាស់",
    step: (number: number) => `ជំហានទី ${number}`,
    items: [
      { title: "បង្កើតគណនីរបស់អ្នក", text: "ចុះឈ្មោះដោយប្រើអ៊ីមែល ឬបន្តជាមួយ Google។" },
      { title: "បន្ថែមកិច្ចការរបស់អ្នក", text: "សរសេរអ្វីដែលអ្នកចង់ធ្វើឱ្យរួចរាល់ ហើយកំណត់អាទិភាពឱ្យកិច្ចការនីមួយៗ។" },
      { title: "សម្គាល់ថាបានបញ្ចប់", text: "បញ្ចប់កិច្ចការម្តងមួយៗ ហើយមើលវឌ្ឍនភាពរបស់អ្នកកើនឡើង។" },
    ],
  },
  cta: {
    create: "បង្កើតគណនី",
    title: "ត្រៀមខ្លួនចាប់ផ្តើមហើយឬនៅ?",
    text: "បង្កើតគណនីរបស់អ្នក ហើយចាប់ផ្តើមបញ្ជីរបស់អ្នកនៅថ្ងៃនេះ។",
  },
  auth: {
    checking: "កំពុងបើកសៀវភៅរបស់អ្នក...",
    signIn: "ចូលគណនី",
    signOut: "ចាកចេញ",
    login: { eyebrow: "សូមស្វាគមន៍ការត្រឡប់មកវិញ", title: "ចូលទៅកាន់កន្លែងរបស់អ្នក", submit: "ចូលគណនី", switchText: "ទើបមកដំបូង?", switchLabel: "បង្កើតគណនី" },
    register: { eyebrow: "ចាប់ផ្តើម", title: "បង្កើតកន្លែងរបស់អ្នក", submit: "បង្កើតគណនី", switchText: "មានគណនីរួចហើយ?", switchLabel: "ចូលគណនី" },
    name: "ឈ្មោះ",
    email: "អ៊ីមែល",
    password: "ពាក្យសម្ងាត់",
    showPassword: "បង្ហាញពាក្យសម្ងាត់",
    hidePassword: "លាក់ពាក្យសម្ងាត់",
    or: "ឬ",
    continueWithGoogle: "បន្តជាមួយ Google",
    passwordRules: { length: "យ៉ាងតិច ៨ តួអក្សរ", upper: "អក្សរធំមួយ (A-Z)", lower: "អក្សរតូចមួយ (a-z)", number: "លេខមួយ", symbol: "និមិត្តសញ្ញាមួយ (ដូចជា ! @ # ?)" },
    passwordNeeds: (missing: string) => `ពាក្យសម្ងាត់ត្រូវមាន ${missing}។`,
    signedIn: "បានចូលគណនីដោយជោគជ័យ។",
    signInFailed: "មិនអាចចូលគណនីបានទេ។ សូមព្យាយាមម្តងទៀត។",
    accountCreated: "បានបង្កើតគណនី។",
    registerFailed: "មិនអាចបង្កើតគណនីរបស់អ្នកបានទេ។ សូមព្យាយាមម្តងទៀត។",
    signedOut: "បានចាកចេញដោយជោគជ័យ។",
    signOutFailed: "មិនអាចចាកចេញបានទេ។ សូមព្យាយាមម្តងទៀត។",
    wrongCredentials: "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ។",
    emailInUse: "មានគណនីប្រើអ៊ីមែលនេះរួចហើយ។ សូមសាកល្បងចូលគណនី។",
    weakPassword: "ពាក្យសម្ងាត់នេះមិនទាន់រឹងមាំគ្រប់គ្រាន់ទេ។ សូមជ្រើសរើសពាក្យសម្ងាត់ដែលរឹងមាំជាងនេះ។",
    invalidEmail: "សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលដែលត្រឹមត្រូវ។",
    tooManyAttempts: "ព្យាយាមច្រើនដងពេក។ សូមរង់ចាំបន្តិច រួចព្យាយាមម្តងទៀត។",
    emailSignInDisabled: "ការចូលដោយអ៊ីមែលមិនទាន់បានបើកសម្រាប់កម្មវិធីនេះនៅឡើយទេ។",
  },
  todos: {
    greeting: { morning: "អរុណសួស្តី", afternoon: "ទិវាសួស្តី", evening: "សាយណ្ហសួស្តី" },
    progressRegion: "វឌ្ឍនភាព",
    placeholder: "តើអ្នកចង់ធ្វើអ្វីឱ្យរួចរាល់?",
    newTask: "កិច្ចការថ្មី",
    addTask: "បន្ថែមកិច្ចការ",
    filterTasks: "ត្រងកិច្ចការ",
    filters: { all: "ទាំងអស់", active: "កំពុងធ្វើ", completed: "បានបញ្ចប់" },
    empty: "មិនទាន់មានកិច្ចការនៅទីនេះទេ។ ទុកកន្លែងបន្តិចសម្រាប់គំនិតបន្ទាប់របស់អ្នក។",
    move: (task: string) => `ផ្លាស់ទី ${task}។ អូស ឬប្រើគ្រាប់ចុចព្រួញឡើងលើ និងចុះក្រោម។`,
    markComplete: (task: string) => `សម្គាល់ ${task} ថាបានបញ្ចប់`,
    editName: "កែឈ្មោះកិច្ចការ",
    save: "រក្សាទុកកិច្ចការ",
    cancel: "បោះបង់ការកែ",
    edit: (task: string) => `កែ ${task}`,
    remove: (task: string) => `លុប ${task}`,
    priority: { low: "ទាប", medium: "មធ្យម", high: "ខ្ពស់" },
    priorityDescription: { low: "អាចរង់ចាំពេលក្រោយបាន", medium: "គួរតាមដានទុក", high: "ត្រូវការការយកចិត្តទុកដាក់" },
    priorityOf: (priority: string) => `អាទិភាព${priority}`,
    taskPriority: "អាទិភាពកិច្ចការ",
    setPriority: "កំណត់អាទិភាព",
    yourProgress: "វឌ្ឍនភាពរបស់អ្នក",
    progressSummary: (completed: number, total: number, percent: number) => `បានបញ្ចប់ ${completed} នៃ ${total} កិច្ចការ ស្មើនឹង ${percent} ភាគរយ`,
    done: "រួចរាល់",
    captionBefore: "បានបញ្ចប់ ",
    captionAfter: (total: number) => ` នៃ ${total} កិច្ចការ`,
    byPriority: "តាមអាទិភាព",
    priorityProgress: (priority: string, done: number, total: number) => `${priority}៖ បានបញ្ចប់ ${done} នៃ ${total}`,
    completedSuffix: " បានបញ្ចប់",
    loadFailed: "មិនអាចផ្ទុកកិច្ចការរបស់អ្នកបានទេ។ សូមព្យាយាមម្តងទៀត។",
    enterTask: "សូមបញ្ចូលកិច្ចការជាមុនសិន។",
    added: "បានបន្ថែមកិច្ចការ។",
    addFailed: "មិនអាចបន្ថែមកិច្ចការបានទេ។ សូមព្យាយាមម្តងទៀត។",
    markedActive: "បានសម្គាល់កិច្ចការថាកំពុងធ្វើ។",
    completed: "បានបញ្ចប់កិច្ចការ។",
    updateFailed: "មិនអាចកែប្រែកិច្ចការបានទេ។ សូមព្យាយាមម្តងទៀត។",
    deleted: "បានលុបកិច្ចការ។",
    deleteFailed: "មិនអាចលុបកិច្ចការបានទេ។ សូមព្យាយាមម្តងទៀត។",
    updated: "បានកែប្រែកិច្ចការ។",
    saveFailed: "មិនអាចរក្សាទុកកិច្ចការបានទេ។ សូមព្យាយាមម្តងទៀត។",
    orderFailed: "មិនអាចរក្សាទុកលំដាប់កិច្ចការបានទេ។ សូមព្យាយាមម្តងទៀត។",
  },
  settings: {
    title: "ការកំណត់",
    eyebrow: "គណនីរបស់អ្នក",
    open: "ការកំណត់",
    back: "ត្រឡប់ទៅកិច្ចការ",
    cancel: "បោះបង់",
    profile: {
      title: "ព័ត៌មានផ្ទាល់ខ្លួន",
      text: "ឈ្មោះរបស់អ្នកបង្ហាញក្នុងពាក្យស្វាគមន៍នៅលើទំព័រកិច្ចការ។",
      name: "ឈ្មោះ",
      email: "អ៊ីមែល",
      save: "រក្សាទុកឈ្មោះ",
      saved: "បានរក្សាទុកឈ្មោះ។",
      saveFailed: "មិនអាចរក្សាទុកឈ្មោះរបស់អ្នកបានទេ។ សូមព្យាយាមម្តងទៀត។",
      nameRequired: "សូមបញ្ចូលឈ្មោះជាមុនសិន។",
    },
    data: {
      title: "កិច្ចការរបស់អ្នក",
      summary: (total: number, completed: number) => `អ្នកមានកិច្ចការ ${total} ដែលក្នុងនោះបានបញ្ចប់ ${completed}។`,
      exportText: "អ្នកអាចទាញយកច្បាប់ចម្លងនៃកិច្ចការទាំងអស់របស់អ្នកជាឯកសារ JSON ឬលុបកិច្ចការដែលអ្នកលែងត្រូវការ។",
      export: "ទាញយកកិច្ចការ",
      exported: "បានទាញយកកិច្ចការ។",
      exportFailed: "មិនអាចទាញយកកិច្ចការរបស់អ្នកបានទេ។ សូមព្យាយាមម្តងទៀត។",
      nothingToExport: "អ្នកមិនមានកិច្ចការសម្រាប់ទាញយកទេ។",
      deleteCompleted: "លុបកិច្ចការដែលបានបញ្ចប់",
      deleteAll: "លុបកិច្ចការទាំងអស់",
      confirmCompleted: (count: number) => `លុបកិច្ចការដែលបានបញ្ចប់ចំនួន ${count}? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`,
      confirmAll: (count: number) => `លុបកិច្ចការទាំង ${count}? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`,
      confirm: "បាទ/ចាស លុប",
      deleted: (count: number) => `បានលុបកិច្ចការចំនួន ${count}។`,
      deleteFailed: "មិនអាចលុបកិច្ចការបានទេ។ សូមព្យាយាមម្តងទៀត។",
    },
    account: {
      title: "លុបគណនី",
      text: "លុបគណនី និងកិច្ចការទាំងអស់របស់អ្នកជាអចិន្ត្រៃយ៍។",
      delete: "លុបគណនីរបស់ខ្ញុំ",
      confirmText: "សកម្មភាពនេះលុបគណនីរបស់អ្នក និងកិច្ចការទាំងអស់នៅក្នុងនោះ ហើយមិនអាចត្រឡប់វិញបានទេ។",
      passwordHint: "សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នកដើម្បីបញ្ជាក់។",
      googleHint: "អ្នកនឹងត្រូវចូលជាមួយ Google ម្តងទៀតដើម្បីបញ្ជាក់។",
      confirm: "លុបគណនីជាអចិន្ត្រៃយ៍",
      deleted: "គណនីរបស់អ្នកត្រូវបានលុប។",
      deleteFailed: "មិនអាចលុបគណនីរបស់អ្នកបានទេ។ សូមព្យាយាមម្តងទៀត។",
      wrongPassword: "ពាក្យសម្ងាត់នោះមិនត្រឹមត្រូវទេ។",
    },
  },
};

const dictionaries: Record<Language, Dictionary> = { km, en };

// The chosen language lives in localStorage, so it is a per-browser preference.
const STORAGE_KEY = "language";
const listeners = new Set<() => void>();
let current: Language | null = null;

function readStored(): Language {
  try { return localStorage.getItem(STORAGE_KEY) === "en" ? "en" : DEFAULT_LANGUAGE; } catch { return DEFAULT_LANGUAGE; }
}

/** The language saved in this browser. Unlike useLanguage(), this is already right
    during the first client render after loading. */
export function getLanguage(): Language {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  return (current ??= readStored());
}

function subscribe(listener: () => void) {
  // Keep other open tabs in step when the language changes in one of them.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    current = readStored();
    listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}

export function setLanguage(language: Language) {
  try { localStorage.setItem(STORAGE_KEY, language); } catch { /* Storage unavailable: the choice lasts for this visit. */ }
  current = language;
  listeners.forEach((listener) => listener());
}

/** For components: re-renders when the language changes. The server and the first
    client render always use the default language, so hydration matches.

    A component whose texts are prerendered must put data-language={language} on its
    root element: the CSS in globals.css keeps that element hidden while its language is
    not the saved one, so an English visitor never sees the prerendered Khmer. */
export function useLanguage() {
  const language = useSyncExternalStore(subscribe, getLanguage, () => DEFAULT_LANGUAGE);
  return { language, t: dictionaries[language] };
}

/** For event handlers and toasts: the texts of the language in use right now. */
export function translations() {
  return dictionaries[getLanguage()];
}
