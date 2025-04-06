export interface StoryDisplay {
  title: string;
  url: string;
}

export interface StoryPayload {
  recordCount: number;
  isReset: boolean;
  stories: StoryDisplay[];
}
