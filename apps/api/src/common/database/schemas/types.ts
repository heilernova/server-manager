export const roles = ['admin', 'developer'] as const; 
export type uuid = `${string}-${string}-${string}-${string}-${string}`;
export type Role = typeof  roles[number];

export const runtime_environment_list = ['Node.js', 'Python', 'PHP'] as const;
export const framework_list = ['NestJS', 'Angular', 'FastAPI'] as const;
export const running_on_list = ['PM2', 'Docker', 'LiteSpeed', 'Apache'] as const;
export const user_log_action_list = ['auth', 'update', 'password',  'lock'] as const;
export const user_log_state_list = ['success', 'warning', 'error', 'bug'] as const;

export type RuntimeEnvironment = typeof runtime_environment_list[number];
export type Framework = typeof framework_list[number];
export type RunningOn = typeof running_on_list[number];
export type UserLogAction = typeof user_log_action_list[number];
export type UserLogState = typeof user_log_state_list[number];