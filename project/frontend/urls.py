from django.urls import path
from . import views
from django.views.generic.base import RedirectView

urlpatterns = [
    path('', views.overview),
    # path('detailView/',views.nodes)
    # path(r'^.*$', RedirectView.as_view(url='https://localhost/overview/', permanent=False), name='index'),


]
