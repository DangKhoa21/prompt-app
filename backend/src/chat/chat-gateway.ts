import { google } from '@ai-sdk/google';
import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { streamText } from 'ai';
import { Server, Socket } from 'socket.io';
// import { ChatCompletionMessageDto } from 'src/googleai/dto/create-chat-completion.request';

@Injectable()
@WebSocketGateway(3002, { cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendPrompt')
  async streamChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ) {
    console.log(data);
    try {
      const { textStream } = streamText({
        model: google('gemini-1.5-flash'),
        prompt: data,
      });

      for await (const chunk of textStream) {
        client.emit('message', chunk); // Stream data to the frontend
        console.log(chunk);
      }

      client.emit('message', '[Stream Ended]');
    } catch (error) {
      console.error('Streaming error:', error.message);
      client.emit('error', 'Error streaming response.');
    }
  }
}
