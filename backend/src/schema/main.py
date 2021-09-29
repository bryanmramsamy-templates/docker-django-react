import graphene

from .authentication import AuthMutations, AuthQuery


# Queries

class Query(AuthQuery, graphene.ObjectType):
    """Import all the queries into the schema"""

    pass


# Mutations

class Mutation(AuthMutations, graphene.ObjectType):
    """Import all the mutations into the schema"""

    pass


# Schema

schema = graphene.Schema(query=Query, mutation=Mutation)
