from django.contrib.auth.mixins import UserPassesTestMixin, LoginRequiredMixin
from django.views.generic.edit import CreateView
from django.views.generic import ListView, CreateView, UpdateView, View
from django.urls import reverse_lazy
from reviews.models import Review
from tickets.models import Ticket
from reviews.forms import ReviewForm
from tickets.forms import TicketForm, TicketUpdateForm
from follows.models import UserBlock, UserFollow
from users.models import CustomUser
from app.utils import generate_random_numbers
from django.contrib import messages
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Case, When, BooleanField
from django.db import transaction
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage


class TicketListView(LoginRequiredMixin, ListView):
    model = Ticket
    template_name = 'ticket_list.html'
    context_object_name = 'tickets'
    paginate_by = 2
    _context_users = None

    def get_queryset(self):
        followed_users = UserFollow.objects.filter(
            follower=self.request.user, status=True
            ).values_list('followed', flat=True)

        tickets = Ticket.objects.prefetch_related('tags', 'reviews').filter(
            is_archived=False,
            author__in=followed_users
        ).order_by('-created_at').distinct()

        for ticket in tickets:
            ticket.likes_count = ticket.get_likes_count()
            ticket.dislikes_count = ticket.get_dislikes_count()
            for review in ticket.reviews.all():
                review.likes_count = review.get_likes_count()
                review.dislikes_count = review.get_dislikes_count()

        ticket_authors = tickets.values_list('author', flat=True)
        review_authors = Review.objects.filter(
            ticket__in=tickets
            ).values_list('author', flat=True)
        all_authors = set(ticket_authors).union(set(review_authors))
        self._context_users = CustomUser.objects.filter(
            id__in=all_authors
            )

        return tickets

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        blocked_users_ids = UserBlock.objects.filter(
            blocker=self.request.user
            ).values_list('blocked', flat=True)
        blocked_users = CustomUser.objects.filter(id__in=blocked_users_ids)
        followers_status = Case(
            When(
                followers__follower=self.request.user,
                followers__status=True,
                then=True
                ),
            default=False,
            output_field=BooleanField()
        )

        following_users = CustomUser.objects.filter(
            followers__followed=self.request.user,
            followers__status=True
        ).exclude(
            pk=self.request.user.pk
        ).annotate(
            followers_status=followers_status
        )

        following_users_ids = following_users.values_list('id', flat=True)
        blocked_users_ids = blocked_users.values_list('id', flat=True)
        colour_numbers = generate_random_numbers()[:10]
        context.update({
            'col{}'.format(i): colour_numbers[i] for i in range(
                min(len(colour_numbers), 10)
                )
            })
        context['ticket_form'] = TicketForm()
        context['review_form'] = ReviewForm()
        context['ticket_update_form'] = TicketUpdateForm()
        context['blocked_users'] = blocked_users
        context['blocked_users_ids'] = list(blocked_users_ids)
        context['following_users_ids'] = list(following_users_ids)
        context['users'] = self._context_users
        context['absolute_url'] = self.request.build_absolute_uri('/')

        return context

    # def get(self, request, *args, **kwargs):
    #     if request.headers.get('x-requested-with') == 'XMLHttpRequest':
    #         ticketSet = request.GET.get('ticketSet', 1)
    #         tickets = self.get_queryset()
    #         paginator = Paginator(tickets, self.paginate_by)
    #         try:
    #             tickets = paginator.page(ticketSet)
    #         except PageNotAnInteger:
    #             tickets = paginator.page(1)
    #         except EmptyPage:
    #             tickets = []
    #         except Exception as e:
    #             error_message = f"An error occurred: {str(e)}"
    #             messages.error(self.request, error_message)
    #             return {
    #                 'success': False,
    #                 'error': error_message
    #                 }
    #         data = render_to_string(
    #             'partial_ticket_list.html',
    #             {'tickets': tickets,
    #              'user': request.user})
    #         has_more_sets = tickets.has_next() if tickets else False
    #         return JsonResponse(
    #             {'data': data,
    #              'success': True,
    #              'has_more_sets': has_more_sets,
    #              'message': 'Ticket set successfully added.'
    #             })
    #     else:
    #         return super().get(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        if request.headers.get('x-requested-with') == 'XMLHttpRequest':
            ticketSet = request.GET.get('ticketSet', 1)
            tickets = self.get_queryset()
            paginator = Paginator(tickets, self.paginate_by)

            try:
                tickets = paginator.page(ticketSet)
            except PageNotAnInteger:
                tickets = paginator.page(1)
            except EmptyPage:
                tickets = []
            except Exception as e:
                error_message = f"An error occurred: {str(e)}"
                return JsonResponse({
                    'success': False,
                    'error': error_message
                })

            ticket_list = []
            for ticket in tickets:
                ticket_dict = {
                    'id': ticket.pk,
                    'img': ticket.image.url if ticket.image else None,
                    'title': ticket.title,
                    'description': ticket.description,
                    'tags': [tag.name for tag in ticket.tags.all()],
                    'creation_date': ticket.created_at,
                    'author': {
                        'id': ticket.author.id,
                        'username': ticket.author.username,
                        } if ticket.author else None,
                    'likes_count': ticket.likes_count,
                    'dislikes_count': ticket.dislikes_count,
                    'reviews': [
                        {
                            'id': r.pk,
                            'cover_image': r.cover_image.url if r.cover_image else None,
                            'title': r.title,
                            'content': r.content,
                            'rating': r.rating,
                            'creation_date': r.created_at,
                            'author': {
                                'id': r.author.id,
                                'username': r.author.username,
                                } if r.author else None,
                            'likes_count': r.get_likes_count(),
                            'dislikes_count': r.get_dislikes_count(),
                        } for r in ticket.reviews.filter(
                            is_archived=False
                            )
                        ]
                }
                ticket_list.append(ticket_dict)

            has_more_sets = tickets.has_next() if tickets else False

            return JsonResponse({
                'data': ticket_list,
                'success': True,
                'has_more_sets': has_more_sets,
                'message': 'Ticket set successfully added.'
            })
        else:
            return super().get(request, *args, **kwargs)


