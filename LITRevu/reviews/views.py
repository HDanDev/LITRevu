from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.contrib.auth import logout
from django.shortcuts import get_object_or_404
from django.views.generic.edit import CreateView
from django.views.generic import (
    ListView,
    DetailView,
    CreateView,
    UpdateView,
    View
    )
from django.urls import reverse_lazy
from reviews.models import Review
from comments.models import Comment
from tickets.models import Ticket
from reviews.forms import ReviewForm
from django.contrib import messages
from django.http import JsonResponse


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
    template_name = 'review_list.html'

    def form_valid(self, form):
        try:
            user = self.request.user
            author = user if user.is_authenticated else self.guest_user
            form.instance.author = author
            form.instance.ticket = get_object_or_404(
                Ticket,
                pk=self.kwargs['pk']
                )
            obj = self.object
            cover_image_url = obj.cover_image.url if obj.cover_image else None
            if form.is_valid():
                super().form_valid(form)
                return JsonResponse({
                        'success': True,
                        'message': 'Review created successfully.',
                        'id': self.object.pk,
                        'cover_image': cover_image_url,
                        'title': self.object.title,
                        'content': self.object.content,
                        'rating': self.object.rating,
                        'creation_date': self.object.created_at,
                        'ticket': self.object.ticket.pk,
                        })

        except Exception as e:
            error_message = f"An error occurred: {str(e)}"
            messages.error(self.request, error_message)
            return JsonResponse({'success': False, 'error': error_message})

    def get_success_url(self):
        ticket_pk = self.kwargs['pk']
        if self.guest_user:
            logout(self.request)
        return reverse_lazy('review_list', kwargs={'pk': ticket_pk})


class ReviewUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Review
    form_class = ReviewForm
    success_url = reverse_lazy('ticket_list')

    def test_func(self):
        review = self.get_object()
        user = self.request.user
        return user.is_superuser or user == review.author

    def form_valid(self, form):
        try:
            form.instance.author = self.request.user
            super().form_valid(form)
            obj = self.object
            img_url = obj.cover_image.url if obj.cover_image else None
            return JsonResponse({
                'success': True,
                'message': 'Review updated successfully.',
                'review': {
                    'id': self.object.pk,
                    'cover_image_url': img_url,
                    'title': self.object.title,
                    'content': self.object.content,
                    'rating': self.object.rating,
                    'creation_date': self.object.created_at,
                    'ticket': self.object.ticket.pk,
                }
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'A problem occured while updating the review.',
                'errors': str(e)
            })

    def form_invalid(self, form):
        msg = 'Failed to update the review. Please correct the errors below.'
        return JsonResponse({
            'success': False,
            'message': msg,
            'errors': form.errors
        })


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

            return JsonResponse(
                {
                    'success': True,
                    'message': 'Review successfully deleted',
                    'id': self.kwargs['pk']
                }
            )

        except Exception as e:
            error_message = f"An error occurred: {str(e)}"
            return JsonResponse({'success': False, 'error': error_message})
