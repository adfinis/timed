from rest_framework_json_api import relations

from timed.serializers import AggregateObject


def is_related_field(field: relations.Field) -> bool:
    """Check whether value is a related field.

    Ignores serializer method fields which define logic separately.
    """
    return isinstance(field, relations.ResourceRelatedField) and not isinstance(
        field, relations.ManySerializerMethodResourceRelatedField
    )


class AggregateQuerysetMixin:
    """Add support for aggregate queryset in view.

    Wrap queryst dicts into aggregate object to support renderer
    which expect attributes.
    It additionally prefetches related instances represented as id in
    aggregate.

    In aggregates only an id of a related field is part of the object.
    Instead of loading each single object row by row this mixin prefetches
    all resource related fields and injects it before serialization starts.

    Mixin expects the id to be the same key as the resource related
    field defined in the serializer.

    >>> from rest_framework.viewsets import ReadOnlyModelViewSet
    ...
    ...
    ... class MyView(ReadOnlyModelViewSet, AggregateQuerysetMixin):
    ...     # ...
    """

    def _get_data(self, data, *args, **kwargs):
        # no data no wrapping needed
        if not data:
            return data

        many = kwargs.get("many")

        # prefetch data for all related fields

        prefetch_per_field = {}
        serializer_class = self.get_serializer_class()

        lookup_expr = "id__in" if many else "id"

        for key, value in filter(
            lambda kv: is_related_field(kv[1]),
            serializer_class._declared_fields.items(),  # noqa: SLF001
        ):
            source = value.source or key

            lookup_value = data.values_list(source, flat=True) if many else data[source]

            qs = value.model.objects.filter(**{lookup_expr: lookup_value})
            qs = qs.select_related()

            prefetch_per_field[source] = {obj.id: obj for obj in qs}

        # enhance entry dicts with model instances
        def _construct_aggregate_object(entry):
            return AggregateObject(
                **{
                    **entry,
                    **{
                        field: objects[entry.get(field) or entry.get(f"{field}_id")]
                        for field, objects in prefetch_per_field.items()
                    },
                }
            )

        if not many:
            return _construct_aggregate_object(data)

        return [_construct_aggregate_object(entry) for entry in data]

    def get_serializer(self, data=None, *args, **kwargs):
        return super().get_serializer(
            self._get_data(data, *args, **kwargs), *args, **kwargs
        )
