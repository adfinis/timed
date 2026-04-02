from datetime import timedelta

import factory
from faker.providers import BaseProvider


class WorkdayProvider(BaseProvider):
    def workday(self):
        d = self.generator.date_object()
        while d.weekday() >= 5:  # noqa: PLR2004
            d += timedelta(days=1)
        return d


def load_providers():
    """Load custom Faker providers."""
    factory.Faker.add_provider(WorkdayProvider)
