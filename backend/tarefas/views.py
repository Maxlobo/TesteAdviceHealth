from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from .models import Task
from .serializers import RegisterSerializer, UserSerializer, TaskSerializer


class RegisterView(generics.CreateAPIView):
    """View for user registration."""
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny)
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        """Handle user registration."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({"user": UserSerializer(user).data,
                         "message": "User created successfully!",
                         "refresh": str(refresh),
                         "access": str(refresh.access_token)},
                        status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """View for user login."""
    permission_classes = (permissions.AllowAny)

    def post(self, request):
        """Handle user login."""
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request=request, username=username,
                            password=password)

        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)

            return Response({"user": UserSerializer(user).data,
                             "message": "Login successful!",
                             "refresh": str(refresh),
                             "access": str(refresh.access_token)},
                            status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid credentials"},
                            status=status.HTTP_401_UNAUTHORIZED)


class UserView(generics.RetrieveAPIView):
    """View for retrieving user information."""
    permission_classes = (permissions.IsAuthenticated)
    serializer_class = UserSerializer

    def get_object(self):
        """Return the user associated with the request."""
        return self.request.user


class TaskListView(generics.ListCreateAPIView):
    """View for listing and creating tasks."""
    permission_classes = (permissions.IsAuthenticated)
    serializer_class = TaskSerializer

    def get_queryset(self):
        """Return tasks for the authenticated user."""
        queryset = Task.objects.filter(user=self.request.user)
        completed = self.request.query_params.get('completed', None)
        if completed is not None:
            queryset = queryset.filter(completed=completed.lower() == 'true')

        return queryset

    def perform_create(self, serializer):
        """Associate the task with the authenticated user."""
        serializer.save(user=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for retrieving, updating, and deleting a task."""
    permission_classes = (permissions.IsAuthenticated)
    serializer_class = TaskSerializer

    def get_queryset(self):
        """Return tasks for the authenticated user."""
        return Task.objects.filter(user=self.request.user)