class TicketCreateView(LoginRequiredMixin, CreateView):
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

                    obj_img = self.object.image
                    response_data = {
                        'success': True,
                        'message': 'Ticket created successfully.',
                        'id': self.object.pk,
                        'img': obj_img.url if obj_img else None,
                        'title': self.object.title,
                        'description': self.object.description,
                        'tags': [tag.name for tag in self.object.tags.all()],
                        'creation_date': self.object.created_at,
                        'create_review': False,
                        }

                    if form.cleaned_data.get(
                        'create_review'
                        ) and form.cleaned_data.get(
                            'review_title'
                            ):
                        try:
                            review = Review(
                                title=form.cleaned_data['review_title'],
                                content=form.cleaned_data['review_content'],
                                cover_image=form.cleaned_data.get(
                                    'review_cover_image'
                                    ),
                                rating=form.cleaned_data.get(
                                    'review_rating'
                                    ) if form.cleaned_data.get(
                                        'review_rating'
                                        ) else 0,
                                author=self.request.user,
                                ticket=self.object,
                            )
                            review.save()
                            msg = 'Ticket and review created successfully.'
                            r_i = review.cover_image
                            response_data = {
                                'success': True,
                                'message': msg,
                                'id': self.object.pk,
                                'img': obj_img.url if obj_img else None,
                                'title': self.object.title,
                                'description': self.object.description,
                                'tags': [
                                    tag.name for tag in self.object.tags.all()
                                    ],
                                'creation_date': self.object.created_at,
                                'create_review': True,
                                'review_id': review.pk,
                                'review_title': review.title,
                                'review_content': review.content,
                                'review_rating': review.rating,
                                'review_cover_image': r_i.url if r_i else None,
                                'review_creation_date': self.object.created_at,
                                }
                        except Exception as e:
                            response_data = {'success': False, 'error': str(e)}

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
    success_url = reverse_lazy('ticket_list')

    def test_func(self):
        ticket = self.get_object()
        user = self.request.user
        return user.is_superuser or user == ticket.author

    def form_valid(self, form):
        try:
            form.instance.author = self.request.user
            super().form_valid(form)
            obj_img = self.object.image
            return JsonResponse({
                'success': True,
                'message': 'Ticket updated successfully.',
                'ticket': {
                    'id': self.object.pk,
                    'title': self.object.title,
                    'description': self.object.description,
                    'tags': [tag.name for tag in self.object.tags.all()],
                    'image_url': obj_img.url if obj_img else None
                }
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'A problem occured while updating the ticket.',
                'errors': str(e)
            })

    def form_invalid(self, form):
        msg = 'Failed to update the ticket. Please correct the errors below.'
        return JsonResponse({
            'success': False,
            'message': msg,
            'errors': form.errors
        })


class ArchiveTicketView(LoginRequiredMixin, UserPassesTestMixin, View):
    def test_func(self):
        ticket = get_object_or_404(Ticket, pk=self.kwargs['pk'])
        return self.request.user == ticket.author or self.request.user.is_staff

    def post(self, request, *args, **kwargs):
        try:
            ticket = get_object_or_404(Ticket, pk=self.kwargs['pk'])

            ticket.is_archived = True
            ticket.save()

            reviews = Review.objects.filter(ticket=ticket)
            reviews.update(is_archived=True)

            return JsonResponse(
                {
                    'success': True,
                    'message': 'Ticket successfully deleted',
                    'id': self.kwargs['pk']
                    }
                )

        except Exception as e:
            error_message = f"An error occurred: {str(e)}"
            return JsonResponse({'success': False, 'error': error_message})
