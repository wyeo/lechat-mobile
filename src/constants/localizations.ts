const baseTranslations = {
  auth: {
    login: {
      title: "Sign in",
      noAccount: "Don't have an account?",
      button: {
        signInGoogle: "Sign in with Google",
        siginInMicrosoft: "Sign in with Microsoft",
        siginInPassword: "Sign in with password",
      },
      link: {
        signup: "Sign up",
        forgotPassword: "Forgot password ?",
      },
      error: {
        input: {
          email: {
            notFoundMessage: "L'adresse email renseignée n'existe pas",
          },
          password: {
            empty: "Merci de renseigner votre mot de passe",
            incorrect: "Votre mot de passe est incorrect",
          },
        },
      },
    },
    signUp: {
      title: "Register an account",
      existingAccount: "Already have an account ?",
      button: {
        signUp: "Sign up",
        signUpGoogle: "Sign up with Google",
        signUpMicrosoft: "Sign up with Microsoft",
      },
      link: {
        signin: "Sign in",
      },
      error: {
        input: {
          email: {
            alreadyExistMessage: "L'adresse email renseignée existe déjà",
          },
          password: {
            empty: "Merci de renseigner votre mot de passe",
          },
        },
      },
    },
    resetPassword: {
      title: "Recover your account",
      rememberCredentials: "Remember your credentials ?",
      link: {
        signin: "Sign in",
      },
      button: {
        continue: "Continue",
      },
      toaster: {
        success: {
          resetPasswordSent:
            "Password reset instructions have been sent to your email",
        },
      },
    },
    common: {
      error: {
        authentication: {
          "account-exists-with-different-credential":
            "This email is already used with a different sign-in method. Please sign in using your original sign-in method.",
        },
        input: {
          email: {
            empty: "Merci de renseigner votre adresse email",
            accountDisabledMessage: "Votre compte a été désactivé",
            badFormatMessage: "Mauvais format (example: help@mistral.ai)",
          },
          lastname: {
            empty: "Merci de renseigner votre prénom",
          },
          fistname: {
            empty: "Merci de renseigner votre nom",
          },
          password: {
            empty: "Merci de renseigner votre mot de passe",
          },
        },
      },
      input: {
        email: "E-mail",
        password: "Password",
        firstname: "First name",
        lastname: "Last name",
      },
    },
  },
  chat: {
    common: {
      comingSoonMessage: {
        agents: "@gents are coming soon ! :)",
        actions:
          "Tools (Canva, Web seach and Image Generation) are coming soon ! :)",
      },
      input: { placeholder: "Ask le Chat or @mention an agent" },
      toaster: {
        success: {
          chatArchived: "The chat has been archived",
        },
        error: {
          maxImageLimit: "Maximum number of images per chat is 4",
          maxDocumentLimit: "Maximum limit of documents per chat is 4",
        },
      },
      authorization: {
        camera: {
          title: "Unable to open camera",
          message: "Would you like to allow camera access?",
        },
        image: {
          title: "Unable to access photos",
          message: "Would you like to allow access to import your photos?",
        },
      },
    },
  },
  drawer: {
    contextMenu: {
      toggleTheme: "Toggle theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      settings: "Settings",
      switchWorkspace: "Switch workspace",
      logout: "Log out",
    },
    animatedChatHistoryList: {
      today: "Today",
      yesterday: "Yesterday",
      previous7Days: "Previous 7 days",
      previous30Days: "Previous 30 days",
      older: "Older",
    },
    link: {
      newChat: "New Chat",
      search: "Search",
      archivedChats: "Archived chats",
      sharedChats: "Shared chats",
    },
  },
  common: {
    error: {
      internal:
        "An error occurred. Please try again later or contact help@mistral.ai for assistance.",
    },
  },
};

type TranslationStructure = typeof baseTranslations;

