
from django.urls import path, include
from . import views
urlpatterns = [
    path('',views.az_settlement,name='az_settlement'),

]