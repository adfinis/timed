from __future__ import annotations

from typing import TYPE_CHECKING

import pytest
from django.contrib.auth import get_user_model
from django.core.cache import cache
from pytest_factoryboy import register
from rest_framework.test import APIClient

from timed.employment import factories as employment_factories
from timed.projects import factories as projects_factories
from timed.subscription import factories as subscription_factories
from timed.tracking import factories as tracking_factories

if TYPE_CHECKING:
    from timed.employment.models import CustomerAssignee, Employment, User


register(employment_factories.AbsenceCreditFactory)
register(employment_factories.AbsenceTypeFactory)
register(employment_factories.EmploymentFactory)
register(employment_factories.LocationFactory)
register(employment_factories.OvertimeCreditFactory)
register(employment_factories.PublicHolidayFactory)
register(employment_factories.UserFactory)

register(projects_factories.BillingTypeFactory)
register(projects_factories.CostCenterFactory)
register(projects_factories.CustomerAssigneeFactory)
register(projects_factories.CustomerFactory)
register(projects_factories.ProjectAssigneeFactory)
register(projects_factories.ProjectFactory)
register(projects_factories.TaskAssigneeFactory)
register(projects_factories.TaskFactory)
register(projects_factories.TaskTemplateFactory)

register(subscription_factories.OrderFactory)
register(subscription_factories.PackageFactory)

register(tracking_factories.AbsenceFactory)
register(tracking_factories.ActivityFactory)
register(tracking_factories.AttendanceFactory)
register(tracking_factories.ReportFactory)


@pytest.fixture
def auth_user(db):  # noqa: ARG001
    return get_user_model().objects.create_user(
        username="user",
        password="123qweasd",
        first_name="Test",
        last_name="User",
        is_superuser=False,
        is_staff=False,
    )


@pytest.fixture
def admin_user(db):  # noqa: ARG001
    return get_user_model().objects.create_user(
        username="admin",
        password="123qweasd",
        first_name="Admin",
        last_name="User",
        is_superuser=False,
        is_staff=True,
    )


@pytest.fixture
def superadmin_user(db):  # noqa: ARG001
    return get_user_model().objects.create_user(
        username="superadmin",
        password="123qweasd",
        first_name="Superadmin",
        last_name="User",
        is_superuser=True,
        is_staff=True,
    )


@pytest.fixture
def external_employee(db):  # noqa: ARG001
    user = get_user_model().objects.create_user(
        username="user",
        password="123qweasd",
        first_name="Test",
        last_name="User",
        is_superuser=False,
        is_staff=False,
    )
    employment_factories.EmploymentFactory.create(user=user, is_external=True)
    return user


@pytest.fixture
def internal_employee(db):  # noqa: ARG001
    user = get_user_model().objects.create_user(
        username="user",
        password="123qweasd",
        first_name="Test",
        last_name="User",
        email="test@example.com",
        is_superuser=False,
        is_staff=False,
    )
    employment_factories.EmploymentFactory.create(user=user, is_external=False)
    return user


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def auth_client(auth_user):
    """Return instance of a APIClient that is logged in as test user."""
    client = APIClient()
    client.force_authenticate(user=auth_user)
    client.user = auth_user
    return client


@pytest.fixture
def admin_client(admin_user):
    """Return instance of a APIClient that is logged in as a staff user."""
    client = APIClient()
    client.force_authenticate(user=admin_user)
    client.user = admin_user
    return client


@pytest.fixture
def superadmin_client(superadmin_user):
    """Return instance of a APIClient that is logged in as superuser."""
    client = APIClient()
    client.force_authenticate(user=superadmin_user)
    client.user = superadmin_user
    return client


@pytest.fixture
def external_employee_client(external_employee):
    """Return instance of a APIClient that is logged in as external test user."""
    client = APIClient()
    client.force_authenticate(user=external_employee)
    client.user = external_employee
    return client


@pytest.fixture
def internal_employee_client(internal_employee):
    """Return instance of a APIClient that is logged in as external test user."""
    client = APIClient()
    client.force_authenticate(user=internal_employee)
    client.user = internal_employee
    return client


@pytest.fixture(autouse=True)
def _autoclear_cache():
    cache.clear()


@pytest.fixture
def setup_customer_and_employment_status(
    db,  # noqa: ARG001
    customer_assignee_factory,
    employment_factory,
):
    def _setup_customer_and_employment_status(
        user: User,
        *,
        is_assignee: bool,
        is_customer: bool,
        is_employed: bool,
        is_external: bool,
    ) -> tuple[CustomerAssignee | None, Employment | None]:
        """Set up customer and employment status.

        Return a 2-tuple of assignee and employment, if they
        were created
        """
        assignee = None
        employment = None
        if is_assignee:
            assignee = customer_assignee_factory(user=user, is_customer=is_customer)
        if is_employed:
            employment = employment_factory(user=user, is_external=is_external)
        return assignee, employment

    return _setup_customer_and_employment_status
