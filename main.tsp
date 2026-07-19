import "@typespec/http";

using Http;

@service(#{ title: "Hexlet Fastify Rest Api Expemple" })
namespace FastifyRestApiExample;

@error
model ProblemDetails {
  @header("content-type") contentType: "application/problem+json";
  type?: string;
  title?: string;
  status?: string;
  detail?: string;
  instance?: string;
}

@error
model NotFoundError {
  @statusCode _: 404;
  ...ProblemDetails;
}

@error
model UnauthorizedError {
  @statusCode _: 401;
  ...ProblemDetails;
}

@error
model UnprocessableEntityError {
  @statusCode _: 422;
  ...ProblemDetails;
  errors: Array<{
    message: string;
    rule: string;
    field: string;
  }>;
}

model Timestamps {
  createdAt: utcDateTime;
}

model User {
  id: numeric;

  @minLength(2)
  @maxLength(100)
  fullName: string | null;

  @format("email")
  email: string;

  ...Timestamps;
}

model UserCreateDTO {
  fullName?: string;
  email: string;
}

model UserEditDTO {
  fullName: string;
}

@route("/users")
namespace users {
  @get
  @useAuth(BearerAuth)
  op index(@query page?: numeric = 1): {
    @body _: {
      data: User[];
    };
  };

  @get
  @useAuth(BearerAuth)
  op show(@path id: numeric):
    | {
        @body _: User;
      }
    | NotFoundError;

  @patch
  @useAuth(BearerAuth)
  op update(@path id: numeric, @body _: UserCreateDTO):
    | {
        @body _: User;
      }
    | NotFoundError
    | UnprocessableEntityError;

  @delete
  @useAuth(BearerAuth)
  op destroy(@path id: numeric):
    | {
        @statusCode statusCode: 204;
      }
    | NotFoundError;
}
