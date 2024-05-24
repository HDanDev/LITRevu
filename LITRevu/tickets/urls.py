from django.urls import path
from tickets.views import (
    TicketCreateView,
    TicketListView,
    TicketUpdateView,
    TicketDeleteView
)

urlpatterns = [
    path('ticket/', TicketListView.as_view(), name='ticket_list'),
    path('ticket/new/', TicketCreateView.as_view(), name='ticket_form'),
    path('ticket/<int:pk>/edit/', TicketUpdateView.as_view(), name='ticket_update'),
    path('ticket/<int:pk>/delete/', TicketDeleteView.as_view(), name='ticket_delete'),
]