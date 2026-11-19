import { z } from 'zod';

export const workspaceScema = z.object({
    name:z
    .string()
    .min(3, { message: 'Workspace title must be at least 3 characters long' })
    .max(20, { message: 'Workspace title cannot exceed 20 characters' }),

    description:z
    .string()
    .min(10 , { message: 'Workspace description must be at least 10 characters long'})
    .max(50, { message: 'Workspace title cannot exceed 50 characters' }),

    deadline:z.string()


})

export type ZWorkspace=z.infer<typeof workspaceScema>;