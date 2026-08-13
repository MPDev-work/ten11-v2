# Admin dashboard Firestore setup

The React dashboard lives at `/admin` and stores its data in these Firestore collections:

- `products`
- `categories`
- `customers`
- `orders`
- `settings` (the store settings document uses the ID `store`)

## Enable secure access

1. In Firebase Authentication, create or sign in with the account that will administer the store.
2. Copy that account's Firebase Authentication UID.
3. In Cloud Firestore, create `admins/<UID>` (the document can be empty).
4. In the Firebase console, replace the Firestore Rules with the contents of [firestore.rules](firestore.rules), then publish them.

Those rules allow only users listed in `admins` to read or change the dashboard collections. The current Firebase project rejects Firestore requests until rules are published and an administrator document is created.

## Product images

Products use an image URL, so no Firebase Storage configuration is needed. Paste a public image URL when creating or editing a product.

## Authentication roles

Authentication uses Firebase Authentication, while account profiles and roles use Realtime Database at `users/<UID>`. Registration creates each profile with `role: "client"`. To promote a user, update that role to `"admin"` in the Realtime Database console; they will be sent to `/admin` on their next login. Publish [database.rules.json](database.rules.json) in Realtime Database Rules so users can read their own role but cannot promote themselves.

If your Realtime Database uses a regional `firebasedatabase.app` URL, copy [`.env.example`](.env.example) to `.env` and replace `VITE_FIREBASE_DATABASE_URL` with the exact URL from Firebase Console → Realtime Database.

Because Firestore Security Rules cannot query Realtime Database, a promoted administrator must also have the `admins/<UID>` Firestore document described above. This is what authorizes their dashboard CRUD access.
