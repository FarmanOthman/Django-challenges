from django.urls import path
from . import views

urlpatterns = [
    path('room/create/', views.create_room, name='create_room'),
    path('room/<str:room_name>/exists/', views.room_exists, name='room_exists'),
    path('room/<str:room_name>/history/', views.get_chat_history, name='chat_history'),
]