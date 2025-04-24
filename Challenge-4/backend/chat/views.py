from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
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
