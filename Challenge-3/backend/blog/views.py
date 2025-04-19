from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Category, Post, Comment
from .serializers import CategorySerializer, PostSerializer, CommentSerializer

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the author
        return obj.author == request.user

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'slug'

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'content', 'category__name']
    ordering_fields = ['created_at', 'published_at', 'title']
    
    def get_queryset(self):
        # Non-authenticated users can only see published posts
        if self.request.user.is_authenticated:
            if self.request.user.is_staff:
                return Post.objects.all()
            return Post.objects.filter(author=self.request.user) | Post.objects.filter(is_published=True)
        return Post.objects.filter(is_published=True)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, slug=None):
        post = self.get_object()
        if post.author != request.user and not request.user.is_staff:
            return Response({'detail': 'You do not have permission to publish this post'}, status=403)
        
        post.publish()
        serializer = self.get_serializer(post)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def add_comment(self, request, slug=None):
        post = self.get_object()
        serializer = CommentSerializer(data={
            'post': post.id,
            'author_id': request.user.id,
            'text': request.data.get('text')
        })
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    
    def get_queryset(self):
        # Non-staff users can only see approved comments
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Comment.objects.all()
        return Comment.objects.filter(approved=True)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        comment = self.get_object()
        if not request.user.is_staff:
            return Response({'detail': 'You do not have permission to approve comments'}, status=403)
        
        comment.approve()
        serializer = self.get_serializer(comment)
        return Response(serializer.data) 