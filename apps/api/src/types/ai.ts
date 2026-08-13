export type AIStreamChunk = {
  choices?: { delta?: { content?: string } }[];
};
