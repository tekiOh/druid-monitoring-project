from django.urls import path
from . import overview
from . import detailview

urlpatterns = [
    path('overview/all', overview.get_overview_all),
    path('overview/broker', overview.get_broker_overview),
    path('overview/historical', overview.get_historical_overview),
    path('overview/coordinator', overview.get_coordinator_overview),
    path('overview/overlord', overview.get_overlord_overview),
    path('overview/middleManager', overview.get_middleManager_overview),
    path('overview/post', overview.postjson),
    path('detail/post', detailview.request_handle),
    path('nodelist', overview.get_node_list),
    path('detail/nodelist',detailview.get_node_list),
    path('detail/broker',detailview.test),
]
