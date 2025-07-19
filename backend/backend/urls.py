from django.contrib import admin
from django.urls import path, include


urlspatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tarefas.urls'))
]
