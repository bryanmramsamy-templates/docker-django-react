from django.dispatch import receiver
from graphql_jwt.refresh_token.signals import refresh_token_rotated


@receiver(refresh_token_rotated)
def revoke_refresh_token(sender, request, refresh_token, **kwargs):
    """Revoke a refresh token after it has been used."""

    refresh_token.revoke(request)
    print("Hello")
