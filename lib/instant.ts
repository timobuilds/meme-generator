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
  return {
    useQuery: () => ({ data: null, isLoading: false }),
    useAuth: () => ({ user: null }),
    auth: {
      signOut: async () => {},
      sendMagicCode: async () => {},
      signInWithMagicCode: async () => {},
      signInWithGoogle: async () => {},
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

