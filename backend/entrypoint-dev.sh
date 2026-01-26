#!/bin/sh

wait4ports -s 5 tcp://db:5432

exec uv run "$@"
