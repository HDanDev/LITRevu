from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.views.generic.edit import CreateView
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from reviews.models import Review, Ticket, Tag
from reviews.forms import TicketForm
from users.models import CustomUser
from django.contrib import messages
from django.utils import timezone
    
class TicketListView(LoginRequiredMixin, ListView):
    model = Ticket
    template_name = 'ticket_list.html'
    context_object_name = 'tickets'
    
    def get_queryset(self):
        return Ticket.objects.prefetch_related('reviews').filter(is_archived=False).distinct()

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

class TicketDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Ticket
    template_name = 'ticket_confirm_delete.html'
    success_url = reverse_lazy('ticket_list')

    def test_func(self):
        ticket = self.get_object()
        return self.request.user == ticket.author or self.request.user.is_staff

    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()
        reviews = Review.objects.filter(ticket=self.object)
        reviews.update(is_archived=True)
        self.object.is_archived = True
        self.object.save()
        return super().delete(request, *args, **kwargs)