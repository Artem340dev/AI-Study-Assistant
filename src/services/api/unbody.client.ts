import { Unbody } from '@unbody-io/ts-client'

export const unbody = new Unbody({
  apiKey: process.env.NEXT_PUBLIC_UNBODY_API_KEY || '',
  projectId: process.env.NEXT_PUBLIC_UNBODY_PROJECT_ID || '',
})
