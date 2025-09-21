/**
 * Feature flag utilities for temporarily hiding features
 */

export function isLearningHubEnabled(): boolean {
  return process.env.ENABLE_LEARNING_HUB === 'true'
}

export function isAdminPagesEnabled(): boolean {
  return process.env.ENABLE_ADMIN_PAGES === 'true'
}