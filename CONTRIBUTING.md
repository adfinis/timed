# Contributing

Contributions to Timed backend are very welcome! Best have a look at the open [issues](https://github.com/adfinis/timed-backend)
and open a [GitHub pull request](https://github.com/adfinis/timed-backend/compare). See instructions below how to setup development
environment. Before writing any code, best discuss your proposed change in a GitHub issue to see if the proposed change makes sense for the project.

## Setup development environment

### Clone

To work on Timed you first need to clone the repository

```bash
git clone https://github.com/adfinis/timed.git
cd timed
```

### Using Podman

The default Makefile uses docker as orchestrator.
To use podman create `Makefile.local` (will be ignored by vcs) and add the following line to it

```make
ORCHESTRATOR := podman
```

Then the commands of the makefile will use podman.

### Open Shell

Once it is cloned you can easily open a shell in the docker container to
open a development environment.

```bash
podman compose run --rm -it backend sh
# or with docker
docker compose run --rm -it backend sh
```

### Testing and Linting

You can run tests using the targets in the Makefile.

```bash
# lint the backend
make backend-lint
# lint the frontend
make frontend-lint
# lint backend and frontend
make lint
# formatting and fixing linting issues
make lint-fix # or backend-lint-fix for just the backend etc.
# running backend tests
make backend-test
# running frontend tests
make frontend-test
# running all tests
make test
# create migrations
make makemigrations
```

### Install new requirements

In case you're adding new requirements you simply need to build the docker container

```bash
podman compose up --build -d backend
# or docker
docker compose up --build -d backend
```

### Developing the frontend

The easiest way to develop the frontend is outside of a container for live reloading.

```bash
cd frontend
pnpm install
pnpm run start # this starts a live-reloading server using the API in the container
```

You can now view your frontend at `http://localhost:4200`

Your changes will automatically be applied on `http://localhost:4200`.
