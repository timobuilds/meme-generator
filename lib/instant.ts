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

export const db = APP_ID
  ? init({
      appId: APP_ID,
      schema,
    })
  : ({} as ReturnType<typeof init>); // Fallback to prevent crash

