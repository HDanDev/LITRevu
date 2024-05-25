from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.contrib.auth import login, logout
from django.views.generic.edit import CreateView
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from reviews.models import Review
from tickets.models import Ticket
from reviews.forms import ReviewForm
from users.models import CustomUser
from django.contrib import messages
from django.utils import timezone
from django.http import HttpResponseRedirect

class ReviewListView(LoginRequiredMixin, ListView):
    model = Review
    template_name = 'review_list.html'
    context_object_name = 'reviews'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        ticket_pk = self.kwargs.get('pk')
        context['ticket'] = Ticket.objects.get(pk=ticket_pk)
        return context
    
class ReviewDetailView(LoginRequiredMixin, DetailView):
    model = Review
    template_name = 'review_detail.html'
    context_object_name = 'review'
    
class ReviewCreateView(LoginRequiredMixin, CreateView):
    model = Review
    form_class = ReviewForm
    template_name = 'review_form.html'
    success_url = reverse_lazy('review_list')  
    guest_user = None

    def dispatch(self, request, *args, **kwargs):
        if request.method == 'POST':
            if not request.user.is_authenticated:
                self.guest_user = CustomUser.objects.get_or_create(username='guest')[0]
                login(request, self.guest_user)
        return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        form.instance.author = self.request.user if self.request.user.is_authenticated else self.guest_user
        return super().form_valid(form)

    def get_success_url(self):
        if self.guest_user:
            logout(self.request)
        return super().get_success_url()
    
class ReviewUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Review
    form_class = ReviewForm
    template_name = 'review_form.html'
    success_url = reverse_lazy('review_list')
    
    def test_func(self):
        review = self.get_object()
        return self.request.user.is_superuser or self.request.user == review.author
    
class ReviewDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Review
    template_name = 'review_confirm_delete.html'
    success_url = reverse_lazy('review_list')

    def test_func(self):
        review = self.get_object()
        return self.request.user.is_superuser or self.request.user == review.author
    
    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()
        self.object.is_archived = True
        self.object.save()
        return HttpResponseRedirect(self.get_success_url())