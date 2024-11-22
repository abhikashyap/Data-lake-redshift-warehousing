
from django.urls import path, include
from . import views
urlpatterns = [
    path('',views.az_settlement,name='az_settlement'),
    path('<str:asin>/', views.az_settlement_with_asin, name='az_settlement_with_asin'),

]