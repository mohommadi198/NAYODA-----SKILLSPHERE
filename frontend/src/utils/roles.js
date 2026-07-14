export const ROLE = {
  CLIENT: "client",
  FREELANCER: "freelancer",
  ADMIN: "admin",
};

/** All roles currently supported by the system. */
export const ALL_ROLES = [ROLE.CLIENT, ROLE.FREELANCER, ROLE.ADMIN];

/** Roles a user is allowed to pick during onboarding. */
export const SELECTABLE_ROLES = [ROLE.CLIENT, ROLE.FREELANCER];

/** Human-friendly labels. */
export const ROLE_LABELS = {
  [ROLE.CLIENT]: "Client",
  [ROLE.FREELANCER]: "Freelancer",
  [ROLE.ADMIN]: "Admin",
};

/** Dashboard/home route per role. */
export const ROLE_HOME = {
  [ROLE.CLIENT]: "/client/dashboard",
  [ROLE.FREELANCER]: "/freelancer/dashboard",
  [ROLE.ADMIN]: "/admin",
};

/** Role-specific display name used in headers. */
export const ROLE_HOME_LABEL = {
  [ROLE.CLIENT]: "Client Hub",
  [ROLE.FREELANCER]: "Freelancer Portal",
  [ROLE.ADMIN]: "Admin Console",
};

export const isClient = (user) => user?.role === ROLE.CLIENT;
export const isFreelancer = (user) => user?.role === ROLE.FREELANCER;
export const isAdmin = (user) => user?.role === ROLE.ADMIN;

/** Has the user chosen a role yet? */
export const hasRole = (user) => Boolean(user?.role);

/** Get the correct home/dashboard route for a user (falls back to /). */
export const getRoleHome = (user) => ROLE_HOME[user?.role] || "/";

/**
 * Field-visibility helpers — the single source of truth for "which fields
 * belong to which role". Used by Profile / EditProfile / cards so the UI
 * never shows freelancer-only data on a client profile (and vice-versa).
 */

export const canShowFreelancerFields = (user) =>
  isFreelancer(user) || isAdmin(user); // admins can see everything while moderating

export const canShowClientFields = (user) => isClient(user) || isAdmin(user);

/**
 * Returns the role-specific sub-object from a user document, safely.
 *   getRoleProfile(dbUser)?.skills
 */
export const getRoleProfile = (user) => {
  if (!user) return {};
  if (isFreelancer(user)) return user.freelancer || {};
  if (isClient(user)) return user.client || {};
  if (isAdmin(user)) return user.admin || {};
  return {};
};
