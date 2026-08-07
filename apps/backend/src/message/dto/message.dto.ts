export class CreateMessageDto {
  conversationId: string;
  content: string;
  image: string | Array<string>;
  receiverId: string;
  type: string;
  senderId: string;
}
