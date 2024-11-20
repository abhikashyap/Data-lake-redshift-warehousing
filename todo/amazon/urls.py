
from django.urls import path, include
from . import views
urlpatterns = [
    path('',views.az_settlement,name='az_settlement'),
    # path('create/',views.tweet_create,name='tweet_create'),
    # path('<int:tweet_id>/', views.tweet_edit, name='tweet_edit'),
    # path('<int:tweet_id>/delete/',views.tweet_delete,name='tweet_delete'),
    # path('register/',views.register,name='register'),
    
]