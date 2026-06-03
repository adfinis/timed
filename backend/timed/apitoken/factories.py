from factory import Faker, SubFactory
from factory.django import DjangoModelFactory

from timed.apitoken import models


class APITokenFactory(DjangoModelFactory):
    user = SubFactory("timed.employment.factories.UserFactory")
    name = Faker("word")
    token_hash = Faker("sha256")

    class Meta:
        model = models.APIToken
