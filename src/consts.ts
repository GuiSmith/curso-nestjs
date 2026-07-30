import { CollaboratorRole } from "@prisma/client";

export const PURPOSE_REQUESTS_KEY = "requests";
export const PURPOSE_RESET_PASSWORD_KEY = "password-reset";
export const EMAIL_QUEUE_KEY = 'email_queue';
export const EMAIL_SERVICE_KEY = 'EMAIL_SERVICE';
export const SEND_PASSOWRD_RESET_KEY = 'SEND_PASSWORD_RESET'
export const PUBLIC_ROUTE_KEY = 'PublicRoute';

export const COLLABORATOR_ROLE_VIEWER_KEY: CollaboratorRole = 'VIEWER';
export const COLLABORATOR_ROLE_EDITOR_KEY: CollaboratorRole = 'EDITOR';
export const COLLABORATOR_ROLE_ADMIN_KEY: CollaboratorRole = 'ADMIN';
export const COLLABORATOR_ROLE_OWNER_KEY: CollaboratorRole = 'OWNER';
