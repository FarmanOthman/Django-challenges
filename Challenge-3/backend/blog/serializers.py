from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Post, Comment

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'content', 'author', 'author_username', 'created_at']
        read_only_fields = ['author']

class PostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'author_username', 
                 'created_at', 'updated_at', 'comments']
        read_only_fields = ['author'] 