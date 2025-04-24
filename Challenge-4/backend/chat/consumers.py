import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Room, Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Send chat history to the newly connected user
        history = await self.get_chat_history()
        if history:
            await self.send(text_data=json.dumps({
                'type': 'chat_history',
                'messages': history
            }))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        username = self.scope.get('user').username if self.scope.get('user').is_authenticated else 'Anonymous'

        # Save message to database
        await self.save_message(message, username)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'username': username,
                'timestamp': await self.get_last_message_timestamp()
            }
        )

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message'],
            'username': event['username'],
            'timestamp': event['timestamp']
        }))

    @database_sync_to_async
    def get_chat_history(self):
        try:
            room = Room.objects.get(name=self.room_name)
            messages = Message.objects.filter(room=room).order_by('timestamp')
            return [{
                'message': msg.content,
                'username': msg.user.username,
                'timestamp': msg.timestamp.isoformat()
            } for msg in messages]
        except Room.DoesNotExist:
            return []

    @database_sync_to_async
    def save_message(self, content, username):
        room, _ = Room.objects.get_or_create(name=self.room_name)
        user = self.scope.get('user')
        Message.objects.create(
            room=room,
            user=user,
            content=content
        )

    @database_sync_to_async
    def get_last_message_timestamp(self):
        try:
            room = Room.objects.get(name=self.room_name)
            message = Message.objects.filter(room=room).latest('timestamp')
            return message.timestamp.isoformat()
        except (Room.DoesNotExist, Message.DoesNotExist):
            return None