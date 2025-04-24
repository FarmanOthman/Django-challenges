from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Room, Message
import json

@csrf_exempt
def create_room(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        room_name = data.get('room_name')
        if room_name:
            return JsonResponse({'status': 'success', 'room_name': room_name})
        return JsonResponse({'status': 'error', 'message': 'Room name is required'}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Method not allowed'}, status=405)

def room_exists(request, room_name):
    return JsonResponse({'exists': True, 'room_name': room_name})

def get_chat_history(request, room_name):
    try:
        room = Room.objects.get(name=room_name)
        messages = Message.objects.filter(room=room).order_by('timestamp')
        message_list = [{
            'message': msg.content,
            'username': msg.user.username,
            'timestamp': msg.timestamp.isoformat()
        } for msg in messages]
        return JsonResponse({
            'status': 'success',
            'messages': message_list
        })
    except Room.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Room not found'
        }, status=404)
