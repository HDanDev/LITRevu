from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.urls import reverse_lazy
from django.views.generic import (
    ListView,
    DetailView,
    CreateView,
    UpdateView,
    DeleteView)
from comments.models import Comment


class CommentListView(LoginRequiredMixin, ListView):
    model = Comment
    template_name = 'comment_list.html'
    context_object_name = 'comments'


class CommentDetailView(LoginRequiredMixin, DetailView):
    model = Comment
    template_name = 'comment_detail.html'
    context_object_name = 'comment'


class CommentCreateView(LoginRequiredMixin, CreateView):
    model = Comment
    template_name = 'comment_form.html'
    fields = ['content']

    def form_valid(self, form):
        form.instance.author = self.request.user
        form.instance.review_id = self.kwargs['review_id']
        return super().form_valid(form)


class CommentUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Comment
    template_name = 'comment_form.html'
    fields = ['content']

    def test_func(self):
        comment = self.get_object()
        user = self.request.user
        return user == comment.author or user.is_superuser


class CommentDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Comment
    template_name = 'comment_confirm_delete.html'
    success_url = reverse_lazy('comment_list')

    def test_func(self):
        comment = self.get_object()
        user = self.request.user
        return user == comment.author or user.is_superuser

    def delete(self, request, *args, **kwargs):
        self.object = self.get_object()
        comments = Comment.objects.filter(comment=self.object)
        comments.update(is_archived=True)
        self.object.is_archived = True
        self.object.save()
        return super().delete(request, *args, **kwargs)
