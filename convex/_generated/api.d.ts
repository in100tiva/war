/* eslint-disable */
/**
 * Generated API types - Run `npx convex dev` to regenerate
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

import type * as game from "../game.js";
import type * as rooms from "../rooms.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 */
declare const fullApi: ApiFromModules<{
  game: typeof game;
  rooms: typeof rooms;
  users: typeof users;
}>;

export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
