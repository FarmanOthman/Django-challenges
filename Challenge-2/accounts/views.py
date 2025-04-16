from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import UserSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

class TestProtectedView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    
    def get(self, request):
        return Response({
            "message": "You are authenticated!",
            "user": request.user.username
        }, status=status.HTTP_200_OK)
