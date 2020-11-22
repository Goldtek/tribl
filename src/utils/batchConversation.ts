export default function batchConversation(conversations: any[]): string[][] {
  const BATCH_SIZE = 10;
  const chunked = [];

  for (let index = 0; index < conversations.length; index++) {
    const { id: documentId } = conversations[index];
    const last = chunked[chunked.length - 1];

    if (last && last.length != BATCH_SIZE) {
      last.push(documentId);
    } else chunked.push([documentId]);
  }

  return chunked;
}
