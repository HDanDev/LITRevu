from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.contrib.auth import login, logout
from django.shortcuts import get_object_or_404
from django.views.generic.edit import CreateView
from django.views.generic import ListView, DetailView, CreateView, UpdateView, View
from django.urls import reverse_lazy
from reviews.models import Review
from comments.models import Comment
from tickets.models import Ticket
from reviews.forms import ReviewForm
from users.models import CustomUser
from django.contrib import messages
from django.http import JsonResponse
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

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        review = self.get_object()
        context['ticket'] = review.ticket
        return context
    
class ReviewCreateView(LoginRequiredMixin, CreateView):
    model = Review
    form_class = ReviewForm
    success_url = reverse_lazy('ticket_list')
    guest_user = None

    # def dispatch(self, request, *args, **kwargs):
    #     if request.method == 'POST' and not request.user.is_authenticated:
    #         self.guest_user = CustomUser.objects.get_or_create(username='guest')[0]
    #         login(request, self.guest_user)
    #     return super().dispatch(request, *args, **kwargs)

    def form_valid(self, form):
        try:
            form.instance.author = self.request.user if self.request.user.is_authenticated else self.guest_user
            form.instance.ticket = get_object_or_404(Ticket, pk=self.kwargs['pk'])
            if form.is_valid():           
                super().form_valid(form)
            
                return JsonResponse({'success': True, 'message': 'review created successfully!'})

        except Exception as e:
            error_message = f"An error occurred: {str(e)}"
            messages.error(self.request, error_message)

        return JsonResponse({'success': False, 'error': error_message})

    # def get_success_url(self):
    #     ticket_pk = self.kwargs['pk']
    #     if self.guest_user:
    #         logout(self.request)
    #     return reverse_lazy('review_list', kwargs={'pk': ticket_pk})
    
class ReviewUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Review
    form_class = ReviewForm
    template_name = 'review_form.html'
    success_url = reverse_lazy('review_list')
    
    def test_func(self):
        review = self.get_object()
        return self.request.user.is_superuser or self.request.user == review.author
    
class ArchiveReviewView(LoginRequiredMixin, UserPassesTestMixin, View):
    def test_func(self):
        ticket = get_object_or_404(Review, pk=self.kwargs['pk'])
        return self.request.user == ticket.author or self.request.user.is_staff
    
    def post(self, request, *args, **kwargs):
        try:
            review = get_object_or_404(Review, pk=self.kwargs['pk'])
            
            review.is_archived = True
            review.save()

            comments = Comment.objects.filter(review=review)
            comments.update(is_archived=True)

            return JsonResponse({'success': True, 'message': 'Review successfully deleted'})
        
        except Exception as e:
            error_message = f"An error occurred: {str(e)}"
            return JsonResponse({'success': False, 'error': error_message})