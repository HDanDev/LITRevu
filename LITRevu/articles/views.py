from django.contrib.auth.mixins import UserPassesTestMixin
from django.contrib.auth import login, logout
from django.views.generic.edit import CreateView
from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from articles.models import Article
from articles.forms import ArticleForm
from users.models import CustomUser

class ArticleListView(ListView):
    model = Article
    template_name = 'article_list.html'
    context_object_name = 'articles'

class ArticleDetailView(DetailView):
    model = Article
    template_name = 'article_detail.html'
    context_object_name = 'article'

class ArticleCreateView(CreateView):
    model = Article
    form_class = ArticleForm
    template_name = 'article_form.html'
    success_url = reverse_lazy('article_list')  
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

class ArticleUpdateView(UserPassesTestMixin, UpdateView):
    model = Article
    form_class = ArticleForm
    template_name = 'article_form.html'
    success_url = reverse_lazy('article_list')
    
    def test_func(self):
        article = self.get_object()
        return self.request.user.is_superuser or self.request.user == article.author

class ArticleDeleteView(UserPassesTestMixin, DeleteView):
    model = Article
    template_name = 'article_confirm_delete.html'
    success_url = reverse_lazy('article_list')

    def test_func(self):
        article = self.get_object()
        return self.request.user.is_superuser or self.request.user == article.author