const fr: TranslationStructure = {
  auth: {
    login: {
      title: "Se connecter",
      noAccount: "Vous n'avez pas de compte ?",
      button: {
        signInGoogle: "Se connecter avec Google",
        siginInMicrosoft: "Se connecter avec Microsoft",
        siginInPassword: "Se connecter avec un mot de passe",
      },
      link: {
        signup: "S'inscrire",
        forgotPassword: "Mot de passe oublié ?",
      },
      error: {
        input: {
          email: {
            notFoundMessage: "L'adresse email renseignée n'existe pas",
          },
          password: {
            empty: "Merci de renseigner votre mot de passe",
            incorrect: "Votre mot de passe est incorrect",
          },
        },
      },
    },
    signUp: {
      title: "Créer un compte",
      existingAccount: "Vous avez déjà un compte ?",
      button: {
        signUp: "S'inscrire",
        signUpGoogle: "S'inscrire avec Google",
        signUpMicrosoft: "S'inscrire avec Microsoft",
      },
      link: {
        signin: "Se connecter",
      },
      error: {
        input: {
          email: {
            alreadyExistMessage: "L'adresse email renseignée existe déjà",
          },
          password: {
            empty: "Merci de renseigner votre mot de passe",
          },
        },
      },
    },
    resetPassword: {
      title: "Récupérer votre compte",
      rememberCredentials: "Vous vous souvenez de vos identifiants ?",
      link: {
        signin: "Se connecter",
      },
      button: {
        continue: "Continuer",
      },
      toaster: {
        success: {
          resetPasswordSent:
            "Les instructions de réinitialisation du mot de passe ont été envoyées à votre email",
        },
      },
    },
    common: {
      error: {
        authentication: {
          "account-exists-with-different-credential":
            "Cet email est déjà utilisé avec une autre méthode de connexion. Veuillez vous connecter avec votre méthode de connexion initiale.",
        },
        input: {
          email: {
            empty: "Merci de renseigner votre adresse email",
            accountDisabledMessage: "Votre compte a été désactivé",
            badFormatMessage: "Mauvais format (exemple: help@mistral.ai)",
          },
          lastname: {
            empty: "Merci de renseigner votre prénom",
          },
          fistname: {
            empty: "Merci de renseigner votre nom",
          },
          password: {
            empty: "Merci de renseigner votre mot de passe",
          },
        },
      },
      input: {
        email: "E-mail",
        password: "Mot de passe",
        firstname: "Prénom",
        lastname: "Nom",
      },
    },
  },
  chat: {
    common: {
      comingSoonMessage: {
        agents: "Les @gents arrivent bientôt ! :)",
        actions:
          "Les outils (Canva, Recherche Web et Génération d'Images) arrivent bientôt ! :)",
      },
      input: {
        placeholder: "Posez une question au Chat ou @mentionnez un agent",
      },
      toaster: {
        success: {
          chatArchived: "La conversation a été archivée",
        },
        error: {
          maxImageLimit: "Le nombre maximum d'images par conversation est de 4",
          maxDocumentLimit:
            "Le nombre maximum de documents par conversation est de 4",
        },
      },
      authorization: {
        camera: {
          title: "Impossible d'ouvrir la caméra",
          message: "Voulez-vous autoriser l'accès à la caméra ?",
        },
        image: {
          title: "Impossible d'accéder aux photos",
          message: "Voulez-vous autoriser l'accès pour importer vos photos ?",
        },
      },
    },
  },
  drawer: {
    contextMenu: {
      toggleTheme: "Changer de thème",
      light: "Clair",
      dark: "Sombre",
      system: "Système",
      settings: "Paramètres",
      switchWorkspace: "Changer d'espace de travail",
      logout: "Se déconnecter",
    },
    animatedChatHistoryList: {
      today: "Aujourd'hui",
      yesterday: "Hier",
      previous7Days: "7 derniers jours",
      previous30Days: "30 derniers jours",
      older: "Plus ancien",
    },
    link: {
      newChat: "Nouveau Chat",
      search: "Recherche",
      archivedChats: "Chats archivés",
      sharedChats: "Chats partagés",
    },
  },
  common: {
    error: {
      internal:
        "Une erreur est survenue. Veuillez réessayer plus tard ou contacter help@mistral.ai pour obtenir de l'aide.",
    },
  },
};


export default { baseTranslations, en: baseTranslations, fr };
