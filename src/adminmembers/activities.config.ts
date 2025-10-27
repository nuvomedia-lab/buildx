import { Role } from '@prisma/client';

// Define allowed activities for each role
export const ROLE_ACTIVITIES: Record<Role, string[]> = {
  PM: [
    'Request new materials',
    'View all requests',
    'Validate requests from SEF',
    'Validate specification from QS',
  ],
  QS: [
    'Create BOQ',
    'Validate requests from SEF',
    'Validate requests from PM',
    'Validate specification from SEF',
    'Validate specification from PM',
    'Submit approved requests for payment',
    'Introduce specification where needed',
    'Cross check with base BOQ',
    'Automatic update of active BOQ',
    'Interim valuation report',
    'Generate Analytics',
  ],
  SEF: [
    'Request for labor',
    'Request materials from store',
    'Log return of unused materials to store',
  ],
  SK: [
    'Receive new materials',
    'Disburse materials in store',
    'Receive previously disbursed materials',
    'Request new materials',
  ],
  PROC: [
    'Receive finalized requests',
    'Confirm status of procurement',
  ],
  ACC: [
    'Make payment',
    'Request for payment',
    'Query payment approval from QS',
  ],
  AD: [
    'Add/remove other users',
    'Assign roles',
    'Select functions for each role',
    'Make payment',
    'Approve payment',
    'Query request',
  ],
};

// Helper function to get activities for a role
export function getActivitiesForRole(role: Role): string[] {
  return ROLE_ACTIVITIES[role] || [];
}

// Helper function to check if a role has access to an activity
export function roleHasActivity(role: Role, activity: string): boolean {
  const activities = getActivitiesForRole(role);
  if (activities.includes('ALL ACCESS')) {
    return true;
  }
  return activities.includes(activity);
}

