from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Room, Message
import json

@api_view(['POST'])
def register_user(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return JsonResponse({'error': 'Username and password are required'}, status=400)
    
    try:
        user = User.objects.create_user(username=username, password=password)
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            'status': 'success',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh)
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['POST'])
def login_user(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    
    try:
        user = User.objects.get(username=username)
        if user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'status': 'success',
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh)
            })
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_room(request):
    data = json.loads(request.body)
    room_name = data.get('room_name')
    if room_name:
        room, created = Room.objects.get_or_create(name=room_name)
        return JsonResponse({'status': 'success', 'room_name': room_name})
    return JsonResponse({'status': 'error', 'message': 'Room name is required'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def room_exists(request, room_name):
    exists = Room.objects.filter(name=room_name).exists()
    return JsonResponse({'exists': exists, 'room_name': room_name})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
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
