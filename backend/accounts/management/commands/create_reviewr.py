from django.core.management.base import BaseCommand
from accounts.models import User, Profile


class Command(BaseCommand):
    help = "Create the reviewr test user with password apple2345"

    def handle(self, *args, **options):
        username = "reviewr"
        password = "apple2345"
        email = "reviewr@artfit.dev"

        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.WARNING(f"User '{username}' already exists — password reset."))
        else:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                role="BOTH",
            )
            Profile.objects.get_or_create(user=user, defaults={"display_name": "Reviewr"})
            self.stdout.write(self.style.SUCCESS(f"User '{username}' created successfully."))
