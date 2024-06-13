from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.views.generic.edit import CreateView
from django.views.generic import ListView, CreateView, UpdateView, View
from django.urls import reverse_lazy
from reviews.models import Review, Ticket, Tag
from reviews.forms import TicketForm
from users.models import CustomUser
from app.utils import generate_random_numbers
from django.contrib import messages
from django.utils import timezone
from django.http import JsonResponse
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404, redirect

    
class TicketListView(LoginRequiredMixin, ListView):
    model = Ticket
    template_name = 'ticket_list.html'
    context_object_name = 'tickets'
    
    def get_queryset(self):
        tickets = Ticket.objects.prefetch_related('reviews').filter(is_archived=False).distinct()
        for ticket in tickets:
            ticket.likes_count = ticket.get_likes_count()
            ticket.dislikes_count = ticket.get_dislikes_count()
        return tickets
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        colour_numbers = generate_random_numbers()
        context['col1'] = colour_numbers[0]
        context['col2'] = colour_numbers[1]
        context['col3'] = colour_numbers[2]
        context['col4'] = colour_numbers[3]
        context['col5'] = colour_numbers[4]
        context['col6'] = colour_numbers[5]
        context['col7'] = colour_numbers[6]
        context['col8'] = colour_numbers[7]
        context['col9'] = colour_numbers[8]
        context['col10'] = colour_numbers[9]
        
        return context
    
class TicketCreateView(LoginRequiredMixin, CreateView):
    model = Ticket
    form_class = TicketForm
    template_name = 'ticket_form.html'
    success_url = reverse_lazy('ticket_list')

    def form_valid(self, form):
        form.instance.author = self.request.user
        response = super().form_valid(form)

        if form.cleaned_data['create_review']:
            tags_str = form.cleaned_data['review_tags']
            tag_names = [name.strip() for name in tags_str.split(',')]
            tag_objs = [Tag.objects.get_or_create(name=name)[0] for name in tag_names]
            review = Review(
                title=form.cleaned_data['review_title'],
                content=form.cleaned_data['review_content'],
                cover_image=form.cleaned_data.get('review_cover_image', None),
                author=self.request.user if self.request.user.is_authenticated else None,
                ticket=self.object,
                created_at=timezone.now()
            )
            review.save()
            review.tags.set(tag_objs)
            messages.success(self.request, 'Ticket and review created successfully.')
        else:
            messages.warning(self.request, 'A problem occured while trying to create the ticket')

        return response
    
class TicketUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Ticket
    form_class = TicketForm
    template_name = 'ticket_form.html'
    success_url = reverse_lazy('ticket_list')

    def test_func(self):
        ticket = self.get_object()
        return self.request.user == ticket.author or self.request.user.is_staff

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