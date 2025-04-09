/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as avatarProfiles from "../avatarProfiles.js";
import type * as companies from "../companies.js";
import type * as files from "../files.js";
import type * as getStorageUrl from "../getStorageUrl.js";
import type * as messages from "../messages.js";
import type * as seed from "../seed.js";
import type * as submissions from "../submissions.js";
import type * as users from "../users.js";
import type * as useStorageUrl from "../useStorageUrl.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  avatarProfiles: typeof avatarProfiles;
  companies: typeof companies;
  files: typeof files;
  getStorageUrl: typeof getStorageUrl;
  messages: typeof messages;
  seed: typeof seed;
  submissions: typeof submissions;
  users: typeof users;
  useStorageUrl: typeof useStorageUrl;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
