import { init, i } from "@instantdb/react";

const APP_ID = process.env.NEXT_PUBLIC_INSTANTDB_APP_ID;

if (!APP_ID) {
  console.error(
    "Missing NEXT_PUBLIC_INSTANTDB_APP_ID environment variable. Please check your .env.local file."
  );
  // Don't throw in production to prevent app crash - will fail gracefully when db is used
}

const schema = i.schema({
  entities: {
    memes: i.entity({
      userId: i.string(),
      userName: i.string(),
      imageData: i.string(),
      topText: i.string(),
      bottomText: i.string(),
      textState: i.string(), // Stored as JSON string since InstantDB doesn't support nested objects
      createdAt: i.number(),
      upvoteUserIds: i.string(), // Stored as JSON string since InstantDB doesn't support arrays
    }),
  },
});

// Create a mock db object for fallback when InstantDB can't be initialized
const createMockDb = (): ReturnType<typeof init> => {
  const warn = () => {
    console.warn(
      "⚠️ InstantDB is not configured. Please set NEXT_PUBLIC_INSTANTDB_APP_ID in your Vercel environment variables."
    );
  };
  
  return {
    useQuery: () => {
      warn();
      return { data: null, isLoading: false };
    },
    useAuth: () => {
      warn();
      return { user: null };
    },
    auth: {
      signOut: async () => {
        warn();
      },
      sendMagicCode: async () => {
        warn();
        throw new Error("InstantDB is not configured. Please set NEXT_PUBLIC_INSTANTDB_APP_ID in Vercel.");
      },
      signInWithMagicCode: async () => {
        warn();
        throw new Error("InstantDB is not configured. Please set NEXT_PUBLIC_INSTANTDB_APP_ID in Vercel.");
      },
      signInWithGoogle: async () => {
        warn();
        throw new Error("InstantDB is not configured. Please set NEXT_PUBLIC_INSTANTDB_APP_ID in Vercel.");
      },
    },
    transact: async (tx: any) => {
      warn();
      throw new Error("InstantDB is not configured. Please set NEXT_PUBLIC_INSTANTDB_APP_ID in Vercel.");
    },
    tx: {
      memes: new Proxy({}, {
        get: () => ({
          update: () => ({
            // Return a transaction object that will fail when transact is called
          }),
        }),
      }),
    },
  } as unknown as ReturnType<typeof init>;
};

// Initialize InstantDB with error handling
let db: ReturnType<typeof init>;
try {
  if (!APP_ID) {
    throw new Error("APP_ID is missing");
  }
  db = init({
    appId: APP_ID,
    schema,
  });
} catch (error) {
  console.error("Failed to initialize InstantDB:", error);
  console.warn("Using mock db - database features will be disabled");
  db = createMockDb();
}

export { db };

