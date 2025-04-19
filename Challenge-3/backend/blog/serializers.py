from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Post, Comment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']

class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'author_id', 'text', 'created_at', 'approved']
        read_only_fields = ['approved']

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'author', 'author_id', 'content', 
            'excerpt', 'category', 'category_id', 'created_at', 
            'updated_at', 'published_at', 'is_published', 'comments'
        ]
        read_only_fields = ['created_at', 'updated_at', 'published_at'] 