export interface IPrompt {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

export type PromptSummary = Pick<IPrompt, 'id' | 'title' | 'content'>
