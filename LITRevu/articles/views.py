from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.contrib.auth import login, logout
from django.views.generic.edit import CreateView
from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from articles.models import Article, Ticket, Tag
from articles.forms import ArticleForm, TicketForm
from users.models import CustomUser
from django.contrib import messages
from django.utils import timezone

class ArticleListView(LoginRequiredMixin, ListView):
    model = Article
    template_name = 'article_list.html'
    context_object_name = 'articles'
    
class ArticleDetailView(LoginRequiredMixin, DetailView):
    model = Article
    template_name = 'article_detail.html'
    context_object_name = 'article'
    
class ArticleCreateView(LoginRequiredMixin, CreateView):
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
    
class ArticleUpdateView(LoginRequiredMixin, UserPassesTestMixin, UpdateView):
    model = Article
    form_class = ArticleForm
    template_name = 'article_form.html'
    success_url = reverse_lazy('article_list')
    
    def test_func(self):
        article = self.get_object()
        return self.request.user.is_superuser or self.request.user == article.author
    
class ArticleDeleteView(LoginRequiredMixin, UserPassesTestMixin, DeleteView):
    model = Article
    template_name = 'article_confirm_delete.html'
    success_url = reverse_lazy('article_list')

    def test_func(self):
        article = self.get_object()
        return self.request.user.is_superuser or self.request.user == article.author
    
class TicketListView(LoginRequiredMixin, ListView):
    model = Ticket
    template_name = 'ticket_list.html'
    context_object_name = 'tickets'
    
    def get_queryset(self):
        return Ticket.objects.prefetch_related('articles').filter(is_archived=False).distinct()

class TicketCreateView(LoginRequiredMixin, CreateView):
    model = Ticket
    form_class = TicketForm
    template_name = 'ticket_form.html'
    success_url = reverse_lazy('ticket_list')

    def form_valid(self, form):
        form.instance.author = self.request.user
        response = super().form_valid(form)

        if form.cleaned_data['create_article']:
            tags_str = form.cleaned_data['article_tags']
            tag_names = [name.strip() for name in tags_str.split(',')]
            tag_objs = [Tag.objects.get_or_create(name=name)[0] for name in tag_names]
            article = Article(
                title=form.cleaned_data['article_title'],
                content=form.cleaned_data['article_content'],
                cover_image=form.cleaned_data.get('article_cover_image', None),
                author=self.request.user if self.request.user.is_authenticated else None,
                ticket=self.object,
                created_at=timezone.now()
            )
            article.save()
            article.tags.set(tag_objs)
            messages.success(self.request, 'Ticket and article created successfully.')
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
        articles = Article.objects.filter(ticket=self.object)
        articles.update(is_archived=True)
        self.object.is_archived = True
        self.object.save()
        return super().delete(request, *args, **kwargs)