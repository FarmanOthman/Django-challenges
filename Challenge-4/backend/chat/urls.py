from django.urls import path
from . import views

urlpatterns = [
    path('auth/register/', views.register_user, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('room/create/', views.create_room, name='create_room'),
    path('rooms/', views.list_rooms, name='list_rooms'),
    path('room/<str:room_name>/join/', views.join_room, name='join_room'),
    path('room/<str:room_name>/invite/', views.invite_to_room, name='invite_to_room'),
    path('room/<str:room_name>/participants/', views.room_participants, name='room_participants'),
]