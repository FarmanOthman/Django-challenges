from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('posts/', views.PostListCreateView.as_view(), name='post-list-create'),
    path('posts/<int:pk>/', views.PostDetailView.as_view(), name='post-detail'),
    path('posts/<int:pk>/comments/', views.CommentCreateView.as_view(), name='post-comment-create'),
] 