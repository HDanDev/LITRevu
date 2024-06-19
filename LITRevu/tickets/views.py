from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.views.generic.edit import CreateView
from django.views.generic import ListView, CreateView, UpdateView, View
from django.urls import reverse_lazy
from reviews.models import Review
from tickets.models import Ticket, Tag
from reviews.forms import ReviewForm
from tickets.forms import TicketForm, TicketUpdateForm
from users.models import CustomUser
from app.utils import generate_random_numbers
from django.contrib import messages
from django.utils import timezone
from django.http import JsonResponse
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect
from django.db import transaction, IntegrityError
from django.core.exceptions import ValidationError
    
class TicketListView(LoginRequiredMixin, ListView):
    model = Ticket
    template_name = 'ticket_list.html'
    context_object_name = 'tickets'
    
    def get_queryset(self):
        tickets = Ticket.objects.prefetch_related('tags', 'reviews').filter(is_archived=False).distinct()
        for ticket in tickets:
            ticket.likes_count = ticket.get_likes_count()
            ticket.dislikes_count = ticket.get_dislikes_count()
        return tickets
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        colour_numbers = generate_random_numbers()[:10]
        ticket_form = TicketForm()
        context.update({
            'col{}'.format(i): colour_numbers[i] for i in range(min(len(colour_numbers), 10))
            })
        context['ticket_form'] = ticket_form
        
        return context
    
class TicketCreateView(CreateView):
    model = Ticket
    form_class = TicketForm
    template_name = 'ticket_form.html'
    success_url = reverse_lazy('ticket_list')

    def form_valid(self, form):
        response_data = {}
        try:
            with transaction.atomic():
                form.instance.author = self.request.user
                
                if form.is_valid():
                        
                    super().form_valid(form)
                    response_data = {'success': True, 'message': 'Ticket created successfully.'}
                            
                    if form.cleaned_data.get('create_review') and form.cleaned_data.get('review_title'):
                        
                        review = Review(
                            title=form.cleaned_data['review_title'],
                            content=form.cleaned_data['review_content'],
                            cover_image=form.cleaned_data.get('review_cover_image'),
                            rating=form.cleaned_data.get('review_rating') if form.cleaned_data.get('review_rating') else 0,
                            author=self.request.user,
                            ticket=self.object,
                        )
                        review.save()
                        response_data = {'success': True, 'message': 'Ticket and review created successfully.'}
                    else:
                        response_data = {'success': False, 'error': 'To create a review you must at least give it a title.'}
                    
            return JsonResponse(response_data)

        except Exception as e:
            error_message = f"An error occurred: {str(e)}"
            messages.error(self.request, error_message)
            response_data = {'success': False, 'error': error_message}

    def form_invalid(self, form):
        response_data = {'success': False, 'errors': form.errors}
        return JsonResponse(response_data)
    
class TicketUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Ticket
    form_class = TicketUpdateForm

    def form_valid(self, form):
            form.instance.author = self.request.user
            response = super().form_valid(form) 
            
            if self.request.is_ajax():
                return JsonResponse({
                    'success': True,
                    'message': 'Ticket updated successfully.',
                    'ticket': {
                        'id': self.object.pk,
                        'title': self.object.title,
                        'description': self.object.description,
                        'image_url': self.object.image.url if self.object.image else None
                    }
                })
            else:
                return response

    def form_invalid(self, form):
        if self.request.is_ajax():
            return JsonResponse({
                'success': False,
                'message': 'Failed to update the ticket. Please correct the errors below.',
                'errors': form.errors
            })
        else:
            return super().form_invalid(form)

class ArchiveTicketView(LoginRequiredMixin, UserPassesTestMixin, View):
    def test_func(self):
        ticket = get_object_or_404(Ticket, pk=self.kwargs['pk'])
        return self.request.user == ticket.author or self.request.user.is_staff

    def post(self, request, *args, **kwargs):
        ticket = get_object_or_404(Ticket, pk=self.kwargs['pk'])
        
        ticket.is_archived = True
        ticket.save()

        reviews = Review.objects.filter(ticket=ticket)
        reviews.update(is_archived=True)

        return redirect('ticket_list')