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
    privacy = data.get('privacy', 'public')
    
    if not room_name:
        return JsonResponse({'status': 'error', 'message': 'Room name is required'}, status=400)
    
    try:
        room = Room.objects.create(
            name=room_name,
            privacy=privacy,
            creator=request.user
        )
        room.participants.add(request.user)
        return JsonResponse({
            'status': 'success',
            'room': {
                'id': room.id,
                'name': room.name,
                'privacy': room.privacy,
                'creator': room.creator.username,
                'created_at': room.created_at.isoformat()
            }
        })
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_rooms(request):
    # Get public rooms and private rooms where user is a participant
    public_rooms = Room.objects.filter(privacy='public')
    private_rooms = Room.objects.filter(privacy='private', participants=request.user)
    rooms = public_rooms.union(private_rooms)
    
    return JsonResponse({
        'rooms': [{
            'id': room.id,
            'name': room.name,
            'privacy': room.privacy,
            'creator': room.creator.username,
            'created_at': room.created_at.isoformat(),
            'participant_count': room.participants.count()
        } for room in rooms]
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_room(request, room_name):
    try:
        room = Room.objects.get(name=room_name)
        
        # Check if user can join
        if room.privacy == 'private' and request.user not in room.participants.all():
            return JsonResponse({
                'status': 'error',
                'message': 'This is a private room. You need an invitation to join.'
            }, status=403)
        
        room.participants.add(request.user)
        return JsonResponse({'status': 'success', 'room_name': room_name})
    except Room.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Room not found'
        }, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def invite_to_room(request, room_name):
    try:
        room = Room.objects.get(name=room_name)
        
        # Only creator or participants can invite others
        if request.user != room.creator and request.user not in room.participants.all():
            return JsonResponse({
                'status': 'error',
                'message': 'You do not have permission to invite users to this room'
            }, status=403)
        
        data = json.loads(request.body)
        username = data.get('username')
        
        if not username:
            return JsonResponse({'status': 'error', 'message': 'Username is required'}, status=400)
            
        try:
            user = User.objects.get(username=username)
            room.participants.add(user)
            return JsonResponse({'status': 'success', 'message': f'Invited {username} to the room'})
        except User.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found'}, status=404)
            
    except Room.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Room not found'
        }, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def room_participants(request, room_name):
    try:
        room = Room.objects.get(name=room_name)
        if room.privacy == 'private' and request.user not in room.participants.all():
            return JsonResponse({
                'status': 'error',
                'message': 'You do not have access to this room'
            }, status=403)
            
        participants = room.participants.all()
        return JsonResponse({
            'participants': [{
                'username': user.username,
                'is_creator': user == room.creator
            } for user in participants]
        })
    except Room.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Room not found'
        }, status=404)
